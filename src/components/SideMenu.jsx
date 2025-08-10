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

const NavLink = ({ icon: Icon, text, href }) => {
  return (
    <li className={`nav-link`}>
      <a href={href}>
        {Icon && <Icon className="icon" />}
        <span className="text nav-text">{text}</span>
      </a>
    </li>
  );
};

function BottomContent({ isDarkMode, toggleTheme }) {
  return (
    <div className="bottom-content">
      <NavLink icon={MdOutlineLogout} text={"Logout"} link={"#"} />

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
        <div
          className={`toggle-switch ${isDarkMode ? "dark" : ""}`}
          onClick={toggleTheme}
        >
          <span className={`switch ${isDarkMode ? "dark" : ""}`}></span>
        </div>
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
            <a href="#">
              <IoSearch className="icon" />
              <span>
                <input type="search" placeholder="Search..." />
              </span>
            </a>
          </li>

          <NavLink icon={IoHomeOutline} text={"Home"} href="/" />
          <NavLink
            icon={FcSalesPerformance}
            text={"Live Trading"}
            href="/trading"
          />
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
  const htmlElement = document.querySelector("html");

  if (isDarkMode) {
    htmlElement.setAttribute("data-bs-theme", "dark");
  } else {
    htmlElement.removeAttribute("data-bs-theme");
  }

  return (
    <nav className={`sidebar ${isDarkMode ? "dark-mode" : ""}`}>
      <SidHeader />
      <SideMenuBar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
    </nav>
  );
}

export default SideMenu;
