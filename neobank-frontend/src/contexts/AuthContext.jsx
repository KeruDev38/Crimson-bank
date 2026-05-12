import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const getAuthError = (error, fallbackMessage) => {
  if (!error.response) {
    return {
      message: 'Could not reach the API gateway.',
      details: ['Make sure the backend is running and the frontend dev server was restarted.'],
    };
  }

  const { status, data } = error.response;
  const validationErrors = data?.validationErrors ? Object.entries(data.validationErrors) : [];
  const details = validationErrors.map(([field, message]) => `${field}: ${message}`);

  if (data?.message) {
    return {
      message: data.message,
      details,
    };
  }

  if (typeof data === 'string' && data.trim()) {
    return {
      message: data,
      details,
    };
  }

  return {
    message: `${fallbackMessage} (HTTP ${status})`,
    details,
  };
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        localStorage.removeItem('user');
      }
    }
    return token ? { username: 'Customer' } : null;
  });

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password,
      });
      const { token: newToken } = response.data;
      const newUser = { username };
      setToken(newToken);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: getAuthError(error, 'Login failed') };
    }
  };

  const register = async (username, password, email, firstName, lastName) => {
    try {
      await axios.post('/api/auth/register', {
        username,
        password,
        email,
        firstName,
        lastName,
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: getAuthError(error, 'Registration failed') };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
