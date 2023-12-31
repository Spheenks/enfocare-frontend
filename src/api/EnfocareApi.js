import axios from 'axios';
import React, {createContext, useContext, useState, useEffect} from 'react';
import {ENFOCARE_URL} from '../config';
import {AuthContext} from '../context/AuthContext';

export const EnfocareApi = createContext();

export const EnfocareApiProvider = ({children}) => {
  const {userInfo} = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const setProfile = async profileDataInput => {
    console.log('setProfile is called for', userInfo.email);
    setError(null); // Reset the error state

    console.log('TANGINAMO', `${ENFOCARE_URL}/profile/save`);

    try {
      const response = await axios.post(
        `${ENFOCARE_URL}/profile/save`,
        {
          email: userInfo.email,
          firstname: profileDataInput.firstname,
          lastname: profileDataInput.lastname,
          gender: profileDataInput.gender,
          birthday: profileDataInput.birthday,
          height: profileDataInput.height,
          phone: profileDataInput.phone,
          weight: profileDataInput.weight,
          bloodType: profileDataInput.bloodType,
          classification: profileDataInput.classification,
          isDoctor: profileDataInput.isDoctor,
          medicalField: profileDataInput.medicalField,
          biometric: 'n',
          age: profileDataInput.age,
          bmi: profileDataInput.bmi,
          profileSetup: 'complete',
        },
        {
          headers: {Authorization: `Bearer ${userInfo.token}`},
        },
      );

      const data = response.data;

      setUserProfile(data);

      console.log('WOW ', data);

      return data; // Return the data for successful responses
    } catch (error) {
      setError(error); // Set the error state for other types of errors

      throw error; // Re-throw the error for other types of errors
    }
  };

  const getProfile = async () => {
    console.log('getProfile Called');
    setError(null); // Reset the error state

    try {
      const response = await axios.get(
        `${ENFOCARE_URL}/profile/${userInfo.email}`,
        {
          headers: {Authorization: `Bearer ${userInfo.token}`},
        },
      );

      const data = response.data;

      console.log(data);
      setUserProfile(data);
      return data; // Return the data for successful responses
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(error); // Set the error state for other types of errors
      throw error; // Re-throw the error for other types of errors
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await getProfile();
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <EnfocareApi.Provider
      value={{getProfile, userProfile, isLoading, error, setProfile}}>
      {children}
    </EnfocareApi.Provider>
  );
};
