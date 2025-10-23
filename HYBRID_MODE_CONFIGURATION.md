# Hybrid Mode Configuration

This document explains how to configure the hybrid mode for the Thafheem Quran application.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# API Configuration
# Set to 'true' to use backend API, 'false' to use SQL.js
VITE_USE_API=false

# API Base URL (only used when VITE_USE_API=true)
VITE_API_BASE_URL=http://localhost:5000

# Cache Configuration
VITE_CACHE_ENABLED=true
VITE_CACHE_TTL=300000

# Development Configuration
VITE_NODE_ENV=development
```

## Configuration Options

### VITE_USE_API
- **Type**: `boolean`
- **Default**: `false`
- **Description**: Controls whether to use the backend API or SQL.js for data fetching
- **Values**:
  - `true`: Use backend API with SQL.js fallback
  - `false`: Use SQL.js only

### VITE_API_BASE_URL
- **Type**: `string`
- **Default**: `http://localhost:5000`
- **Description**: Base URL for the backend API
- **Example**: `http://localhost:5000` or `https://api.thafheem.com`

### VITE_CACHE_ENABLED
- **Type**: `boolean`
- **Default**: `true`
- **Description**: Enable/disable caching for API responses
- **Values**:
  - `true`: Cache API responses to reduce network calls
  - `false`: Disable caching

### VITE_CACHE_TTL
- **Type**: `number`
- **Default**: `300000` (5 minutes)
- **Description**: Cache time-to-live in milliseconds
- **Example**: `300000` for 5 minutes, `600000` for 10 minutes

## Usage Examples

### SQL.js Mode (Default)
```bash
VITE_USE_API=false
```
- Uses local SQLite databases
- No network requests
- Faster initial load
- Requires database files in public directory

### API Mode
```bash
VITE_USE_API=true
VITE_API_BASE_URL=http://localhost:5000
```
- Uses backend API with SQL.js fallback
- Network requests to backend
- Automatic fallback to SQL.js if API fails
- Better for production environments

### Production Configuration
```bash
VITE_USE_API=true
VITE_API_BASE_URL=https://api.thafheem.com
VITE_CACHE_ENABLED=true
VITE_CACHE_TTL=600000
```

## API Endpoints

The backend API supports the following endpoints:

- `GET /api/v1/:language/translation/:surah/:ayah` - Get translation for specific ayah
- `GET /api/v1/:language/surah/:surah` - Get all translations for a surah
- `GET /api/v1/:language/interpretation/:surah/:ayah` - Get interpretation for specific ayah
- `GET /api/v1/:language/word-by-word/:surah/:ayah` - Get word-by-word data for specific ayah
- `GET /api/v1/urdu/footnote/:footnoteId` - Get Urdu footnote
- `GET /api/v1/:language/health` - Check language database health

## Supported Languages

- `bangla` - Bengali translations and interpretations
- `hindi` - Hindi translations and interpretations
- `tamil` - Tamil translations (no interpretations)
- `urdu` - Urdu translations and footnotes

## Fallback Behavior

When `VITE_USE_API=true`:

1. **Primary**: Try API request
2. **Fallback**: If API fails, automatically use SQL.js
3. **Error**: If both fail, throw error

When `VITE_USE_API=false`:

1. **Primary**: Use SQL.js only
2. **Error**: If SQL.js fails, throw error

## Development Setup

1. **Backend API**: Start the backend server on port 5000
2. **Frontend**: Set `VITE_USE_API=true` in `.env`
3. **Testing**: Test both API and SQL.js modes

## Production Deployment

1. **API Mode**: Set `VITE_USE_API=true` and configure `VITE_API_BASE_URL`
2. **SQL.js Mode**: Set `VITE_USE_API=false` and ensure database files are available
3. **Hybrid Mode**: Use API mode with SQL.js fallback for reliability

## Troubleshooting

### API Connection Issues
- Check if backend server is running
- Verify `VITE_API_BASE_URL` is correct
- Check network connectivity
- API will automatically fallback to SQL.js

### SQL.js Issues
- Ensure database files are in public directory
- Check browser console for SQL.js errors
- Verify database file integrity

### Cache Issues
- Clear browser cache
- Set `VITE_CACHE_ENABLED=false` to disable caching
- Check cache TTL settings
