import { motion } from 'framer-motion';
import { ArrowLeft, Star, Clock, Film, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AddToList from '../components/AddToList';
import { useI18n } from '../i18n';
import type { MalAnime } from '../services/malApi';

const STATUS_COLORS: Record<string, string> = {
    watching: '#a855f7',
    completed: '#22c55e',
    on_hold: '#eab308',
    dropped: '#ef4444',
    plan_to_watch: '#3b82f6',
};

interface DetailPageProps {
    anime: MalAnime;
    onBack: () => void;
    onSelectAnime: (anime: MalAnime) => void;
}

export default function DetailPage({ anime, onBack }: DetailPageProps) {
    const imageUrl = anime.main_picture?.large || anime.main_picture?.medium || '';
    const { t } = useI18n();

    const status = anime.list_status?.status as keyof typeof t.status | undefined;
    const statusInfo = status
        ? { label: t.status[status], color: STATUS_COLORS[status] }
        : null;

    return (
        <motion.div
            className="detail-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="detail-header">
                <motion.div
                    className="detail-header-bg"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                    initial={{ scale: 1.3, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
                <div className="detail-header-overlay" />
                <div className="detail-info">
                    <motion.div
                        className="detail-poster"
                        initial={{ y: 50, opacity: 0, rotateY: -8 }}
                        animate={{ y: 0, opacity: 1, rotateY: 0 }}
                        transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        {imageUrl && <img src={imageUrl} alt={anime.title} />}
                    </motion.div>
                    <motion.div
                        className="detail-meta"
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.35, duration: 0.5 }}
                    >
                        <motion.h1
                            className="detail-title"
                            initial={{ y: 15, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.45, duration: 0.4 }}
                        >
                            {anime.title}
                        </motion.h1>
                        <div className="detail-tags">
                            {anime.genres?.map((g, i) => (
                                <motion.span
                                    key={g.id}
                                    className="detail-tag"
                                    initial={{ scale: 0.7, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{
                                        delay: 0.55 + i * 0.06,
                                        duration: 0.3,
                                        type: 'spring',
                                        stiffness: 350,
                                        damping: 20,
                                    }}
                                >
                                    {g.name}
                                </motion.span>
                            ))}
                        </div>
                        <motion.div
                            className="detail-stats"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.65, duration: 0.4 }}
                        >
                            {anime.mean && (
                                <div className="detail-stat">
                                    <Star size={16} fill="#fbbf24" color="#fbbf24" /> {anime.mean.toFixed(2)}
                                </div>
                            )}
                            {anime.num_episodes && (
                                <div className="detail-stat">
                                    <Film size={16} /> {anime.num_episodes} Episodes
                                </div>
                            )}
                            {anime.media_type && (
                                <div className="detail-stat">
                                    <Clock size={16} /> {anime.media_type.toUpperCase()}
                                </div>
                            )}
                            {anime.start_season && (
                                <div className="detail-stat">
                                    <Calendar size={16} /> {anime.start_season.season} {anime.start_season.year}
                                </div>
                            )}
                            {statusInfo && (
                                <div className="detail-stat">
                                    <span className="status-badge" style={{
                                        background: `${statusInfo.color}20`,
                                        color: statusInfo.color,
                                        border: `1px solid ${statusInfo.color}40`,
                                    }}>
                                        {statusInfo.label}
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <motion.div
                className="detail-body"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            >
                <motion.div
                    style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                >
                    <motion.button
                        className="btn-secondary"
                        onClick={onBack}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        <ArrowLeft size={16} /> {t.common.back}
                    </motion.button>
                    <AddToList animeId={anime.id} currentStatus={anime.list_status?.status} variant="primary" />
                </motion.div>
                <motion.h2
                    className="section-title"
                    style={{ marginBottom: '16px' }}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.4 }}
                >
                    {t.detail.synopsis}
                </motion.h2>
                <motion.div
                    className="detail-synopsis"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {anime.synopsis || t.detail.noSynopsis}
                    </ReactMarkdown>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
