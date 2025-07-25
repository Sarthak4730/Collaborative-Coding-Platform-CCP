import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute( { children } ) {
    const token = localStorage.getItem("token");
    const location = useLocation();
    if(!token) return <Navigate to="/login" state={ { from: location.pathname } } />
    return children;
}