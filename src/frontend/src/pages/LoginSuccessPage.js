import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginSuccessPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        console.log('useEffect in LoginSuccessPage is running');
        const urlParams = new URLSearchParams(window.location.search);
        const userData = urlParams.get('user');

        if (userData) {
            try {
                console.log('Raw userData from URL:', userData);
                const parsedUserData = JSON.parse(decodeURIComponent(userData));
                console.log('Parsed user data:', parsedUserData);

                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(parsedUserData));
                console.log('User data stored in localStorage');

                // Redirect to the main dashboard or a protected route
                navigate('/', { replace: true }); // Prevents additional history entry
            } catch (error) {
                console.error('Error parsing user data:', error);
                navigate('/login', { replace: true }); // Redirect to login
            }
        } else {
            console.error('No user data found in query params');
            navigate('/login', { replace: true }); // Redirect to login if no user data
        }
    }, [navigate]);


    return <div>Logging you in...</div>;
};

export default LoginSuccessPage;