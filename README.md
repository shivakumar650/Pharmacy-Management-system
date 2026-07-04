# PharmaCare - Pharmacy Management System

A full-stack web application designed for modern pharmacy inventory management, sales tracking, and expiry alerts. Built with a sleek, responsive, and glassmorphic UI, it helps administrators seamlessly monitor warehouse stock and critical supplies.

## Features
- **Dashboard Overview**: Get a bird's-eye view of your entire inventory, including total active medicines, low stock alerts, and total asset valuation.
- **Inventory Management**: View, search, and manage all active batches of medicines.
- **Smart Expiry Alerts**: Automatically highlights batches that are expiring within 30 days. Includes a cron-job backend service that sends email alerts for expiring stock.
- **Sales & Billing**: Quick internal sales recording with auto-deduction of inventory.
- **Modern UI**: Designed with React and Chart.js, featuring smooth micro-animations, glassmorphism, and a highly responsive layout.

## Tech Stack
**Frontend**:
- React 19 + Vite
- Chart.js & React-Chartjs-2
- TailwindCSS & Custom Modern CSS (Glassmorphism, CSS Variables)
- Lucide React (Icons)

**Backend**:
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT) Authentication
- Node-Cron (for automated expiry checks)
- Nodemailer

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/pharmacy-system.git
cd pharmacy-system
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add the following:
```env
JWT_SECRET=your_super_secret_key
# Optional: If you want to use MongoDB Atlas instead of local MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster0...
```
Start the backend server:
```bash
# This will automatically start the server at http://localhost:5000
npm start
```
*Note: If your database is empty, the server will log a warning. To populate the database with sample data, run `npm run seed` inside the backend directory.*

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## Screenshots
*(Add screenshots of your application here)*

## License
MIT
