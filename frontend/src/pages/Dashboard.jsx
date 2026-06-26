import { useState, useEffect } from 'react'; // ✅ useEffect import kiya
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api'; // ✅ API service import kiya

const Dashboard = () => {
    const { user } = useAuth();

    // 1. STATE MANAGEMENT
    const [workouts, setWorkouts] = useState([]); // Array me saare workouts store honge
    const [loadingWorkouts, setLoadingWorkouts] = useState(true); // Loading spinner ke liye

    // 2. DATA FETCHING (The Waiter)
          useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await api.get('/workouts'); 
                
                // ✅ SMART EXTRACTION: Har possible format ko handle karo
                let fetchedWorkouts = [];
                
                if (Array.isArray(response.data)) {
                    // Agar backend direct array bhej raha hai: [...]
                    fetchedWorkouts = response.data;
                } else if (response.data && Array.isArray(response.data.workouts)) {
                    // Agar backend { workouts: [...] } bhej raha hai
                    fetchedWorkouts = response.data.workouts;
                } else if (response.data && Array.isArray(response.data.data)) {
                    // Agar backend { data: [...] } bhej raha hai
                    fetchedWorkouts = response.data.data;
                } else if (response.data && response.data.result) {
                    // Agar backend { result: [...] } bhej raha hai
                    fetchedWorkouts = response.data.result;
                }

                console.log("Final workouts array:", fetchedWorkouts); // Debugging ke liye
                
                setWorkouts(fetchedWorkouts); // Ab 100% array hi jayega
                
            } catch (error) {
                console.error("Failed to fetch workouts:", error);
                setWorkouts([]); // Error aaye toh khali array set karo
            } finally {
                setLoadingWorkouts(false);
            }
        };

        fetchWorkouts();
    }, []);

    // 3. CALCULATE TOTAL XP (1 Workout = 10 XP)
    const totalXP = workouts.length * 10;
    const level = Math.floor(totalXP / 100) + 1; // Har 100 XP pe 1 Level up

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
                        {/* ✅ Ab hardcoded 1 nahi, calculated level dikhega */}
                        <p className="text-3xl font-bold text-blue-600">{level}</p> 
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-gray-600 text-sm">Total XP</h3>
                        {/* ✅ Ab hardcoded 0 nahi, calculated XP dikhega */}
                        <p className="text-3xl font-bold text-green-600">{totalXP}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-gray-600 text-sm">Total Workouts</h3>
                        {/* ✅ Ab hardcoded 0 nahi, array ki length dikhegi */}
                        <p className="text-3xl font-bold text-purple-600">{workouts.length}</p>
                    </div>
                </div>

                {/* ✅ 4. WORKOUTS LIST SECTION */}
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Recent Workouts 🏋️‍♂️</h2>
                
                {loadingWorkouts ? (
                    // Agar data aa raha hai, toh Spinner dikhao
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                    </div>
                ) : workouts.length === 0 ? (
                    // Agar koi workout nahi hai, toh ye message dikhao
                    <div className="text-center py-10 bg-white rounded-xl shadow-md">
                        <p className="text-gray-500 text-lg">No workouts logged yet. Start moving! 🏃‍♂️</p>
                        <Link to="/log-workout" className="mt-4 inline-block text-blue-600 font-semibold hover:underline">
                            Log your first workout
                        </Link>
                    </div>
                ) : (
                    // ✅ Agar workouts hain, toh unko Cards me dikhao (.map() ka use)
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {workouts.map((workout) => (
                            <div key={workout._id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
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