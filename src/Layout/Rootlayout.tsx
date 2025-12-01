import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import '../styles/Rootlayout.css';

export default function RootLayout() {

  const location = useLocation();
  const [openReports, setOpenReports] = useState(true);

  // ถ้า URL อยู่ใน /reports/* ให้เปิด dropdown อัตโนมัติ
  useEffect(() => {
    if (location.pathname.startsWith("/reports")) {
      setOpenReports(true);
    }
  }, [location.pathname]);

  return (
    <div className="layout-container">
      
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <NavLink to="/home" className="brand-link">🚀 JW Raw Data Export</NavLink>
        </div>

        <ul className="sidebar-menu">
          
          <li>
            <NavLink to="/home" end className={({ isActive }) => isActive ? "active" : ""}>
              Home
            </NavLink>
          </li>

          {/* Dropdown Reports */}
          <li className="dropdown-wrapper">
            
            {/* ตัวที่กดเปิด/ปิด dropdown */}
            <div
                className={`dropdown-toggle ${
                    location.pathname.startsWith("/reports") ? "reports-category-active" : ""
                }`}
                onClick={() => setOpenReports(!openReports)}
                >
                Reports
                <span className={`arrow ${openReports ? "open" : ""}`}>▾</span>
                </div>

            {/* เมนูย่อย */}
            {openReports && (
              <ul className="submenu">
               
                <li>
                  <NavLink 
                    to="/reports/pth"
                    className={({ isActive }) => isActive ? "active" : ""}
                  >
                    PTH Report
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/reports/cfm"
                    className={({ isActive }) => isActive ? "active" : ""}
                  >
                    CFM Report
                  </NavLink>
                </li>

                <li>
                  <NavLink 
                    to="/reports/lpi"
                    className={({ isActive }) => isActive ? "active" : ""}
                  >
                    LPI Report
                  </NavLink>
                </li>

                <li>
                  <NavLink 
                    to="/reports/cvc"
                    className={({ isActive }) => isActive ? "active" : ""}
                  >
                    CVC Report
                  </NavLink>
                </li>
                  <li>
                  <NavLink 
                    to="/reports/sft"
                    className={({ isActive }) => isActive ? "active" : ""}
                  >
                    SFT Report
                  </NavLink>
                </li>
                 <li>
                  <NavLink 
                    to="/reports/fin"
                    className={({ isActive }) => isActive ? "active" : ""}
                  >
                    FIN Report
                  </NavLink>
                </li>
                 <li>
                  <NavLink 
                    to="/reports/smt"
                    className={({ isActive }) => isActive ? "active" : ""}
                  >
                    SMT Report
                  </NavLink>
                </li>
              </ul>
            )}

          </li>

          <li>
            <NavLink to="/mastertable" className={({ isActive }) => isActive ? "active" : ""}>
              Master Table
            </NavLink>
          </li>
          

        </ul>
         
      </aside>

          
      <main className="content">
        <Outlet />
      </main>
            
    </div>
  );
}
