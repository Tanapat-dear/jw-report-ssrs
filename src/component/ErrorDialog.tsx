import "../styles/ErrorDialog.css";
import type { ErrorDialogtype } from "../type/commontype";

export default function ErrorDialog({ message }: ErrorDialogtype) {
  return (
    <div className="error-box">
      {message || "An error occurred while fetching data"}
      <div className="error-progress"></div>
    </div>
  );
}
