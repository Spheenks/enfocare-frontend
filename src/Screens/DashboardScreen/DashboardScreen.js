import React, {Modal, useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from 'react-native';
import {AuthContext} from '../../context/AuthContext';
import CustomButton from '../../Components/CustomButton';
import Spinner from 'react-native-loading-spinner-overlay';
import {useNavigation} from '@react-navigation/native';
import PatientMenu from '../MenuScreen/PatientMenu';
import DoctorMenu from '../MenuScreen/DoctorMenu';
import {EnfocareApi} from '../../api/EnfocareApi';
import PickerModalSettings from '../../Components/PickerModalSettings';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {launchImageLibrary} from 'react-native-image-picker';
import Entypo from 'react-native-vector-icons/Entypo';
import {Voximplant} from 'react-native-voximplant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {APP_NAME, ACC_NAME} from '../../config';
import UploadDiagnosis from '../../Components/UploadDiagnosis/UploadDiagnosis';

const DashboardScreen = () => {
  const voximplant = Voximplant.getInstance();
  const navigation = useNavigation();
  const {userProfile, uploadAvatar, getAvatar} = useContext(EnfocareApi);

  const [isDiagnosisModalVisible, setIsDiagnosisModalVisible] = useState(false);

  const {logout} = useContext(AuthContext);

  const [previewImageUri, setPreviewImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const onLogoutPressed = async () => {
    try {
      await voximplant.disconnect();
      logout();
    } catch (error) {
      console.error('Error during logouts:', error);
    }
  };

  const onConsultPressed = () => {
    navigation.navigate('ConsultListingScreen');
  };

  const onDoctorQueue = () => {
    navigation.navigate('LobbyScreen');
  };

  const handleImageUpload = async () => {
    try {
      const selectedImageUri = await selectImage();

      if (selectedImageUri) {
        setPreviewImageUri(selectedImageUri);
        await uploadAvatar(selectedImageUri);
        console.log('File uploaded successfully');
      }
    } catch (error) {
      console.error('Error handling image upload:', error);
    }
  };

  const selectImage = () => {
    return new Promise((resolve, reject) => {
      const options = {mediaType: 'photo'};

      launchImageLibrary(options, response => {
        if (response.didCancel) {
          reject(new Error('Image selection canceled'));
        } else if (response.error) {
          reject(new Error(response.error));
        } else if (response.assets && response.assets.length > 0) {
          const selectedImageUri = response.assets[0].uri;
          resolve(selectedImageUri);
        } else {
          reject(new Error('Invalid image response'));
        }
      });
    });
  };

  const onUploadDiagnosis = () => {
    setIsDiagnosisModalVisible(!isDiagnosisModalVisible);
  };

  const onConsultations = () => {
    navigation.navigate('DoctorConsultationRecordsScreen');
  };

  const onConsultationsPatient = () => {
    navigation.navigate('PatientConsultationScreen');
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const avatar = await getAvatar(userProfile.email);
        setPreviewImageUri(avatar);
      } catch (error) {
        console.error('Error fetching avatar:', error);
      }
    };

    const fetchData = async () => {
      try {
        const userRawCredential = await AsyncStorage.getItem('userCredential');
        const userCredential = JSON.parse(userRawCredential);

        if (userProfile.email) {
          const numericPhone = userProfile.phone.replace(/\D/g, '');
          const voxUsername = `${userProfile.firstname.toLowerCase()}${userProfile.lastname.toLowerCase()}${numericPhone}`;

          await loginVox(voxUsername, userCredential.password);
          await fetchAvatar();
        }
      } catch (error) {
        console.error('Error fetching user credential or avatar:', error);
      }
    };

    fetchData();
  }, [userProfile]);

  useEffect(() => {
    voximplant.on(
      Voximplant.ClientEvents.IncomingCall,
      incomingCallEvent => {
        navigation.navigate('IncomingCallScreen', {
          call: incomingCallEvent.call,
        });
        return () => {
          voximplant.off(Voximplant.ClientEvents.IncomingCall);
        };
      },
      [],
    );
  }, []);

  /* VOXIMPLANT RELATED */

  async function loginVox(userid, password) {
    const fqUsername = `${userid}@${APP_NAME}.${ACC_NAME}.voximplant.com`;

    console.log('SHEESH', fqUsername);
    try {
      let clientState = await voximplant.getClientState();
      if (clientState === Voximplant.ClientState.DISCONNECTED) {
        await voximplant.connect();
        await voximplant.login(fqUsername, password);
      }
      if (clientState === Voximplant.ClientState.CONNECTED) {
        await voximplant.login(fqUsername, password);
      }
    } catch (e) {
      let message;
      switch (e.name) {
        case Voximplant.ClientEvents.ConnectionFailed:
          message = 'Connection error, check your internet connection';
          break;
        case Voximplant.ClientEvents.AuthResult:
          message = convertCodeMessage(e.code);
          break;
        default:
          message = 'Unknown error. Try again';
      }
      console.log('Dashboard Voximplant login error:', e);
      showLoginError(message);
    }
  }

  function convertCodeMessage(code) {
    switch (code) {
      case 401:
        return 'Invalid password';
      case 404:
        return 'Invalid user';
      case 491:
        return 'Invalid state';
      default:
        return 'Try again later';
    }
  }

  function showLoginError(message) {
    Alert.alert('Login error', message, [
      {
        text: 'OK',
      },
    ]);
  }

  return (
    <View style={styles.root}>
      <View style={styles.settingsContainer}>
        <TouchableOpacity style={styles.settingsIconContainer}>
          <FontAwesome name="gear" size={40} color="#74DA74" />
        </TouchableOpacity>
      </View>

      <View style={styles.avatarAndName}>
        <TouchableOpacity style={styles.avatarCont} onPress={handleImageUpload}>
          {previewImageUri != null ? (
            <Image
              source={{uri: previewImageUri}}
              style={styles.previewImage}
            />
          ) : (
            <Entypo name="emoji-flirt" size={80} color="#74DA74" />
          )}
        </TouchableOpacity>
        <Text style={styles.nameCont}>
          {userProfile.firstname} {userProfile.lastname}
        </Text>
      </View>

      <View>
        {!userProfile.isDoctor ? (
          <PatientMenu
            onLogout={onLogoutPressed}
            onFindDoctor={onConsultPressed}
            onConsultationPatient={onConsultationsPatient}
          />
        ) : (
          <DoctorMenu
            onLogout={onLogoutPressed}
            onDoctorQueue={onDoctorQueue}
            onUpload={onUploadDiagnosis}
            onConsultations={onConsultations}
          />
        )}
      </View>

      <UploadDiagnosis
        isVisible={isDiagnosisModalVisible}
        onClose={() => setIsDiagnosisModalVisible(false)}
        onUploadSuccess={() => {
          console.log('Upload Successful');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
  nameCont: {
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 10,
    color: '#333333',
  },
  settingsContainer: {
    position: 'absolute',
    height: 70,
    width: '100%',
    top: 0,
  },
  settingsIconContainer: {
    position: 'absolute',
    height: 50,
    width: 50,
    top: 10,
    right: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    elevation: 5,
  },
  avatarCont: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    height: 120,
    width: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 5,
  },
  previewImage: {
    height: '100%',
    width: '100%',
    borderRadius: 60,
  },
  avatarAndName: {
    height: 200,
    width: '80%',
    borderBottomColor: '#D3D3D3',
    borderBottomWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  //MODAL

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default DashboardScreen;
