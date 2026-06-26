import { useAuth } from '../context/AuthContext';
import {Link } from 'react-router-dom';
import Navbar from '../components/Navbar';


const Dashboard = () => {
    const { user } = useAuth();
    
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">
                    {user?.level === 1 && user?.xp === 0 
                        ? `Welcome to PulseTrack AI, ${user?.name}! 🎉`
                        : `Welcome back, ${user?.name}! 💪`
                    }
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-gray-600 text-sm">Level</h3>
                        <p className="text-3xl font-bold text-blue-600">{user?.level || 1}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-gray-600 text-sm">Total XP</h3>
                        <p className="text-3xl font-bold text-green-600">{user?.xp || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-gray-600 text-sm">Workouts</h3>
                        <p className="text-3xl font-bold text-purple-600">0</p>
                    </div>
                </div>
                 <div className="flex justify-center">
                    <Link 
                        to="/log-workout" 
                        className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:shadow-2xl transition transform hover:scale-105">
                        + Log New Workout
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;