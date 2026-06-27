import { createContext, useState, useEffect, useContext } from 'react';
//Context banao(global state container)
const AuthContext = createContext();

//Provider component (sabko state provide karega)
export const AuthProvider = ({ children }) => {
    //user state(nul  = not logged in, object = logged in)
    const [user, setUser] = useState(null);
    const[token, setToken] = useState(localStorage.getItem('token') || '');
    const[loading, setLoading] = useState(true);

    //App start hone pe check karo ki token localStorage me hai ya nahi 
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if(storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false); //Loading khatam
    }, []);

    //Login function(backend se token aaya toh call hoga)
    const login = (userData, tokenValue) => {

        console.log("Login function called!"); // ✅ Ye line add kar
    console.log("User data:", userData);
    console.log("Token value:", tokenValue);
    
        setUser(userData);
        setToken(tokenValue);
        localStorage.setItem('token', tokenValue);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    //Logout function
    const logout = () => {
        setUser(null);
        setToken('');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    //Sab values provide karo children ko
    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            loading,
            isAuthenticated: !!user //Boolean - logged in or not
        }}>
            {children}
        </AuthContext.Provider>
    );
};

//Custom hook (for easy access)
export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};