import { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from 'react-router';
import type { ReactNode } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { UserService } from "../Services/UserService";
import { clearTokens } from "../Utils/tokenStorage";

interface AuthProviderProps {
    children: ReactNode;
}

interface AuthContext {
    user: any;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    errorMessage: string;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider = function ({ children }: AuthProviderProps) {
    const [user, setUser] = useLocalStorage("user", null);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string>();

    // call this function when you want to authenticate the user
    async function login(email: string, password: string) {
        const loginResult = await UserService.login(email, password);
        if (loginResult.success) {
            setUser({ email });
            navigate("/");
        }
        else {
            setErrorMessage(loginResult.errorMessage);
        }
    }

    // call this function to sign out logged in user
    async function logout() {
        await UserService.logout();
        clearTokens();
        setUser(null);
        navigate("/login", { replace: true });
    }

    const value = useMemo(
        () => ({
            user,
            login,
            logout,
            errorMessage,
        } as AuthContext),
        [user, errorMessage]
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
    const auth = useContext(AuthContext);
    if (!auth) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return auth;
};
