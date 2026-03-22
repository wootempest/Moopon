import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Library, Star, Play, ChevronRight, Plus, Minus, Filter, X } from 'lucide-react';
import { AnimeGridSkeleton } from '../components/Skeleton';
import { getUserAnimeList, updateAnimeStatus } from '../services/malApi';
import type { MalAnime } from '../services/malApi';

const STATUSES = [
    { value: 'all', label: 'Tümü', color: '#a855f7' },
    { value: 'watching', label: 'İzleniyor', color: '#a855f7' },
    { value: 'completed', label: 'Tamamlandı', color: '#22c55e' },
    { value: 'on_hold', label: 'Beklemede', color: '#eab308' },
    { value: 'dropped', label: 'Bırakıldı', color: '#ef4444' },
    { value: 'plan_to_watch', label: 'İzlenecek', color: '#3b82f6' },
];

const STATUS_COLORS: Record<string, string> = {
    watching: '#a855f7',
    completed: '#22c55e',
    on_hold: '#eab308',
    dropped: '#ef4444',
    plan_to_watch: '#3b82f6',
};

const STATUS_LABELS: Record<string, string> = {
    watching: 'İzleniyor',
    completed: 'Tamamlandı',
    on_hold: 'Beklemede',
    dropped: 'Bırakıldı',
    plan_to_watch: 'İzlenecek',
};

interface MyListPageProps {
    onSelectAnime: (anime: MalAnime) => void;
}

