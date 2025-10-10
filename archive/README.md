# Archive - Navigation with Tools Link

This folder contains the navigation files that included a "TOOLS" link in the main navigation bar.

## Files:
- `home_with_tools.ejs` - Home page with 4-item navigation (HOME, ABOUT, RULES, TOOLS)
- `_navigation_with_tools.scss` - SCSS file configured for 4 navigation items

## What was changed:
- Added TOOLS navigation item linking to https://tools.saikou.dev/
- Adjusted SCSS spacing to accommodate 4 items instead of 3
- Modified margins and responsive breakpoints

## Why archived:
- User decided they didn't like having the tools link in the main navigation
- Reverted back to original 3-item navigation (HOME, ABOUT, RULES)

## To restore:
If you want to bring back the tools navigation:
1. Copy `home_with_tools.ejs` back to `assets/html/home.ejs`
2. Copy `_navigation_with_tools.scss` back to `assets/scss/layout/_navigation.scss`
3. Recompile SCSS: `npx sass assets/scss/main.scss assets/css_final/main.css`