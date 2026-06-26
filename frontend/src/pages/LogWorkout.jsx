import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

// ✅ Component shuru (Dhyan de: yahan '{' bracket hai)
const LogWorkout = () => {
    const [formData, setFormData] = useState({
        exerciseName: '',
        duration: '',
        calories: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    
    const { token } = useAuth(); 
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

        const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Validation
        if (!formData.exerciseName || !formData.duration) {
            toast.error('Exercise Name and Duration are required!');
            return;
        }

        setLoading(true);

        try {
            // 2. DATA FIXING: Backend ko sahi format me data bhejo
            const payload = {
                type: formData.exerciseName,       
                duration: Number(formData.duration), 
                calories: Number(formData.calories) || 0, 
                notes: formData.notes || ""
            };

            // 3. Backend ko fixed payload bhejo
            const response = await api.post('/workouts', payload);
            
            toast.success('Workout logged successfully! 🎉');
            navigate('/dashboard');
            
        } catch (error) {
            console.error("Backend Error:", error);
            toast.error(error.response?.data?.message || 'Failed to log workout');
        } finally {
            setLoading(false);
        }
    };
    // ✅ Return statement function ke andar hai
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-2xl mx-auto px-4 py-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Log Your Workout 🏋️‍♂️</h2>
                
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Name</label>
                        <input
                            type="text"
                            name="exerciseName"
                            value={formData.exerciseName}
                            onChange={handleChange}
                            placeholder="e.g., Running, Pushups, Yoga"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (mins)</label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="30"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Calories Burned</label>
                            <input
                                type="number"
                                name="calories"
                                value={formData.calories}
                                onChange={handleChange}
                                placeholder="250"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="3"
                            placeholder="How did you feel? Any personal records?"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Log Workout'}
                    </button>
                </form>
            </div>
        </div>
    );
};
// ✅ Component khatam (Dhyan de: yahan '}' bracket hai)

export default LogWorkout;