import React, { createContext, useReducer, useEffect, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import { message } from 'antd'; 
import { useNavigate } from 'react-router-dom';

const Auth = createContext();

const initialState = {
  isAuthenticated: false,
  user: {},
  isAdmin: false,
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'SET_LOGGED_IN': {
      return {
        ...state,
        isAuthenticated: true,
        user: payload.user || {},
        isAdmin: payload.isAdmin || false,
      };
    }
    case 'SET_LOGGED_OUT':
      return { ...state, isAuthenticated: false, user: {}, isAdmin: false };
    default:
      return state;
  }
};

export default function AuthContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isAppLoading, setIsAppLoading] = useState(true); // Loading state
 const navigate=useNavigate()
  // Function to fetch and set user data using token
  const setUserFromToken = useCallback(async (token) => {
    setIsAppLoading(true); // Set loading true while fetching data
    try {
      const response = await axios.get('https://backend-pkvn.vercel.app/auth/user', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const user = response.data.user;

        if (!user || !user.role) {
          // throw new Error('User or role is missing');
          console.log("error");
          
        }

        const isAdmin = user.role.includes('admin');
        dispatch({ type: 'SET_LOGGED_IN', payload: { user, isAdmin } });
      } else {
        message.error('User data not found');
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      message.error('Something went wrong while fetching user data');
      localStorage.removeItem('token');
    } finally {
      setIsAppLoading(false); // Stop loading after attempting to fetch user data
    }
  }, []);

  // On component mount, check for token and fetch user data if token exists
  useEffect(() => {
    const fetchTokenAndSetUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await setUserFromToken(token); // Set user from token
      } else {
        setIsAppLoading(false); // No token, just stop loading
      }
    };
    fetchTokenAndSetUser();
  }, [setUserFromToken]);

  // Logout function to remove token and reset state
  const handleLogout = async () => {
    try {
      dispatch({ type: 'SET_LOGGED_OUT' });
      localStorage.removeItem('token');
      message.success('Successfully logged out');
      navigate("/auth/login")
    } catch (error) {
      console.error('Error during logout:', error);
      message.error('Failed to log out. Please try again.');
    }
  };

  // Return context provider with state, dispatch, and handleLogout
  return (
    <Auth.Provider value={{ ...state, isAppLoading, dispatch, handleLogout }}>
      {!isAppLoading ? children : null} {/* Only render children once loading is complete */}
    </Auth.Provider>
  );
}

// Custom hook to access auth context values
export const useAuthContext = () => useContext(Auth);
