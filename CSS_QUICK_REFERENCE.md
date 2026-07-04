# CSS Quick Reference Guide

## 🎯 Overview
Your pharmacy management system now has a complete professional CSS styling system with responsive design, animations, and a cohesive color scheme.

## 📁 CSS Files Structure

### 1. **index.css** (Global Foundation)
- Base styles for HTML elements
- Typography system (fonts: Poppins, Inter)
- Button variants (primary, secondary, success, warning, danger)
- Form inputs with focus states
- Table styling
- Utility helper classes

**When to modify:** Add global base styles, font definitions, global button/form styling

### 2. **App.css** (Main Application) - 1161 lines
- CSS color variables (root design tokens)
- Login/Signup page styling
- Navigation bar styling
- Dashboard page styles
- Modals and alerts
- General page layouts
- Media queries for responsive design

**When to modify:** Main page layouts, navigation, global responsive changes

### 3. **LoginStyles.css** (Authentication)
- Login and Signup page specific styles
- Animated gradient backgrounds
- Glass-morphism effects
- Floating animation patterns
- Form styling for auth pages

**When to modify:** Change login page appearance, adjust auth form styling

### 4. **components.css** (Component Library) - 850+ lines
- Dashboard specific components
- KPI cards with status variants
- Charts section styling
- Expiry alerts page styling
- Search and filter components
- Data table styling
- Info cards and stat cards

**When to modify:** Style new components, update dashboard/expiry alerts appearance

### 5. **utilities.css** (Utility Classes) - 600+ lines
- Rapid styling utility classes
- Spacing (margin, padding)
- Flexbox utilities
- Grid utilities
- Typography utilities
- Shadow utilities
- Animation utilities
- Responsive utilities (sm:, md:, lg:, xl: prefixes)

**When to modify:** Add new utility classes for common styling patterns

## 🎨 Design System - Color Palette

```css
:root {
  /* Primary Colors */
  --primary: #0066cc;           /* Main blue */
  --primary-dark: #004c99;      /* Hover state */
  --primary-light: #3385d6;     /* Light variant */
  
  /* Status Colors */
  --success: #059669;           /* Green - Success */
  --warning: #d97706;           /* Amber - Warning */
  --danger: #dc2626;            /* Red - Critical/Error */
  --danger-dark: #b91c1c;       /* Dark red - Hover */
  --info: #0ea5e9;              /* Light blue - Information */
  
  /* Neutral Colors */
  --dark: #1f2937;              /* Text, headers */
  --medium: #6b7280;            /* Secondary text */
  --light: #f3f4f6;             /* Backgrounds, borders */
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 20px;
  --spacing-2xl: 24px;
  --spacing-3xl: 32px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 999px;
}
```

## 🔧 Common Styling Patterns

### Using CSS Variables
```css
.my-button {
  background-color: var(--primary);        /* Use primary color */
  color: white;
  padding: var(--spacing-md) var(--spacing-lg); /* Use spacing */
  border-radius: var(--radius-md);         /* Use border radius */
  box-shadow: var(--shadow-md);            /* Use shadow */
}
```

### Color Classes (Status Indicators)
```html
<!-- Success (Green) -->
<span class="status-badge success">Active</span>

<!-- Warning (Amber) -->
<span class="status-badge warning">Expiring</span>

<!-- Danger (Red) -->
<span class="status-badge danger">Critical</span>

<!-- Info (Blue) -->
<span class="status-badge info">Info</span>
```

### KPI Card Variants
```html
<!-- Default KPI Card -->
<div class="kpi-card">
  <div class="kpi-value">850</div>
  <div class="kpi-label">Total Sales</div>
</div>

<!-- Critical (Red) KPI Card -->
<div class="kpi-card critical">
  <div class="kpi-value">12</div>
  <div class="kpi-label">Critical Expiry</div>
</div>

<!-- Warning (Amber) KPI Card -->
<div class="kpi-card warning">
  <div class="kpi-value">34</div>
  <div class="kpi-label">Within 7 Days</div>
</div>

<!-- Success (Green) KPI Card -->
<div class="kpi-card success">
  <div class="kpi-value">1250</div>
  <div class="kpi-label">Sales Today</div>
</div>
```

