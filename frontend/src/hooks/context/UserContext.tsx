import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Cookies from "js-cookie";
import { setLogoutFunction } from "@/services/auth/authService";

// Define the context type
interface UserContextType {
  token: string | null;
  loginUser: (token: string) => void;
  logoutUser: () => void;
  // fetchUser: () => void;
  refreshToken: () => void;
}

// Create the UserContext
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to use the UserContext
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Define props for UserProvider
interface UserProviderProps {
  children: ReactNode;
}

// UserProvider component
export const UserProvider = ({ children }: UserProviderProps) => {
  const [token, setToken] = useState<string | null>(() => {
    return Cookies.get("token") || null;
  });

  const loginUser = (userToken: string) => {
    setToken(userToken);

    const expirationDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    Cookies.set("token", userToken, {
      expires: expirationDate,
      secure: true,
      sameSite: "strict",
    });
  };

  //adjust logout
  const logoutUser = () => {
    setToken(null);
    Cookies.remove("user");
    Cookies.remove("token");
  };

  // Function to refresh the token's lifetime
  const refreshToken = () => {
    const currentToken = Cookies.get("token");
    if (currentToken) {
      const newExpirationDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      Cookies.set("token", currentToken, {
        expires: newExpirationDate,
        secure: true,
        sameSite: "strict",
      });
      console.log("Token lifetime refreshed");
    }
  };

  useEffect(() => {
    setLogoutFunction(logoutUser);
  }, []);

  return (
    <UserContext.Provider
      value={{ token, loginUser, logoutUser, refreshToken }}
    >
      {children}
    </UserContext.Provider>
  );
};
