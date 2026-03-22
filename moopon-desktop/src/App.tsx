import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import './index.css';
import TitleBar from './components/TitleBar';
import Sidebar from './components/Sidebar';
import Particles from './components/Particles';
import LanguageModal from './components/LanguageModal';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import DetailPage from './pages/DetailPage';
import MyListPage from './pages/MyListPage';
import TopPage from './pages/TopPage';
import SeasonalPage from './pages/SeasonalPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import { isLoggedIn, logout, isQuotaExceeded } from './services/malApi';
import { I18nProvider, hasSelectedLanguage, useI18n } from './i18n';
import type { MalAnime } from './services/malApi';
import type { Language } from './i18n';

const pageTransition = {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
    transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] },
};

function LanguageGate({ children }: { children: React.ReactNode }) {
    const [showModal, setShowModal] = useState(!hasSelectedLanguage());
    const { setLanguage } = useI18n();

    const handleSelectLanguage = (lang: Language) => {
        setLanguage(lang);
        setShowModal(false);
    };

    if (showModal) {
        return <LanguageModal onSelect={handleSelectLanguage} />;
    }

    return <>{children}</>;
}

function AppContent() {
    const [loggedIn, setLoggedIn] = useState(isLoggedIn());
    const [activePage, setActivePage] = useState('home');
    const [selectedAnime, setSelectedAnime] = useState<MalAnime | null>(null);
    const [showQuotaWarning, setShowQuotaWarning] = useState(false);
    const { t } = useI18n();
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkQuota = () => {
            const exceeded = isQuotaExceeded();
            setShowQuotaWarning(exceeded);
        };
        checkQuota();
        const interval = setInterval(checkQuota, 30000);
        return () => clearInterval(interval);
    }, []);

    const scrollToTop = useCallback(() => {
        contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleLoginSuccess = () => {
        setLoggedIn(true);
        setActivePage('home');
    };

    const handleSelectAnime = (anime: MalAnime) => {
        setSelectedAnime(anime);
        setActivePage('detail');
        scrollToTop();
    };

    const handleNavigate = (page: string) => {
        if (page === 'logout') {
            logout();
            setLoggedIn(false);
            setActivePage('login');
            return;
        }
        setSelectedAnime(null);
        setActivePage(page);
        scrollToTop();
    };

    if (!loggedIn) {
        return (
            <div className="app-layout">
                <Particles />
                <TitleBar />
                <div className="main-area">
                    <div className="content" style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <LoginPage onLoginSuccess={handleLoginSuccess} />
                    </div>
                </div>
            </div>
        );
    }

    const pageKey = activePage === 'detail' && selectedAnime ? `detail-${selectedAnime.id}` : activePage;

    const renderPage = () => {
        if (activePage === 'detail' && selectedAnime) {
            return <DetailPage anime={selectedAnime} onBack={() => handleNavigate('home')} onSelectAnime={handleSelectAnime} />;
        }

        switch (activePage) {
            case 'home':
            case 'trending':
                return <HomePage onSelectAnime={handleSelectAnime} />;
            case 'search':
                return <SearchPage onSelectAnime={handleSelectAnime} />;
            case 'mylist':
                return <MyListPage onSelectAnime={handleSelectAnime} />;
            case 'top':
                return <TopPage onSelectAnime={handleSelectAnime} />;
            case 'seasonal':
                return <SeasonalPage onSelectAnime={handleSelectAnime} />;
            case 'profile':
                return <ProfilePage onLogout={() => { setLoggedIn(false); }} />;
            default:
                return <HomePage onSelectAnime={handleSelectAnime} />;
        }
    };

    return (
        <div className="app-layout">
            <Particles />
            <TitleBar />

            <AnimatePresence>
                {showQuotaWarning && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 40,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(90deg, rgba(234, 179, 8, 0.95), rgba(202, 138, 4, 0.95))',
                            color: 'white',
                            padding: '10px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 12,
                            fontSize: 13,
                            fontWeight: 600,
                            zIndex: 999,
                            boxShadow: '0 4px 20px rgba(234, 179, 8, 0.3)',
                        }}
                    >
                        <AlertTriangle size={18} />
                        <span>{t.quota.warning}</span>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="main-area">
                <Sidebar activePage={activePage} onNavigate={handleNavigate} />
                <main className="content" ref={contentRef}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pageKey}
                            initial={pageTransition.initial}
                            animate={pageTransition.animate}
                            exit={pageTransition.exit}
                            transition={pageTransition.transition}
                            style={{ minHeight: '100%' }}
                        >
                            {renderPage()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <I18nProvider>
            <LanguageGate>
                <AppContent />
            </LanguageGate>
        </I18nProvider>
    );
}
