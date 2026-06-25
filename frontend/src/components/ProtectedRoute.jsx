import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if(loading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div></div>;
    }

    if(!isAuthenticated) {
        return<Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;