import { createContext } from "react";
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase.js'

export const AuthContext = createContext('');

export default function AuthProvider({ children }) {
    const authState = useAuthState(auth)
    return (
        <AuthContext.Provider value={authState}>
            {children}
        </AuthContext.Provider>
    )
}