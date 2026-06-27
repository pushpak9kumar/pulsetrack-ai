import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom'; // ✅ useLocation import kiya
import Navbar from '../components/Navbar';
import api from '../services/api';
import toast from 'react-hot-toast'; // ✅ Toast import kiya

const Dashboard = () => {
    const { user } = useAuth();
    const location = useLocation(); // ✅ Ye track karega ki user kahan se aaya

    // 1. STATE MANAGEMENT
    const [workouts, setWorkouts] = useState([]);
    const [loadingWorkouts, setLoadingWorkouts] = useState(true);

    // 2. DATA FETCHING FUNCTION (Reusable banaya)
    const fetchWorkouts = async () => {
        try {
            const response = await api.get('/workouts');
            
            // Smart extraction
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

    // 3. USE EFFECT - Page load hone par data fetch karo
    useEffect(() => {
        fetchWorkouts();
    }, []);

    // 4. AUTO-REFRESH LOGIC - Jab user LogWorkout se wapas aaye
    useEffect(() => {
        // Check karo ki user /log-workout se aaya hai ya nahi
        if (location.state?.refreshDashboard) {
            fetchWorkouts(); // Data dobara fetch karo
        }
    }, [location]); // Jab bhi location change ho, ye chalega

    // 5. DELETE WORKOUT FUNCTION
 const handleDelete = async (workoutId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this workout?');
    
    if (!confirmDelete) return;

    try {
        await api.delete(`/workouts/${workoutId}`);
        
        // UI se card hatao (Optimistic Update)
        setWorkouts(workouts.filter(workout => workout._id !== workoutId));
        toast.success('Workout deleted successfully! 🗑️');
        
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete workout');
    }
};

    // 6. CALCULATE TOTAL XP (1 Workout = 10 XP)
    const totalXP = workouts.length * 10;
    const level = Math.floor(totalXP / 100) + 1;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Welcome Message */}
                <h1 className="text-4xl font-bold text-gray-800 mb-8">
                    {user?.level === 1 && totalXP === 0 
                        ? `Welcome to PulseTrack AI, ${user?.name}! 🎉`
                        : `Welcome back, ${user?.name}! 💪`
                    }
                </h1>
                
                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-gray-600 text-sm">Level</h3>
                        <p className="text-3xl font-bold text-blue-600">{level}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-gray-600 text-sm">Total XP</h3>
                        <p className="text-3xl font-bold text-green-600">{totalXP}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-gray-600 text-sm">Total Workouts</h3>
                        <p className="text-3xl font-bold text-purple-600">{workouts.length}</p>
                    </div>
                </div>

                {/* Workouts List Section */}
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Recent Workouts 🏋️‍♂️</h2>
                
                {loadingWorkouts ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                    </div>
                ) : workouts.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-xl shadow-md">
                        <p className="text-gray-500 text-lg">No workouts logged yet. Start moving! 🏃‍♂️</p>
                        <Link to="/log-workout" className="mt-4 inline-block text-blue-600 font-semibold hover:underline">
                            Log your first workout
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {workouts.map((workout) => (
                            <div key={workout._id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition relative">
                                
                                {/* ✅ DELETE BUTTON (Top-right corner me) */}
                                <button
                                    onClick={() => handleDelete(workout._id)}
                                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition"
                                    title="Delete workout"
                                >
                                    🗑️
                                </button>

                                <h3 className="text-xl font-bold text-gray-800 capitalize">{workout.type}</h3>
                                <div className="mt-4 flex justify-between text-gray-600">
                                    <span>⏱️ {workout.duration} mins</span>
                                    <span>🔥 {workout.calories} cal</span>
                                </div>
                                {workout.notes && (
                                    <p className="mt-4 text-sm text-gray-500 italic">"{workout.notes}"</p>
                                )}
                                <p className="mt-4 text-xs text-gray-400">
                                    {new Date(workout.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Log New Workout Button */}
                <div className="flex justify-center mt-10">
                    <Link 
                        to="/log-workout" 
                        className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:shadow-2xl transition transform hover:scale-105"
                    >
                        + Log New Workout
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;