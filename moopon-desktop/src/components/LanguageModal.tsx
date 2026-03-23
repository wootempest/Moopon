import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useI18n, type Language } from '../i18n';

interface LanguageModalProps {
    onSelect: (lang: Language) => void;
}

export default function LanguageModal({ onSelect }: LanguageModalProps) {
    const { t } = useI18n();

    return (
        <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <motion.div
                className="language-modal"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="language-modal-icon">
                    <Globe size={48} />
                </div>
                <h2>{t.language.selectTitle}</h2>
                <p>{t.language.selectSubtitle}</p>

                <div className="language-options">
                    <motion.button
                        className="language-option"
                        onClick={() => onSelect('en')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="language-flag">🇺🇸</span>
                        <span className="language-name">{t.language.english}</span>
                    </motion.button>

                    <motion.button
                        className="language-option"
                        onClick={() => onSelect('tr')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="language-flag">🇹🇷</span>
                        <span className="language-name">{t.language.turkish}</span>
                    </motion.button>

                    <motion.button
                        className="language-option"
                        onClick={() => onSelect('ja')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="language-flag">🇯🇵</span>
                        <span className="language-name">{t.language.japanese}</span>
                    </motion.button>

                    <motion.button
                        className="language-option"
                        onClick={() => onSelect('fr')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="language-flag">🇫🇷</span>
                        <span className="language-name">{t.language.french}</span>
                    </motion.button>

                    <motion.button
                        className="language-option"
                        onClick={() => onSelect('de')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="language-flag">🇩🇪</span>
                        <span className="language-name">{t.language.german}</span>
                    </motion.button>

                    <motion.button
                        className="language-option"
                        onClick={() => onSelect('ru')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="language-flag">🇷🇺</span>
                        <span className="language-name">{t.language.russian}</span>
                    </motion.button>

                    <motion.button
                        className="language-option"
                        onClick={() => onSelect('es')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="language-flag">🇪🇸</span>
                        <span className="language-name">{t.language.spanish}</span>
                    </motion.button>

                    <motion.button
                        className="language-option"
                        onClick={() => onSelect('it')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="language-flag">🇮🇹</span>
                        <span className="language-name">{t.language.italian}</span>
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
}
