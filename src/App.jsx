import { useState } from "react";

import SideMenu from "./components/SideMenu";
import { useEffect } from "react";
import "./styles/Styles.scss";
import axios from "axios";
import ServerURL from "./data/config";

import { Routes, Route, Link, useMatch } from "react-router-dom";
import { DarkModeProvider } from "./DarkModeContext";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PasswordReset from "./pages/PasswordReset";

import StockDetails from "./pages/Home/StockDetails";
import LiveTrading from "./pages/LiveTrading";
import IndustryRanking from "./pages/IndustryRanking";
// import { useDarkMode } from "./DarkModeContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

function App() {
  const isStockDetailsPage = useMatch("/stockDetails/:id");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [lastLogin, setLastLogin] = useState(localStorage.getItem("lastLogin") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    setEmail("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const emailValue = event.target.email.value;
    setEmail(emailValue);
    const password = event.target.password.value;

    try {
      console.log("****** URL");
      console.log(`${ServerURL}/users/login/`);

      const response = await axios.post(`${ServerURL}/users/login/`, {
        email: emailValue,
        password,
      });
      // The response.data will contain the data from the server (e.g., token)
      const token = response.data.access;
      localStorage.setItem("token", token); // Store the token
      setIsLoggedIn(true);
      const loginTime = new Date().toLocaleString();
      localStorage.setItem("email", emailValue);
      localStorage.setItem("lastLogin", loginTime);
      setLastLogin(loginTime);
      setIsLoginModalOpen(false);
      setLoginError(null);
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setLoginError(error.response.data.detail || error.response.data.message || error.response.statusText); // Get error message from server
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      setLoginError(null);
    }
  }, []);

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
                  <Link className="btn btn-link" to="/signup">Sign up</Link>
                  <button
                    className="btn btn-primary"
                    onClick={() => { setLoginError(null); setIsLoginModalOpen(true); }}
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
                      <p className="error-message" role="alert">{loginError}</p>
                    )}{" "}
                    {/* Display error */}
                    <form onSubmit={handleLogin}>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
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
                    <Link
                      className="mt-3"
                      to={`/forgot-password?email=${encodeURIComponent(email)}`}
                      onClick={() => setIsLoginModalOpen(false)}
                    >
                      {loginError ? "Trouble signing in? Reset your password" : "Forgot your password?"}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
          <SideMenu />
          <div className={`${isStockDetailsPage ? "container-fluid" : "container"} overflow-auto right`}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<PasswordReset key="request" />} />
              <Route path="/reset-password/:uid/:token" element={<PasswordReset key="confirm" />} />
              <Route path="/stockDetails/:id" element={<StockDetails />} />
              <Route path="/trading" element={<LiveTrading />} />
              <Route path="/industry-ranking" element={<IndustryRanking />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </div>
      </QueryClientProvider>
    </DarkModeProvider>
  );
}

export default App;
