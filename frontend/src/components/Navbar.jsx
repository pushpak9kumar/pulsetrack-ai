import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

const AVATARS = [
    { id: 1, gradient: 'from-blue-500 to-purple-600', emoji: '👤' },
    { id: 2, gradient: 'from-pink-500 to-rose-600', emoji: '🦸' },
    { id: 3, gradient: 'from-green-500 to-emerald-600', emoji: '🏃' },
    { id: 4, gradient: 'from-orange-500 to-red-600', emoji: '🔥' },
    { id: 5, gradient: 'from-indigo-500 to-blue-600', emoji: '💪' },
    { id: 6, gradient: 'from-yellow-500 to-orange-600', emoji: '🏆' },
];

const getLevelBadge = (level) => {
    if (level >= 20) return { title: 'Legend', icon: '👑', color: 'from-yellow-400 to-orange-500' };
    if (level >= 10) return { title: 'Beast', icon: '🦍', color: 'from-red-500 to-pink-600' };
    if (level >= 5) return { title: 'Rising Star', icon: '⭐', color: 'from-purple-500 to-blue-600' };
    return { title: 'Beginner', icon: '🌱', color: 'from-green-500 to-emerald-600' };
};

const calculateXP = (workouts) => {
    const intensityMap = {
        'running': 2, 'run': 2, 'cycling': 2, 'cycle': 2,
        'swimming': 2, 'swim': 2, 'gym': 1.5, 'weights': 1.5,
        'weightlifting': 1.5, 'yoga': 1, 'walking': 1, 'walk': 1,
    };
    
    if (!workouts) return 0;
    return workouts.reduce((total, workout) => {
        const type = workout.type.toLowerCase().trim();
        const intensity = intensityMap[type] || 1.5;
        return total + Math.floor(Number(workout.duration) * intensity);
    }, 0);
};

