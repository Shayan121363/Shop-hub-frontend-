import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {setCredentials,logout,selectCurrentUser,selectCurrentToken,selectIsAuthenticated} from "../auth/authSlice";
import {User,Mail,Shield,LogOut,RefreshCw,AlertCircle,CheckCircle} from "lucide-react";

const Profile = ({ onUserDataUpdate, onLogout }) => {
  const dispatch = useDispatch();
  

  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [tokenInfo, setTokenInfo] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const tokenValue = typeof token === 'string' ? token : JSON.stringify(token);
        setTokenInfo({
          exists: true,
          preview: tokenValue.substring(0, 20) + "...",
          length: tokenValue.length
        });
      } catch (error) {
        setTokenInfo({ exists: false });
      }
    } else {
      setTokenInfo({ exists: false });
    }
  }, [token]);

  const getProfileData = async () => {
    if (!token) {
      setMessage({
        type: "error",
        text: "No authentication token found. Please login first."
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const tokenValue = typeof token === 'string' ? token : JSON.parse(localStorage.getItem("token") || '""');
      const response = await axios.get(
        "https://api.escuelajs.co/api/v1/auth/profile",
        {
          headers: {
            Authorization: `Bearer ${tokenValue}`
          }
        }
      );

      const userData = response.data;
      
    
      dispatch(setCredentials({ user: userData, token: tokenValue }));
      
      setMessage({
        type: "success",
        text: "Profile data loaded successfully!"
      });

      if (onUserDataUpdate) {
        onUserDataUpdate(userData);
      }

      console.log("Profile data", response);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to load profile. Token may be expired."
      });
      console.log("Error occurred", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    
    dispatch(logout());
    
    setTokenInfo(null);
    setMessage({ type: "success", text: "Logged out successfully!" });

 
    if (onLogout) {
      setTimeout(() => {
        onLogout();
      }, 1000);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-icon">
            <User size={32} />
          </div>
          <h2>Account Profile</h2>
          <p>Manage your account information and authentication</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.type === "error" && <AlertCircle size={16} />}
            {message.type === "success" && <CheckCircle size={16} />}
            <span>{message.text}</span>
          </div>
        )}

        {tokenInfo && (
          <div className="token-info">
            <h4> Authentication Status</h4>
            {tokenInfo.exists ? (
              <div className="token-details">
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="status-active">Authenticated</span>
                </p>
                {/* <p>
                  <strong>Token:</strong> <code>{tokenInfo.preview}</code>
                </p>
                <p>
                  <strong>Token Length:</strong> {tokenInfo.length} characters
                </p> */}
              </div>
            ) : (
              <div className="token-details">
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="status-inactive">Not Authenticated</span>
                </p>
              </div>
            )}
          </div>
        )}

        <div className="profile-actions">
          <button
            className={`action-btn primary ${isLoading ? "loading" : ""}`}
            onClick={getProfileData}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Loading...
              </>
            ) : (
              <>
                <RefreshCw size={18} />
                Get Profile Data
              </>
            )}
          </button>

          <button
            className="action-btn secondary"
            onClick={handleLogout}
            disabled={isLoading}
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>

        {user && (
          <div className="user-data">
            <h4> Profile Information</h4>
            <div className="data-grid">
              <div className="data-item">
                <div className="data-content">
                  <label>Full Name:</label>
                  <span>{user?.name || "N/A"}</span>
                </div>
              </div>

              <div className="data-item">
                <div className="data-content">
                  <label>Email :</label>
                  <span>{user?.email || "N/A"}</span>
                </div>
              </div>

              <div className="data-item">
                <div className="data-content">
                  <label>Role:</label>
                  <span className="role-badge">
                    {user?.role || "N/A"}
                  </span>
                </div>
              </div>
              <br />

              {user?.id && (
                <div className="data-item">
                  <div className="data-content">
                    <label>User ID:</label>
                    <span>{user.id}</span>
                  </div>
                </div>
              )}

              <div className="data-item">
                <div className="data-content">
                  <label>Authentication:</label>
                  <span className={`auth-status ${isAuthenticated ? 'authenticated' : 'not-authenticated'}`}>
                    {isAuthenticated ? ' ✔Authenticated' : ' ❌Not Authenticated'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}    
      </div>  
    </div>
  );
};

export default Profile;