# 📖 Blockwise Interpretation Feature - User Guide

## Overview

The blockwise Quran display now features **interactive interpretation numbers** that allow users to click on superscript numbers within the translation text to view detailed interpretations.

## Visual Example

### Before (Translation Text with Numbers)
```
In the name of Allah, the Most Gracious, the Most Merciful¹.
All praise is due to Allah², Lord of the worlds³.
```

### After (With Interactive Numbers)
```
In the name of Allah, the Most Gracious, the Most Merciful¹.
                                                            ↑
                                                    (Clickable, cyan, underlined)
All praise is due to Allah², Lord of the worlds³.
                          ↑                      ↑
                    (Clickable)             (Clickable)
```

## How It Works

### 1. Display Block with Translation
When you navigate to `/blockwise/2` (Surah Al-Baqarah):

```
╔════════════════════════════════════════════════════╗
║ Block 1: Ayahs 1-5                                 ║
╠════════════════════════════════════════════════════╣
║ [Arabic Text Here]                                 ║
║                                                    ║
║ Translation:                                       ║
║ This is the Book about which there is no doubt¹,  ║
║ a guidance for those conscious of Allah²          ║
╚════════════════════════════════════════════════════╝
```

### 2. Click on Interpretation Number
When user clicks on the cyan superscript number (e.g., `¹`):

```
User clicks: "This is the Book¹" → Clicks on "1"
                           ↑
                    Click detected!
```

### 3. Modal Opens with Interpretation
```
╔══════════════════════════════════════════════════════════╗
║ Interpretation #1 - Ayahs 1-5                       [X]  ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║ [Detailed interpretation content here...]                ║
║                                                          ║
║ This interpretation explains the meaning and context     ║
║ of the phrase referenced by the number.                  ║
║                                                          ║
║ [Scroll for more content...]                             ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

## Two Types of Interpretations

### Type 1: Ayah-Level Interpretation
**Trigger:** Click the blue badge number at the end of each ayah translation  
**Example:** Click `2` in: `(2:1) In the name of Allah... [2]`  
**Shows:** General interpretation for that specific ayah  
**Language:** English  

### Type 2: Block-Level Interpretation  
**Trigger:** Click cyan superscript numbers within the translation text  
**Example:** Click `¹` in: `This is the Book¹`  
**Shows:** Detailed interpretation for that specific point  
**Language:** Malayalam (default)  

## Technical Implementation

### API Call Flow
```
1. User views page
   ↓
2. Fetch ayaranges/2
   ↓ Returns: [{ ID: 2, AyaFrom: 1, AyaTo: 5 }, ...]
   ↓
3. For each block, fetch ayatransl/2/1-5
   ↓ Returns: { TranslationText: "Text with <sup>1</sup>" }
   ↓
4. Parse HTML and make <sup> clickable
   ↓
5. User clicks on <sup>1</sup>
   ↓
6. Fetch interpret/2/1-5/1/mal
   ↓ Returns: { InterpretationText: "Detailed explanation..." }
   ↓
7. Display in modal
```

### Code Flow
```javascript
// 1. Fetch and parse translation
const translationHtml = "<sup>1</sup>This is text<sup>2</sup>";

// 2. Make numbers clickable
const parsed = parseTranslationWithClickableSup(translationHtml, "1-5");
// Result: <sup style="cursor:pointer; color:#19B5DD" data-interpretation="1">1</sup>...

// 3. Render with dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: parsed }} />

// 4. Click detected via event listener
document.addEventListener("click", handleSupClick);

// 5. Extract data and open modal
const number = target.getAttribute("data-interpretation"); // "1"
const range = target.getAttribute("data-range"); // "1-5"
setSelectedInterpretation({ range: "1-5", interpretationNumber: 1 });

// 6. Modal renders with InterpretationBlockwise component
<InterpretationBlockwise 
  surahId={2}
  range="1-5"
  ipt={1}
  lang="mal"
/>
```

## User Experience Enhancements

### Visual Indicators
- **Color**: Cyan (#19B5DD) for interpretation numbers
- **Cursor**: Pointer on hover
- **Underline**: Text decoration for clarity
- **Helper Text**: "💡 Click on the superscript numbers to view interpretations"

### Interaction States
1. **Normal**: Cyan number with underline
2. **Hover**: Same styling (browser handles hover cursor change)
3. **Click**: Opens modal instantly
4. **Modal Open**: Scrollable content with close button

### Accessibility
- Semantic HTML maintained
- Keyboard accessible (via tab navigation to close button)
- Clear visual feedback
- ARIA labels on close button

## Example Scenarios

### Scenario 1: Reading Translation
```
User reads: "This is the Book about which there is no doubt¹"
User wonders: "What does '¹' mean?"
User clicks: On the cyan '¹'
System shows: Full interpretation explaining "no doubt" in context
```

### Scenario 2: Multiple Interpretations
```
Block: Ayahs 1-5 (has 8 interpretations)
Translation: "Text¹ more text² and more³"
User can click: ¹, ², ³, etc. (up to 8 different interpretations)
Each click: Shows the corresponding interpretation
```

### Scenario 3: Navigation Between Modals
```
User clicks: Cyan ¹ → Block interpretation modal opens
User closes: Modal
User clicks: Blue [1] badge → Ayah interpretation modal opens
Both work: Independently without conflicts
```

## Best Practices for Users

1. **Cyan = Clickable**: Look for cyan, underlined numbers - these are interactive
2. **Read Full Block**: Get context before clicking interpretations
3. **Use Both Types**: Combine ayah and block interpretations for complete understanding
4. **Close Modal**: Click [X] or outside modal to dismiss

## Troubleshooting

### Numbers Not Clickable?
- Check if number is cyan and underlined
- Only numbers in `<sup>` tags are clickable
- Refresh page if JavaScript failed to load

### Modal Not Opening?
- Check browser console for errors
- Ensure internet connection is active
- Try clicking a different interpretation number

### Wrong Interpretation Shown?
- Each number corresponds to a specific interpretation
- Number sequence matches the order in the block
- Close and try clicking again

## Developer Notes

### Adding Custom Styling
Current styling is inline. To customize:
```javascript
sup.style.cursor = "pointer";
sup.style.color = "#19B5DD"; // Change this for different color
sup.style.textDecoration = "underline";
```

### Changing Default Language
Currently defaults to Malayalam (`mal`). To change:
```javascript
<InterpretationBlockwise 
  lang="mal"  // Change to "en", "ar", etc.
/>
```

### Performance Considerations
- Event delegation used (single listener for all sup tags)
- HTML parsing done once during render
- Modals unmount when closed (memory efficient)
- API calls only made when interpretation clicked

## Summary

The blockwise interpretation feature provides an intuitive way for users to access detailed explanations of Quranic text. By making interpretation numbers visually distinct and interactive, users can seamlessly navigate between reading and understanding the text.

**Key Benefits:**
- ✅ Immediate access to interpretations
- ✅ Clear visual indicators
- ✅ Dual interpretation system (ayah + block)
- ✅ Smooth user experience
- ✅ Efficient resource usage

