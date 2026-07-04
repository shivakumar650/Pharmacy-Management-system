function KpiCards({ stats }) {
  const cardStyle = {
    padding: "16px",
    borderRadius: "8px",
    minWidth: "200px",
    background: "#1f1f1f",
    color: "white"
  };

  const dangerStyle = {
    ...cardStyle,
    background: "#b00020"
  };

  return (
    <div style={{
      display: "flex",
      gap: "16px",
      flexWrap: "wrap",
      marginBottom: "20px"
    }}>
      <div style={cardStyle}>
        <h3>Total Medicines</h3>
        <h2>{stats.totalMedicines}</h2>
      </div>

      <div style={cardStyle}>
        <h3>Total Stock Qty</h3>
        <h2>{stats.totalQuantity}</h2>
      </div>

      <div style={cardStyle}>
        <h3>Total Stock Value</h3>
        <h2>₹ {stats.totalValue}</h2>
      </div>

      <div style={stats.criticalExpiry > 0 ? dangerStyle : cardStyle}>
        <h3>Critical Expiry</h3>
        <h2>{stats.criticalExpiry}</h2>
      </div>
    </div>
  );
}

export default KpiCards;
