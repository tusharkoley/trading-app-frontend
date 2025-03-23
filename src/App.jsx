import { useState } from "react";

import SideMenu from "./components/SideMenu";
import { data, useParams } from "react-router-dom";
import { useEffect } from "react";
import "./styles/Styles.scss";
import { SiReactrouter } from "react-icons/si";
import { MdRoundaboutLeft } from "react-icons/md";
import axios from "axios";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { DarkModeProvider } from "./DarkModeContext";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

import Home from "./pages/Home";
import Login from "./pages/Login";

import StockDetails from "./pages/Home/StockDetails";
import LiveTrading from "./pages/LiveTrading";
// import { useDarkMode } from "./DarkModeContext";
const ServerURL = "http://localhost:8000/";

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [lastLogin, setLastLogin] = useState("20th Jan, 2025");
  const [email, setEmail] = useState("");

  const queryClient = new QueryClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(!isLoggedIn);
    console.log("Logged out");
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    setEmail(event.target.email.value);
    const password = event.target.password.value;

    try {
      console.log("****** URL");
      console.log(`${ServerURL}/users/login/`);

      const response = await axios.post(`${ServerURL}/users/login/`, {
        email,
        password,
      });
      // The response.data will contain the data from the server (e.g., token)
      const token = response.data.access;
      localStorage.setItem("token", token); // Store the token
      setIsLoggedIn(true);
      setLastLogin(new Date().toLocaleString());
      setIsLoginModalOpen(false);
      setLoginError(null);
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setLoginError(error.response.data.message || error.response.statusText); // Get error message from server
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        setLoginError("No response from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        setLoginError(error.message);
      }
    }
  };

  console.log(isLoginModalOpen);

  useEffect(() => {
    console.log("Inside Effect");
    try {
      console.log("****** URL");
      console.log(`${ServerURL}/users/login/`);

      const response = axios.post(`${ServerURL}/users/login/`, {
        email,
        password,
      });
      // The response.data will contain the data from the server (e.g., token)
      const token = response.data.access;
      localStorage.setItem("token", token); // Store the token
      setIsLoggedIn(true);
      setIsLoginModalOpen(false);
      setLoginError(null);
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        setLoginError(error.response.data.message || error.response.statusText); // Get error message from server
      } else if (error.request) {
        setLoginError("No response from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        setLoginError(error.message);
      }
    }
  });

  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <div className={`app`}>
          <div className="top-panel">
            {/* New top panel */}
            <div className="top-panel-left">
              {lastLogin && <p>Last Login: {lastLogin}</p>}
              {!lastLogin && <p>No Login Information</p>}
            </div>

            <div className="top-panel-right">
              {isLoggedIn ? (
                <>
                  {/* Fragment to group elements */}
                  <span>Logged on as {email}</span> {/* Display email */}
                  <button className="btn btn-primary" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <span>
                    New user? <a href="/signup">Sign up</a>
                  </span>
                  {/* Link to sign-up */}
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsLoginModalOpen(true)}
                  >
                    Login
                  </button>
                </>
              )}

              {isLoginModalOpen && (
                <div className="modal-main">
                  <div className="modal-content">
                    <span
                      className="modal-close"
                      onClick={() => setIsLoginModalOpen(false)}
                    >
                      &times;
                    </span>
                    <h2>
                      <b>Login</b>
                    </h2>
                    {loginError && (
                      <p className="error-message">{loginError}</p>
                    )}{" "}
                    {/* Display error */}
                    <form onSubmit={handleLogin}>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                      />
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                      />
                      <button className="btn btn-primary" type="submit">
                        Login
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
          <SideMenu />
          <div className={`container overflow-auto right`}>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/stockDetails/:id" element={<StockDetails />} />
                <Route path="/trading" element={<LiveTrading />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </Router>
          </div>
        </div>
      </QueryClientProvider>
    </DarkModeProvider>
  );
}

export default App;
