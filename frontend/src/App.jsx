import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import InventoryPage from "./pages/InventoryPage";
import AddStockPage from "./pages/AddStockPage";
import ExpiryAlertsPage from "./pages/ExpiryAlertsPage";
import SalesHistoryPage from "./pages/SalesHistoryPage";
import CustomersPage from "./pages/CustomersPage";
import InvoicesPage from "./pages/InvoicesPage";
import AboutPage from "./pages/AboutPage";
import TechStackPage from "./pages/TechStackPage";
import ReportsPage from "./pages/ReportsPage";
import SalesPage from "./pages/SalesPage";
import RecordSalePage from "./pages/RecordSalePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "./App.css";
import "./components.css";
import "./utilities.css";

const ProtectedRoute = ({ children, loggedIn }) => {
  return loggedIn ? children : <Navigate to="/" />;
};

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              loggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={() => setLoggedIn(true)} />
            }
          />
          <Route
            path="/signup"
            element={
              loggedIn ? <Navigate to="/dashboard" /> : <Signup />
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Layout>
                  <InventoryPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory/add"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Layout>
                  <AddStockPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/expiry-alerts"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Layout>
                  <ExpiryAlertsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales-history"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Layout>
                  <SalesHistoryPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sales"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Layout>
                  <SalesPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/record-sale"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Layout>
                  <RecordSalePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Layout>
                  <CustomersPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoices"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Layout>
                  <InvoicesPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Layout>
                  <AboutPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tech-stack"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Layout>
                  <TechStackPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <Layout>
                  <ReportsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
