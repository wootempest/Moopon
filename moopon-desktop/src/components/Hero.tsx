import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Star, Flame } from 'lucide-react';
import AddToList from './AddToList';
import type { MalAnime } from '../services/malApi';

interface HeroProps {
    anime: MalAnime;
    onSelect: (anime: MalAnime) => void;
}

export default function Hero({ anime, onSelect }: HeroProps) {
    const imageUrl = anime.main_picture?.large || anime.main_picture?.medium || '';
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const heroRef = useRef<HTMLDivElement>(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const el = heroRef.current;
        if (!el) return;
        const handleMouseMove = (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
            setMousePos({ x, y });
        };
        el.addEventListener('mousemove', handleMouseMove);
        return () => el.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        if (!imageUrl) return;
        const img = new Image();
        img.onload = () => setImageLoaded(true);
        img.src = imageUrl;
    }, [imageUrl]);

    return (
        <motion.div
            className="hero"
            ref={heroRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
        >
            <motion.div
                className="hero-bg"
                style={{ backgroundImage: `url(${imageUrl})` }}
                animate={{
                    x: mousePos.x,
                    y: mousePos.y,
                    scale: 1.1,
                    opacity: imageLoaded ? 1 : 0,
                }}
                transition={{ type: 'tween', duration: 0.8, ease: 'easeOut' }}
            />
            <motion.div
                className="hero-overlay"
                animate={{
                    background: [
                        'linear-gradient(to top, rgba(6,0,15,0.95) 0%, rgba(6,0,15,0.6) 35%, rgba(6,0,15,0.2) 60%, transparent 100%), linear-gradient(to right, rgba(6,0,15,0.85) 0%, transparent 50%)',
                        'linear-gradient(to top, rgba(6,0,15,0.9) 0%, rgba(6,0,15,0.5) 30%, rgba(6,0,15,0.15) 55%, transparent 90%), linear-gradient(to right, rgba(6,0,15,0.8) 0%, transparent 55%)',
                        'linear-gradient(to top, rgba(6,0,15,0.95) 0%, rgba(6,0,15,0.6) 35%, rgba(6,0,15,0.2) 60%, transparent 100%), linear-gradient(to right, rgba(6,0,15,0.85) 0%, transparent 50%)',
                    ],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="hero-content"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
                <motion.div
                    className="hero-badge"
                    initial={{ scale: 0.7, opacity: 0, y: -10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.5, type: 'spring', stiffness: 280 }}
                >
                    <Flame size={12} fill="currentColor" /> Trending #1
                </motion.div>
                <motion.h1
                    className="hero-title"
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.65, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    {anime.title}
                </motion.h1>
                <motion.div
                    className="hero-meta"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.75, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                    {anime.mean && (
                        <span className="hero-score">
                            <Star size={14} fill="currentColor" /> {anime.mean.toFixed(2)}
                        </span>
                    )}
                    {anime.num_episodes && <span>{anime.num_episodes} Bölüm</span>}
                    {anime.media_type && <span>{anime.media_type.toUpperCase()}</span>}
                    {anime.start_season && <span>{anime.start_season.season} {anime.start_season.year}</span>}
                </motion.div>
                <motion.p
                    className="hero-synopsis"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.85, duration: 0.55, ease: 'easeOut' }}
                >
                    {anime.synopsis}
                </motion.p>
                <motion.div
                    className="hero-actions"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.95, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                    <motion.button
                        className="btn-primary"
                        onClick={() => onSelect(anime)}
                        whileHover={{ scale: 1.03, boxShadow: '0 0 35px rgba(168, 85, 247, 0.5), 0 0 80px rgba(168, 85, 247, 0.15)' }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Play size={16} fill="currentColor" /> Detaylar
                    </motion.button>
                    <AddToList animeId={anime.id} currentStatus={anime.list_status?.status} />
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
