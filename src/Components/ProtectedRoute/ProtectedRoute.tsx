import { useAuth } from '../../Hooks/useAuth';
import { hasTokens } from '../../Utils/tokenStorage';
import { Navigate, Outlet } from 'react-router';

const ProtectedRoute: React.FC = () => {
    const auth = useAuth();
    if (!auth || !auth.user || !hasTokens()) {
        // user is not authenticated
        return <Navigate to="/login" />;
    }
    return <Outlet />;
}

export default ProtectedRoute;
