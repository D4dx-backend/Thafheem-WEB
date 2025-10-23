# Hybrid Data Service - BanglaTranslationService

## Overview

This is a comprehensive hybrid data service that implements API-first approach with SQL.js fallback for the Thafheem Quran application. The service maintains complete backward compatibility while providing modern API integration.

## Key Features

### 🔄 **Hybrid Mode Architecture**
- **Primary**: REST API calls to backend
- **Fallback**: SQL.js local database queries
- **Toggle**: Environment variable control
- **Seamless**: Automatic failover on API errors

### 🌐 **API-First Approach**
- All methods try API first when `VITE_USE_API=true`
- Automatic fallback to SQL.js on API failure
- Consistent error handling and logging
- Request deduplication to prevent duplicate calls

### 💾 **Advanced Caching**
- In-memory caching with configurable TTL
- Cache invalidation and statistics
- Request deduplication for same queries
- Performance optimization for repeated requests

### 🔧 **Configuration System**
- Environment variable based configuration
- Runtime mode switching
- Centralized configuration management
- Development and production ready

## File Structure

```
src/
├── config/
│   └── apiConfig.js              # Centralized configuration
├── services/
│   └── BanglaTranslationService.js  # Hybrid service implementation
└── HYBRID_SERVICE_DOCUMENTATION.md   # This documentation
```

## Configuration

### Environment Variables

Create a `.env` file in your project root:

```bash
# API Configuration
VITE_USE_API=true                    # Toggle between API and SQL.js
VITE_API_BASE_URL=http://localhost:5000  # Backend API URL
VITE_CACHE_ENABLED=true              # Enable/disable caching
VITE_CACHE_TTL=300000               # Cache TTL in milliseconds (5 minutes)
```

### Configuration Options

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_USE_API` | boolean | `false` | Enable API-first mode |
| `VITE_API_BASE_URL` | string | `http://localhost:5000` | Backend API base URL |
| `VITE_CACHE_ENABLED` | boolean | `true` | Enable in-memory caching |
| `VITE_CACHE_TTL` | number | `300000` | Cache time-to-live (5 minutes) |

## API Endpoints

The service expects the following API endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `getAyahTranslation` | `/api/v1/bangla/translation/:surah/:ayah` | Single ayah translation |
| `getSurahTranslations` | `/api/v1/bangla/surah/:surah` | Full surah translations |
| `getWordByWordData` | `/api/v1/bangla/word-by-word/:surah/:ayah` | Word-by-word data |
| `getExplanation` | `/api/v1/bangla/interpretation/:surah/:ayah` | Ayah interpretation |
| Health Check | `/api/v1/bangla/health` | Service health check |

## Method Signatures

All methods maintain the same signatures as the original SQL.js implementation:

```javascript
// Single ayah translation
async getAyahTranslation(surahId, ayahNumber) → Promise<string|null>

// Full surah translations
async getSurahTranslations(surahId) → Promise<Array>

// Word-by-word data
async getWordByWordData(surahId, ayahNumber) → Promise<Object|null>

// Explanation/interpretation
async getExplanation(surahNo, ayahNo) → Promise<string|null>

// HTML rendering for clickable explanations
parseBanglaTranslationWithClickableExplanations(htmlContent, surahNo, ayahNo) → string

// Get explanation by specific number
async getExplanationByNumber(surahNo, ayahNo, explanationNumber) → Promise<string|null>

// Service availability
async isAvailable() → Promise<boolean>

// Cache management
clearCache() → void
getCacheStats() → Object
```

## Implementation Details

### 1. **API-First Logic**
```javascript
async getAyahTranslation(surahId, ayahNumber) {
  // Check cache first
  const cachedData = this.getCachedData(cacheKey);
  if (cachedData) return cachedData;

  // Try API first if enabled
  if (this.useApi) {
    try {
      const apiResponse = await this.makeApiRequest(`/bangla/translation/${surahId}/${ayahNumber}`);
      return apiResponse.translation_text;
    } catch (apiError) {
      // Fall through to SQL.js fallback
    }
  }

  // SQL.js fallback
  // ... existing SQL.js implementation
}
```

### 2. **Caching System**
- **Cache Keys**: Generated from method name and parameters
- **TTL**: Configurable time-to-live (default: 5 minutes)
- **Invalidation**: Automatic expiration and manual clearing
- **Statistics**: Cache size, hit rate, and performance metrics

### 3. **Error Handling**
- **API Errors**: Logged with fallback to SQL.js
- **SQL.js Errors**: Logged with proper error propagation
- **Network Timeouts**: 10-second timeout for API requests
- **Graceful Degradation**: Service continues working even if API fails

### 4. **Request Deduplication**
- **Pending Requests**: Tracked to prevent duplicate API calls
- **Cache Keys**: Used for deduplication
- **Promise Sharing**: Multiple calls for same data share single request

## Usage Examples

### Basic Usage
```javascript
import BanglaTranslationService from './services/BanglaTranslationService.js';

// Get single ayah translation
const translation = await BanglaTranslationService.getAyahTranslation(1, 1);

// Get full surah translations
const surahTranslations = await BanglaTranslationService.getSurahTranslations(1);

// Get word-by-word data
const wordByWordData = await BanglaTranslationService.getWordByWordData(1, 1);

// Get explanation
const explanation = await BanglaTranslationService.getExplanation(1, 1);

// Parse HTML with clickable explanation numbers
const htmlContent = '<p>Text with <sup class="f-note"><a href="#">1</a></sup> explanation</p>';
const clickableHtml = BanglaTranslationService.parseBanglaTranslationWithClickableExplanations(htmlContent, 1, 1);

// Get specific explanation by number
const specificExplanation = await BanglaTranslationService.getExplanationByNumber(1, 1, '1');
```

