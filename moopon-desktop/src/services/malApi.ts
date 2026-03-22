// MyAnimeList API Constants & Service

const MAL_API_URL = 'https://api.myanimelist.net/v2/';
const MAL_OAUTH2_URL = 'https://myanimelist.net/v1/oauth2/';
const DEFAULT_CLIENT_ID = '1229627dde7db8d852af0ec22cbfa112';

// ─── Rate Limiting ───
// MAL API uses credit system. We limit to prevent costs.
// Approximate cost: 1 request = 1-5 credits. Default limit: 1000 credits/hour (~$0.05)

const RATE_LIMIT_KEY = 'mal_api_quota';
const RATE_LIMIT_MAX = 1000; // Max requests per window
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

interface QuotaInfo {
    count: number;
    windowStart: number;
}

function getQuota(): QuotaInfo {
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    if (!stored) return { count: 0, windowStart: Date.now() };
    
    try {
        const info: QuotaInfo = JSON.parse(stored);
        // Reset if window expired
        if (Date.now() - info.windowStart > RATE_WINDOW_MS) {
            return { count: 0, windowStart: Date.now() };
        }
        return info;
    } catch {
        return { count: 0, windowStart: Date.now() };
    }
}

function incrementQuota(): boolean {
    const quota = getQuota();
    quota.count++;
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(quota));
    return quota.count <= RATE_LIMIT_MAX;
}

export function getQuotaInfo(): { used: number; limit: number; resetIn: number } {
    const quota = getQuota();
    const used = Math.min(quota.count, RATE_LIMIT_MAX);
    const resetIn = Math.max(0, RATE_WINDOW_MS - (Date.now() - quota.windowStart));
    return { used, limit: RATE_LIMIT_MAX, resetIn };
}

export function isQuotaExceeded(): boolean {
    const quota = getQuota();
    return quota.count >= RATE_LIMIT_MAX;
}

// PKCE Helper
function generateCodeVerifier(): string {
    const array = new Uint8Array(64);
    crypto.getRandomValues(array);
    return Array.from(array, (b) => b.toString(36).padStart(2, '0')).join('').slice(0, 128);
}

// Storage helpers
function getToken(): string | null {
    return localStorage.getItem('mal_access_token');
}
function getRefreshToken(): string | null {
    return localStorage.getItem('mal_refresh_token');
}
function getClientId(): string | null {
    return localStorage.getItem('mal_client_id');
}
function saveTokens(accessToken: string, refreshToken: string, expiresIn: number) {
    localStorage.setItem('mal_access_token', accessToken);
    localStorage.setItem('mal_refresh_token', refreshToken);
    localStorage.setItem('mal_token_expires', String(Date.now() + expiresIn * 1000));
}
function saveClientId(clientId: string) {
    localStorage.setItem('mal_client_id', clientId);
}
function clearAuth() {
    localStorage.removeItem('mal_access_token');
    localStorage.removeItem('mal_refresh_token');
    localStorage.removeItem('mal_token_expires');
}

// ─── Auth Flow (via Electron IPC) ───

export async function startLogin(clientId?: string): Promise<boolean> {
    const id = clientId || DEFAULT_CLIENT_ID;
    saveClientId(id);

    const codeVerifier = generateCodeVerifier();
    const authUrl = `${MAL_OAUTH2_URL}authorize?response_type=code&client_id=${id}&code_challenge=${codeVerifier}&state=Moopon123`;

    try {
        // Open MAL auth window via Electron main process
        const code = await window.electronAPI!.malAuth(authUrl);

        if (!code) return false;

        // Exchange code for token via Electron main process (no CORS)
        const tokenData = await window.electronAPI!.malTokenExchange({
            clientId: id,
            code,
            codeVerifier,
        });

        if (tokenData.error || !tokenData.access_token) {
            console.error('Token exchange failed:', tokenData.error || tokenData.message);
            return false;
        }

        saveTokens(tokenData.access_token, tokenData.refresh_token, tokenData.expires_in);
        return true;
    } catch (err) {
        console.error('Auth failed:', err);
        return false;
    }
}

async function refreshAccessToken(): Promise<boolean> {
    const clientId = getClientId();
    const refreshToken = getRefreshToken();
    if (!clientId || !refreshToken) return false;

    try {
        const tokenData = await window.electronAPI!.malTokenRefresh({
            clientId,
            refreshToken,
        });

        if (tokenData.error || !tokenData.access_token) return false;

        saveTokens(tokenData.access_token, tokenData.refresh_token, tokenData.expires_in);
        return true;
    } catch {
        return false;
    }
}

