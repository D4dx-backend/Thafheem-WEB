# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Basic Operations
- `npm run dev` - Start development server (runs on port 5173)
- `npm run build` - Build for production 
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build locally

### Testing
- Open `test-integration.html` in browser - Test API connectivity
- Open `test-tamil-db.html` in browser - Test Tamil database integration
- `node test-tajweed-api.js` - Test Tajweed API endpoints
- `node test-word-meanings-api.js` - Test word meanings API

## Architecture Overview

### Core Structure
This is a React + Vite application serving as a comprehensive Quran study platform with multi-language support (Malayalam, English, Tamil, Hindi, Bengali). The app integrates multiple external APIs and local SQLite databases for translations.

### Key API Integrations
- **Quran.com API** (`/api/quran/*`) - Primary Quranic content and metadata
- **Thafheem.net API** (`/api/thafheem/*`) - Malayalam translations and interpretations  
- **Directus CMS** (`/api/directus/*`) - Content management for articles and media
- **Audio Proxy** (`/api/audio/*`) - Audio recitations and interpretations

All API calls are proxied through Vite dev server to handle CORS. Production uses direct API calls to the backend server.

### Context Architecture
- **ThemeContext**: Global state for UI preferences (dark/light mode, fonts, translation language)
- **AuthContext**: Firebase authentication with Google and Apple OAuth providers

### Data Layer
- **Services** (`src/services/`): Language-specific translation services that interface with local SQLite databases
- **API Functions** (`src/api/`): Centralized API calls with timeout handling and fallback mechanisms
- **Local Databases**: SQLite files in `public/` for offline translation access (Tamil, Hindi, Bangla, Urdu)

### Component Architecture
**Modal-First Design**: Core functionality uses modal overlays rather than separate pages:
- `AyahModal` - Main verse display with translations and interpretations
- `InterpretationModal` - Detailed verse commentary
- `BlockInterpretationModal` - Multi-verse interpretations

**Navigation Components**: Dynamic navbars that adapt based on content type and support cross-surah navigation.

### Key Features
- **Multi-language Support**: Dynamic translation switching with localStorage persistence
- **Offline Capability**: SQLite databases for translations work without network
- **Block-wise Reading**: Grouped verse display for better comprehension
- **Audio Integration**: Verse-by-verse and full surah recitations
- **Bookmarking System**: Firebase-backed user bookmarks
- **Search**: Cross-language verse and content search

### Base Path Configuration
App is configured for deployment at `/new_thafheem_web/` path (see `vite.config.js` base setting and Router basename).

### Performance Considerations
- Translation services use caching (`Map` objects) to reduce database queries
- API functions include timeout mechanisms (8-10s) with graceful fallbacks
- SQLite databases are loaded on-demand and cached in memory

### Development Notes
- All external API calls use the `fetchWithTimeout` wrapper for consistent error handling
- The app gracefully degrades when APIs are unavailable, falling back to cached data or alternative endpoints
- Local SQLite databases require SQL.js library loaded from CDN
- Firebase config is committed (public keys only) for ease of development