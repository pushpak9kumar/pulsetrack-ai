import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import LogWorkout from './pages/LogWorkout';
import  EditProfile from './pages/EditProfile';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Achievements from './pages/Achievements';

function App() {
    return (
    //ThemeProvider ko sabse pehle rakho
      <ThemeProvider>
        {/*1. Sabse pehle AuthProvider (Global Data ka Dabba) */}
         <AuthProvider>
            {/* 2. Uske andar Router (URL handle karne wala) */}
            <Router>
                <Toaster position="top-right" />
                
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* 3. Dashboard ko ProtectedRoute ke andar wrap kiya */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                      <Route path="/log-workout" element={
                        <ProtectedRoute>
                            <LogWorkout />
                        </ProtectedRoute>
                    } />

                    <Route path="/edit-profile" element={
                      <ProtectedRoute>
                           <EditProfile />
                       </ProtectedRoute>
                    } />

                    <Route path="/achievements" element={
                        <ProtectedRoute>
                            <Achievements />
                        </ProtectedRoute>
                    } />
                    
                </Routes>
            </Router>
         </AuthProvider>
     </ThemeProvider>   
    );
}

export default App;