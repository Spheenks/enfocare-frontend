import axios from 'axios';
import React, {createContext, useState} from 'react';
import {BASE_URL} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

        console.log(userInfo.email);
        setIsLoading(false);
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

  return (
    <AuthContext.Provider value={{userInfo, register, authenticate}}>
      {children}
    </AuthContext.Provider>
  );
};
