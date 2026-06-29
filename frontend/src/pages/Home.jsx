import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { isAuthenticated, user } = useAuth();

    // Daily Motivational Quotes
    const quotes = [
        { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
        { text: "Your body can stand almost anything. It's your mind you have to convince.", author: "Andrew Murphy" },
        { text: "Fitness is not about being better than someone else. It's about being better than you used to be.", author: "Khloe Kardashian" },
        { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Arnold Schwarzenegger" },
        { text: "Don't limit your challenges, challenge your limits.", author: "Jerry Dunn" },
        { text: "Success is what comes after you stop making excuses.", author: "Luis Galarza" },
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
        { text: "Great things never come from comfort zones.", author: "Unknown" },
        { text: "Dream it. Wish it. Do it.", author: "Unknown" },
        { text: "The hard days are what make you stronger.", author: "Aly Raisman" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "Strength does not come from winning. You fight through it.", author: "Unknown" },
        { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
        { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
        { text: "It never gets easier. You just get stronger.", author: "Unknown" },
        { text: "The difference between try and triumph is a little umph.", author: "Marvin Phillips" },
        { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
        { text: "The clock is ticking. Are you becoming the person you want to be?", author: "Greg Plitt" },
        { text: "Success isn't always about greatness. It's about consistency.", author: "Dwayne Johnson" },
        { text: "The only way to achieve the impossible is to believe it is possible.", author: "Charles Kingsleigh" },
        { text: "Don't stop when you're tired. Stop when you're done.", author: "David Goggins" },
        { text: "Your limitation—it's only your imagination.", author: "Unknown" },
        { text: "Little things make big days.", author: "Unknown" },
        { text: "It's going to be hard, but hard does not mean impossible.", author: "Unknown" },
        { text: "Don't wait for opportunity. Create it.", author: "Unknown" },
        { text: "Sometimes we're tested not to fail, but to discover how strong we can become.", author: "Unknown" },
        { text: "The body achieves what the mind believes.", author: "Unknown" },
        { text: "You are your only limit.", author: "Unknown" },
        { text: "Make each day your masterpiece.", author: "John Wooden" },
        { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
        { text: "What seems to us as bitter trials are often blessings in disguise.", author: "Oscar Wilde" },
        { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
        { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
        { text: "What you get by achieving your goals is not as important as what you become.", author: "Zig Ziglar" },
        { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
        { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
        { text: "Don't wish for it, work for it.", author: "Unknown" },
        { text: "Live life to the fullest, and focus on the positive.", author: "Matt Cameron" },
        { text: "Your mind must be stronger than your feelings.", author: "Unknown" },
        { text: "Champions keep playing until they get it right.", author: "Billie Jean King" },
        { text: "The only way to predict the future is to create it.", author: "Peter Drucker" },
        { text: "Strive for progress, not perfection.", author: "Unknown" },
        { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
        { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
        { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
        { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
        { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
        { text: "Dream big. Start small. Act now.", author: "Robin Sharma" },
        { text: "No pain, no gain. Shut up and train.", author: "Unknown" },
    ];

    // Get today's quote
    const getTodayQuote = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now - start;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        return quotes[dayOfYear % quotes.length];
    };

    const todayQuote = getTodayQuote();

    // Athletes Gallery Data
    const athletes = [
        {
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
            title: "Strength Training",
            subtitle: "Build Your Power",
            quote: "Strength does not come from the body. It comes from the will."
        },
        {
            image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&q=80",
            title: "Running",
            subtitle: "Push Your Limits",
            quote: "Run when you can, walk if you have to, crawl if you must; just never give up."
        },
        {
            image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
            title: "Yoga & Flexibility",
            subtitle: "Find Your Balance",
            quote: "Yoga is the journey of the self, through the self, to the self."
        },
        {
            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
            title: "Gym Workout",
            subtitle: "No Excuses",
            quote: "The only bad workout is the one that didn't happen."
        },
        {
            image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80",
            title: "Cardio Fitness",
            subtitle: "Heart of a Champion",
            quote: "Take care of your body. It's the only place you have to live."
        },
        {
            image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80",
            title: "Boxing",
            subtitle: "Fight For Your Goals",
            quote: "Champions aren't made in gyms. They are made from something deep inside them."
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            <Navbar />
            
            {/* Hero Section */}
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

            {/* Daily Motivational Quote Section */}
            <div className="bg-white dark:bg-gray-800 py-12 sm:py-16 transition-colors duration-300">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 sm:p-10 rounded-2xl shadow-2xl text-white text-center">
                        <div className="text-4xl sm:text-5xl mb-4">💪</div>
                        <h2 className="text-xl sm:text-2xl font-bold mb-4">Daily Motivation</h2>
                        <blockquote className="text-lg sm:text-xl lg:text-2xl font-semibold leading-relaxed mb-4 italic">
                            "{todayQuote.text}"
                        </blockquote>
                        <p className="text-sm sm:text-base opacity-90">— {todayQuote.author}</p>
                        <p className="text-xs sm:text-sm opacity-75 mt-4">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                            Why Choose PulseTrack AI?
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Everything you need to transform your fitness journey
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {/* Feature 1: AI Coach */}
                        <div className="group bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                                AI-Powered Coach
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                                Get personalized workout recommendations and real-time feedback from our advanced AI coach.
                            </p>
                        </div>

                        {/* Feature 2: Track Everything */}
                        <div className="group bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                                Track Everything
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                                Monitor your workouts, calories, streaks, and progress with beautiful charts and analytics.
                            </p>
                        </div>

                        {/* Feature 3: Gamification */}
                        <div className="group bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                                Gamification & Rewards
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                                Earn XP, unlock achievements, level up, and stay motivated with our gamified fitness system.
                            </p>
                        </div>
                    </div>

                    {/* ✅ FIXED: Conditional CTA Button */}
                    <div className="text-center mt-12 sm:mt-16">
                        {isAuthenticated ? (
                            <Link 
                                to="/dashboard"
                                className="inline-block bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105"
                            >
                                Go to Your Dashboard 📊
                            </Link>
                        ) : (
                            <Link 
                                to="/register"
                                className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105"
                            >
                                Start Your Journey Today 🚀
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Athletes Gallery Section */}
            <div className="py-16 sm:py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                            Find Your Inspiration 🔥
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Join thousands of athletes who transformed their lives with PulseTrack AI
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {athletes.map((athlete, index) => (
                            <div 
                                key={index}
                                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                            >
                                <div className="aspect-[4/5] overflow-hidden">
                                    <img 
                                        src={athlete.image} 
                                        alt={athlete.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        loading="lazy"
                                    />
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300"></div>

                                <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 text-white">
                                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-2">
                                            {athlete.subtitle}
                                        </span>
                                        <h3 className="text-xl sm:text-2xl font-bold mb-2">
                                            {athlete.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm italic opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 leading-relaxed">
                                            "{athlete.quote}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ✅ FIXED: Conditional CTA Button */}
                {/*}    <div className="text-center mt-12 sm:mt-16">
                        {isAuthenticated ? (
                            <Link 
                                to="/dashboard"
                                className="inline-block bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105"
                            >
                                Continue Your Journey 🚀
                            </Link>
                        ) : (
                            <Link 
                                to="/register"
                                className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:shadow-2xl transition-all transform hover:scale-105"
                            >
                                Start Your Journey Today 🚀
                            </Link>
                        )}
                    </div>
            */}
                    
                </div>
            </div>
            

            {/* Stats Section - Hardcoded for now */}
<div className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                    200+
                </div>
                <div className="text-xs sm:text-sm opacity-90">Active Users</div>
            </div>
            <div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                    1.5K+
                </div>
                <div className="text-xs sm:text-sm opacity-90">Workouts Logged</div>
            </div>
            <div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                    50+
                </div>
                <div className="text-xs sm:text-sm opacity-90">Badges Unlocked</div>
            </div>
            <div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                    24/7
                </div>
                <div className="text-xs sm:text-sm opacity-90">AI Support</div>
            </div>
        </div>
    </div>
</div>
            {/* Footer */}
            <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm sm:text-base">
                        © 2026 PulseTrack AI. Transform your fitness journey with AI-powered coaching.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;