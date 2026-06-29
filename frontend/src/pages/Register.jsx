import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        setLoading(true);
        try {
            const response = await api.post('/auth/register', formData);
            const { token, user } = response.data;
            login(user, token);
            toast.success('Account created successfully! 🎉');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-600 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 px-4 py-8">
            <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md transition-colors duration-300">
                <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
                    Create Account 🚀
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Name
                        </label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                            placeholder="Your Name"
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Email
                        </label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            placeholder="your@email.com"
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                            Password
                        </label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                            placeholder="Password (min 6 chars)"
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base" 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 text-sm sm:text-base"
                    >
                        {loading ? 'Creating...' : 'Register'}
                    </button>
                </form>
                <p className="text-center mt-6 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    Already have an account?{' '}
                    <Link to="/login" className="text-green-600 dark:text-green-400 font-semibold hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;