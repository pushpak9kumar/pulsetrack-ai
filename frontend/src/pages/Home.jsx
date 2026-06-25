import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
     return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-6">Transform Your Fitness Journey</h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    AI-powered workout tracking, personalized coaching, and gamification to keep you motivated.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link to="/register" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition">Get Started Free</Link>
                    <Link to="/login" className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-blue-500 transition">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Home;