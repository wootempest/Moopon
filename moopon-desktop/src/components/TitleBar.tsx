import { Minus, Square, X } from 'lucide-react';
import { useI18n } from '../i18n';

export default function TitleBar() {
    const { t } = useI18n();
    return (
        <div className="titlebar">
            <div className="titlebar-title">
                <span className="logo-dot"></span>
                {t.common.appName}
            </div>
            <div className="titlebar-controls">
                <button className="titlebar-btn" onClick={() => window.electronAPI?.minimize()}>
                    <Minus size={14} />
                </button>
                <button className="titlebar-btn" onClick={() => window.electronAPI?.maximize()}>
                    <Square size={12} />
                </button>
                <button className="titlebar-btn close" onClick={() => window.electronAPI?.close()}>
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}
