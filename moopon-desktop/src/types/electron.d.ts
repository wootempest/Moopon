export { };

declare global {
    interface Window {
        electronAPI?: {
            minimize: () => void;
            maximize: () => void;
            close: () => void;
            isMaximized: () => Promise<boolean>;
            malAuth: (authUrl: string) => Promise<string>;
            malTokenExchange: (data: { clientId: string; code: string; codeVerifier: string }) => Promise<any>;
            malTokenRefresh: (data: { clientId: string; refreshToken: string }) => Promise<any>;
        };
    }
}
