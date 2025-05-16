import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  profile?: {
    name: string;
    profilePicture: string;
    bio?: string;
    location?: string;
    socialLinks?: {
      twitter?: string;
      instagram?: string;
      facebook?: string;
    };
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: Partial<User['profile']>) => Promise<void>;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  profilePicture?: File;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_AUTH_SERVICE_URL}/api/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await axios.post(`${import.meta.env.VITE_AUTH_SERVICE_URL}/api/auth/login`, {
        email,
        password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred during login');
      throw error;
    }
  };

  const signup = async (userData: SignupData) => {
    try {
      setError(null);
      let profilePictureUrl = '';
      
      // If there's a profile picture, upload it first
      if (userData.profilePicture) {
        const formData = new FormData();
        formData.append('file', userData.profilePicture);
        // TODO: Implement file upload service
        // const uploadResponse = await axios.post('/api/upload', formData);
        // profilePictureUrl = uploadResponse.data.url;
      }

      const response = await axios.post(`${import.meta.env.VITE_AUTH_SERVICE_URL}/api/auth/signup`, {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        profilePicture: profilePictureUrl
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred during signup');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (profileData: Partial<User['profile']>) => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const response = await axios.put(
        `${import.meta.env.VITE_USER_SERVICE_URL}/api/profiles/me`,
        profileData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUser(prev => prev ? { ...prev, profile: response.data.profile } : null);
    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred updating profile');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};