function AnimeListItem({ anime, index, onClick, onEpisodeUpdate }: {
    anime: MalAnime;
    index: number;
    onClick: (a: MalAnime) => void;
    onEpisodeUpdate: (animeId: number, newCount: number) => void;
}) {
    const imageUrl = anime.main_picture?.medium || anime.main_picture?.large || '';
    const watched = anime.list_status?.num_episodes_watched || 0;
    const total = anime.num_episodes || 0;
    const progress = total > 0 ? (watched / total) * 100 : 0;
    const score = anime.list_status?.score || 0;
    const statusColor = STATUS_COLORS[anime.list_status?.status || ''] || '#a855f7';
    const statusLabel = STATUS_LABELS[anime.list_status?.status || ''] || '';
    const [updating, setUpdating] = useState(false);

    const handleEpisodeChange = async (e: React.MouseEvent, delta: number) => {
        e.stopPropagation();
        const newCount = watched + delta;
        if (newCount < 0) return;
        if (total > 0 && newCount > total) return;

        setUpdating(true);
        try {
            const updates: Record<string, string> = {
                num_watched_episodes: String(newCount),
            };
            // Auto-complete if all episodes watched
            if (total > 0 && newCount === total) {
                updates.status = 'completed';
            }
            // Auto-set to watching if incrementing from 0
            if (watched === 0 && newCount > 0 && anime.list_status?.status === 'plan_to_watch') {
                updates.status = 'watching';
            }
            await updateAnimeStatus(anime.id, updates);
            onEpisodeUpdate(anime.id, newCount);
        } catch (err) {
            console.error('Episode update failed:', err);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <motion.div
            className="list-item"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ backgroundColor: 'rgba(168, 85, 247, 0.06)', x: 2 }}
            onClick={() => onClick(anime)}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 16px',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'background 0.2s',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}
        >
            {/* Poster */}
            <div style={{
                width: '60px',
                height: '84px',
                borderRadius: '8px',
                overflow: 'hidden',
                flexShrink: 0,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
            }}>
                {imageUrl && (
                    <img src={imageUrl} alt={anime.title} style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'top center',
                        display: 'block',
                    }} />
                )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}>
                    {anime.title}
                </div>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    marginBottom: '8px',
                }}>
                    {anime.media_type && (
                        <span>{anime.media_type.toUpperCase()}</span>
                    )}
                    {statusLabel && (
                        <span style={{
                            color: statusColor,
                            background: `${statusColor}15`,
                            border: `1px solid ${statusColor}30`,
                            padding: '1px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 500,
                        }}>
                            {statusLabel}
                        </span>
                    )}
                </div>

                {/* Episode Progress */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        flex: 1,
                        height: '4px',
                        background: 'rgba(255,255,255,0.06)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        maxWidth: '200px',
                    }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${total > 0 ? progress : (watched > 0 ? 50 : 0)}%` }}
                            transition={{ delay: index * 0.03 + 0.3, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{
                                height: '100%',
                                background: `linear-gradient(90deg, ${statusColor}, ${statusColor}cc)`,
                                borderRadius: '4px',
                            }}
                        />
                    </div>
                    <span style={{
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        fontVariantNumeric: 'tabular-nums',
                    }}>
                        <Play size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} />
                        {watched}{total > 0 ? ` / ${total}` : ''} bölüm
                    </span>
                </div>
            </div>

            {/* Episode +/- Buttons */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                flexShrink: 0,
            }}>
                <motion.button
                    onClick={(e) => handleEpisodeChange(e, -1)}
                    disabled={updating || watched <= 0}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.04)',
                        color: watched > 0 ? 'var(--text-secondary)' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: watched > 0 ? 'pointer' : 'default',
                        opacity: watched > 0 ? 1 : 0.4,
                        transition: 'all 0.2s',
                    }}
                >
                    <Minus size={12} />
                </motion.button>
                <motion.button
                    onClick={(e) => handleEpisodeChange(e, 1)}
                    disabled={updating || (total > 0 && watched >= total)}
                    whileHover={{ scale: 1.15, boxShadow: '0 0 12px rgba(168, 85, 247, 0.3)' }}
                    whileTap={{ scale: 0.85 }}
                    style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        background: 'rgba(168, 85, 247, 0.15)',
                        color: '#c084fc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: (total > 0 && watched >= total) ? 'default' : 'pointer',
                        opacity: (total > 0 && watched >= total) ? 0.4 : 1,
                        transition: 'all 0.2s',
                    }}
                >
                    <Plus size={12} />
                </motion.button>
            </div>

            {/* Score */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                flexShrink: 0,
            }}>
                {score > 0 ? (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'rgba(251, 191, 36, 0.1)',
                        border: '1px solid rgba(251, 191, 36, 0.2)',
                        padding: '4px 10px',
                        borderRadius: '8px',
                    }}>
                        <Star size={12} fill="#fbbf24" color="#fbbf24" />
                        <span style={{
                            fontSize: '13px',
                            fontWeight: 700,
                            color: '#fbbf24',
                        }}>{score}</span>
                    </div>
                ) : (
                    <div style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: 'rgba(255,255,255,0.04)',
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                    }}>—</div>
                )}
                <ChevronRight size={16} style={{ color: 'var(--text-muted)', marginLeft: 4 }} />
            </div>
        </motion.div>
    );
}

export default function MyListPage({ onSelectAnime }: MyListPageProps) {
    const [activeFilter, setActiveFilter] = useState('all');
    const [activeGenre, setActiveGenre] = useState<string | null>(null);
    const [animeList, setAnimeList] = useState<MalAnime[]>([]);
    const [loading, setLoading] = useState(true);

    const allGenres = useMemo(() => {
        const genreMap = new Map<number, string>();
        animeList.forEach(anime => {
            anime.genres?.forEach(g => {
                if (!genreMap.has(g.id)) {
                    genreMap.set(g.id, g.name);
                }
            });
        });
        return Array.from(genreMap.values()).sort();
    }, [animeList]);

    const filteredAnimeList = useMemo(() => {
        if (!activeGenre) return animeList;
        return animeList.filter(anime =>
            anime.genres?.some(g => g.name === activeGenre)
        );
    }, [animeList, activeGenre]);

    useEffect(() => {
        async function fetchList() {
            setLoading(true);
            setActiveGenre(null);
            try {
                const status = activeFilter === 'all' ? undefined : activeFilter;
                const data = await getUserAnimeList(status);
                setAnimeList(data);
            } catch (err) {
                console.error('Error fetching list:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchList();
    }, [activeFilter]);

    useEffect(() => {
        setActiveGenre(null);
    }, [activeFilter]);

    const handleEpisodeUpdate = (animeId: number, newCount: number) => {
        setAnimeList(prev => prev.map(a => {
            if (a.id !== animeId) return a;
            const total = a.num_episodes || 0;
            const newStatus = (total > 0 && newCount >= total) ? 'completed' : a.list_status?.status || 'watching';
            return {
                ...a,
                list_status: {
                    ...a.list_status!,
                    num_episodes_watched: newCount,
                    status: newStatus,
                },
            };
        }));
    };

    const totalEpisodes = filteredAnimeList.reduce((sum, a) => sum + (a.list_status?.num_episodes_watched || 0), 0);
    const scoredAnime = filteredAnimeList.filter(a => a.list_status?.score);
    const avgScore = scoredAnime.length > 0
        ? (scoredAnime.reduce((sum, a) => sum + (a.list_status?.score || 0), 0) / scoredAnime.length).toFixed(1)
        : '—';

return (
        <div style={{ padding: '24px' }}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h2 className="section-title" style={{ marginBottom: '4px' }}>Listem</h2>
                {!loading && filteredAnimeList.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            display: 'flex',
                            gap: '16px',
                            fontSize: '12px',
                            color: 'var(--text-muted)',
                            marginBottom: '16px',
                        }}
                    >
                        <span><strong style={{ color: 'var(--text-secondary)' }}>{filteredAnimeList.length}</strong> anime</span>
                        <span><strong style={{ color: 'var(--text-secondary)' }}>{totalEpisodes}</strong> bölüm izlendi</span>
                        <span>ort. Puan: <strong style={{ color: '#fbbf24' }}>{avgScore}</strong></span>
                    </motion.div>
                )}
            </motion.div>

            <motion.div
                className="filter-tabs"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
            >
                {STATUSES.map(status => (
                    <motion.button
                        key={status.value}
                        className={`filter-tab ${activeFilter === status.value ? 'active' : ''}`}
                        onClick={() => setActiveFilter(status.value)}
                        style={activeFilter === status.value ? {
                            borderColor: `${status.color}60`,
                            color: status.color,
                            background: `${status.color}15`,
                        } : {}}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        {status.label}
                    </motion.button>
                ))}
            </motion.div>

            {/* Genre Filter */}
            {!loading && allGenres.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.35 }}
                    style={{ marginTop: '12px', marginBottom: '4px' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <Filter size={14} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>Tür:</span>
                        {activeGenre && (
                            <motion.button
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    padding: '2px 8px',
                                    background: 'rgba(168, 85, 247, 0.15)',
                                    border: '1px solid rgba(168, 85, 247, 0.3)',
                                    borderRadius: 6,
                                    color: 'var(--purple-300)',
                                    fontSize: '11px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                }}
                                onClick={() => setActiveGenre(null)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {activeGenre} <X size={10} />
                            </motion.button>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {allGenres.slice(0, 12).map(genre => (
                            <motion.button
                                key={genre}
                                className={`filter-tab ${activeGenre === genre ? 'active' : ''}`}
                                onClick={() => setActiveGenre(activeGenre === genre ? null : genre)}
                                style={{
                                    padding: '4px 12px',
                                    fontSize: '11px',
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {genre}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                {loading && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <AnimeGridSkeleton count={8} />
                    </motion.div>
                )}

                {!loading && filteredAnimeList.length > 0 && (
                    <motion.div
                        key={`${activeFilter}-${activeGenre}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            marginTop: '12px',
                        }}
                    >
                        {/* List Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 16px',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                        }}>
                            <span style={{ width: '76px' }}></span>
                            <span style={{ flex: 1 }}>Anime</span>
                            <span style={{ width: '70px', textAlign: 'center' }}>Bölüm</span>
                            <span style={{ width: '80px', textAlign: 'right' }}>Puan</span>
                        </div>

                        {filteredAnimeList.map((anime, i) => (
                            <AnimeListItem
                                key={anime.id}
                                anime={anime}
                                index={i}
                                onClick={onSelectAnime}
                                onEpisodeUpdate={handleEpisodeUpdate}
                            />
                        ))}
                    </motion.div>
                )}

                {!loading && filteredAnimeList.length === 0 && (
                    <motion.div
                        key="empty"
                        className="empty-state"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                        >
                            <Library />
                        </motion.div>
                        <h3>{activeGenre ? `${activeGenre} türünde anime yok` : 'Liste boş'}</h3>
                        <p>{activeGenre ? 'Farklı bir tür seç veya filtreyi kaldır' : 'Bu kategoride anime bulunmuyor'}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
