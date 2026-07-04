# PharmaCare - Pharmacy Management System

A modern, professional pharmacy management system built with React, featuring inventory tracking, expiry monitoring, and comprehensive analytics.

## 🚀 Features

### 📊 Dashboard
- Real-time analytics and insights
- Key performance indicators (KPIs)
- Interactive charts for inventory and expiry data
- Quick overview of critical metrics

### 📦 Inventory Management
- Complete medicine inventory tracking
- Stock level monitoring with low-stock alerts
- Search and filter functionality
- CSV export capabilities
- Detailed stock value calculations

### ⏰ Expiry Alerts
- Advanced expiry date monitoring
- Configurable alert periods (7, 15, 30, 60 days)
- Critical expiry notifications
- Batch-wise expiry tracking
- Automated email alerts (backend feature)

### 🎨 Professional Design
- Modern, responsive UI with professional styling
- Intuitive navigation with sticky header
- Mobile-friendly design
- Beautiful gradients and animations
- Status badges and visual indicators

## 🛠️ Technology Stack

- **Frontend:** React 19, React Router DOM
- **Styling:** CSS3 with modern design patterns
- **Charts:** Chart.js with react-chartjs-2
- **Notifications:** React Toastify
- **Build Tool:** Vite

## 📁 Project Structure

```
frontend/
├── public/
│   └── images/          # Static images directory
├── src/
│   ├── components/      # Reusable components
│   │   ├── Charts.jsx
│   │   ├── Layout.jsx
│   │   └── Navigation.jsx
│   ├── pages/           # Page components
│   │   ├── Dashboard.jsx
│   │   ├── InventoryPage.jsx
│   │   └── ExpiryAlertsPage.jsx
│   ├── utils/           # Utility functions
│   │   └── exportCsv.js
│   ├── App.jsx          # Main app component with routing
│   ├── App.css          # Global styles
│   ├── index.css        # Base styles and CSS variables
│   ├── Login.jsx        # Authentication component
│   └── main.jsx         # App entry point
├── index.html           # HTML template
└── package.json
```

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Access the Application:**
   - Frontend: http://localhost:5174
   - Backend: http://localhost:5000 (must be running separately)

## 🔐 Authentication

- Default login credentials:
  - Email: admin@example.com
  - Password: yourpassword

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- Desktop computers
- Tablets
- Mobile devices

## 🎯 Key Features

### Navigation
- Sticky navigation bar with active page indicators
- Professional branding with pharmacy icon
- Easy logout functionality

### Dashboard
- KPI cards with hover animations
- Interactive bar charts for inventory and expiry data
- Real-time data updates

### Inventory Page
- Advanced search functionality
- Stock status indicators
- Export to CSV feature
- Responsive table design

### Expiry Alerts
- Color-coded status badges
- Configurable time periods
- Critical alerts summary
- Batch-level tracking

## 🎨 Design System

### Color Palette
- Primary: Blue (#2563eb)
- Success: Green (#10b981)
- Warning: Amber (#f59e0b)
- Danger: Red (#ef4444)
- Background: Light gray (#f8fafc)

### Typography
- Font Family: Inter (Google Fonts)
- Responsive text sizing
- Proper contrast ratios

### Components
- Card-based layouts
- Gradient backgrounds
- Smooth animations
- Professional shadows

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- Modern React with hooks
- CSS modules approach
- Clean component architecture
- Responsive design principles

## 📈 Future Enhancements

- Medicine addition/editing interface
- Batch management system
- Advanced reporting features
- User role management
- Dark mode toggle
- Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ for efficient pharmacy management

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
