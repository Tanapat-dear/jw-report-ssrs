import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  return (
    <div className="home-container">
      {/* Title */}
      <h1 className="home-title">
        Welcome <span role="img" aria-label="wave">👋</span>
      </h1>
      <p className="home-desc">
       This system is for downloading Raw Data Reports for each Process.
        Please select a Report from the left menu to begin.
      </p>

      {/* Quick Access Section */}
      <section className="section-block">
        <h2 className="section-title">🔗 Quick Access</h2>

        {/* Reports Group */}
        <div className="quick-group">
          <h3 className="group-label">Reports</h3>
          <div className="quick-grid report-grid">
            {/* Reports Links */}
            <Link to="/reports/pth" className="quick-btn">PTH Report</Link>
            <Link to="/reports/cfm" className="quick-btn">CFM Report</Link>
            <Link to="/reports/lpi" className="quick-btn">LPI Report</Link>
            <Link to="/reports/cvc" className="quick-btn">CVC Report</Link>
            <Link to="/reports/sft" className="quick-btn">SFT Report</Link>
            <Link to="/reports/fin" className="quick-btn">FIN Report</Link>
            <Link to="/reports/smt" className="quick-btn">SMT Report</Link>
          </div>
        </div>

        {/* Master Table Group */}
        <div className="quick-group">
          <h3 className="group-label">Master Table</h3>
          <div className="quick-grid master-grid">
            <Link to="/mastertable" className="quick-btn master-btn">Master Table</Link>
          </div>
        </div>
      </section>

      {/* How to use Section */}
     <section className="section-block">
        <h2 className="section-title">📘 How to Use</h2>
        <ol className="howto-list">
          <li>Select the **Report Type** from the left menu.</li>
          <li>Choose the **Date Range** required.</li>
          <li>Click the <strong>Download</strong> button to get the file.</li>
        </ol>
      </section>

      {/* Footer */}
      <footer className="footer">
        System Version: v1.0.0
        <br />
        Contact IOT: <span role="img" aria-label="phone">📞</span> Internal 4308
      </footer>
    </div>
  );
}