// src/services/authService.ts
type LogoutFunction = () => void;

let logoutFn: LogoutFunction | null = null;

export const setLogoutFunction = (fn: LogoutFunction) => {
  logoutFn = fn;
};

export const logout = () => {
  if (logoutFn) {
    logoutFn();
  } else {
    console.warn("Logout function is not set.");
  }
};
