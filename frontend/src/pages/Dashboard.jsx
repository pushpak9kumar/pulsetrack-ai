import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import toast from 'react-hot-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import AIChatWidget from '../components/AIChatWidget';

const Dashboard = () => {
    const { user } = useAuth();
    const location = useLocation();

    // 1. STATE MANAGEMENT
    const [workouts, setWorkouts] = useState([]);
    const [loadingWorkouts, setLoadingWorkouts] = useState(true);

    // GOAL STATES 
   const [userGoal, setUserGoal] = useState({ 
    targetValue: 100, 
    currentValue: 0, 
    title: "Weekly Goal" 
});
const [goalHistory, setGoalHistory] = useState([]); 
const [showGoalHistory, setShowGoalHistory] = useState(false); 

const [goalInput, setGoalInput] = useState('');

    //States for AI COACH
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [aiFeedback, setAiFeedback] = useState('');
    const [loadingAI, setLoadingAI] = useState(false);
    const [showAIModal, setShowAIModal] = useState(false);

    //States for BMI 
    const [weightInput, setWeightInput] = useState('');
    const [heightInput, setHeightInput] = useState('');
    const [weightHistory, setWeightHistory] = useState([]);
    const [currentBmi, setCurrentBmi] = useState(null);

    // 2. DATA FETCHING FUNCTION
    const fetchWorkouts = async () => {
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

            setWorkouts(fetchedWorkouts);
        } catch (error) {
            console.error("Failed to fetch workouts:", error);
            setWorkouts([]);
        } finally {
            setLoadingWorkouts(false);
        }
    };

   const fetchUserGoal = async () => {
    try {
        const response = await api.get('/users/goal', {
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        
        console.log("📥 Fetched Goal from Backend:", response.data);
        
        if (response.data.achieved) {
            toast.success('🎉 Weekly Goal Achieved! Great job!');
        }
        
        setUserGoal({
            targetValue: response.data.targetValue,
            currentValue: response.data.currentValue,
            title: response.data.title
        });
        setGoalInput(response.data.targetValue);
    } catch (error) {
        console.error("Failed to fetch goal:", error);
    }
};

   const fetchGoalHistory = async () => {
    try {
        const response = await api.get('/users/goal/history');
        setGoalHistory(response.data);
    } catch (error) {
        console.error("Failed to fetch goal history:", error);
        // Set empty array as fallback
        setGoalHistory([]);
    }
};

    const fetchWeightHistory = async () => {
        try {
            const response = await api.get('/weight/history');
            setWeightHistory(response.data.history);
            setCurrentBmi(response.data.currentBmi);
        } catch(error) {
            console.error("Failed to fetch weight history:", error);
        }
    };

    // 3. USE EFFECT
    useEffect(() => {
        fetchWorkouts();
        fetchUserGoal();
        fetchGoalHistory();
        fetchWeightHistory();
    }, []);

    useEffect(() => {
        if (location.state?.refreshDashboard) {
            fetchWorkouts();
        }
    }, [location]);

    // 4. DELETE WORKOUT FUNCTION
    const handleDelete = async (workoutId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this workout?');
        
        if (!confirmDelete) return;

        try {
            await api.delete(`/workouts/${workoutId}`);
            setWorkouts(workouts.filter(workout => workout._id !== workoutId));
            toast.success('Workout deleted successfully! 🗑️');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete workout');
        }
    };

    // CHARTS COLORS
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

    // PIE CHART DATA
    const getActivityDistribution = () => {
        const activityMap = {};
        
        workouts.forEach(workout => {
            const rawType = workout.type.trim().toLowerCase();
            
            if (!activityMap[rawType]) {
                const displayName = rawType.charAt(0).toUpperCase() + rawType.slice(1);
                activityMap[rawType] = { name: displayName, value: 0, minutes: 0 };
            }
            
            activityMap[rawType].value += 1;
            activityMap[rawType].minutes += Number(workout.duration);
        });
        
        return Object.values(activityMap);
    };

    const handleWeightSubmit = async (e) => {
        e.preventDefault();
        if (!weightInput || !heightInput) return;

        try {
            const response = await api.post('/weight/log', {
                weight: weightInput,
                heightCm: heightInput
            });
            setCurrentBmi(response.data.currentBmi);
            setWeightHistory(response.data.history);
            setWeightInput('');
            toast.success('Weight logged! 📉');
        } catch (error) {
            toast.error('Failed to log weight');
        }
    };

    // BAR CHART DATA
    const getWeeklyActivity = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weekData = days.map(day => ({ day, minutes: 0, workouts: 0 }));
        
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        
        workouts.forEach(workout => {
            const workoutDate = new Date(workout.createdAt);
            if (workoutDate >= sevenDaysAgo) {
                const dayIndex = workoutDate.getDay();
                weekData[dayIndex].minutes += Number(workout.duration);
                weekData[dayIndex].workouts += 1;
            }
        });
        return weekData;
    };

    // STREAK CALCULATOR LOGIC
    const calculateStreak = (workouts) => {
        if (workouts.length === 0) return 0;

        const dates = workouts.map(w => {
            const d = new Date(w.createdAt);
            d.setHours(0, 0, 0, 0);
            return d.getTime();
        });

        const uniqueDates = [...new Set(dates)].sort((a, b) => b - a);

        const today = new Date(); today.setHours(0, 0, 0, 0);
        if (uniqueDates[0] < today.getTime() - 86400000) {
            return 0;
        }

        let streak = 0;
        let expectedDate = uniqueDates[0];

        for (let i = 0; i < uniqueDates.length; i++) {
            if (uniqueDates[i] === expectedDate) {
                streak++;
                expectedDate -= 86400000;
            } else if (uniqueDates[i] < expectedDate) {
                break;
            }
        }
        return streak;
    };

    // GOAL UPDATE FUNCTION 
    const handleGoalUpdate = async (e) => {
    e.preventDefault();
    if (!goalInput || goalInput <= 0) {
        toast.error('Please enter a valid goal');
        return;
    }
    
    try {
        await api.put('/users/goal', { targetValue: Number(goalInput) });
        toast.success('Goal updated successfully! 🎯');
        setGoalInput('');
        fetchUserGoal(); // Refresh goal data
    } catch (error) {
        toast.error('Failed to update goal');
        console.error(error);
    }
};

    // Get AI Feedback
    const handleGetAIFeedback = async (workout) => {
        console.log("🤖 AI Button Clicked!");
        console.log("Workout data:", workout);
        
        setSelectedWorkout(workout);
        setShowAIModal(true);
        setLoadingAI(true);
        setAiFeedback('');

        try {
            const response = await api.post('/ai/coach', {
                type: workout.type,
                duration: workout.duration,
                calorieBurned: workout.calories
            });
            
            console.log("✅ AI Response received:", response.data);
            setAiFeedback(response.data.aiFeedback);
        } catch (error) {
            console.error("Error response:", error.response?.data);
            setAiFeedback('Sorry, AI coach is currently unavailable. Please try again later.');
        } finally {
            setLoadingAI(false);
        }
    };

    const closeAIModal = () => {
        setShowAIModal(false);
        setSelectedWorkout(null);
        setAiFeedback('');
    };

    // 5. CALCULATIONS
    const calculateXP = (workouts) => {
    const intensityMap = {
        'running': 2,
        'run': 2,
        'cycling': 2,
        'cycle': 2,
        'swimming': 2,
        'swim': 2,
        'gym': 1.5,
        'weights': 1.5,
        'weightlifting': 1.5,
        'yoga': 1,
        'walking': 1,
        'walk': 1,
    };
    
    return workouts.reduce((total, workout) => {
        const type = workout.type.toLowerCase().trim();
        const intensity = intensityMap[type] || 1.5;
        const xp = Math.floor(Number(workout.duration) * intensity);
        return total + xp;
    }, 0);
};

const calculateLevel = (totalXP) => {
    return Math.floor(Math.sqrt(totalXP / 50)) + 1;
};

const totalMinutes = workouts.reduce((sum, w) => sum + Number(w.duration), 0);
const progressPercentage = Math.min((userGoal.currentValue / userGoal.targetValue) * 100, 100);
const totalXP = calculateXP(workouts);
const level = calculateLevel(totalXP);

    const getLevelBadge = (level) => {
    if (level >= 20) return { title: 'Legend', icon: '👑', color: 'from-yellow-400 to-orange-500' };
    if (level >= 10) return { title: 'Beast', icon: '🦍', color: 'from-red-500 to-pink-600' };
    if (level >= 5) return { title: 'Rising Star', icon: '⭐', color: 'from-purple-500 to-blue-600' };
    return { title: 'Beginner', icon: '🌱', color: 'from-green-500 to-emerald-600' };
};

const [previousLevel, setPreviousLevel] = useState(level);

useEffect(() => {
    if (level > previousLevel) {
        toast.success(`🎉 Level Up! You are now Level ${level}!`, {
            duration: 4000,
            icon: '🚀'
        });
        setPreviousLevel(level);
    }
}, [level, previousLevel]);

   // Helper function for inline markdown (bold, italic)
const formatInlineMarkdown = (text) => {
    // Bold text: **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-semibold text-gray-800 dark:text-gray-100">{part.replace(/\*\*/g, '')}</strong>;
        }
        return part;
    });
};

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Welcome Message */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6 sm:mb-8">
                    {user?.level === 1 && totalXP === 0 
                        ? `Welcome to PulseTrack AI, ${user?.name}! 🎉`
                        : `Welcome back, ${user?.name}! 💪`
                    }
                </h1>
                
                {/* Stats Cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
                    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md transition-colors duration-300">
                        <h3 className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Level</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{level}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md transition-colors duration-300">
                        <h3 className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Total XP</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">{totalXP}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md transition-colors duration-300">
                        <h3 className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">Total Workouts</h3>
                        <p className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">{workouts.length}</p>
                    </div>
                    
                    {/* STREAK CARD */}
                    <div className="bg-gradient-to-br from-orange-400 to-red-500 p-4 sm:p-6 rounded-xl shadow-md text-white">
                        <h3 className="text-white/90 text-xs sm:text-sm font-semibold">Current Streak 🔥</h3>
                        <p className="text-2xl sm:text-3xl font-bold">{calculateStreak(workouts)} Days</p>
                    </div>
                </div>
                
               {/* GOAL & PROGRESS BAR SECTION */}
