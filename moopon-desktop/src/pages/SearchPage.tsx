import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimeCard from '../components/AnimeCard';
import { AnimeGridSkeleton } from '../components/Skeleton';
import { searchAnime } from '../services/malApi';
import { useI18n } from '../i18n';
import type { MalAnime } from '../services/malApi';

interface SearchPageProps {
    onSelectAnime: (anime: MalAnime) => void;
}

export default function SearchPage({ onSelectAnime }: SearchPageProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<MalAnime[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const { t } = useI18n();

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setSearched(false);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const data = await searchAnime(query, 20);
                setResults(data);
                setSearched(true);
            } catch (err) {
                console.error('Search error:', err);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div>
            <motion.div
                className="search-container"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder={t.search.placeholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                </div>
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
                        <AnimeGridSkeleton count={12} />
                    </motion.div>
                )}

                {!loading && results.length > 0 && (
                    <motion.div
                        key="results"
                        className="anime-grid"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                    >
                        {results.map((anime, i) => (
                            <AnimeCard key={anime.id} anime={anime} index={i} onClick={onSelectAnime} />
                        ))}
                    </motion.div>
                )}

                {!loading && searched && results.length === 0 && (
                    <motion.div
                        key="empty"
                        className="empty-state"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Search />
                        <h3>{t.search.noResults}</h3>
                        <p>{t.empty.tryDifferentSearch}</p>
                    </motion.div>
                )}

                {!searched && !loading && (
                    <motion.div
                        key="idle"
                        className="empty-state"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                    >
                        <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                        >
                            <Search />
                        </motion.div>
                        <h3>{t.nav.search}</h3>
                        <p>{t.empty.useSearchBar}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
