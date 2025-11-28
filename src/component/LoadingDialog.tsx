
import "../styles/LoadingDialog.css";

export default function LoadingDialog({ open = false }) {
  if (!open) return null; // ถ้าไม่เปิด ไม่แสดง

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
}