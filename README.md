# moopon

<p align="center">
  <img src="icon.png" alt="moopon Logo" width="128" />
</p>

<p align="center">
  Premium Anime List Manager for Desktop
</p>

<p align="center">
  <a href="https://github.com/wootempest/Moopon/releases">
    <img src="https://img.shields.io/github/v/release/wootempest/Moopon?style=flat-square" alt="Release" />
  </a>
  <a href="https://github.com/wootempest/Moopon/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/wootempest/Moopon?style=flat-square" alt="License" />
  </a>
  <img src="https://img.shields.io/badge/platform-Linux%20%7C%20Windows-blue?style=flat-square" alt="Platform" />
</p>

---

## Features

- **MyAnimeList Integration** - Sync your anime list directly with MAL
- **Beautiful Dark UI** - Modern, anime-inspired dark theme with purple accents
- **Keyboard Navigation** - Fully navigable with arrow keys
- **Browse Anime** - Explore trending, top-rated, and seasonal anime
- **Track Progress** - Track watching, completed, on-hold, dropped, and planned anime
- **Desktop App** - Native feel with Electron (Linux & Windows)

## Screenshots

*Coming soon*

---

## Download

### Linux
- [AppImage](https://github.com/wootempest/Moopon/releases/latest/download/Moopon-1.1.1.AppImage) - Universal Linux package
- [pacman](https://github.com/wootempest/Moopon/releases/latest/download/moopon-1.1.1.pacman) - Arch Linux package

### Windows
- [Installer](https://github.com/wootempest/Moopon/releases/latest/download/Moopon%20Setup%201.1.1.exe) - NSIS installer

## Development

### Prerequisites
- Node.js 18+
- npm 9+

### Setup
```bash
# Clone the repository
git clone https://github.com/wootempest/Moopon.git
cd Moopon/moopon-desktop

# Install dependencies
npm install

# Run in development mode
npm run electron:dev

# Build for production
npm run electron:build:linux   # Linux
npm run electron:build:win     # Windows
```

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Desktop**: Electron 35
- **Animation**: Framer Motion 11
- **API**: MyAnimeList API v2
- **Icons**: Lucide React

## Architecture

```
moopon-desktop/
├── electron/           # Electron main process
│   ├── main.cjs       # Main entry point
│   └── preload.cjs    # Preload scripts
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── App.tsx        # Main app component
│   └── main.tsx       # React entry point
├── public/            # Static assets
└── package.json      # Dependencies
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [MyAnimeList](https://myanimelist.net/) for their API
- [Lucide](https://lucide.dev/) for beautiful icons
- All contributors and users

---

<p align="center">
  Made with ❤️ for anime fans
</p>

---

## Özellikler

- **MyAnimeList Entegrasyonu** - Anime listenizi MAL ile senkronize edin
- **Güzel Koyu Arayüz** - Mor aksanlı, anime ilhamlı modern koyu tema
- **Klavye Navigasyonu** - Ok tuşlarıyla tam navigasyon
- **Anime Gezgini** - Trend, en yüksek puanlı ve mevsimlik anime'leri keşfedin
- **İlerleme Takibi** - İzlenen, tamamlanan, bekleyen, bırakılan ve planlanan anime'leri takip edin
- **Masaüstü Uygulaması** - Electron ile native his (Linux & Windows)

## Ekran Görüntüleri

*Çok yakında*

---

## İndir

### Linux
- [AppImage](https://github.com/wootempest/Moopon/releases/latest/download/Moopon-1.1.1.AppImage) - Evrensel Linux paketi
- [pacman](https://github.com/wootempest/Moopon/releases/latest/download/moopon-1.1.1.pacman) - Arch Linux paketi

### Windows
- [Installer](https://github.com/wootempest/Moopon/releases/latest/download/Moopon%20Setup%201.1.1.exe) - NSIS kurulumu

## Geliştirme

### Gereksinimler
- Node.js 18+
- npm 9+

### Kurulum
```bash
# Repoyu klonlayın
git clone https://github.com/wootempest/Moopon.git
cd Moopon/moopon-desktop

# Bağımlılıkları yükleyin
npm install

# Geliştirme modunda çalıştırın
npm run electron:dev

# Prodüksiyon için build edin
npm run electron:build:linux   # Linux
npm run electron:build:win     # Windows
```

## Mimari

```
moopon-desktop/
├── electron/           # Electron ana süreç
│   ├── main.cjs       # Ana giriş noktası
│   └── preload.cjs    # Preload scriptleri
├── src/
│   ├── components/     # React bileşenleri
│   ├── pages/         # Sayfa bileşenleri
│   ├── services/      # API servisleri
│   ├── App.tsx        # Ana uygulama bileşeni
│   └── main.tsx       # React giriş noktası
├── public/            # Statik varlıklar
└── package.json      # Bağımlılıklar
```

## Lisans

Bu proje MIT Lisansı ile lisanslanmıştır - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## Teşekkürler

- [MyAnimeList](https://myanimelist.net/) API'leri için
- [Lucide](https://lucide.dev/) güzel ikonları için
- Tüm katkıda bulunanlar ve kullanıcılar

---

<p align="center">
  Anime hayranları için ❤️ ile yapıldı
</p>
