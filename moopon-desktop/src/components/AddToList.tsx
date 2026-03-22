import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookmarkPlus, Eye, CheckCircle, Pause, XCircle, Clock, Check, Star } from 'lucide-react';
import { updateAnimeStatus } from '../services/malApi';

const STATUSES = [
    { value: 'watching', label: 'İzleniyor', icon: Eye, color: '#a855f7' },
    { value: 'completed', label: 'Tamamlandı', icon: CheckCircle, color: '#22c55e' },
    { value: 'on_hold', label: 'Beklemede', icon: Pause, color: '#eab308' },
    { value: 'dropped', label: 'Bırakıldı', icon: XCircle, color: '#ef4444' },
    { value: 'plan_to_watch', label: 'İzlenecek', icon: Clock, color: '#3b82f6' },
];

interface AddToListProps {
    animeId: number;
    currentStatus?: string;
    currentScore?: number;
    variant?: 'primary' | 'secondary';
}

export default function AddToList({ animeId, currentStatus, currentScore, variant = 'secondary' }: AddToListProps) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(currentStatus || '');
    const [score, setScore] = useState(currentScore || 0);
    const [hoverScore, setHoverScore] = useState(0);
    const [saving, setSaving] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        if (open) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    const handleSelect = async (status: string) => {
        setSaving(true);
        try {
            await updateAnimeStatus(animeId, { status });
            setSelected(status);
        } catch (err) {
            console.error('Failed to update status:', err);
        } finally {
            setSaving(false);
        }
    };

    const handleScore = async (newScore: number) => {
        const finalScore = newScore === score ? 0 : newScore;
        setSaving(true);
        try {
            await updateAnimeStatus(animeId, { score: String(finalScore) });
            setScore(finalScore);
        } catch (err) {
            console.error('Failed to update score:', err);
        } finally {
            setSaving(false);
        }
    };

    const currentLabel = STATUSES.find(s => s.value === selected);

    const dropdownStyle: React.CSSProperties = {
        position: 'absolute',
        top: '100%',
        left: 0,
        marginTop: '8px',
        background: 'rgba(15, 5, 35, 0.95)',
        border: '1px solid var(--border-glow)',
        borderRadius: '12px',
        padding: '6px',
        minWidth: '220px',
        backdropFilter: 'blur(20px)',
        boxShadow: 'var(--glow-purple), 0 20px 40px rgba(0,0,0,0.5)',
        zIndex: 100,
    };

    const itemStyle = (isActive: boolean, color: string): React.CSSProperties => ({
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        width: '100%',
        padding: '10px 14px',
        border: 'none',
        borderRadius: '8px',
        background: isActive ? `${color}15` : 'transparent',
        color: isActive ? color : 'var(--text-secondary)',
        fontSize: '13px',
        fontWeight: isActive ? 600 : 500,
        fontFamily: 'Inter, sans-serif',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
    });

    return (
        <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
            <button
                className={variant === 'primary' ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setOpen(!open)}
                disabled={saving}
            >
                {currentLabel ? (
                    <>
                        <Check size={16} />
                        {currentLabel.label}
                        {score > 0 && <span style={{ opacity: 0.7 }}>• {score}/10</span>}
                    </>
                ) : (
                    <>
                        <BookmarkPlus size={16} />
                        {saving ? 'Kaydediliyor...' : 'Listeye Ekle'}
                    </>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        style={dropdownStyle}
                    >
                        {/* Status Seçimi */}
                        <div style={{
                            padding: '4px 10px 6px',
                            fontSize: '10px',
                            fontWeight: 700,
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                        }}>Durum</div>

                        {STATUSES.map(status => (
                            <button
                                key={status.value}
                                onClick={() => handleSelect(status.value)}
                                style={itemStyle(selected === status.value, status.color)}
                                onMouseEnter={(e) => {
                                    if (selected !== status.value) {
                                        e.currentTarget.style.background = 'rgba(168, 85, 247, 0.08)';
                                        e.currentTarget.style.color = 'var(--text-primary)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selected !== status.value) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                    }
                                }}
                            >
                                <status.icon size={16} style={{ color: status.color }} />
                                {status.label}
                                {selected === status.value && (
                                    <Check size={14} style={{ marginLeft: 'auto', color: status.color }} />
                                )}
                            </button>
                        ))}

                        {/* Puan Bölümü */}
                        <div style={{
                            borderTop: '1px solid var(--border-subtle)',
                            margin: '6px 0',
                        }} />

                        <div style={{
                            padding: '4px 10px 6px',
                            fontSize: '10px',
                            fontWeight: 700,
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                        }}>Puan</div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            padding: '6px 10px 10px',
                        }}>
                            {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                                <button
                                    key={n}
                                    onClick={() => handleScore(n)}
                                    onMouseEnter={() => setHoverScore(n)}
                                    onMouseLeave={() => setHoverScore(0)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: '2px',
                                        cursor: 'pointer',
                                        transition: 'transform 0.1s ease',
                                        transform: (hoverScore >= n || (!hoverScore && score >= n)) ? 'scale(1.15)' : 'scale(1)',
                                    }}
                                    title={`${n}/10`}
                                >
                                    <Star
                                        size={18}
                                        fill={(hoverScore >= n || (!hoverScore && score >= n)) ? '#fbbf24' : 'transparent'}
                                        color={(hoverScore >= n || (!hoverScore && score >= n)) ? '#fbbf24' : 'var(--text-muted)'}
                                        style={{ transition: 'all 0.15s ease' }}
                                    />
                                </button>
                            ))}
                            <span style={{
                                marginLeft: '6px',
                                fontSize: '13px',
                                fontWeight: 700,
                                color: (hoverScore || score) ? '#fbbf24' : 'var(--text-muted)',
                                minWidth: '28px',
                            }}>
                                {hoverScore || score || '—'}/10
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
