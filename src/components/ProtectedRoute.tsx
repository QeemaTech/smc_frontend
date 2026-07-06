import { Navigate } from 'react-router-dom';
import {
  clearAdminSession,
  hasValidAdminSession,
} from '@/lib/adminAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

  if (!hasValidAdminSession()) {
    clearAdminSession();
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
