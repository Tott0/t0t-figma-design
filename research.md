# OKLCH Color Conversion Research - Culori Library

## Overview

This research covers using the **culori** library to convert RGB, HSL, and HEX colors to OKLCH format for a Figma design tokens to Tailwind 4 CSS conversion tool.

---

## 1. Culori Library Basics

**Installation:**
```bash
npm install culori
```

**Core Concept:**
Culori uses plain JavaScript objects to represent colors, with a `mode` property identifying the color space and channel values:

```javascript
{ mode: 'rgb', r: 0.1, g: 0.2, b: 1, alpha: 1 }
{ mode: 'oklch', l: 0.7, c: 0.15, h: 240, alpha: 0.5 }
```

---

## 2. Converting RGB, HSL, and HEX to OKLCH

### 2.1 Basic Conversion Pattern

**Step 1: Parse input color**
```javascript
import { parse, converter, formatCss } from 'culori';

// Parse any CSS color format (RGB, HSL, HEX)
const inputColor = parse('#ff6b6b');        // Hex
const inputColor = parse('rgb(255, 107, 107)');  // RGB
const inputColor = parse('hsl(0, 100%, 71%)');   // HSL
```

**Step 2: Convert to OKLCH**
```javascript
// Method 1: Using converter function
const convertToOklch = converter('oklch');
const oklchColor = convertToOklch(inputColor);

// Method 2: Direct import and use
import { oklch } from 'culori';
const oklchColor = oklch(inputColor);
```

**Step 3: Format for CSS output**
```javascript
const cssString = formatCss(oklchColor);
// Output: "oklch(53% 0.22 31.1)"
```

### 2.2 Complete Conversion Examples

**HEX to OKLCH:**
```javascript
import { parse, oklch, formatCss } from 'culori';

function hexToOklch(hexColor) {
  const parsed = parse(hexColor);
  const oklchColor = oklch(parsed);
  return formatCss(oklchColor);
}

hexToOklch('#ff6b6b');  // "oklch(53% 0.22 31.1)"
hexToOklch('#000000');  // "oklch(0% 0 0)"
```

**RGB to OKLCH:**
```javascript
import { parse, oklch, formatCss } from 'culori';

function rgbToOklch(r, g, b) {
  const parsed = parse(`rgb(${r}, ${g}, ${b})`);
  const oklchColor = oklch(parsed);
  return formatCss(oklchColor);
}

rgbToOklch(255, 107, 107);  // "oklch(53% 0.22 31.1)"
```

**HSL to OKLCH:**
```javascript
import { parse, oklch, formatCss } from 'culori';

function hslToOklch(h, s, l) {
  const parsed = parse(`hsl(${h}, ${s}%, ${l}%)`);
  const oklchColor = oklch(parsed);
  return formatCss(oklchColor);
}

hslToOklch(0, 100, 71);  // "oklch(53% 0.22 31.1)"
```

---

## 3. Preserving Alpha/Opacity Values

### 3.1 Alpha Channel Handling

Culori preserves alpha channels throughout the conversion pipeline:

```javascript
import { parse, oklch, formatCss } from 'culori';

// RGB with alpha
const rgbaColor = parse('rgba(255, 107, 107, 0.5)');
const oklchColor = oklch(rgbaColor);
const cssString = formatCss(oklchColor);
// Output: "oklch(53% 0.22 31.1 / 0.5)"

// HEX with alpha (8-character)
const hexAlpha = parse('#ff6b6b80');  // 50% opacity
const oklchColor = oklch(hexAlpha);
const cssString = formatCss(oklchColor);
// Output: "oklch(53% 0.22 31.1 / 0.5)"

// HSL with alpha
const hslaColor = parse('hsla(0, 100%, 71%, 0.75)');
const oklchColor = oklch(hslaColor);
const cssString = formatCss(oklchColor);
// Output: "oklch(53% 0.22 31.1 / 0.75)"
```

### 3.2 Manual Alpha Manipulation

You can also manually set or adjust alpha values:

```javascript
import { oklch, formatCss } from 'culori';

const oklchColor = {
  mode: 'oklch',
  l: 0.53,    // Lightness: 0-1 (displayed as 0-100%)
  c: 0.22,    // Chroma
  h: 31.1,    // Hue: 0-360 degrees
  alpha: 0.5  // Opacity: 0-1
};

const cssString = formatCss(oklchColor);
// Output: "oklch(53% 0.22 31.1 / 0.5)"
```

