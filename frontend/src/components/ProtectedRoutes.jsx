import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { ACCESS_TOKEN } from '../apiConstants';
import WaveLoader from './WaveLoader';

const ProtectedRoute = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
        } else {
            const decoded = jwtDecode(token);
            const tokenExpiration = decoded.exp;
            const now = Date.now() / 1000;

            if (tokenExpiration < now) {
                setIsAuthorized(false); // Axios interceptor will handle refreshing the token
            } else {
                setIsAuthorized(true);
            }
        }
    }, []);

    if (isAuthorized === null) {
        return <WaveLoader /> ;
    }

    return isAuthorized ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
