import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {AuthContext} from '../../context/AuthContext';
import CustomButton from '../../Components/CustomButton';
import Spinner from 'react-native-loading-spinner-overlay';
import {ProfileSetup} from '../../api/EnfocareApi';
import {useNavigation} from '@react-navigation/native';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const {logout, isLoading} = useContext(AuthContext);
  // const [userProfile, setUserProfile] = useState(null); // Initialize as null
  // const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const onLogoutPressed = () => {
    logout();
  };

  return (
    <View style={styles.root}>
      <Spinner
        visible={isLoading}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />

      <View>
        <CustomButton text="Logout" type="PRIMARY" onPress={onLogoutPressed} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DashboardScreen;
