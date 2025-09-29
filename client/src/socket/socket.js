import { io } from "socket.io-client";

// Determine the server URL based on the environment
const getServerUrl = () => {
  // Use environment variable if available (works for both build-time and runtime)
  if (
    typeof process.env.REACT_APP_SERVER_URL !== "undefined" &&
    process.env.REACT_APP_SERVER_URL
  ) {
    return process.env.REACT_APP_SERVER_URL;
  }

  // Fallback for local development
  return "https://tetrizz-production.up.railway.app";
};

export const socket = io(getServerUrl(), {
  autoConnect: false,
  withCredentials: true,
});
