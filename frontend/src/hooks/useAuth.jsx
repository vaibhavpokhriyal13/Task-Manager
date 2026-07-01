import { useState, useEffect, createContext, useContext } from 'react';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const API_BASE = import.meta.env.VITE_API_URL || '/api';
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error(err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const signIn = async (email, password) => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || '/api';
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        toast({
          title: 'Sign In Error',
          description: data.error || 'Failed to login',
          variant: 'destructive'
        });
        return { error: new Error(data.error) };
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);
      
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.'
      });
      return { error: null };
    } catch (error) {
      toast({
        title: 'Sign In Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive'
      });
      return { error };
    }
  };

  const signUp = async (email, password, displayName) => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || '/api';
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, display_name: displayName })
      });
      const data = await res.json();

      if (!res.ok) {
        toast({
          title: 'Sign Up Error',
          description: data.error || 'Failed to register',
          variant: 'destructive'
        });
        return { error: new Error(data.error) };
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);

      toast({
        title: 'Account Created!',
        description: 'Welcome to Task Manager!'
      });
      return { error: null };
    } catch (error) {
      toast({
        title: 'Sign Up Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive'
      });
      return { error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    setUser(null);
    toast({
      title: 'Signed Out',
      description: 'You have been signed out successfully.'
    });
    return { error: null };
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};