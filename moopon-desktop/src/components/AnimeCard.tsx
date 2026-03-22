import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';
import type { MalAnime } from '../services/malApi';

interface AnimeCardProps {
    anime: MalAnime;
    index: number;
    showRank?: boolean;
    onClick: (anime: MalAnime) => void;
}

export default function AnimeCard({ anime, index, showRank, onClick }: AnimeCardProps) {
    const imageUrl = anime.main_picture?.large || anime.main_picture?.medium || '';
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const watched = anime.list_status?.num_episodes_watched || 0;
    const total = anime.num_episodes || 0;
    const progress = total > 0 && watched > 0 ? (watched / total) * 100 : 0;

    return (
        <motion.div
            className="anime-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, scale: 1.025, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(anime)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="anime-card-image">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={anime.title}
                        loading="lazy"
                        className={`card-img ${imageLoaded ? 'loaded' : ''}`}
                        onLoad={() => setImageLoaded(true)}
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                        Görsel Yok
                    </div>
                )}
                <motion.div
                    className="anime-card-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    <div className="anime-card-genres">
                        {anime.genres?.slice(0, 2).map(g => g.name).join(' • ')}
                    </div>
                </motion.div>
                <motion.div
                    className="anime-card-glow"
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                />
                {anime.mean && (
                    <motion.div
                        className="anime-card-score"
                        animate={{
                            scale: isHovered ? 1.05 : 1,
                            transition: { duration: 0.25, ease: 'easeOut' }
                        }}
                    >
                        <Star size={10} fill="currentColor" /> {anime.mean.toFixed(2)}
                    </motion.div>
                )}
                {showRank && anime.rank && (
                    <motion.div
                        className="anime-card-rank"
                        initial={{ scale: 0.6, opacity: 0, y: -5 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06 + 0.25, type: 'spring', stiffness: 350, damping: 18 }}
                    >
                        <TrendingUp size={10} style={{ marginRight: 3 }} /> #{anime.rank}
                    </motion.div>
                )}
                {/* Progress Bar */}
                {progress > 0 && (
                    <div className="anime-card-progress">
                        <motion.div
                            className="anime-card-progress-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ delay: index * 0.06 + 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        />
                    </div>
                )}
            </div>
            <motion.div
                className="anime-card-title"
                animate={{ color: isHovered ? 'var(--purple-300)' : 'var(--text-primary)' }}
                transition={{ duration: 0.25 }}
            >
                {anime.title}
            </motion.div>
        </motion.div>
    );
}
