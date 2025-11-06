# ⚡ Lazy Loading Quick Reference Guide

## 🎯 Quick Start

### Using Lazy Loaded Services in Components

```javascript
import { useTranslationService } from '../hooks/useTranslationService';
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { translationLanguage } = useTheme();
  const { translationService, loading, error } = useTranslationService(translationLanguage);
  
  if (loading) return <div>Loading translation service...</div>;
  if (error) return <div>Error loading service</div>;
  
  // Use translationService here
  const translation = await translationService.getAyahTranslation(surahId, ayahId);
}
```

### Manually Loading a Service

```javascript
import { loadTranslationService } from '../utils/serviceLoader';

// Load on demand
const service = await loadTranslationService('hi'); // Hindi
const translation = await service.getAyahTranslation(1, 1);
```

### Preloading Services

```javascript
import { preloadLanguageServices } from '../utils/serviceLoader';

// Preload all services for a language
await preloadLanguageServices('ta'); // Tamil

// Now when user navigates, services are already loaded!
```

## 📚 Available Functions

### From `utils/serviceLoader.js`:

| Function | Purpose | Example |
|----------|---------|---------|
| `loadTranslationService(lang)` | Load translation service | `await loadTranslationService('hi')` |
| `loadWordByWordService(lang)` | Load word-by-word service | `await loadWordByWordService('bn')` |
| `loadInterpretationService(lang)` | Load interpretation service | `await loadInterpretationService('bn')` |
| `preloadLanguageServices(lang)` | Preload all services for language | `await preloadLanguageServices('ur')` |
| `clearServiceCache()` | Clear cached services | `clearServiceCache()` |
| `getServiceCacheSize()` | Get number of cached services | `console.log(getServiceCacheSize())` |

### From `hooks/useTranslationService.js`:

| Hook | Returns | Use Case |
|------|---------|----------|
| `useTranslationService(lang)` | All services + loading state | Full-featured components |
| `useTranslationOnly(lang)` | Translation service only | Lightweight components |

## 🔧 Language Codes

| Language | Code | Service File |
|----------|------|--------------|
| Malayalam | `mal` | N/A (API-based) |
| Hindi | `hi` | `hindiTranslationService.js` |
| Urdu | `ur` | `urduTranslationService.js` |
| Bangla | `bn` | `banglaTranslationService.js` |
| Tamil | `ta` | `tamilTranslationService.js` |
| English | `E` | `englishTranslationService.js` |

## 💡 Common Patterns

### Pattern 1: Load Service When Language Changes

```javascript
useEffect(() => {
  if (language && language !== 'mal') {
    loadTranslationService(language).then(service => {
      setService(service);
    });
  }
}, [language]);
```

### Pattern 2: Load Multiple Services in Parallel

```javascript
const [translation, wordByWord] = await Promise.all([
  loadTranslationService('hi'),
  loadWordByWordService('hi')
]);
```

### Pattern 3: Preload on User Interaction

```javascript
<button 
  onMouseEnter={() => preloadLanguageServices('ta')}
  onClick={() => navigate('/surah/1')}
>
  View Tamil Translation
</button>
```

### Pattern 4: Conditional Service Loading

```javascript
const MyComponent = ({ language }) => {
  // Only load if not Malayalam
  const { translationService, loading } = useTranslationService(
    language === 'mal' ? null : language
  );
  
  // Malayalam uses API directly, others use service
  const getTranslation = async () => {
    if (language === 'mal') {
      return await fetchAyaTranslation(surahId, ayahId, 'mal');
    } else {
      return await translationService.getAyahTranslation(surahId, ayahId);
    }
  };
};
```

## 🚨 Error Handling

### Best Practice:

```javascript
try {
  const service = await loadTranslationService(language);
  if (!service) {
    // Service not available for this language
    showError('Translation service not available');
    return;
  }
  
  const translation = await service.getAyahTranslation(surahId, ayahId);
} catch (error) {
  console.error('Failed to load translation:', error);
  showError('Failed to load translation');
}
```

### With React Hook:

```javascript
const { translationService, loading, error } = useTranslationService(language);

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!translationService) return <div>Service not available</div>;

// Safe to use translationService here
```

## 🎨 Loading States

### Minimal Loading UI:

```javascript
{loading && <div>Loading...</div>}
```

### Fancy Loading UI:

```javascript
import { CompactLoadFallback } from '../components/LazyLoadFallback';

{loading && <CompactLoadFallback message="Loading Hindi translations..." />}
```

