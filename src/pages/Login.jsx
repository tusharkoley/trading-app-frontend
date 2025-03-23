import "../styles/Styles.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import { useDarkMode } from "../DarkModeContext";

function LiveTrading() {
  const { isDarkMode, toggleTheme } = useDarkMode();
  return (
    <div
      className={
        "container overflow-auto " +
        (isDarkMode ? "live-dark-mode" : "live-light-mode")
      }
    >
      <h1>Login</h1>
    </div>
  );
}

export default LiveTrading;
