import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function Charts({ inventory, expiry }) {
  // 🔹 Inventory Stock Value Chart
  const inventoryChart = {
    labels: inventory.map(i => i.medicineName),
    datasets: [
      {
        label: "Total Stock Value",
        data: inventory.map(i => i.totalStockValue),
        backgroundColor: "#4caf50"
      }
    ]
  };

  // 🔹 Expiry Timeline Chart
  const expiryChart = {
    labels: expiry.map(
      e => `${e.medicineName} (${e.daysLeft}d)`
    ),
    datasets: [
      {
        label: "Quantity Expiring",
        data: expiry.map(e => e.quantity),
        backgroundColor: expiry.map(e =>
          e.daysLeft <= 7 ? "#d32f2f" : "#fbc02d"
        )
      }
    ]
  };

  return (
    <div className="charts-grid">
      <div className="chart-container">
        <h3>💰 Inventory Stock Value</h3>
        <Bar data={inventoryChart} />
      </div>

      <div className="chart-container">
        <h3>⏰ Expiry Risk Analysis</h3>
        <Bar data={expiryChart} />
      </div>
    </div>
  );
}

export default Charts;