### Cache Management
```javascript
// Clear all caches
BanglaTranslationService.clearCache();

// Get cache statistics
const stats = BanglaTranslationService.getCacheStats();
console.log('Cache stats:', stats);
```

### Service Health Check
```javascript
// Check if service is available
const isAvailable = await BanglaTranslationService.isAvailable();
if (isAvailable) {
  console.log('Service is ready');
} else {
  console.log('Service is not available');
}
```

### HTML Rendering for Clickable Explanations
```javascript
// HTML content with explanation numbers
const htmlContent = `
  <p>In the name of Allah, the Entirely Merciful, the Especially Merciful 
     <sup class="f-note"><a href="#">1</a></sup>.</p>
  <p>Praise be to Allah, Lord of the worlds 
     <sup class="f-note"><a href="#">2</a></sup>.</p>
`;

// Parse and make explanation numbers clickable
const clickableHtml = BanglaTranslationService.parseBanglaTranslationWithClickableExplanations(
  htmlContent, 
  1, // surahNo
  1  // ayahNo
);

// The result will have blue circular buttons for explanation numbers
// with hover effects and click handlers
console.log(clickableHtml);

// Get specific explanation by number
const explanation1 = await BanglaTranslationService.getExplanationByNumber(1, 1, '1');
const explanation2 = await BanglaTranslationService.getExplanationByNumber(1, 1, '2');
```

## Development Setup

### 1. **Environment Configuration**
```bash
# Development (SQL.js mode)
VITE_USE_API=false

# Development (API mode)
VITE_USE_API=true
VITE_API_BASE_URL=http://localhost:5000
```

### 2. **Backend API Setup**
- Start the backend server on port 5000
- Ensure API endpoints are available
- Test API health endpoint

### 3. **Database Files**
- Ensure database files are in `public/` directory:
  - `quran_bangla.db`
  - `quran_hindi.db`
  - `quran_tamil.db`
  - `quran_urdu.db`

## Production Deployment

### API Mode (Recommended)
```bash
VITE_USE_API=true
VITE_API_BASE_URL=https://api.thafheem.com
VITE_CACHE_ENABLED=true
VITE_CACHE_TTL=600000
```

### SQL.js Mode (Fallback)
```bash
VITE_USE_API=false
VITE_CACHE_ENABLED=true
```

## Performance Considerations

### Caching Benefits
- **Reduced API Calls**: Cached responses prevent duplicate requests
- **Faster Response**: Cached data returns immediately
- **Bandwidth Savings**: Less network traffic for repeated requests
- **Better UX**: Faster loading times for users

### Memory Management
- **Cache Size**: Monitored and can be cleared manually
- **TTL**: Automatic expiration prevents memory leaks
- **Statistics**: Available for monitoring and optimization

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check if backend server is running
   - Verify `VITE_API_BASE_URL` is correct
   - Check network connectivity
   - Service will automatically fallback to SQL.js

2. **SQL.js Loading Failed**
   - Ensure database files are in `public/` directory
   - Check browser console for SQL.js errors
   - Verify database file integrity

3. **Cache Issues**
   - Clear cache manually: `BanglaTranslationService.clearCache()`
   - Disable caching: `VITE_CACHE_ENABLED=false`
   - Check cache TTL settings

### Debug Information
- Service initialization logs show current mode
- API calls are logged with success/failure status
- Cache hits/misses are logged for performance monitoring
- Error messages distinguish between API and SQL.js failures

## Migration Guide

### From SQL.js Only
1. **No Code Changes**: All existing code continues to work
2. **Environment Setup**: Add `VITE_USE_API=true` to enable API mode
3. **Backend Setup**: Ensure API server is running
4. **Testing**: Test both API and SQL.js modes

### Gradual Migration
1. **Start with SQL.js**: `VITE_USE_API=false`
2. **Test API Mode**: `VITE_USE_API=true` with fallback
3. **Monitor Performance**: Use cache statistics
4. **Full API Mode**: Remove SQL.js dependencies when ready

## Future Enhancements

### Planned Features
1. **Other Languages**: Apply same pattern to Hindi, Tamil, Urdu services
2. **Advanced Caching**: Redis or persistent caching
3. **Performance Monitoring**: Metrics for API vs SQL.js usage
4. **Error Recovery**: Retry logic for transient API failures
5. **Offline Support**: Service worker integration

### Extensibility
- **New Methods**: Easy to add new API endpoints
- **Custom Caching**: Configurable cache strategies
- **Monitoring**: Built-in performance metrics
- **Testing**: Comprehensive test coverage

## Conclusion

The hybrid data service provides a robust, scalable solution for modern web applications while maintaining complete backward compatibility. The API-first approach with SQL.js fallback ensures reliability and performance, while the caching system optimizes user experience.

**Key Benefits:**
- ✅ **Zero Breaking Changes**: Existing code continues to work
- ✅ **Automatic Fallback**: Reliable service even if API fails
- ✅ **Performance Optimized**: Advanced caching and deduplication
- ✅ **Production Ready**: Comprehensive error handling and monitoring
- ✅ **Future Proof**: Easy to extend and maintain