<div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md mb-8 sm:mb-10 transition-colors duration-300">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">Weekly Goal Progress 🎯</h2>
        <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400">
                {userGoal.currentValue} / {userGoal.targetValue} mins
            </span>
            
            {/* Goal History Dropdown Button */}
            <button
                onClick={() => setShowGoalHistory(!showGoalHistory)}
                className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1"
                title="View Goal History"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                History
            </button>
        </div>
    </div>
    
    {/* Progress Bar */}
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 sm:h-4 mb-4">
        <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 sm:h-4 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
        ></div>
    </div>

    {/* Goal Update Form */}
    <form onSubmit={handleGoalUpdate} className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <label className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Set new goal (mins):</label>
        <input 
            type="number" 
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded px-2 py-1 w-full sm:w-24 text-sm"
        />
        <button type="submit" className="bg-blue-500 text-white px-3 py-1.5 sm:py-1 rounded text-sm hover:bg-blue-600 transition w-full sm:w-auto">
            Update
        </button>
    </form>

    {/* Goal History Dropdown */}
{showGoalHistory && (
    <div 
        onClick={() => setShowGoalHistory(false)} 
        className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
            📜 Recent Goals (Last 10)
        </h3>
        {goalHistory.length === 0 ? (
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                No completed goals yet. Keep working! 💪
            </p>
        ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
                {goalHistory.map((goal, index) => (
                    <div key={goal.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded text-xs sm:text-sm">
                        <span className="text-gray-700 dark:text-gray-200 font-medium">
                            {goal.targetValue} mins
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                            {new Date(goal.completedAt).toLocaleDateString()}
                        </span>
                    </div>
                ))}
            </div>
        )}
        <p className="text-[10px] text-gray-400 text-center mt-2 italic">Click anywhere to close</p>
    </div>
)}
</div>
                {/* CHARTS SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
                    
                    {/* Donut Chart */}
                    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md transition-colors duration-300">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Workout Distribution 🥧</h2>
                        {workouts.length === 0 ? (
                            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                                No data yet. Start logging workouts!
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={getActivityDistribution()}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        innerRadius={60}
                                        fill="#8884d8"
                                        dataKey="value"
                                        stroke="#fff"
                                        strokeWidth={2}
                                    >
                                        {getActivityDistribution().map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(value, name, props) => {
                                            return [`${props.payload.minutes} mins (${value} workouts)`, props.payload.name];
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md transition-colors duration-300">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Last 7 Days Activity 📊</h2>
                        {workouts.length === 0 ? (
                            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                                No data yet. Start logging workouts!
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={getWeeklyActivity()}>
                                    <defs>
                                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.9}/>
                                            <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.9}/>
                                        </linearGradient>
                                    </defs>
                                    
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="day" tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#6B7280' }} axisLine={false} tickLine={false} />
                                    
                                    <Tooltip 
                                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                        contentStyle={{ 
                                            backgroundColor: '#fff', 
                                            border: 'none', 
                                            borderRadius: '8px', 
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                                        }}
                                        formatter={(value) => [`${value} mins`, 'Duration']}
                                    />
                                    
                                    <Bar dataKey="minutes" fill="url(#barGradient)" radius={[10, 10, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* BODY METRICS & BMI SECTION */}
                <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md mb-8 sm:mb-10 transition-colors duration-300">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Body Metrics & BMI 📉</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        {/* Form */}
                        <div>
                            <form onSubmit={handleWeightSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">Height (cm)</label>
                                    <input 
                                        type="number" 
                                        value={heightInput}
                                        onChange={(e) => setHeightInput(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm p-2 border text-sm sm:text-base"
                                        placeholder="e.g., 175"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">Current Weight (kg)</label>
                                    <input 
                                        type="number" 
                                        value={weightInput}
                                        onChange={(e) => setWeightInput(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm p-2 border text-sm sm:text-base"
                                        placeholder="e.g., 70"
                                    />
                                </div>
                                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition text-sm sm:text-base">
                                    Log Weight
                                </button>
                            </form>
                            {currentBmi && (
                                <div className="mt-4 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Your Current BMI</p>
                                    <p className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{currentBmi}</p>
                                </div>
                            )}
                        </div>

                        {/* Line Chart */}
                        <div className="h-64">
                            {weightHistory.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                                    Log weight to see progress graph
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={weightHistory}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis 
                                            dataKey="createdAt" 
                                            tickFormatter={(str) => new Date(str).toLocaleDateString()} 
                                        />
                                        <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                                        <Tooltip 
                                            labelFormatter={(str) => new Date(str).toLocaleDateString()}
                                            formatter={(value) => [`${value} kg`, 'Weight']}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="weight" 
                                            stroke="#8B5CF6" 
                                            strokeWidth={3}
                                            dot={{ r: 5, fill: '#8B5CF6' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                </div>

                {/* Workouts List Section */}
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Your Recent Workouts 🏋️‍♂️</h2>
                
                {loadingWorkouts ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                    </div>
                ) : workouts.length === 0 ? (
                    <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl shadow-md transition-colors duration-300">
                        <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">No workouts logged yet. Start moving! 🏃‍♂️</p>
                        <Link to="/log-workout" className="mt-4 inline-block text-blue-600 dark:text-blue-400 font-semibold hover:underline text-sm sm:text-base">
                            Log your first workout
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {workouts.map((workout) => (
                            <div key={workout._id} className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition relative transition-colors duration-300">
                                
                                {/* DELETE BUTTON */}
                                <button
                                    onClick={() => handleDelete(workout._id)}
                                    className="absolute top-3 right-3 sm:top-4 sm:right-4 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 sm:p-2 rounded-full transition"
                                    title="Delete workout"
                                >
                                    🗑️
                                </button>

                                <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 capitalize pr-8">{workout.type}</h3>
                                <div className="mt-3 sm:mt-4 flex justify-between text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                                    <span>⏱️ {workout.duration} mins</span>
                                    <span>🔥 {workout.calories} cal</span>
                                </div>
                                {workout.notes && (
                                    <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic">"{workout.notes}"</p>
                                )}
                                <p className="mt-3 sm:mt-4 text-xs text-gray-400 dark:text-gray-500">
                                    {new Date(workout.createdAt).toLocaleDateString()}
                                </p>

                                {/* AI FEEDBACK BUTTON */}
                                <button
                                    onClick={() => handleGetAIFeedback(workout)}
                                    className="mt-3 sm:mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
                                >
                                    🤖 Get AI Feedback   
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Log New Workout Button */}
                <div className="flex justify-center mt-8 sm:mt-10">
                    <Link 
                        to="/log-workout" 
                        className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-lg sm:text-xl font-bold hover:shadow-2xl transition transform hover:scale-105"
                    >
                        + Log New Workout
                    </Link>
                </div>
            </div>
            
           {/* AI FEEDBACK MODAL */}
{showAIModal && (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-hidden transition-colors duration-300">
           {/* Modal Header */}
<div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 sm:p-6 text-white">
    <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0 pr-2">
            <h3 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
                🤖 AI Coach Feedback
            </h3>
            {selectedWorkout && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm">
                    <span className="font-semibold capitalize">{selectedWorkout.type}</span>
                    <span>•</span>
                    <span>{selectedWorkout.duration} mins</span>
                </div>
            )}
        </div>
        <button
            onClick={closeAIModal}
            className="text-white hover:bg-white/20 p-1.5 sm:p-2 rounded-full transition flex-shrink-0"
        >
            ✕
        </button>
    </div>
</div>
            
            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh] sm:max-h-[60vh]">
                {loadingAI ? (
                    <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-purple-500 mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-300 font-semibold text-sm sm:text-base text-center">AI Coach is analyzing your workout...</p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">This may take a few seconds</p>
                    </div>
                ) : (
                    <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert">
                        {aiFeedback.split('\n').map((line, index) => {
                            // Headings (## or **)
                            if (line.startsWith('## ')) {
                                return <h2 key={index} className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">{line.replace('## ', '')}</h2>;
                            }
                            if (line.startsWith('**') && line.endsWith('**')) {
                                return <h3 key={index} className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mt-4 mb-2">{line.replace(/\*\*/g, '')}</h3>;
                            }
                            
                            // Bullet points
                            if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                                const content = line.trim().substring(2);
                                return (
                                    <div key={index} className="flex items-start gap-2 ml-4 mb-2">
                                        <span className="text-purple-500 dark:text-purple-400 mt-1">•</span>
                                        <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base flex-1">{formatInlineMarkdown(content)}</p>
                                    </div>
                                );
                            }
                            
                            // Numbered lists
                            if (line.trim().match(/^\d+\.\s/)) {
                                const match = line.trim().match(/^(\d+)\.\s(.*)$/);
                                if (match) {
                                    return (
                                        <div key={index} className="flex items-start gap-2 ml-4 mb-2">
                                            <span className="text-purple-500 dark:text-purple-400 font-semibold mt-0.5">{match[1]}.</span>
                                            <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base flex-1">{formatInlineMarkdown(match[2])}</p>
                                        </div>
                                    );
                                }
                            }
                            
                            // Empty lines
                            if (line.trim() === '') {
                                return <div key={index} className="h-2"></div>;
                            }
                            
                            // Regular paragraphs
                            return <p key={index} className="text-gray-700 dark:text-gray-200 mb-3 text-sm sm:text-base leading-relaxed">{formatInlineMarkdown(line)}</p>;
                        })}
                    </div>
                )}
            </div>
            
            {/* Modal Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 bg-gray-50 dark:bg-gray-900">
                <button
                    onClick={closeAIModal}
                    className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm sm:text-base"
                >
                    Close
                </button>
            </div>

        </div>
    </div>
)}
     {/* AI Chat Widget */}
               <AIChatWidget />
        </div>
    );
};

export default Dashboard;