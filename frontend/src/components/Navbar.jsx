import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
        return (
        <nav className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                     💪 PulseTrack AI
                </Link>
                
                <div className="flex items-center gap-4">
                    
                    {/* ✅ DARK MODE TOGGLE BUTTON (Yahan add kiya) */}
                    <button 
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        title="Toggle Theme"
                    >
                        {theme === 'light' ? (
                            // Moon Icon (Dark mode karne ke liye)
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-700 dark:text-gray-200">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                            </svg>
                        ) : (
                            // Sun Icon (Light mode karne ke liye)
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                            </svg>
                        )}
                    </button>

                    {/* Auth Links (Inme dark: classes add ki hain) */}
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors">
                                Dashboard
                            </Link>
                            <span className="text-gray-600 dark:text-gray-300 hidden sm:inline">
                                Hi, {user?.name}!
                            </span>
                            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors">
                                Login
                            </Link>
                            <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}    

export default Navbar;