import { motion } from 'framer-motion';

export function AnimeCardSkeleton({ index = 0 }: { index?: number }) {
    return (
        <motion.div
            className="anime-card skeleton-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
        >
            <div className="anime-card-image skeleton-shimmer" />
            <div className="skeleton-title skeleton-shimmer" style={{ width: '80%', height: 14, marginTop: 10, borderRadius: 6 }} />
            <div className="skeleton-title skeleton-shimmer" style={{ width: '50%', height: 12, marginTop: 6, borderRadius: 6 }} />
        </motion.div>
    );
}

export function AnimeGridSkeleton({ count = 12 }: { count?: number }) {
    return (
        <div className="anime-grid">
            {Array.from({ length: count }, (_, i) => (
                <AnimeCardSkeleton key={i} index={i} />
            ))}
        </div>
    );
}

export function AnimeRowSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="cards-row">
            {Array.from({ length: count }, (_, i) => (
                <AnimeCardSkeleton key={i} index={i} />
            ))}
        </div>
    );
}

export function HeroSkeleton() {
    return (
        <div className="hero skeleton-hero">
            <div className="skeleton-shimmer" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />
            <div className="hero-content" style={{ zIndex: 2 }}>
                <div className="skeleton-shimmer" style={{ width: 120, height: 28, borderRadius: 20, marginBottom: 16 }} />
                <div className="skeleton-shimmer" style={{ width: 350, height: 36, borderRadius: 8, marginBottom: 12 }} />
                <div className="skeleton-shimmer" style={{ width: 250, height: 16, borderRadius: 6, marginBottom: 10 }} />
                <div className="skeleton-shimmer" style={{ width: 400, height: 14, borderRadius: 6, marginBottom: 6 }} />
                <div className="skeleton-shimmer" style={{ width: 320, height: 14, borderRadius: 6, marginBottom: 20 }} />
                <div style={{ display: 'flex', gap: 12 }}>
                    <div className="skeleton-shimmer" style={{ width: 130, height: 42, borderRadius: 10 }} />
                    <div className="skeleton-shimmer" style={{ width: 140, height: 42, borderRadius: 10 }} />
                </div>
            </div>
        </div>
    );
}

export function ProfileSkeleton() {
    return (
        <div style={{ padding: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
                <div className="skeleton-shimmer" style={{ width: 90, height: 90, borderRadius: '50%', flexShrink: 0 }} />
                <div>
                    <div className="skeleton-shimmer" style={{ width: 180, height: 28, borderRadius: 8, marginBottom: 8 }} />
                    <div className="skeleton-shimmer" style={{ width: 140, height: 14, borderRadius: 6 }} />
                </div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                <div className="skeleton-shimmer profile-stat-card" style={{ flex: 1, minWidth: 140, height: 80 }} />
                <div className="skeleton-shimmer profile-stat-card" style={{ flex: 1, minWidth: 140, height: 80 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="skeleton-shimmer profile-stat-card" style={{ height: 70 }} />
                ))}
            </div>
        </div>
    );
}
