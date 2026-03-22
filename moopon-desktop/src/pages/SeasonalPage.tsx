import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';
import AnimeCard from '../components/AnimeCard';
import { AnimeGridSkeleton } from '../components/Skeleton';
import { getSeasonalAnime } from '../services/malApi';
import { useI18n } from '../i18n';
import type { MalAnime } from '../services/malApi';

interface SeasonalPageProps {
    onSelectAnime: (anime: MalAnime) => void;
}

const SEASONS = ['winter', 'spring', 'summer', 'fall'];
const SEASON_LABELS: Record<string, string> = {
    winter: 'Winter',
    spring: 'Spring',
    summer: 'Summer',
    fall: 'Fall',
};

function getCurrentSeason() {
    const month = new Date().getMonth();
    if (month < 3) return 'winter';
    if (month < 6) return 'spring';
    if (month < 9) return 'summer';
    return 'fall';
}

export default function SeasonalPage({ onSelectAnime }: SeasonalPageProps) {
    const currentYear = new Date().getFullYear();
    const currentSeason = getCurrentSeason();

    const [year, setYear] = useState(currentYear);
    const [season, setSeason] = useState(currentSeason);
    const [animeList, setAnimeList] = useState<MalAnime[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useI18n();

    useEffect(() => {
        async function fetchSeasonal() {
            setLoading(true);
            try {
                const data = await getSeasonalAnime(year, season, 40);
                data.sort((a, b) => (b.popularity ? 1 / b.popularity : 0) - (a.popularity ? 1 / a.popularity : 0));
                setAnimeList(data);
            } catch (err) {
                console.error('Error fetching seasonal:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchSeasonal();
    }, [year, season]);

    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <div>
            <motion.div
                className="section"
                style={{ paddingBottom: 0 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h2 className="section-title">
                    <Calendar size={20} style={{ marginLeft: 8 }} />
                    {t.nav.seasonal}
                </h2>
            </motion.div>

            <motion.div
                className="filter-tabs"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
            >
                {SEASONS.map(s => (
                    <motion.button
                        key={s}
                        className={`filter-tab ${season === s ? 'active' : ''}`}
                        onClick={() => setSeason(s)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        {SEASON_LABELS[s]}
                    </motion.button>
                ))}
                <div style={{ width: 1, background: 'var(--border-subtle)', margin: '0 4px' }} />
                {years.map(y => (
                    <motion.button
                        key={y}
                        className={`filter-tab ${year === y ? 'active' : ''}`}
                        onClick={() => setYear(y)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        {y}
                    </motion.button>
                ))}
            </motion.div>

            <AnimatePresence mode="wait">
                {loading && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <AnimeGridSkeleton count={16} />
                    </motion.div>
                )}

                {!loading && animeList.length > 0 && (
                    <motion.div
                        className="anime-grid"
                        key={`${year}-${season}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        {animeList.map((anime, i) => (
                            <AnimeCard key={anime.id} anime={anime} index={i} onClick={onSelectAnime} />
                        ))}
                    </motion.div>
                )}

                {!loading && animeList.length === 0 && (
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
                            <Calendar />
                        </motion.div>
                        <h3>No anime found</h3>
                        <p>No data available for this season</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
