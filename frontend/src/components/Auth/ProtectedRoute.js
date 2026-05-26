import { Navigate } from 'react-router-dom';
import { isAuthenticated, getRole, getDashboardPath } from '../../services/api';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const authenticated = isAuthenticated();
  const role = getRole();

  // Not logged in -> redirect to login
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role -> redirect to their own dashboard
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={getDashboardPath(role)} replace />;
  }

  // Authorized -> render the component
  return children;
};

export default ProtectedRoute;