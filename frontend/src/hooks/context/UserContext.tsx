import {createContext, useContext, useState, ReactNode} from "react";
import Cookies from "js-cookie";

// Define the User interface
export default interface User {
    name: string;
}

// Define the context type
interface UserContextType {
    user: User | null;
    token: string | null;
    loginUser: (userData: User, token: string) => void;
    logoutUser: () => void;
    // fetchUser: () => void;
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
export const UserProvider = ({children}: UserProviderProps) => {
    const [user, setUser] = useState<User | null>(() => {
        // Retrieve user data from cookies if available
        const savedUser = Cookies.get("user");
        return savedUser ? (JSON.parse(savedUser) as User) : null;
    });

    const [token, setToken] = useState<string | null>(() => {
        return Cookies.get("token") || null;
    });

    const loginUser = (userData: User, userToken: string) => {
        setUser(userData);
        setToken(userToken);
        Cookies.set("user", JSON.stringify(userData), {expires: 1});
        Cookies.set("token", userToken, {expires: 1, secure: true, sameSite: "strict"});
    };

    //adjust logout
    const logoutUser = () => {
        setUser(null);
        setToken(null);
        Cookies.remove("user");
        Cookies.remove("token");
    };

    // // Optionally, fetch user data on mount if token exists
    // const fetchUser = async () => {
    //     if (token && !user) {
    //         try {
    //             const response = await fetch(`${ENV.API_URL}/api/user`, {
    //                 method: "GET",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     Accept: "application/json",
    //                 },
    //                 credentials: "include", // Include cookies
    //             });
    //
    //             if (response.ok) {
    //                 const data = await response.json();
    //                 setUser({
    //                     name: data.name,
    //                 });
    //             } else {
    //                 // If token is invalid or expired, perform logout
    //                 logoutUser();
    //             }
    //         } catch (error) {
    //             console.error("Error fetching user data:", error);
    //             logoutUser();
    //         }
    //     }
    // };

    return (
        <UserContext.Provider value={{user, token, loginUser, logoutUser}}>
            {children}
        </UserContext.Provider>
    );
};
