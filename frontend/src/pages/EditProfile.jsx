import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import toast from 'react-hot-toast';

const AVATARS = [
    { id: 1, gradient: 'from-blue-500 to-purple-600', emoji: '👤' },
    { id: 2, gradient: 'from-pink-500 to-rose-600', emoji: '🦸' },
    { id: 3, gradient: 'from-green-500 to-emerald-600', emoji: '🏃' },
    { id: 4, gradient: 'from-orange-500 to-red-600', emoji: '🔥' },
    { id: 5, gradient: 'from-indigo-500 to-blue-600', emoji: '💪' },
    { id: 6, gradient: 'from-yellow-500 to-orange-600', emoji: '🏆' },
];

const EditProfile = () => {
    const { user, fetchProfile } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    
    const [name, setName] = useState(user?.name || '');
    const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 1);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const payload = { name };
            
            if (selectedAvatar && Number(selectedAvatar) > 0) {
                payload.avatar = Number(selectedAvatar);
            }
            
            await api.put('/profile', payload);
            await fetchProfile();
            toast.success('Profile updated successfully! ✨');
            navigate('/dashboard');
        } catch (error) {
            toast.error('Failed to update profile');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size should be less than 5MB');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            await api.post('/profile/upload-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            await fetchProfile();
            setSelectedAvatar(null);
            toast.success('Avatar uploaded successfully! 📸');
        } catch (error) {
            toast.error('Failed to upload avatar');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Navbar />
            
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 sm:mb-8">
                    Edit Profile ✨
                </h1>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm sm:text-base"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Email (Cannot be changed)
                        </label>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-lg bg-gray-100 dark:bg-gray-900 cursor-not-allowed text-sm sm:text-base"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                            Choose Your Avatar
                        </label>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 mb-4">
                            {AVATARS.map((avatar) => (
                                <button
                                    key={avatar.id}
                                    type="button"
                                    onClick={() => setSelectedAvatar(avatar.id)}
                                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${avatar.gradient} flex items-center justify-center text-xl sm:text-2xl shadow-md transition-all transform hover:scale-110 ${
                                        selectedAvatar === avatar.id
                                            ? 'ring-4 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800 scale-110'
                                            : ''
                                    }`}
                                >
                                    {avatar.emoji}
                                </button>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                Or Upload Your Own Photo
                            </label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:border-blue-500 hover:text-blue-500 transition disabled:opacity-50 text-sm sm:text-base"
                            >
                                {uploading ? 'Uploading...' : '📸 Click to Upload Photo (Max 5MB)'}
                            </button>
                            {user?.avatarUrl && (
                                <div className="mt-4 flex items-center gap-3">
                                    <img 
                                        src={`http://localhost:5000${user.avatarUrl}`} 
                                        alt="Current avatar"
                                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                                    />
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Current custom photo</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 text-sm sm:text-base"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm sm:text-base"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;