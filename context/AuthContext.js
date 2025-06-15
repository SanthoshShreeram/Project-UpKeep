import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAuth} from '@react-native-firebase/auth';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

// Create AuthContext
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [idToken, setIdToken] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null); // ✅ Store role
  const [confirm, setConfirm] = useState(null);

  // ✅ Save user data to AsyncStorage
  const saveUserData = async (name,userRole) => {
    try {
      await AsyncStorage.setItem('username', name || ''); // Handle null username
      await AsyncStorage.setItem('role', userRole || 'User'); // Default: User
      setUsername(name);
      setRole(userRole);
    } catch (error) {
      console.error('❌ Error saving user data:', error);
    }
  };
  // ✅ Check Token Expiry & Refresh if Needed
  const checkAndRefreshToken = useCallback(async () => {
    try {
      const user = getAuth().currentUser;
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        const expirationTime = new Date(idTokenResult.expirationTime).getTime();
        const currentTime = new Date().getTime();
        const remainingTimeInMinutes = Math.floor((expirationTime - currentTime) / (1000 * 60));

        console.log(`⏳ Token will expire in ${remainingTimeInMinutes} minutes`);

        if (remainingTimeInMinutes < 5) {
          console.log('🔄 Refreshing token as it is about to expire...');
          await refreshToken();
        }
      }
    } catch (error) {
      console.error('❌ Error checking token expiry:', error);
    }
  }, []);

  // ✅ Refresh Firebase Token Function
  const refreshToken = useCallback(async () => {
    try {
      const user = getAuth().currentUser;
      if (user) {
        const newIdToken = await user.getIdToken(true); // Force refresh token
        console.log('🔥 New Refreshed Token:', newIdToken);
        setIdToken(newIdToken);
        await AsyncStorage.setItem('token', newIdToken);
        console.log('✅ Firebase token refreshed successfully');
      }
    } catch (error) {
      console.error('❌ Error refreshing token:', error);
      await logout(); // Logout if token refresh fails
    }
  }, []);

  const loadUserData = async () => {
    try {
      const phone = await AsyncStorage.getItem('phoneNumber');
      const name = await AsyncStorage.getItem('username');
      const storedRole = await AsyncStorage.getItem('role');
      if (phone) {
        setPhoneNumber(phone);
        console.log(phone);
      }
      if (name) {
        setUsername(name);
        console.log(name);
      }
      if (storedRole) {
        setRole(storedRole);
        console.log(storedRole);
      }

    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

// ✅ Load Token when App Starts
  const loadToken = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setIdToken(token);
        console.log(token);
        await checkAndRefreshToken(); // ✅ Check and log token expiry
      }
      setLoading(false); // Stop loading once token is fetched
    } catch (error) {
      console.error('❌ Error loading token:', error);
      setLoading(false);
    }
  }, [checkAndRefreshToken]); // ✅ Empty dependency array

  // ✅ Auto-Refresh Token every 50 mins
  useEffect(() => {
    const interval = setInterval(async () => {
      await checkAndRefreshToken;
    }, 50 * 60 * 1000); // 50 minutes

    return () => clearInterval(interval);
  }, [checkAndRefreshToken]);
  useEffect(() => {
    (async () => {
      await refreshToken();
      await loadToken(); // ✅ No ESLint error now
      await loadUserData(); // ✅ Load user data along with token
      setLoading(false);  // ✅ Ensure loading is only stopped after all data is available
    })();
  },[loadToken]);

  // ✅ Logout Function
  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('role'); // Clear role
    setIdToken(null);
    setUsername(null);
    setRole(null);
  };

  // ✅ Show Loading Screen while fetching token
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ idToken, setIdToken, logout, isNewUser, setIsNewUser, phoneNumber, setPhoneNumber, loading, username, setUsername, saveUserData, role, setRole, confirm, setConfirm }}>
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
