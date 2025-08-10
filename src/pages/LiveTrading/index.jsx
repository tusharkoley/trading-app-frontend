// import "./LiveTrading.css";
import "../../styles/Styles.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import { useDarkMode } from "../../DarkModeContext";

function LiveTrading() {
  const { isDarkMode, toggleTheme } = useDarkMode();
  return (
    <div
      className={
        "container overflow-auto " +
        (isDarkMode ? "live-dark-mode" : "live-light-mode")
      }
    >
      <h1>
        Thanks for visiting the Live Trading page! This is a sample page to
      </h1>
      <h1>
        LIVE Trading0 - LIVE Trading - LIVE Trading - LIVE Trading - LIVE
        Trading - LIVE Trading - LIVE Trading - LIVE Trading - LIVE Trading -
        culpa incidunt ab facere a modi provident optio nobis, minus sed enim
        sint dolores eos ipsam!
      </h1>
      <h1>
        LIVE Trading1 - LIVE Trading - LIVE Trading - LIVE Trading - LIVE
        Trading - LIVE Trading - LIVE Trading - LIVE Trading - LIVE Trading -
        culpa incidunt ab facere a modi provident optio nobis, minus sed enim
        sint dolores eos ipsam!
      </h1>
      <h1>
        LIVE Trading2 - LIVE Trading - LIVE Trading - LIVE Trading - LIVE
        Trading - LIVE Trading - LIVE Trading - LIVE Trading - LIVE Trading -
        culpa incidunt ab facere a modi provident optio nobis, minus sed enim
        sint dolores eos ipsam!
      </h1>
      <h1>
        LIVE Trading3 - LIVE Trading - LIVE Trading - LIVE Trading - LIVE
        Trading - LIVE Trading - LIVE Trading - LIVE Trading - LIVE Trading -
        culpa incidunt ab facere a modi provident optio nobis, minus sed enim
        sint dolores eos ipsam!
      </h1>
      <h1>
        LIVE Trading2 - LIVE Trading - LIVE Trading - LIVE Trading - LIVE
        Trading - LIVE Trading - LIVE Trading - LIVE Trading - LIVE Trading -
        culpa incidunt ab facere a modi provident optio nobis, minus sed enim
        sint dolores eos ipsam!
      </h1>
      <h1>
        LIVE Trading3 - LIVE Trading - LIVE Trading - LIVE Trading - LIVE
        Trading - LIVE Trading - LIVE Trading - LIVE Trading - LIVE Trading -
        culpa incidunt ab facere a modi provident optio nobis, minus sed enim
        sint dolores eos ipsam!
      </h1>
    </div>
  );
}

export default LiveTrading;
