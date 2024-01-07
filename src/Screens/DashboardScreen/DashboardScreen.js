import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Image} from 'react-native';
import {AuthContext} from '../../context/AuthContext';
import CustomButton from '../../Components/CustomButton';
import Spinner from 'react-native-loading-spinner-overlay';
import {useNavigation} from '@react-navigation/native';
import PatientMenu from '../MenuScreen/PatientMenu';
import DoctorMenu from '../MenuScreen/DoctorMenu';
import {EnfocareApi} from '../../api/EnfocareApi';
import PickerModalSettings from '../../Components/PickerModalSettings';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Entypo from 'react-native-vector-icons/Entypo';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const {userProfile, uploadAvatar, getAvatar} = useContext(EnfocareApi);

  const {logout} = useContext(AuthContext);

  const [previewImageUri, setPreviewImageUri] = useState(null);

  const onLogoutPressed = () => {
    logout();
  };

  const onConsultPressed = async () => {
    navigation.navigate('ConsultListingScreen');
  };

  const onDoctorQueue = () => {
    navigation.navigate('LobbyScreen');
  };

  const handleImageUpload = async () => {
    try {
      const selectedImageUri = await selectImage();

      console.log(selectedImageUri);

      if (selectedImageUri) {
        setPreviewImageUri(selectedImageUri);

        // Upload the selected image
        await uploadAvatar(selectedImageUri);
        console.log('File uploaded successfully');
      }
    } catch (error) {
      console.error('Error handling image upload:', error);
    }
  };

  const selectImage = async () => {
    return new Promise((resolve, reject) => {
      const options = {
        mediaType: 'photo',
      };

      launchImageLibrary(options, response => {
        if (response.didCancel) {
          reject(new Error('Image selection canceled'));
        } else if (response.error) {
          reject(new Error(response.error));
        } else if (response.assets && response.assets.length > 0) {
          // Access the first asset in the array
          const selectedImageUri = response.assets[0].uri;
          resolve(selectedImageUri);
        } else {
          reject(new Error('Invalid image response'));
        }
      });
    });
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

    if (userProfile.email) {
      fetchAvatar();
    }
  }, [userProfile, getAvatar]);

  return (
    <View style={styles.root}>
      {/* <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      /> */}

      <View style={styles.settingsContainer}>
        <TouchableOpacity
          style={styles.settingsIconContainer}
          // onPress={toggleSettings}
        >
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
            <>
              <Entypo name="emoji-flirt" size={80} color="#74DA74" />
            </>
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
            // viewFiles={viewFiles}
          />
        ) : (
          <DoctorMenu
            onLogout={onLogoutPressed}
            onDoctorQueue={onDoctorQueue}
            // onUpload={onUploadFileForUser}
          />
        )}
      </View>

      {/* <PickerModalSettings
        options={
          userIsBioEnabled === true ? biometricOption2 : biometricOption1
        }
        onSelect={value => {
          setIsSettingModalVisible(false), settingAction(value);
        }}
        isVisible={isSettingModalVisible}
        onClose={() => setIsSettingModalVisible(false)}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  nameCont: {
    fontWeight: 'bold',
    fontSize: 30,
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
  },
  avatarCont: {
    borderWidth: 1,
    borderColor: 'black',
    height: 180,
    width: 180,
    borderRadius: 100,
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
  },
  previewImage: {
    height: '100%',
    width: '100%',
    borderRadius: 100,
    backgroundColor: 'red',
  },

  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarAndName: {
    height: 250,
    width: '80%',
    borderBottomColor: '#D3D3D3',
    borderBottomWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  head: {
    color: 'black',
  },
});

export default DashboardScreen;
