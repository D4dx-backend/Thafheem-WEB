# 🚀 Shimmer Loading - Quick Developer Guide

## TL;DR

Replace old spinners with shimmer skeletons for **15-30% better perceived performance**. ✨

---

## 📦 Available Components

Import from `../components/LoadingSkeleton`:

```jsx
import { 
  VerseSkeleton,       // Single verse skeleton
  VersesSkeleton,      // Multiple verses (count prop)
  BlockSkeleton,       // Single block skeleton
  BlocksSkeleton,      // Multiple blocks (count prop)
  CompactLoading,      // Inline loading (message prop)
  LoadingWithProgress  // Loading with progress bar (progress & message props)
} from '../components/LoadingSkeleton';
```

---

## 🎯 Quick Examples

### **1. Page Loading (Verses)**

**❌ Before:**
```jsx
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      <p>Loading...</p>
    </div>
  );
}
```

**✅ After:**
```jsx
if (loading) {
  return (
    <>
      <HomepageNavbar />
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <VersesSkeleton count={5} />
        </div>
      </div>
    </>
  );
}
```

### **2. Page Loading (Blocks)**

**✅ Good:**
```jsx
if (loading && blockRanges.length === 0) {
  return (
    <>
      <HomeNavbar />
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <BlocksSkeleton count={3} />
        </div>
      </div>
    </>
  );
}
```

### **3. Inline Loading (Individual Items)**

**✅ Good:**
```jsx
{loadingBlocks.has(blockId) ? (
  <CompactLoading message="Loading translation..." />
) : (
  <div>{translationContent}</div>
)}
```

### **4. Progress Loading**

**✅ Good:**
```jsx
<LoadingWithProgress 
  progress={loadingProgress} 
  message="Downloading database..." 
/>
```

---

## 🎨 Custom Shimmer Elements

For custom layouts, use the inline shimmer pattern:

```jsx
<div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-48 relative overflow-hidden">
  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 dark:via-white/10 to-transparent"></div>
</div>
```

**Key Classes:**
- `relative overflow-hidden` - Required for shimmer clipping
- `animate-shimmer` - Applies shimmer animation
- `bg-gradient-to-r from-gray-200 to-gray-300` - Base gradient (light mode)
- `dark:from-gray-700 dark:to-gray-600` - Base gradient (dark mode)

---

## ⚡ Performance Tips

1. **Show shimmer immediately** - Don't delay skeleton rendering
2. **Match actual layout** - Skeleton should match real content structure
3. **Use appropriate count** - Show 3-5 items for optimal UX
4. **Keep animations smooth** - Don't override animation timing
5. **Test both themes** - Verify light and dark mode appearance

---

## 🎨 Design Guidelines

### **Skeleton Sizes**

| Element | Height | Width | Use Case |
|---------|--------|-------|----------|
| Small text | `h-4` | Variable | Translation, descriptions |
| Medium text | `h-6` | Variable | Subtitles, metadata |
| Large text | `h-8` to `h-12` | Variable | Titles, Arabic text |
| Buttons | `h-10` | `w-10` | Action buttons |
| Cards | Variable | `full` | Full content blocks |

### **Width Patterns**

```jsx
// Full width
className="w-full"

// Percentage widths for variation
className="w-3/4"  // 75%
className="w-5/6"  // 83%
className="w-4/5"  // 80%

// Fixed widths
className="w-32"   // 8rem
className="w-48"   // 12rem
className="w-64"   // 16rem
```

---

## ✅ Migration Checklist

When updating a component:

- [ ] Import skeleton components from `LoadingSkeleton`
- [ ] Replace spinner with appropriate skeleton
- [ ] Include navbar in loading state
- [ ] Match container widths (`max-w-4xl` or `max-w-7xl`)
- [ ] Add proper padding (`pt-20 px-4`)
- [ ] Test light mode appearance
- [ ] Test dark mode appearance
- [ ] Verify mobile responsiveness
- [ ] Check animation smoothness
- [ ] Remove old spinner code

---

## 🐛 Common Mistakes

### **❌ Missing overflow-hidden**
```jsx
// BAD - shimmer will overflow
<div className="relative animate-shimmer">
```

```jsx
// GOOD
<div className="relative overflow-hidden">
  <div className="animate-shimmer ...">
```

### **❌ Wrong animation class**
```jsx
// BAD - uses old pulse
<div className="animate-pulse bg-gray-200">
```

```jsx
// GOOD - uses shimmer
<div className="relative overflow-hidden">
  <div className="absolute inset-0 -translate-x-full animate-shimmer">
```

### **❌ Forgetting dark mode**
```jsx
// BAD - only light mode
<div className="bg-gray-200">
```

```jsx
// GOOD - both themes
<div className="bg-gray-200 dark:bg-gray-700">
```

---

## 🧪 Testing

### **Visual Testing**

```bash
# Start dev server
npm run dev

# Test scenarios:
# 1. Toggle dark mode while loading
# 2. Resize browser window
# 3. Check mobile viewport
# 4. Verify smooth animations
# 5. Check actual content appears correctly
```

### **Performance Testing**

```javascript
// Measure perceived performance
const startTime = performance.now();
// ... loading logic ...
const endTime = performance.now();
console.log(`Loading took ${endTime - startTime}ms`);
```

---

## 📊 When to Use Which Component

| Scenario | Component | Count |
|----------|-----------|-------|
| Surah page loading | `VersesSkeleton` | 5 |
| BlockWise page loading | `BlocksSkeleton` | 3 |
| Individual block loading | `CompactLoading` | - |
| Database download | `LoadingWithProgress` | - |
| Modal loading | `CompactLoading` | - |
| List items loading | `VerseSkeleton` | 3-5 |
| Button loading | Inline spinner | - |

---

## 🎯 Best Practices Summary

1. ✅ **Always use shimmer for page-level loading**
2. ✅ **Use CompactLoading for inline/small elements**
3. ✅ **Match skeleton structure to actual content**
4. ✅ **Show 3-5 skeleton items (sweet spot)**
5. ✅ **Include navbar in loading state**
6. ✅ **Test both light and dark modes**
7. ✅ **Keep animation timing at 2s**
8. ✅ **Use consistent gradient colors**

---

## 🔗 Related Files

- **Component:** `Thafheem-WEB/src/components/LoadingSkeleton.jsx`
- **Config:** `Thafheem-WEB/tailwind.config.js`
- **Examples:** 
  - `Thafheem-WEB/src/pages/Surah.jsx`
  - `Thafheem-WEB/src/pages/BlockWise.jsx`
  - `Thafheem-WEB/src/pages/BlockWise_new.jsx`
- **Documentation:** `Thafheem-WEB/SHIMMER_LOADING_IMPLEMENTATION.md`

---

## 💡 Pro Tips

1. **Perceived performance > Actual performance** - Even if loading takes the same time, shimmer feels faster
2. **Progressive reveal** - Show skeleton immediately, don't wait
3. **Consistency** - Use same shimmer timing across all components
4. **Simplicity** - Don't over-engineer skeleton structures
5. **Test early** - Check shimmer appearance before implementing full feature

---

**Updated:** November 10, 2025  
**Status:** ✅ Production Ready

