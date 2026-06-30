import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const WorkoutHistory = () => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkoutHistory = async () => {
            try {
                // ✅ Last 10 days ka data fetch karo
                const response = await api.get('/workouts?days=10');
                
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
                console.error('Failed to fetch workout history:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchWorkoutHistory();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        Workout History 📊
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Last 10 days of your fitness journey
                    </p>
                </div>

                {/* Back Button */}
                <Link 
                    to="/dashboard" 
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-6"
                >
                    ← Back to Dashboard
                </Link>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                    </div>
                ) : workouts.length === 0 ? (
                    <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">No workouts found in the last 10 days.</p>
                        <Link to="/log-workout" className="mt-4 inline-block text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                            Log a workout
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {workouts.map((workout) => (
                            <div key={workout._id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 capitalize mb-3">
                                    {workout.type}
                                </h3>
                                <div className="flex justify-between text-gray-600 dark:text-gray-300 mb-2">
                                    <span>⏱️ {workout.duration} mins</span>
                                    <span>🔥 {workout.calories} cal</span>
                                </div>
                                {workout.notes && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-2">
                                        "{workout.notes}"
                                    </p>
                                )}
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                    {new Date(workout.createdAt).toLocaleDateString()} 
                                    {' '}at {' '}
                                    {new Date(workout.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkoutHistory;