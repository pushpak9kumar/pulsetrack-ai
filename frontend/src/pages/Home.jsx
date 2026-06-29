import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated, user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6">
                    Transform Your Fitness Journey
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto px-2">
                    AI-powered workout tracking, personalized coaching, and gamification to keep you motivated.
                </p>
                
                {isAuthenticated ? (
                    <div className="flex flex-col items-center gap-4">
                        <Link 
                            to="/dashboard" 
                            className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:shadow-xl transition w-full sm:w-auto"
                        >
                            Go to Dashboard 🚀
                        </Link>
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 px-4">
                            Welcome back, <span className="font-semibold">{user?.name}</span>! Ready to crush your goals?
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                        <Link 
                            to="/register" 
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:shadow-xl transition w-full sm:w-auto"
                        >
                            Get Started Free
                        </Link>
                        <Link 
                            to="/login" 
                            className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:border-blue-500 dark:hover:border-blue-400 transition w-full sm:w-auto"
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