# 📚 Blockwise Quran Display Implementation

## Overview
This document describes the implementation of the blockwise Quran display feature in the `BlockWise.jsx` component.

## Implementation Details

### 1. API Endpoints Added

#### New API Constant in `apis.js`
```javascript
export const AYA_TRANSLATION_API = `${API_BASE_URL}/ayatransl`;
```

#### Endpoints Used
- **Aya Ranges**: `https://thafheem.net/thafheem-api/ayaranges/{surah_id}`
  - Returns array of blocks with `ID`, `AyaFrom`, `AyaTo`
  - Example: `https://thafheem.net/thafheem-api/ayaranges/2`

- **Aya Translation**: `https://thafheem.net/thafheem-api/ayatransl/{surah_id}/{range}`
  - Returns translation text for a specific range
  - Example: `https://thafheem.net/thafheem-api/ayatransl/2/1-5`

### 2. New API Function in `apifunction.js`

```javascript
export const fetchAyaTranslation = async (surahId, range) => {
  const url = `${AYA_TRANSLATION_API}/${surahId}/${range}`;
  const response = await fetchWithTimeout(url, {}, 8000);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
};
```

### 3. BlockWise.jsx Changes

#### New State Variables
- `blockRanges`: Stores the aya ranges fetched from the API
- `blockTranslations`: Stores translation data for each block (indexed by block ID)

#### Data Fetching Flow
1. **Step 1**: Fetch aya ranges, Arabic verses, and surah info in parallel
2. **Step 2**: For each block in the aya ranges:
   - Extract `AyaFrom`, `AyaTo`, and block `ID`
   - Construct range string (e.g., "1-5")
   - Fetch translation using `fetchAyaTranslation(surahId, range)`
   - Store in `blockTranslations` object with block ID as key

#### Rendering
Each block displays:
- **Block Header**: "Block {index}: Ayahs {start}-{end}"
- **Arabic Text**: Uthmani script with verse numbers
- **Translation**: HTML content rendered using `dangerouslySetInnerHTML`
- **Action Buttons**: Copy, Play, View Details, Word-by-Word, Bookmark, Share

#### HTML Rendering
The translation text contains HTML markup (like `<br>` tags and `<sup>` tags) which is rendered using:
```javascript
<div dangerouslySetInnerHTML={{ __html: translationText }} />
```

### 4. Features Implemented

✅ Fetch aya ranges for selected surah  
✅ Fetch translation for each block  
✅ Display blocks with ID, range, and translation  
✅ Render HTML content properly  
✅ **Parse HTML to detect and make interpretation numbers clickable**  
✅ **Fetch and display interpretations when clicking superscript numbers**  
✅ **Show interpretations in modal with proper headers**  
✅ **Support multiple interpretations per block**  
✅ Error handling for failed API calls  
✅ Loading states  
✅ Responsive design  
✅ Copy functionality (strips HTML for clipboard)  
✅ Navigation to ayah details  
✅ Word-by-word navigation  
✅ Bookmark functionality  
✅ Share functionality  

### 5. Error Handling

- Network errors are caught and displayed to users
- Individual block translation failures don't prevent other blocks from loading
- Loading states show progress to users
- Fallback messages for missing data

### 6. Interactive Interpretation Numbers

**Feature:** Clickable superscript numbers in translation text that open interpretations

**Implementation:**

#### Helper Function: `parseTranslationWithClickableSup`
```javascript
const parseTranslationWithClickableSup = (htmlContent, blockRange) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlContent;
  
  // Find all sup tags and make them clickable
  const supTags = tempDiv.querySelectorAll("sup");
  supTags.forEach((sup) => {
    const number = sup.textContent.trim();
    if (/^\d+$/.test(number)) {
      sup.style.cursor = "pointer";
      sup.style.color = "#19B5DD";
      sup.style.textDecoration = "underline";
      sup.setAttribute("data-interpretation", number);
      sup.setAttribute("data-range", blockRange);
      sup.className = "interpretation-link";
    }
  });
  
  return tempDiv.innerHTML;
};
```