---

## 4. Precision and Accuracy Considerations

### 4.1 Channel Value Ranges and Normalization

**OKLCH channel specifications:**
- **Lightness (L):** 0-1 range (displayed as 0-100% in CSS)
- **Chroma (C):** 0 to ~0.4 for sRGB gamut (theoretically unbounded, practically 0-0.5)
- **Hue (H):** 0-360 degrees
- **Alpha:** 0-1 range (displayed as 0-100% in CSS)

Culori automatically normalizes values to these ranges during conversion.

### 4.2 Gamut Mapping

Not all colors in other color spaces map directly to displayable sRGB. Use gamut mapping:

```javascript
import { parse, oklch, toGamut, formatCss } from 'culori';

// Convert and ensure color is displayable in sRGB
const inputColor = parse('rgb(255, 400, 107)');  // Invalid RGB (>255)
const oklchColor = oklch(inputColor);

// Gamut map using toGamut (preserves hue/lightness better)
const displayable = toGamut(oklchColor);
const cssString = formatCss(displayable);

// Alternative: clampChroma (simpler, preserves hue while reducing saturation)
import { clampChroma } from 'culori';
const clamped = clampChroma(oklchColor);
```

### 4.3 Precision Loss Scenarios

**Potential accuracy issues:**
1. **Very saturated colors** in other spaces may lose chroma when converted to sRGB-displayable OKLCH
2. **Wide color gamut colors** (e.g., Display P3) may require desaturation when mapped to sRGB
3. **Hue shifts** can occur with high chroma reduction during gamut mapping
4. **Floating point precision** - Culori maintains full precision internally; CSS serialization rounds appropriately

### 4.4 Color Difference Measurement

For verification, you can measure color difference before/after conversion:

```javascript
import { parse, oklch, deltaE2000 } from 'culori';

const original = parse('#ff6b6b');
const converted = oklch(original);

// Measure perceptual difference (CIEDE2000)
const difference = deltaE2000(original, converted);
console.log(`ΔE: ${difference}`);  // Should be near 0 for same colors

// ΔE < 1: Imperceptible difference
// ΔE < 2: Threshold of perceptibility
// ΔE < 10: Similar colors
```

---

## 5. Best Practices for Visual Accuracy

### 5.1 Recommended Conversion Pattern

```javascript
import { parse, oklch, clampChroma, formatCss, displayable } from 'culori';

function convertToOklch(colorInput, options = {}) {
  const {
    ensureDisplayable = true,
    precision = 'default',
  } = options;

  // Step 1: Parse input color
  let color = parse(colorInput);
  if (!color) throw new Error(`Invalid color: ${colorInput}`);

  // Step 2: Convert to OKLCH
  let oklchColor = oklch(color);

  // Step 3: Ensure displayability in sRGB
  if (ensureDisplayable && !displayable(oklchColor)) {
    oklchColor = clampChroma(oklchColor);
  }

  // Step 4: Format for CSS output
  return formatCss(oklchColor);
}

// Usage
convertToOklch('#ff6b6b');           // "oklch(53% 0.22 31.1)"
convertToOklch('rgb(255, 107, 107)'); // "oklch(53% 0.22 31.1)"
convertToOklch('hsla(0, 100%, 71%, 0.5)'); // "oklch(53% 0.22 31.1 / 0.5)"
```

### 5.2 Tailwind Integration Strategy

```javascript
import { parse, oklch, formatCss } from 'culori';

function figmaTokenToTailwind(figmaToken) {
  // figmaToken: { name: 'primary', value: '#ff6b6b', opacity: 1 }

  const oklchColor = oklch(parse(figmaToken.value));

  // Preserve opacity if specified
  if (figmaToken.opacity && figmaToken.opacity < 1) {
    oklchColor.alpha = figmaToken.opacity;
  }

  return formatCss(oklchColor);
}

// Usage in Tailwind config:
// colors: {
//   primary: 'oklch(53% 0.22 31.1 / <alpha-value>)'
// }
```

### 5.3 Batch Processing with Error Handling

