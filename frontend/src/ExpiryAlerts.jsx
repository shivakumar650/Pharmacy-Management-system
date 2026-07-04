import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { exportToCSV } from "./utils/exportCsv";

function ExpiryAlerts({ onCriticalChange }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  const prevCriticalRef = useRef(0);
  const abortRef = useRef(null);

  const fetchData = () => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setLoading(true);

    fetch(`/api/reports/expiry?days=${days}`, {
      headers: {
        Authorization: localStorage.getItem("token")
      },
      signal: abortRef.current.signal
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => {
        setAlerts(data);

        const criticalCount = data.filter(
          item => item.daysLeft <= 7
        ).length;

        // Notify parent (KPI cards)
        if (onCriticalChange) onCriticalChange(criticalCount);

        // Toast only when new critical appears
        if (
          criticalCount > 0 &&
          prevCriticalRef.current === 0
        ) {
          toast.error(
            `🚨 ${criticalCount} batch(es) expiring within 7 days!`,
            { autoClose: 7000 }
          );
        }

        prevCriticalRef.current = criticalCount;
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== "AbortError") {
          console.error(err);
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);

    return () => {
      clearInterval(interval);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [days]);

  const criticalCount = alerts.filter(
    item => item.daysLeft <= 7
  ).length;

  const warningCount = alerts.filter(
    item => item.daysLeft > 7 && item.daysLeft <= 30
  ).length;

  return (
    <div className="expiry-alerts-wrapper">
      {/* Header */}
      <div className="expiry-header">
        <div>
          <h1 className="expiry-title">⏰ Expiry Alerts Dashboard</h1>
          <p className="expiry-subtitle">Monitor and manage medicines approaching expiry dates</p>
        </div>
      </div>

      {/* Alert Stats */}
      <div className="alert-stats-grid">
        <div className="alert-stat-card critical-bg">
          <div className="alert-stat-icon">🚨</div>
          <div className="alert-stat-info">
            <h3>Critical</h3>
            <p className="alert-stat-value">{criticalCount}</p>
            <span className="alert-stat-label">0-7 days</span>
          </div>
        </div>

        <div className="alert-stat-card warning-bg">
          <div className="alert-stat-icon">⚠️</div>
          <div className="alert-stat-info">
            <h3>Warning</h3>
            <p className="alert-stat-value">{warningCount}</p>
            <span className="alert-stat-label">8-30 days</span>
          </div>
        </div>

        <div className="alert-stat-card total-bg">
          <div className="alert-stat-icon">📊</div>
          <div className="alert-stat-info">
            <h3>Total</h3>
            <p className="alert-stat-value">{alerts.length}</p>
            <span className="alert-stat-label">All alerts</span>
          </div>
        </div>
      </div>

      {/* Critical Alert Banner */}
      {criticalCount > 0 && (
        <div className="critical-alert-banner">
          <div className="banner-icon">🚨</div>
          <div className="banner-content">
            <h3>Critical Alert!</h3>
            <p>{criticalCount} batch(es) expiring within 7 days - Immediate action required</p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="expiry-controls">
        <div className="control-group">
          <label className="control-label">
            📅 Show expiring within:
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="expiry-select"
            >
              <option value={7}>7 Days</option>
              <option value={15}>15 Days</option>
              <option value={30}>30 Days</option>
              <option value={60}>60 Days</option>
            </select>
          </label>
        </div>

        <button
          onClick={() =>
            exportToCSV(
              `expiry-alerts-${days}-days.csv`,
              alerts.map(a => ({
                Medicine: a.medicineName,
                Batch: a.batchNo,
                ExpiryDate: new Date(a.expiryDate).toDateString(),
                DaysLeft: a.daysLeft,
                Quantity: a.quantity
              }))
            )
          }
          className="export-btn"
        >
          ⬇️ Export CSV Report
        </button>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading expiry alerts...</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="empty-state-alerts">
          <div className="empty-icon">✅</div>
          <h3>All Clear!</h3>
          <p>No medicines expiring in the next {days} days</p>
        </div>
      ) : (
        <div className="expiry-table-section">
          <div className="table-wrapper">
            <table className="expiry-table">
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th>Batch No</th>
                  <th>Expiry Date</th>
                  <th>Days Left</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((item, index) => (
                  <tr key={index} className={`expiry-row ${
                    item.daysLeft <= 7 ? 'critical-row' :
                    item.daysLeft <= 30 ? 'warning-row' : 'normal-row'
                  }`}>
                    <td className="medicine-name">{item.medicineName}</td>
                    <td className="batch-no">{item.batchNo}</td>
                    <td className="expiry-date">{new Date(item.expiryDate).toLocaleDateString()}</td>
                    <td className="days-left">
                      <span className="days-badge">
                        {item.daysLeft} days
                      </span>
                    </td>
                    <td className="quantity">{item.quantity} units</td>
                    <td>
                      <span className={`status-badge ${
                        item.daysLeft <= 7 ? 'status-critical' :
                        item.daysLeft <= 30 ? 'status-warning' : 'status-normal'
                      }`}>
                        {item.daysLeft <= 7 ? '🚨 Critical' :
                         item.daysLeft <= 30 ? '⚠️ Warning' : '✅ Normal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Guidance Section */}
      <div className="guidance-section">
        <h2 className="guidance-title">📋 What to Do When Medicines Are Expiring?</h2>
        <div className="guidance-grid">
          <div className="guidance-card critical-guide">
            <div className="guide-icon">🚨</div>
            <h4>Critical (0-7 Days)</h4>
            <ul>
              <li>🛑 <strong>Stop using immediately</strong></li>
              <li>📦 <strong>Quarantine the batch</strong> separately</li>
              <li>♻️ <strong>Dispose safely</strong> following pharma guidelines</li>
              <li>📝 <strong>Update inventory records</strong> to zero</li>
              <li>⚖️ <strong>Follow regulatory compliance</strong> (FDA/WHO guidelines)</li>
            </ul>
          </div>

          <div className="guidance-card warning-guide">
            <div className="guide-icon">⚠️</div>
            <h4>Warning (8-30 Days)</h4>
            <ul>
              <li>📢 <strong>Mark for priority sale/use</strong></li>
              <li>💰 <strong>Offer discounts</strong> to move stock quickly</li>
              <li>🏥 <strong>Promote to customers</strong> (within expiry)</li>
              <li>📊 <strong>Track daily</strong> for movement</li>
              <li>🔔 <strong>Set reminders</strong> for final week</li>
            </ul>
          </div>

          <div className="guidance-card normal-guide">
            <div className="guide-icon">📅</div>
            <h4>Planning Ahead (30+ Days)</h4>
            <ul>
              <li>📈 <strong>Monitor stock levels</strong> regularly</li>
              <li>🛒 <strong>Plan reordering</strong> to avoid overstocking</li>
              <li>📦 <strong>Practice FIFO</strong> (First In, First Out)</li>
              <li>🗂️ <strong>Organize storage</strong> by expiry date</li>
              <li>📅 <strong>Schedule reviews</strong> weekly</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="best-practices">
        <h3>✨ Best Practices for Pharmacy Management</h3>
        <div className="practices-list">
          <div className="practice-item">
            <span className="practice-number">1</span>
            <p><strong>Regular Audits:</strong> Check inventory weekly to catch upcoming expiries early</p>
          </div>
          <div className="practice-item">
            <span className="practice-number">2</span>
            <p><strong>FIFO Method:</strong> Always use older stock first to minimize waste</p>
          </div>
          <div className="practice-item">
            <span className="practice-number">3</span>
            <p><strong>Proper Storage:</strong> Keep medicines in cool, dry place away from light</p>
          </div>
          <div className="practice-item">
            <span className="practice-number">4</span>
            <p><strong>Legal Compliance:</strong> Maintain disposal records as per regulations</p>
          </div>
          <div className="practice-item">
            <span className="practice-number">5</span>
            <p><strong>Team Training:</strong> Educate staff on expiry date importance</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpiryAlerts;
