import React, {useContext, useState} from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';
import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../Components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import {AuthContext} from '../../context/AuthContext';

import Spinner from 'react-native-loading-spinner-overlay';

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const SignUpScreen = () => {
  const {isLoading, register} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const {control, handleSubmit, watch} = useForm();

  const pwd = watch('password');
  const navigation = useNavigation();

  const onSignUpPressed = data => {
    register(data.email, data.password);

    navigation.navigate('SignInScreen');
  };
  const onSignInInsteadPressed = () => {
    navigation.navigate('SignInScreen');
  };

  return (
    <View style={styles.root}>
      <Spinner
        visible={isLoading}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
      <Text style={styles.title}>SIGN UP</Text>
      <CustomInput
        name="email"
        control={control}
        placeholder="Email"
        rules={{
          required: 'Email is required',
          pattern: {value: EMAIL_REGEX, message: 'Email is Invalid'},
        }}
      />

      <CustomInput
        name="password"
        control={control}
        placeholder="Password"
        secureTextEntry
        rules={{
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'Password should be minimum 8 characters long',
          },
        }}
      />

      <CustomInput
        name="confirmPassword"
        control={control}
        placeholder="Confirm Password"
        secureTextEntry
        rules={{
          validate: value => value == pwd || 'Password do not match',
        }}
      />

      <CustomButton
        text="Sign up"
        type="PRIMARY"
        onPress={handleSubmit(onSignUpPressed)}
      />

      <CustomButton
        text="Sign in Instead"
        type="TERTIARY"
        onPress={onSignInInsteadPressed}
      />

      <Text style={styles.tac}>
        {' '}
        By Signing up, you confirm that you accept our{' '}
        <Text style={styles.tacLink}>Term of Use</Text> and{' '}
        <Text style={styles.tacLink}>Privacy Policy</Text>
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    margin: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  tac: {
    color: 'gray',
    marginVertical: 10,
  },
  tacLink: {
    color: 'blue',
  },
});
export default SignUpScreen;
