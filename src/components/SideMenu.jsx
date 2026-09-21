import "../styles/Styles.scss";
import logo from "./logo2.png";
import { IoHomeOutline } from "react-icons/io5";
import { SiSimpleanalytics } from "react-icons/si";
import { MdDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
import { Link } from "react-router-dom";

import { useDarkMode } from "../DarkModeContext";

import "bootstrap/dist/css/bootstrap.min.css";

function SidHeader() {
  return (
    <header>
      <div className="image-text">
        <span className="image">
          <img src={logo} alt="logo" />
        </span>

        <div className="text header-text">
          <span className="name">TradeZen</span>
          <span className="profssion">AI generated Trading System</span>
        </div>
      </div>
    </header>
  );
}

const NavLink = ({ icon: Icon, text, to }) => {
  return (
    <li className={`nav-link`}>
      <Link to={to}>
        {Icon && <Icon className="icon" />}
        <span className="text nav-text">{text}</span>
      </Link>
    </li>
  );
};

function BottomContent({ isDarkMode, toggleTheme }) {
  return (
    <div className="bottom-content">

      <li className="mode">
        <div className="moon-sun">
          {isDarkMode ? (
            <MdOutlineLightMode className="icon sun" />
          ) : (
            <MdDarkMode className="icon moon" />
          )}
        </div>
        <span className="text mode-text">
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </span>
        <button
          type="button"
          className={`toggle-switch ${isDarkMode ? "is-dark" : ""}`}
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          aria-pressed={isDarkMode}
        >
          <span className="switch"></span>
        </button>
      </li>
    </div>
  );
}

function SideMenuBar({ isDarkMode, toggleTheme }) {
  return (
    <div className="menu-bar container">
      <div className="menu">
        <ul className="menu-link">
          <NavLink icon={IoHomeOutline} text={"Home"} to="/" />
          <NavLink
            icon={SiSimpleanalytics}
            text={"Industry Ranking"}
            to="/industry-ranking"
          />
        </ul>
      </div>

      <BottomContent isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </div>
  );
}

function SideMenu() {
  const { isDarkMode, toggleTheme } = useDarkMode();

  return (
    <nav className={`sidebar ${isDarkMode ? "dark-mode" : ""}`}>
      <SidHeader />
      <SideMenuBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </nav>
  );
}

export default SideMenu;
