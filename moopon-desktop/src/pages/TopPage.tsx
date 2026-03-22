import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimeCard from '../components/AnimeCard';
import { AnimeGridSkeleton } from '../components/Skeleton';
import { getAnimeRanking } from '../services/malApi';
import type { MalAnime } from '../services/malApi';

interface TopPageProps {
    onSelectAnime: (anime: MalAnime) => void;
}

const RANKING_TYPES = [
    { value: 'all', label: 'Genel' },
    { value: 'airing', label: 'Yayında' },
    { value: 'upcoming', label: 'Yakında' },
    { value: 'tv', label: 'TV' },
    { value: 'movie', label: 'Film' },
    { value: 'bypopularity', label: 'Popülerlik' },
    { value: 'favorite', label: 'Favori' },
];

export default function TopPage({ onSelectAnime }: TopPageProps) {
    const [rankingType, setRankingType] = useState('all');
    const [animeList, setAnimeList] = useState<MalAnime[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRanking() {
            setLoading(true);
            try {
                const data = await getAnimeRanking(rankingType, 30);
                setAnimeList(data);
            } catch (err) {
                console.error('Error fetching ranking:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchRanking();
    }, [rankingType]);

    return (
        <div>
            <motion.div
                className="section"
                style={{ paddingBottom: 0 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h2 className="section-title">En İyi Animeler</h2>
            </motion.div>

            <motion.div
                className="filter-tabs"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
            >
                {RANKING_TYPES.map(type => (
                    <motion.button
                        key={type.value}
                        className={`filter-tab ${rankingType === type.value ? 'active' : ''}`}
                        onClick={() => setRankingType(type.value)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        {type.label}
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
                        <AnimeGridSkeleton count={15} />
                    </motion.div>
                )}

                {!loading && (
                    <motion.div
                        className="anime-grid"
                        key={rankingType}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        {animeList.map((anime, i) => (
                            <AnimeCard key={anime.id} anime={anime} index={i} showRank onClick={onSelectAnime} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
