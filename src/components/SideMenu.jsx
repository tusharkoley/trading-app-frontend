import "../styles/Styles.scss";
import { IoIosArrowForward } from "react-icons/io";
import logo from "./logo2.png";
import { IoHomeOutline } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { FcSalesPerformance } from "react-icons/fc";
import { SiSimpleanalytics } from "react-icons/si";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdOutlineLogout } from "react-icons/md";
import { FcLike } from "react-icons/fc";
import { MdDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
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
          <IoIosArrowForward className="toggle" />
        </div>
      </div>
    </header>
  );
}

const NavLink = ({ icon: Icon, text, to }) => {
  if (!to) {
    return (
      <li className="nav-link">
        {Icon && <Icon className="icon" />}
        <span className="text nav-text">{text}</span>
      </li>
    );
  }

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
      <NavLink icon={MdOutlineLogout} text={"Logout"} />

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
          <li className="search-box">
            <div>
              <IoSearch className="icon" />
              <span>
                <input type="search" placeholder="Search..." />
              </span>
            </div>
          </li>

          <NavLink icon={IoHomeOutline} text={"Home"} to="/" />
          <NavLink
            icon={FcSalesPerformance}
            text={"Live Trading"}
            to="/trading"
          />
          <NavLink
            icon={SiSimpleanalytics}
            text={"Industry Ranking"}
            to="/industry-ranking"
          />
          <NavLink icon={FaRegEdit} text={"Company Admin"} to="/company-admin" />
          <NavLink icon={IoIosNotificationsOutline} text={"Notification"} />
          <NavLink icon={SiSimpleanalytics} text={"Analytics"} />
          <NavLink icon={FcLike} text={"Likes"} />
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
