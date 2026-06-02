import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear previous errors
  const clearError = () => setError(null);

  // Check if user is logged in on load
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('travel_token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser({ ...data, token });
        } else {
          // Token expired or invalid
          localStorage.removeItem('travel_token');
          setUser(null);
        }
      } catch (err) {
        console.error('Error checking authentication status:', err);
        // Do not remove token on network failure, just hold user as null
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register User
  const signup = async (name, email, password) => {
    clearError();
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Registration only triggers a verification mail, it does not automatically log in
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Login User
  const login = async (email, password) => {
    clearError();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Attach needsVerification flag to the error so the Login page can detect it
        const err = new Error(data.message || 'Login failed');
        err.needsVerification = data.needsVerification || false;
        err.email = data.email || email;
        throw err;
      }

      localStorage.setItem('travel_token', data.token);
      setUser(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Resend Verification Email
  const resendVerification = async (email) => {
    try {
      const res = await fetch(`${API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to resend verification email');
      }

      return data;
    } catch (err) {
      throw err;
    }
  };

  // Logout User
  const logout = () => {
    localStorage.removeItem('travel_token');
    setUser(null);
    clearError();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signup,
        login,
        logout,
        clearError,
        resendVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
