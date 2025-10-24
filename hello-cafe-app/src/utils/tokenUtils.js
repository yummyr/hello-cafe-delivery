
// Helper function to decode JWT and check expiration
export function isTokenExpired(token) {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    const now = Date.now();

    // Token is expired or will expire in next 5 minutes
    return exp < now + 5 * 60 * 1000;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return true;
  }
}