```javascript
import { parse, oklch, formatCss } from 'culori';

function convertColorPalette(colorMap) {
  const converted = {};
  const errors = [];

  for (const [name, hexColor] of Object.entries(colorMap)) {
    try {
      const parsed = parse(hexColor);
      if (!parsed) {
        throw new Error(`Could not parse: ${hexColor}`);
      }

      const oklchColor = oklch(parsed);
      converted[name] = formatCss(oklchColor);
    } catch (error) {
      errors.push({ color: hexColor, error: error.message });
    }
  }

  return { converted, errors };
}

// Usage
const palette = {
  'primary': '#ff6b6b',
  'secondary': '#3498db',
  'success': '#2ecc71'
};

const { converted, errors } = convertColorPalette(palette);
console.log(converted);
// {
//   primary: 'oklch(53% 0.22 31.1)',
//   secondary: 'oklch(59% 0.16 247)',
//   success: 'oklch(74% 0.16 142)'
// }
```

### 5.4 Testing and Verification

```javascript
import { parse, oklch, displayable, deltaE2000, formatCss } from 'culori';

function verifyConversion(originalColor) {
  const parsed = parse(originalColor);
  const oklchConverted = oklch(parsed);

  // Check 1: Is it displayable?
  const isDisplayable = displayable(oklchConverted);
  console.log(`Displayable in sRGB: ${isDisplayable}`);

  // Check 2: Measure perceptual difference
  const difference = deltaE2000(parsed, oklchConverted);
  console.log(`Color difference (ΔE): ${difference.toFixed(3)}`);

  // Check 3: CSS output
  const css = formatCss(oklchConverted);
  console.log(`CSS output: ${css}`);

  // Check 4: Handle out-of-gamut colors
  if (!isDisplayable) {
    const { clampChroma } = await import('culori');
    const clamped = clampChroma(oklchConverted);
    console.log(`Clamped CSS: ${formatCss(clamped)}`);
  }

  return {
    isDisplayable,
    colorDifference: difference,
    cssOutput: css
  };
}
```

---

## 6. OKLCH Color Space Advantages

### Why OKLCH over HSL/RGB:

1. **Perceptual Uniformity:** OKLCH lightness is perceived consistently across hues (HSL is not)
2. **Accessible Colors:** Better for creating accessible color systems with predictable contrast
3. **Modern CSS Standard:** Native CSS support (available since May 2023 in modern browsers)
4. **Computational:** Easier to generate color harmonies and scales mathematically
5. **Design Intent:** More intuitive for designers—lightness and saturation values are independent

### OKLCH vs HSL Differences:

| Property | OKLCH | HSL |
|----------|-------|-----|
| Lightness | Perceived uniformly | Relative to RGB midpoint |
| Color wheel | Hue 0° = magenta | Hue 0° = red |
| Saturation unit | Chroma (0-~0.4) | Saturation (0-100%) |
| Perceptual accuracy | High | Lower at extreme values |
| Browser support | Modern browsers (2023+) | All browsers |

---

## 7. Common Challenges and Solutions

### Challenge: Colors appear darker/lighter after conversion

**Cause:** HSL lightness doesn't correspond to perceived lightness
**Solution:** Expected behavior—OKLCH values may differ visually from HSL

### Challenge: Out-of-gamut colors in OKLCH

**Cause:** Extreme saturation values don't map to displayable RGB
**Solution:** Use `clampChroma()` or `toGamut()` before formatting

### Challenge: Slight color shifts with alpha blending

**Cause:** Color space conversions with transparency
**Solution:** Culori preserves alpha throughout—shifts are minimal and perceptually accurate

### Challenge: CSS precision/rounding

**Cause:** CSS limits decimal places in output
**Solution:** Culori handles CSS serialization—values rounded appropriately per spec

---

## 8. Implementation Checklist

- [ ] Install culori: `npm install culori`
- [ ] Import needed functions: `parse`, `oklch`, `formatCss`, `displayable`
- [ ] Create conversion function for RGB/HSL/HEX inputs
- [ ] Add gamut mapping for out-of-gamut colors
- [ ] Preserve alpha/opacity values through conversion
- [ ] Test with sample Figma color tokens
- [ ] Verify CSS output compatibility
- [ ] Add error handling for invalid colors
- [ ] Document precision/rounding decisions
- [ ] Test in browser for visual accuracy
- [ ] Create Tailwind config with OKLCH color definitions

---

## 9. Resources

- **Culori GitHub:** https://github.com/Evercoder/culori
- **Culori Official:** https://culorijs.org/
- **MDN OKLCH Reference:** https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
- **OKLCH Color Space:** https://oklch.com/
- **CSS Color Level 4 Spec:** https://www.w3.org/TR/css-color-4/

