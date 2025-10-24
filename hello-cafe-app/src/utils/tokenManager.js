import api from "../api";
const TOKEN_REFRESH_INTERVAL = 25 * 60 * 1000; // 25 minutes (if token expires in 30 min)
const ACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes of inactivity

class TokenManager {
  constructor() {
    this.refreshTimer = null;
    this.activityTimer = null;
    this.lastActivity = Date.now();
    this.isRefreshing = false;
  }

  // Initialize token refresh mechanism
  init(onTokenExpired) {
    this.onTokenExpired = onTokenExpired;
    this.setupActivityListeners();
    this.startRefreshTimer();
    this.startActivityMonitor();
    console.log("TokenManager initialized");
  }

  // Setup activity listeners
  setupActivityListeners() {
    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];

    events.forEach((event) => {
      document.addEventListener(event, this.updateActivity.bind(this), true);
    });
  }

  //  Update last activity time
  updateActivity() {
    this.lastActivity = Date.now();
  }

  // Start periodic token refresh
  startRefreshTimer() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

    this.refreshTimer = setInterval(async () => {
      const token = localStorage.getItem("token");
      if (token && !this.isRefreshing) {
        await this.refreshToken();
      }
    }, TOKEN_REFRESH_INTERVAL);
  }
  // Monitor user activity
  startActivityMonitor() {
    if (this.activityTimer) {
      clearInterval(this.activityTimer);
    }

    this.activityTimer = setInterval(() => {
      const inactiveDuration = Date.now() - this.lastActivity;

      if (inactiveDuration > ACTIVITY_TIMEOUT) {
        console.log("User inactive for too long, logging out...");
        this.cleanup();
        if (this.onTokenExpired) {
          this.onTokenExpired();
        }
      }
    }, 60 * 1000); // Check every minute
  }

  // Refresh token
  async refreshToken() {
    if (this.isRefreshing) {
      console.log("Token refresh already in progress");
      return;
    }

    this.isRefreshing = true;
    console.log("Attempting to refresh token...");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      // Call your refresh token endpoint
      const response = await api.post(
        "/auth/refresh",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 1 && response.data.data.token) {
        const newToken = response.data.data.token;
        localStorage.setItem("token", newToken);
        console.log("Token refreshed successfully");
        return true;
      } else {
        throw new Error("Invalid refresh response");
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);

      // If refresh fails, assume token is invalid
      this.cleanup();
      if (this.onTokenExpired) {
        this.onTokenExpired();
      }
      return false;
    } finally {
      this.isRefreshing = false;
    }
  }
  // Cleanup timers and listeners
  cleanup() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }

    if (this.activityTimer) {
      clearInterval(this.activityTimer);
      this.activityTimer = null;
    }

    const events = ["mousedown", "keydown", "scroll", "touchstart", "click"];
    events.forEach((event) => {
      document.removeEventListener(event, this.updateActivity.bind(this), true);
    });

    console.log("TokenManager cleaned up");
  }

  // Manual token validation check
  async validateToken() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return false;
      }

      // Try a simple API call to validate token
      const response = await api.get("/shop/status");
      return response.data.code === 1;
    } catch (error) {
      console.error("Token validation failed:", error);
      return false;
    }
  }
}

// Export singleton instance
export const tokenManager = new TokenManager();


export default tokenManager;