// ─── API Fetch ───

async function malFetch(url: string, retry = true): Promise<any> {
    // Check rate limit
    if (!incrementQuota()) {
        console.warn('MAL API rate limit exceeded. Please wait.');
        throw new Error('RATE_LIMIT_EXCEEDED');
    }

    const token = getToken();
    const clientId = getClientId();
    if (!token && !clientId) throw new Error('Not authenticated');

    const headers: Record<string, string> = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    } else if (clientId) {
        headers['X-MAL-CLIENT-ID'] = clientId;
    }

    const response = await fetch(url, { headers });

    if (response.status === 401 && retry) {
        const refreshed = await refreshAccessToken();
        if (refreshed) return malFetch(url, false);
        throw new Error('Token expired');
    }

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
}

// ─── API Methods ───

const ANIME_FIELDS = 'id,title,main_picture,mean,num_episodes,status,synopsis,genres,start_season,media_type,rank,popularity,num_list_users,average_episode_duration';
const USER_ANIME_FIELDS = `${ANIME_FIELDS},list_status{status,score,num_episodes_watched,start_date,finish_date}`;

export interface MalAnime {
    id: number;
    title: string;
    main_picture?: { medium: string; large: string };
    mean?: number;
    num_episodes?: number;
    status?: string;
    synopsis?: string;
    genres?: { id: number; name: string }[];
    start_season?: { year: number; season: string };
    media_type?: string;
    rank?: number;
    popularity?: number;
    list_status?: {
        status: string;
        score: number;
        num_episodes_watched: number;
    };
    recommendations?: MalAnime[];
}

export interface MalUser {
    id: number;
    name: string;
    picture?: string;
    anime_statistics?: {
        num_items_watching: number;
        num_items_completed: number;
        num_items_on_hold: number;
        num_items_dropped: number;
        num_items_plan_to_watch: number;
        num_items: number;
        mean_score: number;
    };
}

export async function searchAnime(query: string, limit = 20): Promise<MalAnime[]> {
    const data = await malFetch(
        `${MAL_API_URL}anime?q=${encodeURIComponent(query)}&limit=${limit}&fields=${ANIME_FIELDS}&nsfw=true`
    );
    return data.data.map((item: any) => item.node);
}

export async function getAnimeRanking(type = 'all', limit = 20): Promise<MalAnime[]> {
    const data = await malFetch(
        `${MAL_API_URL}anime/ranking?ranking_type=${type}&limit=${limit}&fields=${ANIME_FIELDS}`
    );
    return data.data.map((item: any) => ({ ...item.node, rank: item.ranking?.rank }));
}

export async function getSeasonalAnime(year: number, season: string, limit = 20): Promise<MalAnime[]> {
    const data = await malFetch(
        `${MAL_API_URL}anime/season/${year}/${season}?limit=${limit}&fields=${ANIME_FIELDS}&sort=anime_num_list_users`
    );
    return data.data.map((item: any) => item.node);
}

export async function getAnimeDetails(animeId: number): Promise<MalAnime> {
    return malFetch(
        `${MAL_API_URL}anime/${animeId}?fields=${ANIME_FIELDS},related_anime,recommendations`
    );
}

export async function getUserAnimeList(status?: string, sort = 'list_updated_at', limit = 100): Promise<MalAnime[]> {
    let url = `${MAL_API_URL}users/@me/animelist?limit=${limit}&fields=${USER_ANIME_FIELDS}&sort=${sort}`;
    if (status) url += `&status=${status}`;
    const data = await malFetch(url);
    return data.data.map((item: any) => ({ ...item.node, list_status: item.list_status }));
}

export async function updateAnimeStatus(animeId: number, updates: Record<string, string>): Promise<any> {
    const token = getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${MAL_API_URL}anime/${animeId}/my_list_status`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(updates),
    });

    if (!response.ok) throw new Error(`Update failed: ${response.status}`);
    return response.json();
}

export async function getUserProfile(): Promise<MalUser> {
    return malFetch(`${MAL_API_URL}users/@me?fields=anime_statistics`);
}

export async function getAnimeSuggestions(limit = 20): Promise<MalAnime[]> {
    const data = await malFetch(
        `${MAL_API_URL}anime/suggestions?limit=${limit}&fields=${ANIME_FIELDS}`
    );
    return data.data.map((item: any) => item.node);
}

export function isLoggedIn(): boolean {
    return !!getToken();
}

export function logout() {
    clearAuth();
}

export { saveClientId, getClientId };
