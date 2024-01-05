import axios from 'axios';
import React, {createContext, useContext, useState, useEffect} from 'react';
import {ENFOCARE_URL} from '../config';
import {AuthContext} from '../context/AuthContext';
import encode from 'base64-js';
import {Buffer} from 'buffer';

export const EnfocareApi = createContext();

export const EnfocareApiProvider = ({children}) => {
  const {userInfo} = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

      console.log('isDoctor from DATA :   ', returnData.isDoctor);

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
          doctor: returnData.firstname + returnData.lastname,
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

  const getProfile = async () => {
    console.log('getProfile Called');

    try {
      const response = await axios.get(
        `${ENFOCARE_URL}/profile/${userInfo.email}`,
        {
          headers: {Authorization: `Bearer ${userInfo.token}`},
        },
      );

      return response;
    } catch (error) {
      setUserProfile({});
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

  //   const getAvatar = async (email) => {
  //   try {
  //     const response = await axios.get(`${ENFOCARE_URL}/avatar/${email}`, {
  //       responseType: 'arraybuffer',
  //     });

  //     const base64Image = Buffer.from(response.data, 'binary').toString('base64');
  //     const imageUri = `data:image/jpeg;base64,${base64Image}`;

  //     return imageUri;
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  const getAvatar = async email => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${ENFOCARE_URL}/profile/avatar/${userProfile.email}`,
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
      setIsLoading(false);
      // Use base64Image as needed, for example, setting it in state
      return `data:image/jpeg;base64, ${base64Image}`;
    } catch (error) {
      console.error('Error fetching avatar:', error);
    }
  };
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();

        if (response.status === 200) {
          let responseData = response.data;

          if (responseData.isDoctor === true) {
            const lobby = await getDoctorLobby(responseData.email);

            const lobbyData = lobby.data;

            responseData = {
              ...responseData,
              lobbyData,
            };
          }

          console.log('BETLOG', responseData);

          setUserProfile(responseData);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    if (userInfo) {
      fetchProfile();
    }
  }, [userInfo]);

  return (
    <EnfocareApi.Provider
      value={{
        getProfile,
        userProfile,
        isLoading,
        setProfile,
        uploadAvatar,
        getAvatar,
      }}>
      {children}
    </EnfocareApi.Provider>
  );
};
