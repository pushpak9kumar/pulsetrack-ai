import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext'; // ✅ AuthContext import kiya

const Home = () => {
    // ✅ Check karo ki user logged in hai ya nahi
    const { isAuthenticated, user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-6">Transform Your Fitness Journey</h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    AI-powered workout tracking, personalized coaching, and gamification to keep you motivated.
                </p>
                
                {/* ✅ Conditional Rendering: Logged in vs Logged out */}
                {isAuthenticated ? (
                    // Agar user LOGGED IN hai
                    <div className="flex flex-col items-center gap-4">
                        <Link 
                            to="/dashboard" 
                            className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition"
                        >
                            Go to Dashboard 🚀
                        </Link>
                        <p className="text-gray-500">Welcome back, {user?.name}! Ready to crush your goals?</p>
                    </div>
                ) : (
                    // Agar user LOGGED OUT hai
                    <div className="flex gap-4 justify-center">
                        <Link 
                            to="/register" 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition"
                        >
                            Get Started Free
                        </Link>
                        <Link 
                            to="/login" 
                            className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-blue-500 transition"
                        >
                            Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;