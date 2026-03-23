import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Eye, CheckCircle, Pause, XCircle, Clock, Star, LogOut, Globe } from 'lucide-react';
import { ProfileSkeleton } from '../components/Skeleton';
import { getUserProfile, logout } from '../services/malApi';
import { useI18n, useLanguage } from '../i18n';
import type { MalUser } from '../services/malApi';

interface ProfilePageProps {
    onLogout: () => void;
}

export default function ProfilePage({ onLogout }: ProfilePageProps) {
    const [user, setUser] = useState<MalUser | null>(null);
    const [loading, setLoading] = useState(true);
    const { t } = useI18n();
    const { language, setLanguage } = useLanguage();

    useEffect(() => {
        async function fetchProfile() {
            try {
                const data = await getUserProfile();
                setUser(data);
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const handleLogout = () => {
        logout();
        onLogout();
    };

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value as 'en' | 'tr' | 'ja' | 'fr' | 'de' | 'ru' | 'es' | 'it');
    };

    if (loading) {
        return <ProfileSkeleton />;
    }

    if (!user) {
        return (
            <motion.div
                className="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <User />
                <h3>{t.profile.loadFailed}</h3>
                <p>{t.profile.pleaseLogin}</p>
            </motion.div>
        );
    }

    const stats = user.anime_statistics;

    const statItems = stats ? [
        { label: t.profile.watching, value: stats.num_items_watching, icon: Eye, color: '#a855f7' },
        { label: t.profile.completed, value: stats.num_items_completed, icon: CheckCircle, color: '#22c55e' },
        { label: t.profile.onHold, value: stats.num_items_on_hold, icon: Pause, color: '#eab308' },
        { label: t.profile.dropped, value: stats.num_items_dropped, icon: XCircle, color: '#ef4444' },
        { label: t.profile.planToWatch, value: stats.num_items_plan_to_watch, icon: Clock, color: '#3b82f6' },
    ] : [];

    return (
        <motion.div
            style={{ padding: '40px' }}
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
            }}
        >
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } }
                }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    marginBottom: '32px',
                }}
            >
                <div>
                    <motion.div
                        style={{
                            width: '90px',
                            height: '90px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: '3px solid var(--border-glow)',
                            boxShadow: 'var(--glow-purple)',
                            flexShrink: 0,
                        }}
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.3 }}
                    >
                        {user.picture ? (
                            <img src={user.picture} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(135deg, var(--purple-600), var(--purple-800))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <User size={36} color="white" />
                            </div>
                        )}
                    </motion.div>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <h1 style={{
                                fontSize: '28px',
                                fontWeight: 800,
                                marginBottom: '4px',
                            }}>
                                {user.name}
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                                {t.profile.myAnimeList}
                            </p>
                        </div>
                        <motion.div
                            className="language-selector"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Globe size={16} style={{ color: 'var(--text-secondary)' }} />
                            <select
                                value={language}
                                onChange={handleLanguageChange}
                                className="language-select"
                            >
                                <option value="en">{t.language.english}</option>
                                <option value="tr">{t.language.turkish}</option>
                                <option value="ja">{t.language.japanese}</option>
                                <option value="fr">{t.language.french}</option>
                                <option value="de">{t.language.german}</option>
                                <option value="ru">{t.language.russian}</option>
                                <option value="es">{t.language.spanish}</option>
                                <option value="it">{t.language.italian}</option>
                            </select>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {stats && (
                <>
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, y: 18 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } }
                        }}
                        style={{
                            display: 'flex',
                            gap: '16px',
                            marginBottom: '24px',
                            flexWrap: 'wrap',
                        }}
                    >
                        <motion.div
                            className="profile-stat-card"
                            style={{ flex: 1, minWidth: '140px' }}
                            whileHover={{ borderColor: 'rgba(168, 85, 247, 0.4)', y: -2 }}
                        >
                            <div className="profile-stat-value" style={{ color: '#fbbf24' }}>
                                <Star size={18} fill="#fbbf24" /> {stats.mean_score.toFixed(1)}
                            </div>
                            <div className="profile-stat-label">{t.profile.meanScore}</div>
                        </motion.div>
                        <motion.div
                            className="profile-stat-card"
                            style={{ flex: 1, minWidth: '140px' }}
                            whileHover={{ borderColor: 'rgba(168, 85, 247, 0.4)', y: -2 }}
                        >
                            <div className="profile-stat-value">{stats.num_items}</div>
                            <div className="profile-stat-label">{t.profile.totalAnime}</div>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
                        }}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                            gap: '12px',
                            marginBottom: '32px',
                        }}
                    >
                        {statItems.map((item, idx) => (
                            <motion.div
                                key={item.label}
                                className="profile-stat-card"
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: 0.4 + idx * 0.08, duration: 0.35, type: 'spring', stiffness: 300 }}
                                whileHover={{ borderColor: `${item.color}60`, y: -3, boxShadow: `0 0 15px ${item.color}20` }}
                            >
                                <div className="profile-stat-value" style={{ color: item.color }}>
                                    <item.icon size={16} /> {item.value}
                                </div>
                                <div className="profile-stat-label">{item.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </>
            )}

            <motion.div variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45 } }
            }}>
                <motion.button
                    className="btn-secondary"
                    onClick={handleLogout}
                    style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                    whileHover={{ scale: 1.04, borderColor: 'rgba(239,68,68,0.5)', boxShadow: '0 0 15px rgba(239,68,68,0.15)' }}
                    whileTap={{ scale: 0.96 }}
                >
                    <LogOut size={16} /> {t.profile.logout}
                </motion.button>
            </motion.div>
        </motion.div>
    );
}
