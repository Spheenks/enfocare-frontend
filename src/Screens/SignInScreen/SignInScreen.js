import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  Modal,
  Text,
} from 'react-native';
import logo from './../../assets/enfo.png';
import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../Components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  storedEmail,
  storedPassword,
  isBioEnabled,
} from '../../Constants/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import Entypo from 'react-native-vector-icons/Entypo';
import DeviceInfo from 'react-native-device-info';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../../context/AuthContext';

const SignInScreen = () => {
  const {isLoading, authenticate} = useContext(AuthContext);
  const asyncValues = ['storedEmail', 'storedPassword', 'isBioEnabled'];
  const [biometricIsEnabled, setBiometricIsEnabled] = useState(false);
  const [passmodal, setPassModal] = useState(false);
  const [storedAsyncedEmail, setStoredAsyncedEmail] = useState('');
  const [storedAsyncedPassword, setStoredAsyncedPassword] = useState('');
  const {height} = useWindowDimensions();
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const [verificationPending, setVerificationPending] = useState(false);
  const [user, setUser] = useState({});

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  useEffect(() => {
    if (user != null) {
      // navigation.navigate('DashboardScreen');

      navigation.navigate('ProfileSetupScreen');
    }
  }, [user]);

  const onSignInPressed = async data => {
    const authenticatedUser = await authenticate(data.email, data.password);
    setUser(authenticatedUser);
  };
  const onForgotPasswordPressed = () => {
    // navigation.navigate('ResetPasswordScreen');
  };
  const onSignUpPressed = () => {
    navigation.navigate('SignUpScreen');
  };
  const onSignOutPressed = () => {
    setStoredAsyncedEmail('');
    setStoredAsyncedPassword('');
  };
  return (
    <View style={styles.root}>
      <Spinner
        visible={isLoading}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
      <Spinner
        visible={verificationPending}
        textContent={'Waiting for email Verification...'}
        textStyle={styles.spinnerTextStyle}
      />
      <Image source={logo} style={[styles.logo, {height: height * 0.3}]} />

      <CustomInput
        name="email"
        placeholder="Email"
        rules={{required: 'Email is required'}}
        control={control}
      />

      <CustomInput
        name="password"
        placeholder="Password"
        rules={{
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'Password should be minimum 8 characters long',
          },
        }}
        control={control}
        secureTextEntry
      />
      <CustomButton
        text="Sign in"
        type="PRIMARY"
        onPress={handleSubmit(onSignInPressed)}
      />

      <CustomButton
        text="Forgot Password"
        type="TERTIARY"
        onPress={onForgotPasswordPressed}
      />
      <CustomButton
        text="Doesn't have account? Create one"
        type="TERTIARY"
        onPress={onSignUpPressed}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  twoComponentsSpaceAround: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    minHeight: 60,
    width: '100%',
  },
  twoComponents: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 60,
    width: '100%',
  },
  firstComponentStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
    height: 65,
  },
  secondComponentStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    height: 65,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    position: 'absolute',
    bottom: 0,
    margin: 20,
    height: 200,
    width: '100%',
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
  spinnerTextStyle: {
    color: '#FFF',
  },
  root: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: '70%',
    height: 100,
    maxWidth: 300,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
});
export default SignInScreen;
