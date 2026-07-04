import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import './Dashboard.css';
import { 
  AlertOutlined, 
  DollarCircleOutlined, 
  MedicineBoxOutlined, 
  WarningOutlined,
  DownloadOutlined,
  PlusOutlined
} from '@ant-design/icons';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const [stats, setStats] = useState({
    totalMedicines: 0,
    lowStock: 0,
    expiringSoon: 0,
    totalValue: 0
  });
  
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch inventory stats
      const invRes = await fetch('/api/reports/inventory', { headers });
      const inventory = await invRes.json();
      
      // Fetch batches for expiry alerts
      const batchRes = await fetch('/api/batches', { headers });
      const batches = await batchRes.json();
      
      if (!Array.isArray(inventory)) throw new Error(inventory.message || "Failed to load inventory");
      if (!Array.isArray(batches)) throw new Error(batches.message || "Failed to load batches");

      // Calculate stats
      const totalMeds = inventory.length;
      const lowStockCount = inventory.filter(item => item.totalQuantity < 20).length;
      
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      
      const expiringList = batches.filter(batch => {
        const expiryDate = new Date(batch.expiryDate);
        return expiryDate <= thirtyDaysFromNow;
      }).sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

      const totalVal = inventory.reduce((sum, item) => sum + (item.totalStockValue || 0), 0);

      setStats({
        totalMedicines: totalMeds,
        lowStock: lowStockCount,
        expiringSoon: expiringList.length,
        totalValue: totalVal
      });

      setRecentAlerts(expiringList.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setLoading(false);
    }
  };

  const barChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Stock Value ($)',
        data: [1200, 1900, 1500, 2200, 1800, stats.totalValue],
        backgroundColor: '#2563eb',
        borderRadius: 4,
      }
    ],
  };

  const doughnutData = {
    labels: ['Good Stock', 'Low Stock', 'Expiring'],
    datasets: [
      {
        data: [
          Math.max(0, stats.totalMedicines - stats.lowStock - stats.expiringSoon), 
          stats.lowStock, 
          stats.expiringSoon
        ],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0,
        cutout: '70%',
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      }
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p className="subtitle">Monitor essential inventory, stock levels, and critical alerts.</p>
        </div>
        <div className="header-actions">
          <button className="export-btn">
            <DownloadOutlined /> Export Report
          </button>
          <Link to="/inventory/add">
            <button className="primary add-stock-btn">
              <PlusOutlined /> Add Medicine
            </button>
          </Link>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <h3>TOTAL MEDICINES</h3>
            <div className="icon-wrapper blue">
              <MedicineBoxOutlined />
            </div>
          </div>
          <div className="metric-value">{stats.totalMedicines}</div>
          <div className="metric-trend">
            <span className="positive">Active</span> catalog items
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>LOW STOCK</h3>
            <div className="icon-wrapper orange">
              <WarningOutlined />
            </div>
          </div>
          <div className="metric-value">{stats.lowStock}</div>
          <div className="metric-trend">
            <span className="positive">Below Avg</span> inventory items
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>EXPIRING SOON</h3>
            <div className="icon-wrapper red">
              <AlertOutlined />
            </div>
          </div>
          <div className="metric-value">{stats.expiringSoon}</div>
          <div className="metric-trend">
            <span className="warning">Within 30d</span> attention needed
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3>ASSET VALUE</h3>
            <div className="icon-wrapper green">
              <DollarCircleOutlined />
            </div>
          </div>
          <div className="metric-value">${stats.totalValue.toFixed(2)}</div>
          <div className="metric-trend">
            <span className="info">Total</span> estimated capital
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card bar-chart">
          <h3>Stock Values</h3>
          <p className="subtitle">Value of medicines currently in stock</p>
          <div className="chart-container">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card doughnut-chart">
          <h3>Expiry Distribution</h3>
          <p className="subtitle">Health of overall inventory</p>
          <div className="chart-container">
            <Doughnut data={doughnutData} options={chartOptions} />
            <div className="doughnut-center">
              <span>{Math.max(0, stats.totalMedicines)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-tables">
        <div className="table-card">
          <div className="card-header">
            <h3>Critical Expiry Alerts</h3>
            <Link to="/expiry-alerts" className="view-all">View All Alerts</Link>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Batch No</th>
                  <th>Stock</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAlerts.length === 0 ? (
                  <tr><td colSpan="5" className="text-center">No alerts at the moment</td></tr>
                ) : (
                  recentAlerts.map(alert => {
                    const expiry = new Date(alert.expiryDate);
                    const isExpired = expiry <= new Date();
                    
                    return (
                      <tr key={alert._id}>
                        <td>{alert.medicine?.name}</td>
                        <td>{alert.batchNo}</td>
                        <td>{alert.quantity} units</td>
                        <td>{expiry.toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge ${isExpired ? 'status-critical' : 'status-warning'}`}>
                            {isExpired ? 'Expired' : 'Expiring Soon'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;