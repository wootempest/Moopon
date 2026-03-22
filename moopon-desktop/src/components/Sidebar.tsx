import { motion } from 'framer-motion';
import { Home, Library, Calendar, Search, Star, User, LogOut, Sparkles } from 'lucide-react';
import { useI18n } from '../i18n';

interface SidebarProps {
    activePage: string;
    onNavigate: (page: string) => void;
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
    const { t } = useI18n();

    const menuItems = [
        {
            section: t.nav.home, items: [
                { id: 'home', label: t.nav.home, icon: Home },
                { id: 'search', label: t.nav.search, icon: Search },
                { id: 'seasonal', label: t.nav.seasonal, icon: Calendar },
                { id: 'top', label: t.nav.topAnime, icon: Star },
            ]
        },
        {
            section: t.nav.myList, items: [
                { id: 'mylist', label: t.nav.myList, icon: Library },
                { id: 'profile', label: t.nav.profile, icon: User },
                { id: 'logout', label: t.common.logout, icon: LogOut },
            ]
        },
    ];

    const sidebarVariants = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.05, delayChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -12 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <motion.nav
            className="sidebar"
            initial="hidden"
            animate="visible"
            variants={sidebarVariants}
        >
            {menuItems.map((group) => (
                <div key={group.section} className="sidebar-section">
                    <motion.div
                        className="sidebar-label"
                        variants={itemVariants}
                        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                        <Sparkles size={10} style={{ opacity: 0.5 }} />
                        {group.section}
                    </motion.div>
                    {group.items.map((item) => (
                        <motion.div
                            key={item.id}
                            className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
                            onClick={() => onNavigate(item.id)}
                            variants={itemVariants}
                            whileHover={{ x: 3, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {activePage === item.id && (
                                <motion.div
                                    className="sidebar-active-indicator"
                                    layoutId="sidebar-indicator"
                                    transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                                />
                            )}
                            <motion.div
                                style={{ display: 'flex', alignItems: 'center' }}
                                animate={activePage === item.id ? { scale: [1, 1.1, 1] } : {}}
                                transition={{ duration: 0.3 }}
                            >
                                <item.icon size={18} />
                            </motion.div>
                            {item.label}
                        </motion.div>
                    ))}
                </div>
            ))}
        </motion.nav>
    );
}