const calculateLevel = (totalXP) => {
    return Math.floor(Math.sqrt(totalXP / 50)) + 1;
};

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [goalHistory, setGoalHistory] = useState([]);
    const [userWorkouts, setUserWorkouts] = useState([]);
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchGoalHistory = async () => {
            if (isAuthenticated) {
                try {
                    const response = await api.get('/users/goal/history');
                    setGoalHistory(response.data);
                } catch (error) {
                    console.error('Failed to fetch goal history:', error);
                }
            }
        };
        
        fetchGoalHistory();
    }, [isAuthenticated]);

    useEffect(() => {
        const fetchWorkouts = async () => {
            if (isAuthenticated) {
                try {
                    const response = await api.get('/workouts');
                    let fetchedWorkouts = [];
                    if (Array.isArray(response.data)) {
                        fetchedWorkouts = response.data;
                    } else if (response.data && Array.isArray(response.data.workouts)) {
                        fetchedWorkouts = response.data.workouts;
                    } else if (response.data && Array.isArray(response.data.data)) {
                        fetchedWorkouts = response.data.data;
                    }
                    setUserWorkouts(fetchedWorkouts);
                } catch (error) {
                    console.error('Failed to fetch workouts:', error);
                }
            }
        };
        fetchWorkouts();
    }, [isAuthenticated]);

    const currentAvatar = AVATARS.find(a => a.id === user?.avatar) || AVATARS[0];
    const totalXP = calculateXP(userWorkouts);
    const level = calculateLevel(totalXP);
    const levelBadge = getLevelBadge(level);

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    💪 PulseTrack AI
                </Link>
                
                <div className="flex items-center gap-2 sm:gap-4">
                    <button 
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                        title="Toggle Theme"
                    >
                        {theme === 'light' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-700 dark:text-gray-200">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                            </svg>
                        )}
                    </button>

                    {isAuthenticated && user ? (
                        <>
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700 dark:text-gray-200">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            </button>

                            {/* Desktop Avatar */}
                            <div className="hidden lg:block relative" ref={dropdownRef}>
                                <button 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 focus:outline-none"
                                >
                                    {user.avatarUrl ? (
                                        <img 
                                            src={`http://localhost:5000${user.avatarUrl}`} 
                                            alt="User avatar"
                                            className="w-9 h-9 rounded-full object-cover shadow-md hover:shadow-lg transition"
                                        />
                                    ) : (
                                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${currentAvatar.gradient} flex items-center justify-center text-white text-lg shadow-md hover:shadow-lg transition`}>
                                            {currentAvatar.emoji}
                                        </div>
                                    )}
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                                        <div className="px-4 py-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                            <div className="flex items-center gap-3">
                                                {user.avatarUrl ? (
                                                    <img 
                                                        src={`http://localhost:5000${user.avatarUrl}`} 
                                                        alt="User avatar"
                                                        className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                                                    />
                                                ) : (
                                                    <div className={`w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl`}>
                                                        {currentAvatar.emoji}
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold truncate">{user.name}</p>
                                                    <p className="text-xs opacity-90 truncate">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Level</p>
                                                    <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{level}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">Total XP</p>
                                                    <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{totalXP}</p>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${levelBadge.color} text-white text-xs font-semibold flex items-center gap-1`}>
                                                    <span>{levelBadge.icon}</span>
                                                    <span>{levelBadge.title}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {goalHistory.length > 0 && (
                                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">🏆 Goal History</p>
                                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                                    {goalHistory.slice(0, 5).map((goal, index) => (
                                                        <div key={goal.id} className="flex items-center justify-between text-xs">
                                                            <span className="text-gray-600 dark:text-gray-300">
                                                                {goal.targetValue} mins
                                                            </span>
                                                            <span className="text-gray-400 dark:text-gray-500">
                                                                {new Date(goal.completedAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="py-1">
                                            <button 
                                                onClick={() => {
                                                    navigate('/edit-profile');
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                </svg>
                                                Edit Profile
                                            </button>

                                            <button 
                                                onClick={() => {
                                                    navigate('/achievements');
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 00-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                                                </svg>
                                                Achievements
                                            </button>

                                            <button 
                                                onClick={() => {
                                                    navigate('/dashboard');
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                                </svg>
                                                Dashboard
                                            </button>

                                            <button 
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                                </svg>
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu */}
                            {isMobileMenuOpen && (
                                <div className="lg:hidden absolute top-16 right-4 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50" ref={mobileMenuRef}>
                                    <div className="px-4 py-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                        <div className="flex items-center gap-3">
                                            {user.avatarUrl ? (
                                                <img 
                                                    src={`http://localhost:5000${user.avatarUrl}`} 
                                                    alt="User avatar"
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                                                />
                                            ) : (
                                                <div className={`w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl`}>
                                                    {currentAvatar.emoji}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold truncate">{user.name}</p>
                                                <p className="text-xs opacity-90 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Level</p>
                                                <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{level}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Total XP</p>
                                                <p className="text-lg font-bold text-gray-800 dark:text-gray-100">{totalXP}</p>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${levelBadge.color} text-white text-xs font-semibold flex items-center gap-1`}>
                                                <span>{levelBadge.icon}</span>
                                                <span>{levelBadge.title}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="py-1">
                                        <button 
                                            onClick={() => {
                                                navigate('/edit-profile');
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                            Edit Profile
                                        </button>

                                        <button 
                                            onClick={() => {
                                                navigate('/achievements');
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 00-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                                            </svg>
                                            Achievements
                                        </button>

                                        <button 
                                            onClick={() => {
                                                navigate('/dashboard');
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                            </svg>
                                            Dashboard
                                        </button>

                                        <button 
                                            onClick={() => {
                                                handleLogout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors text-sm sm:text-base">
                                Login
                            </Link>
                            <Link to="/register" className="bg-blue-500 text-white px-3 py-2 sm:px-4 rounded-lg hover:bg-blue-600 transition text-sm sm:text-base">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;