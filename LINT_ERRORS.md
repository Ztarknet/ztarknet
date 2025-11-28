# Biome Lint Errors Report

Generated: November 20, 2025

## Summary

- **@ztarknet/explorer**: 116 errors, 36 warnings
- **@ztarknet/website**: 51 errors
- **@workspace/ui**: Multiple formatting and style errors

## Error Categories

### 1. Formatting Issues (Quote Style)
- **Issue**: Files use double quotes `"` instead of single quotes `'`
- **Affected**: All packages (explorer, website, ui)
- **Files**: Nearly all `.tsx` and `.ts` files
- **Example**: `import React from "react"` should be `import React from 'react'`

### 2. Import Organization
- **Issue**: Import statements not sorted alphabetically
- **Affected**: explorer, website
- **Files**:
  - `apps/explorer/src/components/common/StatCard.tsx`
  - `apps/explorer/src/components/transactions/TransactionDetails.tsx`
  - `apps/website/src/components/sections/Thesis.tsx`
  - `apps/website/src/components/sections/Resources.tsx`

### 3. Import Type Issues (useImportType)
- **Issue**: Type-only imports should use `import type`
- **Affected**: website
- **Files**:
  - `apps/website/src/components/sections/Resources.tsx:3` - `import React from "react"`
  - `apps/website/src/components/sections/Hero.tsx:3` - `import React from "react"`
- **Fix**: Use `import type React from 'react'`

### 4. Accessibility Issues

#### Missing Button Type (useButtonType)
- **Issue**: Buttons missing explicit `type` attribute
- **Affected**: explorer
- **Files**:
  - `apps/explorer/src/components/transactions/TransactionsList.tsx:41`
  - `apps/explorer/src/components/transactions/TransactionsList.tsx:85`
- **Fix**: Add `type="button"` to button elements

#### Missing SVG Alt Text (useAltText)
- **Issue**: SVG elements need alternative text via title element or aria-label
- **Affected**: explorer
- **Files**:
  - `apps/explorer/src/components/transactions/TransactionsList.tsx:92` - Loading spinner SVG

### 5. React Issues

#### Array Index as Key (noArrayIndexKey)
- **Issue**: Using array index as React key
- **Affected**: explorer
- **Files**:
  - `apps/explorer/src/components/transactions/TransactionsList.tsx:75`
- **Code**: `Array.from({ length: PAGE_SIZE }).map((_, index: number) => ( <TransactionCard key={index} ...`
- **Impact**: Affects performance and component state
- **Fix**: Use unique identifier instead of index

### 6. Self-Closing Elements (useSelfClosingElements)
- **Issue**: Elements without children should be self-closing
- **Affected**: website
- **Files**:
  - `apps/website/src/components/sections/Roadmap.tsx:70`
  - `apps/website/src/components/sections/Roadmap.tsx:72`
- **Fix**: Change `<div></div>` to `<div />`

### 7. Extra Blank Lines
- **Issue**: Extra blank lines at end of files
- **Affected**: website, ui
- **Files**: Multiple layout files

## Detailed Breakdown by Package

### @ztarknet/explorer (116 errors, 36 warnings)
- Quote style formatting: ~80% of errors
- Import organization: 3 files
- Button type issues: 2 instances
- Array index key: 1 instance
- SVG accessibility: 1 instance

### @ztarknet/website (51 errors)
- Quote style formatting: ~85% of errors
- Import type issues: 2 files
- Self-closing elements: 2 instances
- Import organization: 2 files
- Extra blank lines: Multiple files

### @workspace/ui (Multiple errors)
- Quote style formatting: Majority of errors
- All files need quote style conversion

## Recommended Fix Order

1. **Auto-fixable (Safe)**:
   - Quote style (double → single)
   - Import organization
   - Self-closing elements
   - Extra blank lines

2. **Auto-fixable (Unsafe - requires review)**:
   - Import type conversions

3. **Manual fixes required**:
   - Button type attributes
   - Array index keys (needs logic change)
   - SVG accessibility

## Command to Auto-Fix

```bash
# Safe fixes only
bun run lint -- --fix

# Include unsafe fixes (use with caution)
bun run lint -- --fix --unsafe
```

## Note

Biome reported: "The number of diagnostics exceeds the number allowed by Biome. Diagnostics not shown: 132."

This means there are even more errors than displayed (at least 132 additional diagnostics).

