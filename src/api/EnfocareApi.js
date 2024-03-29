import axios from 'axios';
import React, {createContext, useContext, useState, useEffect} from 'react';
import {
  ENFOCARE_URL,
  VOXIMPLANT_ACCOUNT_ID,
  VOXIMPLANT_API_KEY,
  VOXIMPLANT_APPLICATION_ID,
} from '../config';
import {AuthContext} from '../context/AuthContext';
// import encode from 'base64-js';
import {Buffer} from 'buffer';
// import {log} from 'console';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const EnfocareApi = createContext();

export const EnfocareApiProvider = ({children}) => {
  const {userInfo} = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const setProfile = async profileDataInput => {
    setIsLoading(true);
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

      setIsLoading(false);

      return returnData;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const saveDoctorLobby = async returnData => {
    setIsLoading(true);
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

      setIsLoading(false);
      return response;
    } catch (error) {
      setIsLoading(false);
      console.error('Error saving doctor lobby:', error);
      throw error;
    }
  };

  const getDoctorLobby = async doctorEmail => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${ENFOCARE_URL}/lobby/${doctorEmail}`, {
        headers: {Authorization: `Bearer ${userInfo.token}`},
      });

      setIsLoading(false);
      return response;
    } catch (error) {
      setIsLoading(false);
      console.error('Error saving doctor lobby:', error);
      throw error;
    }
  };

  const getProfile = async toFind => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${ENFOCARE_URL}/profile/${toFind ? toFind : userInfo.email}`,
        {
          headers: {Authorization: `Bearer ${userInfo.token}`},
        },
      );

      setIsLoading(false);
      return response.data;
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching user profiles:', error);
    }
  };

  const uploadAvatar = async selectedImageUri => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: selectedImageUri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });

      const response = await axios.post(
        `${ENFOCARE_URL}/profile/avatar/${userProfile.email}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      setIsLoading(false);

      return response.data;
    } catch (error) {
      setIsLoading(false);
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  const getAvatar = async email => {
    setIsLoading(true);
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
      setIsLoading(false);
      // Use base64Image as needed, for example, setting it in state
      return `data:image/jpeg;base64, ${base64Image}`;
    } catch (error) {
      console.error('Error fetching avatar:', error);

      setIsLoading(false);
    }
  };

  const getDoctorListByField = async doctorField => {
    setIsLoading(true);
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

      setIsLoading(false);
      return returnData;
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching user doctors:', error);
    }
  };

  const getLobbyInformation = async email => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${ENFOCARE_URL}/lobby/${email}`, {
        headers: {Authorization: `Bearer ${userInfo.token}`},
      });

      setIsLoading(false);
      return response.data;
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching user doctors:', error);
    }
  };

  const getLobbyQueue = async email => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${ENFOCARE_URL}/queue/count?email=${email}`,
        {
          headers: {Authorization: `Bearer ${userInfo.token}`},
        },
      );
      setIsLoading(false);
      return response.data;
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching user getLobbyQueue:', error);
    }
  };

  const saveQueueEntry = async (doctorSelected, patientEmail) => {
    setIsLoading(true);
    try {
      const queueNumber = await getLobbyQueue(doctorSelected.email);

      const currentDate = new Date();
      const timeIn = currentDate.toISOString();

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
      setIsLoading(false);
      return response;
    } catch (error) {
      setIsLoading(false);
      console.error('Error saving doctor lobby:', error.response);

      throw error;
    }
  };

  const getPatientQueue = async doctorEmail => {
    setIsLoading(true);
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
        return [];
      } else {
        console.error('Unexpected status code:', response.status);

        throw new Error(`Unexpected status code: ${response.status}`);
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching patient queue:', error);
      throw error;
    }
  };

  const createVoximplantAccount = async profile => {
    setIsLoading(true);
    const displayName = profile.firstname + ' ' + profile.lastname;

    try {
      if (profile && profile.firstname && profile.lastname && profile.phone) {
        // Extract numeric part from the phone number
        const numericPhone = profile.phone.replace(/\D/g, '');

        // Concatenate firstname, lastname, and numeric part of the phone number
        const voxUsername = `${profile.firstname.toLowerCase()}${profile.lastname.toLowerCase()}${numericPhone}`;

        const userRawCredential = await AsyncStorage.getItem('userCredential');
        const userCredential = JSON.parse(userRawCredential);

        const response = await axios.get(
          `https://api.voximplant.com/platform_api/AddUser/?account_id=${VOXIMPLANT_ACCOUNT_ID}&api_key=${VOXIMPLANT_API_KEY}&user_name=${voxUsername}&user_display_name=${displayName}&user_password=${userCredential.password}&application_id=${VOXIMPLANT_APPLICATION_ID}`,
        );

        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const getProfileByPhone = async phone => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${ENFOCARE_URL}/profile/phone/${phone}`,
        {
          headers: {Authorization: `Bearer ${userInfo.token}`},
        },
      );

      setIsLoading(false);
      return response.data;
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching user profile By Phone:', error);
    }
  };

  const saveConsultation = async consultationInfo => {
    try {
      // Ensure the date format and other data match what your backend expects
      const response = await axios.post(
        `${ENFOCARE_URL}/save`, // Corrected endpoint to match your Spring Boot backend
        {
          doctor: consultationInfo.doctor,
          patient: consultationInfo.patient,
          date: consultationInfo.date,
          diagnosis: consultationInfo.diagnosis,
          treatment: consultationInfo.treatment,
          ailment: consultationInfo.ailment,
          symptoms: consultationInfo.symptoms,
        },
        {
          headers: {Authorization: `Bearer ${userInfo.token}`}, // Ensure the token is handled securely
        },
      );

      alert('Consultation saved successfully!'); // User feedback on success
      return response.data;
    } catch (error) {
      console.error('Error saving consultation:', error.response || error);
      alert('Failed to save consultation.'); // User feedback on failure
      throw error;
    }
  };

  function getMimeType(file) {
    const extension = file.uri.split('.').pop().toLowerCase();
    let type;
    switch (extension) {
      case 'pdf':
        type = 'application/pdf';
        break;
      case 'jpg':
      case 'jpeg':
        type = 'image/jpeg';
        break;
      case 'png':
        type = 'image/png';
        break;
      case 'doc':
        type = 'application/msword';
        break;
      case 'docx':
        type =
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      // Add more cases as needed
      default:
        type = 'application/octet-stream'; // generic stream of bytes
    }
    return type;
  }

  const uploadDiagnosisFile = async (patientEmail, doctorEmail, file) => {
    setIsLoading(true); // Start loading
    try {
      const formData = new FormData();
      const mimeType = getMimeType(file); // Dynamically determine the MIME type

      formData.append('file', {
        uri: file.uri,
        type: mimeType, // Use the dynamically determined MIME type
        name: file.name || 'uploaded_file',
      });

      const response = await axios.post(
        `${ENFOCARE_URL}/upload/${patientEmail}/${doctorEmail}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      setIsLoading(false); // End loading
      alert('Diagnosis file uploaded successfully!'); // User feedback
      return response.data;
    } catch (error) {
      setIsLoading(false); // End loading
      console.error('Error uploading diagnosis file:', error.response || error);
      alert('Failed to upload diagnosis file.'); // User feedback
      throw error;
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
      }
    };
    if (Object.keys(userInfo).length !== 0) {
      fetchProfile();
    }
  }, [userInfo]);

  useEffect(() => {
    // console.log('THIS IS TO NOTIFY YOU USERPROFILE HAS CHANGE');
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
        getProfileByPhone,
        saveConsultation,
      }}>
      {children}
    </EnfocareApi.Provider>
  );
};
