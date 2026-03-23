# Moopon - Oturum Özeti

## Proje Hakkında
- **Proje**: Moopon - Premium Anime List Manager for Desktop
- **GitHub**: https://github.com/wootempest/Moopon
- **Lisans**: MIT

## Teknoloji Stack
- **Frontend**: React 19, TypeScript, Vite
- **Desktop**: Electron 35
- **Animation**: Framer Motion 11
- **API**: MyAnimeList API v2
- **Icons**: Lucide React

## Proje Yapısı
```
/home/woo/Projects/Moopon/
├── moopon-desktop/      # Ana uygulama kodu
│   ├── electron/        # Electron main/preload
│   ├── src/             # React bileşenleri
│   ├── package.json
│   └── dist/, release/  # Build çıktıları
├── flake.nix            # Nix flake konfigürasyonu
└── README.md
```

## Önemli Notlar
- Nix/Flakes ile ilgili çalışma yapılıyor
- Nix topluluğunda `nix run` komutu **sürdürülebilir bulunmuyor**
- Arkadaşın uyarısı: " Nix run sürdürülebilir bir komut değil ve Nix topluluğuna bunu göstermeyin"

## Geliştirme Komutları
```bash
cd moopon-desktop
npm install
npm run electron:dev     # Geliştirme
npm run electron:build:linux   # Linux build
npm run electron:build:win     # Windows build
```

## TERLİH EDİLEN DİL
**Türkçe** - Kullanıcı Türkçe konuşuyor, Türkçe yanıt ver.