### Responsive Utility Classes
```html
<!-- Flexbox -->
<div class="flex flex-col gap-4">      <!-- Column layout with gap -->
  <div class="flex items-center gap-2">  <!-- Row with centered items -->
    Content
  </div>
</div>

<!-- Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  <!-- 1 column on mobile, 2 on tablet, 3 on desktop -->
</div>

<!-- Spacing -->
<div class="m-4 p-8">  <!-- margin: 16px, padding: 32px -->
  <p class="mb-2">Text with margin bottom</p>
</div>

<!-- Typography -->
<h1 class="text-3xl font-bold">Heading</h1>
<p class="text-sm text-gray-600">Subtitle</p>

<!-- Display -->
<div class="hidden md:block">Visible only on tablet+</div>
<div class="block md:hidden">Visible only on mobile</div>
```

## 🌈 Adding New Styles

### Option 1: Add to components.css (for new components)
```css
.my-new-component {
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
}

.my-new-component:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### Option 2: Add to utilities.css (for reusable classes)
```css
.bg-gradient-primary {
  background: linear-gradient(135deg, var(--primary), var(--primary-light));
}

.transition-smooth {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### Option 3: Add to App.css (for page-level styles)
```css
.my-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}
```

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
/* Default (mobile): 320px - 639px */
.my-class {
  display: block;
}

/* Tablet and up: 640px+ */
@media (min-width: 640px) {
  .my-class {
    display: flex;
  }
}

/* Desktop and up: 768px+ */
@media (min-width: 768px) {
  .my-class {
    width: 50%;
  }
}

/* Large desktop: 1024px+ */
@media (min-width: 1024px) {
  .my-class {
    width: 33%;
  }
}

/* Extra large: 1200px+ */
@media (min-width: 1200px) {
  .my-class {
    width: 25%;
  }
}
```

## ✨ Animation Classes

```css
/* Available animations */
.animate-spin      /* 1s rotating animation */
.animate-pulse     /* 4s pulsing animation */
.animate-bounce    /* Bouncing animation */

/* Usage */
<div class="animate-spin">Loading...</div>
```

## 🐛 Debugging CSS Issues

1. **Check Browser DevTools:** Right-click → Inspect element
2. **Verify CSS Import Order:** In App.jsx, order matters:
   - index.css (base)
   - App.css (main)
   - components.css (components)
   - utilities.css (utilities)
3. **Check Class Names:** Ensure HTML class matches CSS selector
4. **CSS Specificity:** More specific selectors override general ones
5. **Check Variables:** Make sure CSS variables are defined in :root

## 🚀 Best Practices

1. **Use CSS Variables:** Always use `var(--color-name)` for colors and spacing
2. **Keep it Responsive:** Test on mobile (640px), tablet (768px), and desktop (1024px)
3. **Consistent Spacing:** Use variables from `--spacing-xs` to `--spacing-3xl`
4. **Reuse Utilities:** Use utility classes from `utilities.css` instead of repeating styles
5. **Hover States:** Always add `:hover` and `:active` states for interactive elements
6. **Performance:** Use CSS transforms instead of changing layout (translateX, scale)
7. **Accessibility:** Maintain sufficient color contrast (WCAG AA standard)

## 📚 File Size Reference

- **index.css:** ~400 lines (Global styles)
- **App.css:** ~1,161 lines (Main app + auth)
- **LoginStyles.css:** ~300 lines (Auth page animations)
- **components.css:** ~850 lines (Component styles)
- **utilities.css:** ~600 lines (Utility classes)
- **Total:** ~3,400 lines of professional CSS

## 🔄 Development Workflow

1. **Make changes** to CSS files (any of the 5 files)
2. **Save** the file (Ctrl+S)
3. **HMR triggers** automatically (check terminal for "updated" message)
4. **Browser refreshes** with new styles (no manual refresh needed)
5. **Debug** in browser DevTools if needed

## 📞 Quick Help

**Question:** How do I style a new page?
**Answer:** Create a new section in `components.css` with `.my-new-page` styles

**Question:** How do I make something responsive?
**Answer:** Use `@media (min-width: 768px)` for tablet and up

**Question:** How do I add colors?
**Answer:** Use existing variables like `var(--primary)`, `var(--success)`, etc.

**Question:** How do I make things align?
**Answer:** Use flex utilities: `class="flex items-center justify-center"`

---

**Happy Styling!** 🎨 Your pharmacy system is now fully styled and production-ready.
