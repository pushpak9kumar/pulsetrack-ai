import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import toast from 'react-hot-toast';

const Achievements = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        try {
            const response = await api.get('/achievements');
            console.log('🏆 Achievements:', response.data);
            setAchievements(response.data);
        } catch (error) {
            console.error('Failed to fetch achievements:', error);
            toast.error('Failed to load achievements');
        } finally {
            setLoading(false);
        }
    };

    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalCount = achievements.length;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                        🏆 Achievements
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        {unlockedCount} of {totalCount} badges unlocked
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm sm:text-base">Loading achievements...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {achievements.map((achievement) => (
                            <div
                                key={achievement.type}
                                className={`p-4 sm:p-6 rounded-xl shadow-md transition-all transform hover:scale-105 ${
                                    achievement.unlocked
                                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                                        : 'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-600'
                                }`}
                            >
                                <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 text-center">
                                    {achievement.unlocked ? achievement.icon : '🔒'}
                                </div>
                                
                                <h3 className={`text-lg sm:text-xl font-bold mb-2 text-center ${
                                    achievement.unlocked ? 'text-white' : 'text-gray-800 dark:text-gray-200'
                                }`}>
                                    {achievement.name}
                                </h3>
                                
                                <p className={`text-xs sm:text-sm text-center mb-3 sm:mb-4 ${
                                    achievement.unlocked ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
                                }`}>
                                    {achievement.description}
                                </p>
                                
                                {achievement.unlocked ? (
                                    <div className="text-center">
                                        <span className="inline-block px-2.5 sm:px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                                            ✅ Unlocked
                                        </span>
                                        <p className="text-xs mt-2 text-white/70">
                                            {new Date(achievement.unlockedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <span className="inline-block px-2.5 sm:px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs font-semibold">
                                            🔒 Locked
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Achievements;