#### Event Handling
- Uses `useEffect` to attach global click listener
- Detects clicks on `.interpretation-link` elements
- Extracts interpretation number and range from data attributes
- Opens interpretation modal with correct parameters

#### Modal Display
- Separate modal for block interpretations vs ayah interpretations
- Shows interpretation title with number and range
- Uses `InterpretationBlockwise` component
- Fetches from: `/interpret/{surah_id}/{range}/{interpretation_number}/mal`

### 7. State Management

**New State Variables:**
- `selectedInterpretation`: Tracks currently selected interpretation
  ```javascript
  { range: "1-5", interpretationNumber: 3 }
  ```

### 8. Performance Optimizations

- All block translations are fetched in parallel using `Promise.all()`
- Uses `fetchWithTimeout` with 8-second timeout to prevent hanging
- Efficient state management with separate state for ranges and translations
- Event delegation for interpretation clicks (single global listener)

### 9. User Experience

- Clean, modern UI with hover effects
- Dark mode support
- Responsive design for mobile and desktop
- Toast notifications for user actions
- Smooth transitions and loading indicators
- **Visual cues for clickable interpretation numbers** (cyan color, underline, pointer cursor)
- **Dual interpretation system**:
  - Click ayah numbers (blue badges) → Shows ayah-level interpretation
  - Click superscript numbers in text → Shows block-level interpretation

## Example Usage

Navigate to `/blockwise/{surahId}` to view the blockwise display for any surah.

Example: `/blockwise/2` for Surah Al-Baqarah

## API Response Format

### Aya Ranges Response
```json
[
  {
    "ID": 2,
    "AyaFrom": 1,
    "AyaTo": 5
  },
  {
    "ID": 3,
    "AyaFrom": 6,
    "AyaTo": 7
  }
]
```

### Translation Response
```json
{
  "TranslationText": "Translation text with <br> tags and <sup>footnotes</sup>"
}
```

or

```json
[
  {
    "TranslationText": "Translation text..."
  }
]
```

## Technical Stack

- **React**: Functional components with hooks
- **State Management**: useState, useEffect
- **API Calls**: Async/await with error handling
- **Routing**: React Router (useParams, useNavigate)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Interpretation Feature Details

### How It Works

1. **Translation HTML Parsing**: When translation is fetched, it contains `<sup>` tags with interpretation numbers
   ```html
   This is the text<sup>1</sup> with interpretation.
   ```

2. **Making Numbers Clickable**: The parser function:
   - Finds all `<sup>` tags
   - Checks if content is a number
   - Adds styling (cyan color, underline, cursor pointer)
   - Adds data attributes for tracking
   - Adds CSS class for event handling

3. **Click Detection**: Global click listener:
   - Uses event delegation for performance
   - Detects clicks on `.interpretation-link` elements
   - Extracts interpretation number and range
   - Opens modal with interpretation

4. **Fetching Interpretation**: Uses existing `InterpretationBlockwise` component:
   - Endpoint: `/interpret/{surah_id}/{range}/{interpretation_number}/mal`
   - Example: `/interpret/2/1-5/3/mal` (Surah 2, verses 1-5, interpretation #3, Malayalam)

5. **Display**: Modal shows:
   - Header with interpretation number and range
   - Full interpretation content
   - Close button to dismiss

### User Interactions

```
User Flow 1 (Ayah Interpretation):
Click blue ayah number badge → Shows interpretation for that specific ayah

User Flow 2 (Block Interpretation):
Click cyan superscript number in translation → Shows that numbered interpretation for the block
```

## Future Enhancements

- Audio playback for block recitations
- Interpretation language selector (currently defaults to Malayalam)
- Navigate between interpretations within the modal (prev/next buttons)
- Offline support for downloaded surahs
- Advanced search within blocks
- Customizable translation display options
- Highlight active interpretation number when modal is open

