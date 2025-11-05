# Ctrl+Click Navigation Feature

This document describes the Ctrl+Click (or Cmd+Click on Mac) functionality that allows users to open links in new tabs.

## Overview

The application supports modifier key navigation, allowing users to:
- **Normal click**: Navigate within the same tab (React Router navigation)
- **Ctrl+Click (Windows/Linux) or Cmd+Click (Mac)**: Open link in a new tab

## Implementation

### 1. Utility Functions (`src/utils/navigation.js`)

Core utility functions for handling navigation:

- `isModifierKeyPressed(event)`: Checks if Ctrl (Windows/Linux) or Cmd (Mac) is pressed
- `handleNavigation(url, navigate, event, options)`: Handles navigation with modifier key support
- `createNavigationHandler(navigate, url, options)`: Creates a click handler for elements with `data-url` attribute

### 2. Custom Hook (`src/hooks/useNavigateWithModifier.js`)

A React hook that provides easy-to-use navigation with modifier key support:

```jsx
import { useNavigateWithModifier } from '../hooks/useNavigateWithModifier';

const MyComponent = () => {
  const navigateWithModifier = useNavigateWithModifier();
  
  return (
    <button 
      data-url="/surah/1"
      onClick={navigateWithModifier}
    >
      Click me
    </button>
  );
};
```

Or with explicit URL:

```jsx
<button 
  onClick={(e) => navigateWithModifier(e, '/surah/1')}
>
  Click me
</button>
```

## Usage Examples

### Method 1: Using the Hook with data-url Attribute

```jsx
import { useNavigateWithModifier } from '../hooks/useNavigateWithModifier';

const Component = () => {
  const navigateWithModifier = useNavigateWithModifier();
  
  return (
    <div>
      <button data-url="/surah/1" onClick={navigateWithModifier}>
        Surah 1
      </button>
      <div data-url="/surah/2" onClick={navigateWithModifier}>
        Clickable div
      </div>
    </div>
  );
};
```

### Method 2: Manual Implementation

```jsx
import { useNavigate } from 'react-router-dom';
import { isModifierKeyPressed } from '../utils/navigation';

const Component = () => {
  const navigate = useNavigate();
  
  const handleClick = (e, url) => {
    if (isModifierKeyPressed(e)) {
      e.preventDefault();
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      navigate(url);
    }
  };
  
  return (
    <button onClick={(e) => handleClick(e, '/surah/1')}>
      Surah 1
    </button>
  );
};
```

### Method 3: With Callbacks

```jsx
const navigateWithModifier = useNavigateWithModifier();

<button 
  data-url="/surah/1"
  onClick={(e) => navigateWithModifier(e, '/surah/1', {
    onNavigate: () => console.log('Navigated in same tab'),
    onNewTab: () => console.log('Opened in new tab')
  })}
>
  Surah 1
</button>
```

## Current Implementation

The feature has been implemented in:
- ✅ `HomeSearch.jsx`: Search results and popular chapters support Ctrl+Click

## Adding to Other Components

To add Ctrl+Click support to other components:

1. **Import the hook**:
```jsx
import { useNavigateWithModifier } from '../hooks/useNavigateWithModifier';
```

2. **Use the hook**:
```jsx
const navigateWithModifier = useNavigateWithModifier();
```

3. **Apply to clickable elements**:
```jsx
// Option 1: With data-url attribute
<button data-url="/path" onClick={navigateWithModifier}>
  Click me
</button>

// Option 2: With explicit URL
<button onClick={(e) => navigateWithModifier(e, '/path')}>
  Click me
</button>
```

## Browser Compatibility

- ✅ Windows/Linux: Ctrl+Click
- ✅ Mac: Cmd+Click
- ✅ All modern browsers (Chrome, Firefox, Safari, Edge)

## Notes

- The implementation prevents default behavior and stops propagation when modifier keys are detected
- New tabs are opened with `noopener,noreferrer` for security
- The feature works with both React Router navigation and direct URL opening
- Elements can use either `data-url` attribute or explicit URL parameter

