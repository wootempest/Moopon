import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Hero from '../components/Hero';
import AnimeCard from '../components/AnimeCard';
import { HeroSkeleton, AnimeRowSkeleton } from '../components/Skeleton';
import { getAnimeRanking, getSeasonalAnime } from '../services/malApi';
import { useI18n } from '../i18n';
import type { MalAnime } from '../services/malApi';

interface HomePageProps {
    onSelectAnime: (anime: MalAnime) => void;
}

const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }
    }),
};

function BrowseRow({ children }: { children: ReactNode }) {
    const rowRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!rowRef.current || !isFocused) return;

            const cards = rowRef.current.querySelectorAll('.anime-card');
            const cardWidth = 200;
            const currentScroll = rowRef.current.scrollLeft;

            switch (e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    if (focusedIndex < cards.length - 1) {
                        const newIndex = focusedIndex + 1;
                        setFocusedIndex(newIndex);
                        rowRef.current.scrollTo({
                            left: Math.min(currentScroll + cardWidth, rowRef.current.scrollWidth),
                            behavior: 'smooth'
                        });
                        (cards[newIndex] as HTMLElement)?.focus();
                    }
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    if (focusedIndex > 0) {
                        const newIndex = focusedIndex - 1;
                        setFocusedIndex(newIndex);
                        rowRef.current.scrollTo({
                            left: Math.max(currentScroll - cardWidth, 0),
                            behavior: 'smooth'
                        });
                        (cards[newIndex] as HTMLElement)?.focus();
                    }
                    break;
                case 'Enter':
                    if (focusedIndex >= 0) {
                        const card = cards[focusedIndex] as HTMLElement;
                        card?.click();
                    }
                    break;
                case 'Escape':
                    setFocusedIndex(-1);
                    rowRef.current.blur();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, focusedIndex]);

    return (
        <div style={{ position: 'relative' }}>
            <div
                ref={rowRef}
                className="cards-row"
                tabIndex={0}
                onFocus={() => setIsFocused(true)}
                onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                        setIsFocused(false);
                        setFocusedIndex(-1);
                    }
                }}
                style={{ outline: 'none' }}
            >
                {children}
            </div>
            {isFocused && (
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        position: 'absolute',
                        bottom: -30,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: 8,
                        background: 'rgba(6, 0, 15, 0.9)',
                        backdropFilter: 'blur(12px)',
                        padding: '4px 12px',
                        borderRadius: 20,
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        zIndex: 20,
                    }}
                >
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <ChevronLeft size={12} /> <ChevronRight size={12} /> navigate
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--purple-400)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        Enter select
                    </span>
                </motion.div>
            )}
        </div>
    );
}

export default function HomePage({ onSelectAnime }: HomePageProps) {
    const [trending, setTrending] = useState<MalAnime[]>([]);
    const [topRated, setTopRated] = useState<MalAnime[]>([]);
    const [seasonal, setSeasonal] = useState<MalAnime[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useI18n();

    useEffect(() => {
        async function fetchData() {
            try {
                const now = new Date();
                const month = now.getMonth();
                const year = now.getFullYear();
                const season = month < 3 ? 'winter' : month < 6 ? 'spring' : month < 9 ? 'summer' : 'fall';

                const [trendingData, topData, seasonalData] = await Promise.all([
                    getAnimeRanking('airing', 10).catch(() => []),
                    getAnimeRanking('all', 10).catch(() => []),
                    getSeasonalAnime(year, season, 10).catch(() => []),
                ]);

                setTrending(trendingData);
                setTopRated(topData);
                setSeasonal(seasonalData);
            } catch (err) {
                console.error('Error fetching home data:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div>
                <HeroSkeleton />
                <div className="section">
                    <div className="section-header">
                        <div className="skeleton-shimmer" style={{ width: 180, height: 24, borderRadius: 8 }} />
                    </div>
                    <AnimeRowSkeleton count={8} />
                </div>
                <div className="section">
                    <div className="section-header">
                        <div className="skeleton-shimmer" style={{ width: 140, height: 24, borderRadius: 8 }} />
                    </div>
                    <AnimeRowSkeleton count={8} />
                </div>
            </div>
        );
    }

    return (
        <div>
            {trending.length > 0 && (
                <Hero anime={trending[0]} onSelect={onSelectAnime} />
            )}

            {trending.length > 0 && (
                <motion.div
                    className="section"
                    custom={0}
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                >
                    <div className="section-header">
                        <h2 className="section-title">{t.home.trending}</h2>
                    </div>
                    <BrowseRow>
                        {trending.map((anime, i) => (
                            <AnimeCard key={anime.id} anime={anime} index={i} onClick={onSelectAnime} />
                        ))}
                    </BrowseRow>
                </motion.div>
            )}

            {topRated.length > 0 && (
                <motion.div
                    className="section"
                    custom={1}
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                >
                    <div className="section-header">
                        <h2 className="section-title">{t.home.topRated}</h2>
                    </div>
                    <BrowseRow>
                        {topRated.map((anime, i) => (
                            <AnimeCard key={anime.id} anime={anime} index={i} showRank onClick={onSelectAnime} />
                        ))}
                    </BrowseRow>
                </motion.div>
            )}

            {seasonal.length > 0 && (
                <motion.div
                    className="section"
                    custom={2}
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                >
                    <div className="section-header">
                        <h2 className="section-title">{t.home.seasonal}</h2>
                    </div>
                    <BrowseRow>
                        {seasonal.map((anime, i) => (
                            <AnimeCard key={anime.id} anime={anime} index={i} onClick={onSelectAnime} />
                        ))}
                    </BrowseRow>
                </motion.div>
            )}
        </div>
    );
}
