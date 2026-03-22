# Moopon

<p align="center">
  <img src="icon.png" alt="Moopon Logo" width="128" />
</p>

<p align="center">
  Premium Anime List Manager for Desktop
</p>

<p align="center">
  <a href="https://github.com/yourusername/moopon/releases">
    <img src="https://img.shields.io/github/v/release/yourusername/moopon?style=flat-square" alt="Release" />
  </a>
  <a href="https://github.com/yourusername/moopon/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/yourusername/moopon?style=flat-square" alt="License" />
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

## Download

### Linux
- [AppImage](https://github.com/yourusername/moopon/releases/latest/download/Moopon-1.1.1.AppImage) - Universal Linux package
- [pacman](https://github.com/yourusername/moopon/releases/latest/download/moopon-1.1.1.pacman) - Arch Linux package

### Windows
- [Installer](https://github.com/yourusername/moopon/releases/latest/download/Moopon%20Setup%201.1.1.exe) - NSIS installer

## Development

### Prerequisites
- Node.js 18+
- npm 9+

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/moopon.git
cd moopon/moopon-desktop

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
