import axios from 'axios';
import React, {createContext, useContext, useState, useEffect} from 'react';
import {
  ENFOCARE_URL,
  VOXIMPLANT_ACCOUNT_ID,
  VOXIMPLANT_API_KEY,
  VOXIMPLANT_APPLICATION_ID,
} from '../config';
import {AuthContext} from '../context/AuthContext';
import encode from 'base64-js';
import {Buffer} from 'buffer';
import {log} from 'console';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const EnfocareApi = createContext();

export const EnfocareApiProvider = ({children}) => {
  const {userInfo} = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState({});

  const setProfile = async profileDataInput => {
    console.log('setProfile is called for', userInfo.email);

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
          biometric: profileDataInput.biometric,
          age: profileDataInput.age,
          bmi: profileDataInput.bmi,
          profileSetup: 'complete',
        },
        {
          headers: {Authorization: `Bearer ${userInfo.token}`},
        },
      );

      let returnData = response.data;

      if (response.status === 200) {
        createVoximplantAccount(returnData);
      }

      if (returnData.isDoctor === true) {
        const lobbyResponse = await saveDoctorLobby(returnData);

        const lobbyData = lobbyResponse.data;

        returnData = {
          ...returnData,
          lobby: lobbyData,
        };
      }

      setUserProfile(returnData);

      return returnData; // Return the data for successful responses
    } catch (error) {
      throw error; // Re-throw the error for other types of errors
    }
  };

  const saveDoctorLobby = async returnData => {
    try {
      const response = await axios.post(
        `${ENFOCARE_URL}/lobby/save`,
        {
          email: returnData.email,
          doctor: returnData.firstname + ' ' + returnData.lastname,
          maxCapacity: 8,
        },
        {
          headers: {Authorization: `Bearer ${userInfo.token}`},
        },
      );

      return response;
    } catch (error) {
      // Handle lobby save errors if needed
      console.error('Error saving doctor lobby:', error);
      throw error; // Re-throw the error for other types of errors
    }
  };

  const getDoctorLobby = async doctorEmail => {
    try {
      const response = await axios.get(`${ENFOCARE_URL}/lobby/${doctorEmail}`, {
        headers: {Authorization: `Bearer ${userInfo.token}`},
      });

      console.log(response.status);

      return response;
    } catch (error) {
      // Handle lobby save errors if needed
      console.error('Error saving doctor lobby:', error);
      throw error; // Re-throw the error for other types of errors
    }
  };

  const getProfile = async toFind => {
    console.log('getProfile Called');

    try {
      const response = await axios.get(
        `${ENFOCARE_URL}/profile/${toFind ? toFind : userInfo.email}`,
        {
          headers: {Authorization: `Bearer ${userInfo.token}`},
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const uploadAvatar = async selectedImageUri => {
    console.log('uploadAvatar');
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: selectedImageUri,
        type: 'image/jpeg', // Adjust the type based on the file type
        name: 'image.jpg', // You can use the original file name here
      });

      const response = await axios.post(
        `${ENFOCARE_URL}/profile/avatar/${userProfile.email}`, // Update the endpoint accordingly
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      console.log('File upload successful:', response.data);

      // You can handle the response as needed, e.g., update user profile with file details

      return response.data; // Return the data for successful responses
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error; // Re-throw the error for other types of errors
    }
  };

  const getAvatar = async email => {
    try {
      const response = await axios.get(
        `${ENFOCARE_URL}/profile/avatar/${email}`,
        {
          headers: {
            Accept: 'image/jpeg',
            Authorization: `Bearer ${userInfo.token}`,
          },
          responseType: 'arraybuffer',
        },
      );

      // Convert the ArrayBuffer to base64 using Buffer
      const base64Image = Buffer.from(response.data, 'binary').toString(
        'base64',
      );

      // Use base64Image as needed, for example, setting it in state
      return `data:image/jpeg;base64, ${base64Image}`;
    } catch (error) {
      // console.error('Error fetching avatar:', error);
    }
  };

  const getDoctorListByField = async doctorField => {
    try {
      const response = await axios.get(
        `${ENFOCARE_URL}/profile/specialization/${doctorField}`,
        {
          headers: {Authorization: `Bearer ${userInfo.token}`},
        },
      );
      let returnData;

      if (response.status === 200) {
        returnData = response.data;
      } else {
        returnData = {};
      }
      return returnData;
    } catch (error) {
      console.error('Error fetching user doctors:', error);
    }
  };

  const getLobbyInformation = async email => {
    try {
      const response = await axios.get(`${ENFOCARE_URL}/lobby/${email}`, {
        headers: {Authorization: `Bearer ${userInfo.token}`},
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching user doctors:', error);
    }
  };

  const getLobbyQueue = async email => {
    console.log('getLobbyQueueCalled', email);
    try {
      const response = await axios.get(
        `${ENFOCARE_URL}/queue/count?email=${email}`,
        {
          headers: {Authorization: `Bearer ${userInfo.token}`},
        },
      );

      console.log('THIS SHIT ', response.data);

      return response.data;
    } catch (error) {
      console.error('Error fetching user getLobbyQueue:', error);
    }
  };

  const saveQueueEntry = async (doctorSelected, patientEmail) => {
    console.log('saveQueueEntry Called', patientEmail);

    try {
      const queueNumber = await getLobbyQueue(doctorSelected.email);

      const currentDate = new Date();
      const timeIn = currentDate.toISOString();

      console.log('TIME! ', timeIn);

      const response = await axios.post(
        `${ENFOCARE_URL}/queue/save`,
        {
          doctor: doctorSelected.email,
          patient: patientEmail,
          queue: queueNumber,
          timeIn: timeIn,
        },
        {
          headers: {Authorization: `Bearer ${userInfo.token}`},
        },
      );

      console.log(response.data);
      return response;
    } catch (error) {
      console.error('Error saving doctor lobby:', error.response);

      throw error; // Re-throw the error for other types of errors
    }
  };

  const getPatientQueue = async doctorEmail => {
    console.log('getPatientQueue ', 'called');
    try {
      const response = await axios.get(
        `${ENFOCARE_URL}/queue/list?doctor=${doctorEmail}`,
        {
          headers: {Authorization: `Bearer ${userInfo.token}`},
        },
      );

      if (response.status === 200) {
        return response.data;
      } else if (response.status === 404) {
        return []; // Return an empty array for 404 status
      } else {
        console.error('Unexpected status code:', response.status);
        // Throw an error for unexpected status codes
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching patient queue:', error);
      throw error; // Rethrow the error to propagate it to the caller
    }
  };

  const createVoximplantAccount = async profile => {
    console.log('createVoximplantAccount called');
    const displayName = profile.firstname + ' ' + profile.lastname;

    try {
      if (profile && profile.firstname && profile.lastname && profile.phone) {
        // Extract numeric part from the phone number
        const numericPhone = profile.phone.replace(/\D/g, '');

        // Concatenate firstname, lastname, and numeric part of the phone number
        const voxUsername = `${profile.firstname.toLowerCase()}${profile.lastname.toLowerCase()}${numericPhone}`;

        console.log(voxUsername);

        const userRawCredential = await AsyncStorage.getItem('userCredential');
        const userCredential = JSON.parse(userRawCredential);

        console.log('USER RAW', userCredential);

        const response = await axios.get(
          `https://api.voximplant.com/platform_api/AddUser/?account_id=${VOXIMPLANT_ACCOUNT_ID}&api_key=${VOXIMPLANT_API_KEY}&user_name=${voxUsername}&user_display_name=${displayName}&user_password=${userCredential.password}&application_id=${VOXIMPLANT_APPLICATION_ID}`,
        );

        // Handle the response...
        console.log(response.data);
      } else {
        console.log('Invalid profile data');
      }
    } catch (error) {
      // Handle errors...
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();

        if (response.email === userInfo.email) {
          let responseData = response;

          if (responseData.isDoctor === true) {
            const lobby = await getDoctorLobby(responseData.email);

            const lobbyData = lobby.data;

            responseData = {
              ...responseData,
              lobbyData,
            };
          }

          setUserProfile(responseData);
        }
      } catch (error) {
        setUserProfile({});
        console.error('Error fetching user profile: Line 260', error);
      }
    };
    if (userInfo) {
      fetchProfile();
    }
  }, [userInfo]);

  useEffect(() => {
    console.log('THIS IS TO NOTIFY YOU USERPROFILE HAS CHANGE');
  }, [userProfile]);

  return (
    <EnfocareApi.Provider
      value={{
        getProfile,
        userProfile,
        setProfile,
        uploadAvatar,
        getAvatar,
        getDoctorListByField,
        getLobbyQueue,
        getLobbyInformation,
        saveQueueEntry,
        getPatientQueue,
      }}>
      {children}
    </EnfocareApi.Provider>
  );
};
