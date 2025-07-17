import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from '../firebase/config';
import toast from 'react-hot-toast';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful! ✅');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
      toast.error('Login failed! Check credentials. ❌');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Admin account created successfully! ✅');
      return true;
    } catch (error) {
      console.error('Account creation error:', error);
      setError(error.message);
      toast.error('Account creation failed! ❌');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      toast.success('Logged out successfully 👋');
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.message);
      toast.error('Logout failed! ❌');
      return false;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    createAccount,
    logout,
    isAuthenticated: !!user
  };
} 