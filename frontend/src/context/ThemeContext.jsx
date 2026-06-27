import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(
        () => localStorage.getItem('theme') || 'light'
    );

    useEffect(() => {
        console.log("🎨 Theme Effect Running. Current theme:", theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        console.log("👆 Toggle Button Clicked! Current theme:", theme);
        const newTheme = theme === 'light' ? 'dark' : 'light';
        console.log("🔄 Setting new theme to:", newTheme);
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);