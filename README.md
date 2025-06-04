# Flux · Expense Tracker

A beautifully redesigned expense tracking application with a minimal dark theme, built with Next.js, TypeScript, and modern design principles.

## ✨ Design Features

### Minimal Dark Aesthetic
- **Deep Dark Theme**: Carefully crafted color palette avoiding pure black/white
- **Glass Morphism**: Subtle glass effects with backdrop blur and transparency  
- **Gradient Accents**: Beautiful gradient overlays for visual depth
- **Inter Font**: Clean, modern typography with proper font weights
- **Smooth Animations**: Micro-interactions and transitions throughout

### Layout & Navigation
- **Card Grid System**: Responsive grid layout for category breakdowns
- **Mobile-First**: Optimized for mobile devices with touch interactions
- **Floating Action Button**: Easy access to add new transactions
- **Sticky Header**: Always accessible navigation with balance toggle

### Data Visualization
- **Interactive Charts**: Beautiful pie charts and area charts with gradients
- **Category Insights**: Visual breakdown of spending by category
- **Monthly Trends**: Area charts showing income vs expenses over time
- **Real-time Stats**: Dynamic balance calculation with visual indicators

## 🎨 Color Scheme

```css
/* Primary Colors */
--color-background: #0a0a0a    /* Deep background */
--color-surface: #121212       /* Card surfaces */
--color-text: #fafafa         /* Primary text */
--color-secondary: #a3a3a3    /* Secondary text */

/* Category Colors */
--food: #f97316      /* Orange gradient */
--transport: #06b6d4 /* Cyan gradient */
--fitness: #10b981   /* Emerald gradient */
--misc: #8b5cf6      /* Violet gradient */
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15.3.3 with TypeScript
- **Styling**: Custom CSS with CSS Variables and modern features
- **Charts**: Recharts library for data visualization
- **Icons**: Lucide React for consistent iconography
- **Database**: Supabase for data persistence

### Key Components
- **Balance Card**: Central balance display with income/expense breakdown
- **Category Grid**: Visual representation of spending categories
- **Transaction List**: Elegant list with expand/collapse interactions
- **Chart Components**: Multiple chart types for data insights
- **Modal Forms**: Smooth modal interactions for adding transactions

## 🚀 Features

### Core Functionality
- ✅ Add income and expense transactions
- ✅ Categorize transactions (Food, Transport, Fitness, Misc)
- ✅ View current balance with calculations
- ✅ Filter transactions by type
- ✅ Delete transactions with confirmation
- ✅ Real-time data updates

### Enhanced UX
- ✅ Balance visibility toggle (privacy mode)
- ✅ Smooth animations and transitions
- ✅ Touch-friendly mobile interface
- ✅ Visual feedback for all interactions
- ✅ Expandable transaction details
- ✅ Form validation and error handling

### Charts & Analytics
- ✅ Category spending breakdown (Pie Chart)
- ✅ Monthly trend analysis (Area Chart)
- ✅ Visual spending indicators
- ✅ Responsive chart layouts
- ✅ Gradient fills and modern styling

## 🛠️ Development

### Setup
```bash
npm install
npm run dev
```

### Demo Data
```bash
node setup-demo.js
```

### Build
```bash
npm run build
npm start
```

## 🎯 Design Philosophy

This redesign focuses on creating a **minimal, elegant, and functional** expense tracking experience:

1. **Clarity Over Complexity**: Clean interface that prioritizes essential information
2. **Dark-First Design**: Optimized for reduced eye strain and modern aesthetics  
3. **Micro-Interactions**: Subtle animations that provide feedback and delight
4. **Data-Driven Insights**: Visual representations that make financial data digestible
5. **Mobile Excellence**: Touch-optimized interface that works beautifully on all devices

The result is a premium-feeling expense tracker that makes financial management both beautiful and effortless.

---

*Built with ❤️ using modern web technologies and thoughtful design principles.*