### Full Page Loading:

```javascript
import LazyLoadFallback from '../components/LazyLoadFallback';

{loading && <LazyLoadFallback message="Preparing translations..." />}
```

## 🔍 Debugging

### Check What's Loaded:

```javascript
import { getServiceCacheSize } from '../utils/serviceLoader';

console.log(`Cached services: ${getServiceCacheSize()}`);
```

### Force Reload Service:

```javascript
import { clearServiceCache, loadTranslationService } from '../utils/serviceLoader';

// Clear cache
clearServiceCache();

// Reload service
const service = await loadTranslationService('hi');
```

### Check Network Tab:

Open DevTools → Network tab → Look for files like:
- `hindiTranslationService-[hash].js`
- `tamilWordByWordService-[hash].js`

## ⚡ Performance Tips

### ✅ DO:
- Use `useTranslationService` hook in components
- Preload services when user selects language
- Cache service references in state
- Use `useTranslationOnly` for lightweight components

### ❌ DON'T:
- Import services directly in component files
- Load services repeatedly in loops
- Block rendering while loading services
- Clear cache unnecessarily

## 📱 Mobile Optimization

### Check Connection:

```javascript
const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

if (connection && connection.effectiveType === '4g') {
  // Good connection - preload aggressively
  preloadLanguageServices(language);
} else {
  // Slow connection - load on demand only
}
```

### Reduce Data Usage:

```javascript
// Load only translation, skip word-by-word
const { translationService } = useTranslationOnly(language);
```

## 🧪 Testing

### Test Service Loading:

```javascript
// In browser console
import { loadTranslationService } from './utils/serviceLoader';

// Test Hindi
const hindi = await loadTranslationService('hi');
console.log('Hindi service:', hindi);

// Test Tamil
const tamil = await loadTranslationService('ta');
console.log('Tamil service:', tamil);
```

### Test Hook:

```jsx
function TestComponent() {
  const { translationService, loading, error } = useTranslationService('hi');
  
  return (
    <div>
      <div>Loading: {loading ? 'Yes' : 'No'}</div>
      <div>Error: {error ? error.message : 'None'}</div>
      <div>Service: {translationService ? 'Loaded' : 'Not loaded'}</div>
    </div>
  );
}
```

## 📊 Performance Monitoring

### Measure Loading Time:

```javascript
console.time('Load Hindi Service');
const service = await loadTranslationService('hi');
console.timeEnd('Load Hindi Service');
// Output: Load Hindi Service: 45ms
```

### Monitor Bundle Size:

```bash
# Build and analyze
npm run build

# Check dist/ folder sizes
ls -lh dist/assets/
```

## 🎓 Advanced Usage

### Custom Service Loader:

```javascript
const loadCustomService = async (serviceName) => {
  try {
    const module = await import(`../services/${serviceName}.js`);
    return module.default || module;
  } catch (error) {
    console.error(`Failed to load ${serviceName}:`, error);
    return null;
  }
};
```

### Parallel Preloading:

```javascript
// Preload multiple languages at once
await Promise.all([
  preloadLanguageServices('hi'),
  preloadLanguageServices('ta'),
  preloadLanguageServices('ur')
]);
```

### Lazy Component with Service:

```javascript
import { lazy, Suspense } from 'react';

const HindiTranslation = lazy(async () => {
  // Load component AND service together
  const [component, service] = await Promise.all([
    import('./components/HindiTranslation'),
    loadTranslationService('hi')
  ]);
  
  // Inject service into component
  return {
    default: () => <component.default service={service} />
  };
});
```

## 🔗 Related Files

- **Main Implementation**: `src/App.jsx`
- **Service Loader**: `src/utils/serviceLoader.js`
- **React Hook**: `src/hooks/useTranslationService.js`
- **Loading UI**: `src/components/LazyLoadFallback.jsx`
- **Context Integration**: `src/context/ThemeContext.jsx`

## 📞 Need Help?

1. Check [COMPREHENSIVE_LAZY_LOADING.md](./COMPREHENSIVE_LAZY_LOADING.md) for full documentation
2. Look at existing components using the pattern (e.g., `Surah.jsx`, `BlockWise.jsx`)
3. Test in browser DevTools to see what's loading when

---

**Quick Tip:** When in doubt, use the `useTranslationService` hook - it handles all the complexity for you! 🚀

