import axios from 'axios';
import React, {createContext, useEffect, useState} from 'react';
import {BASE_URL} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);
  const [isProfileSetupDone, setIsProfileSetupDone] = useState(false);
  const [isInitialCheck, setIsInitialCheck] = useState(true);

  const register = (email, password) => {
    setIsLoading(true);

    axios
      .post(`${BASE_URL}/register`, {
        email,
        password,
      })
      .then(res => {
        let userInfo = res.data;
        setUserInfo(userInfo);
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        setIsLoading(false);
        console.log('register success', new Date(), 'DATA:', userInfo);
      })
      .catch(error => {
        if (error.response) {
          console.log('Response data:', error.response.data);
          console.log('Response status:', error.response.status);
          console.log('Response headers:', error.response.headers);
        } else if (error.request) {
          console.log('No response received:', error.request);
        } else {
          console.log('Request setup error:', error.message);
        }
        console.log('Axios error config:', error.config);

        setIsLoading(false);
      });
  };

  const authenticate = (email, password) => {
    console.log(
      'authenticate called',
      new Date(),
      ` DATA ${email} and ${password}`,
    );

    setIsLoading(true);

    axios
      .post(`${BASE_URL}/authenticate`, {
        email,
        password,
      })
      .then(res => {
        let userInfo = res.data;

        setUserInfo(userInfo);
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
        setIsLoading(false);

        console.log(
          'authenticate success',
          new Date(),
          ' for ',
          userInfo.email,
        );

        return userInfo;
      })
      .catch(error => {
        // Handle errors
        console.error('Authentication error:', error);
        setIsLoading(false);
      });
  };

  const logout = async () => {
    try {
      console.log('logout called', new Date(), `for  ${userInfo.email}`);

      const response = await axios.post(
        `${BASE_URL}/logout`,
        {},
        {
          headers: {Authorization: `Bearer ${userInfo.token}`},
        },
      );

      console.log('Logout response:', response.data);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear AsyncStorage and update state
      await AsyncStorage.removeItem('userInfo');
      setUserInfo({});
    }
  };

  // Inside checkTokenValidity function
  const checkTokenValidity = async () => {
    console.log(
      'checkTokenValidity called',
      new Date(),
      ` FOR : ${userInfo.email}`,
    );

    if (userInfo && userInfo.email && userInfo.token) {
      try {
        const response = await axios.post(`${BASE_URL}/check-token`, {
          email: userInfo.email,
          token: userInfo.token,
        });

        if (response.status === 200) {
          console.log('Token is valid');
          return true;
        } else {
          console.error('Token validation failed. Response:', response);
          return false;
        }
      } catch (error) {
        console.error('Error checking token validity:', error);
        return false;
      }
    }

    console.log('Token information missing');
    return false;
  };

  const isLoggedIn = async () => {
    console.log();
    console.log('FUNCTION isLoggedIn : ');
    console.log();
    try {
      // Check if userInfo exists and the token is valid
      if (userInfo && (await checkTokenValidity())) {
        // Set the user info if the token is valid
        setUserInfo(userInfo);
      } else {
        logout();
      }
    } catch (e) {
      // Handle errors related to AsyncStorage or other issues
      console.log(`is logged in error ${e}`);
    }
  };

  useEffect(() => {
    // Check token validity every 5 minutes (adjust as needed)
    const interval = setInterval(async () => {
      isLoggedIn();
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isLoading, isInitialCheck]);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userInfo,
        register,
        authenticate,
        splashLoading,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
