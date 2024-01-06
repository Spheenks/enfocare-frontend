import React, {useState, useEffect, useRef, useContext} from 'react';
import {StyleSheet, View, Text, Button, ScrollView} from 'react-native';
import CustomInput from '../../Components/CustomInput';
import {useForm, w} from 'react-hook-form';
import CustomButton from '../../Components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import ScrollViewIndicator from 'react-native-scroll-indicator';
import moment from 'moment';
import CustomPicker from '../../Components/CustomPicker';
import CustomDatePicker from '../../Components/CustomDatePicker/CustomDatePicker';
import CustomPhoneInput from '../../Components/CustomPhoneInput/CustomPhoneInput';
import {EnfocareApi} from '../../api/EnfocareApi';
import {AuthContext} from '../../context/AuthContext';

const NAME_REGEX = /^[A-Za-z0-9 ]+$/;
const NUM_REGEX = /\d+/g;
const ProfileSetupScreen = () => {
  const {setProfile} = useContext(EnfocareApi);
  const {userInfo} = useContext(AuthContext);
  // ASYNC STORAGE CONTROL
  const [storedAsyncedEmail, setStoredAsyncedEmail] = useState('');
  const [storedAsyncedPassword, setStoredAsyncedPassword] = useState('');
  const [isBirthDatePickerVisible, setIsBirthDatePickerVisible] =
    useState(false);

  // LOADING CONTROL
  const [loading, setLoading] = useState(false);

  // NAVIGATION CONTROL
  const navigation = useNavigation();

  // FORM CONTROL
  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
  } = useForm();
  // MODAL CONTROLS
  const [accountTypeModal, setAccountTypeModal] = useState(false);
  const [specsModal, setSpecsModal] = useState(false);
  const [bloodTypeModal, setBloodTypeModal] = useState(false);
  const [genderModal, setGenderModal] = useState(false);
  const [birthdayModal, setBirthdayModal] = useState(false);

  // WATCHERS
  const heightWatcher = watch('height');
  const weightWatcher = watch('weight');
  const accountTypeWatcher = watch('account_type');
  const birthWatcher = watch('birthday');
  const phoneNumWatcher = watch('phonenumber');

  const age = moment(new Date()).year() - moment(birthWatcher).year();
  const bmi =
    703 *
    (weightWatcher / (heightWatcher * 0.393701 * (heightWatcher * 0.393701)));

  // COMPONENT CONTROL
  const [isAccountTypeSelected, setIsAccountTypeSelected] = useState(false);
  const [isSpecializationSelected, setIsSpecializationSelected] =
    useState(false);
  const [showPersonalDetail, setShowPersonalDetail] = useState(false);
  const [allowSetup, setAllowSetup] = useState(false);

  // VALUE CONTROL
  const rawSpecs = [];
  const [user, setUser] = useState();
  const [specs, setSpecs] = useState([]);
  const [birthDay, setBirthDay] = useState(new Date());
  const [specialization, setSpecialization] = useState('');
  const [classification, setClassification] = useState('');

  // FALSE SETTER
  const [falseVal, setFalseVal] = useState(false);

  // OPTION VALUES CONTROL
  const accountType = ['PATIENT', 'DOCTOR'];
  const specializations = [
    'CARDIOLOGY',
    'DERMATOLOGY',
    'ENDOCRINOLOGY',
    'GASTROENTEROLOGY',
    'HEMATOLOGY',
    'IMMUNOLOGY',
    'NEPHROLOGY',
    'NEUROLOGY',
    'ONCOLOGY',
    'ORTHOPEDICS',
    'PULMONOLOGY',
    'RHEUMATOLOGY',
    'ALLERGY AND IMMUNOLOGY',
    'ANESTHESIOLOGY',
    'EMERGENCY MEDICINE',
    'FAMILY MEDICINE',
    'INTERNAL MEDICINE',
    'OBSTETRICS AND GYNECOLOGY',
    'PEDIATRICS',
    'PSYCHIATRY',
    'RADIOLOGY',
    'UROLOGY',
    'OPHTHALMOLOGY',
    'OTOLARYNGOLOGY',
    'PATHOLOGY',
    'PHYSICAL MEDICINE AND REHABILITATION',
    'PLASTIC SURGERY',
    'COLON AND RECTAL SURGERY',
    'THORACIC SURGERY',
    'VASCULAR SURGERY',
    'NUCLEAR MEDICINE',
    'GERIATRICS',
    'INFECTIOUS DISEASE',
    'PAIN MEDICINE',
    'SLEEP MEDICINE',
    'SPORTS MEDICINE',
    'MEDICAL GENETICS',
    'CLINICAL GENETICS',
    'DENTAL MEDICINE',
    'CLINICAL PHARMACOLOGY',
    'FORENSIC MEDICINE',
    'NUCLEAR RADIOLOGY',
    'GYNECOLOGIC ONCOLOGY',
    'NEONATOLOGY',
    'PEDIATRIC SURGERY',
    'HAND SURGERY',
    'INTERVENTIONAL RADIOLOGY',
    'MOLECULAR GENETICS',
    'MEDICAL MICROBIOLOGY',
    'NEUROTOLOGY',
  ];

  const bloodTypesSelection = [
    'A+',
    'B+',
    'AB+',
    'A-',
    'B-',
    'AB-',
    'O+',
    'O-',
  ];
  const genderSelection = ['Male', 'Female', 'LGBTQ+', 'Vegetarian'];

  // USEEFFECTS
  useEffect(() => {
    getSpecs();
  }, []);

  useEffect(() => {
    if (bmi <= 18.4) {
      setClassification('Underweight');
    }
    if (bmi >= 18.5 && bmi <= 24.9) {
      setClassification('Normal');
    }
    if (bmi >= 25.0 && bmi <= 39.9) {
      setClassification('Overweight');
    }
    if (bmi >= 40.0) {
      setClassification('Obese');
    }
  }, [bmi]);

  // FUNCTIONS

  const togglePicker = () => {
    setBirthdayModal(!birthdayModal);
  };

  const getSpecs = async () => {};

  const onSetupPressed = async data => {
    try {
      const profileData =
        data.account_type === 'PATIENT'
          ? {
              accountType: data.account_type,
              firstname: data.firstname,
              middlename: data.middlename,
              lastname: data.lastname,
              birthday: data.birthday,
              gender: data.gender,
              age: age,
              height: data.height,
              weight: data.weight,
              bloodType: data.bloodtype,
              bmi: bmi,
              classification: classification,
              phone: data.phonenumber,
              isDoctor: false,
              biometric: false,
            }
          : {
              accountType: data.account_type,
              medicalField: data.medical_field,
              firstname: data.firstname,
              middlename: data.middlename,
              lastname: data.lastname,
              gender: data.gender,
              birthday: data.birthday,
              age: age,
              phone: data.phonenumber,
              isDoctor: true,
              biometric: false,
            };

      // Call the setProfile method from the context
      const response = await setProfile(profileData);

      // Handle the response as needed
      console.log('Profile setup response:', response);

      // Navigate to the dashboard or another screen upon successful setup
      // navigation.navigate("DashboardScreen");
    } catch (error) {
      console.error('Profile setup error:', error);
    }
    // console.log('AGAGAGAGAG');
    // userObj = {
    //   id: user.uid,
    //   email: user.email,
    //   accountType: '',
    //   firstname: data.firstname,
    //   middlename: data.middlename,
    //   lastname: data.lastname,
    //   birthday: data.birthday,
    //   gender: data.gender,
    //   age: age,
    //   height: data.height,
    //   weight: data.weight,
    //   bloodType: data.bloodtype,
    //   bmi: bmi,
    //   classification: 'classification',
    //   phone: data.phonenumber,
    // };

    // setProfile(data);
    // console.log(data);
    // setLoading(true);
    // let userObj;
    // try {
    //     if (data.account_type === 'DOCTOR') {
    //         const newLobby = database().ref('lobbies').push({
    //             doctor: user.uid,
    //             settings: {
    //                 maxQue: 8,
    //                 onQueue: {
    //                 },
    //             }
    //         });
    //         const newLobbyId = newLobby.key;
    //         userObj = {
    //             id: user.uid,
    //             email: user.email,
    //             isAvailable: false,
    //             lobby: newLobbyId,
    //             //
    //             accountType: data.account_type,
    //             specialization: data.medical_field,
    //             firstname: data.firstname,
    //             middlename: data.middlename,
    //             lastname: data.lastname,
    //             birthday: data.birthday,
    //             gender: data.gender,
    //             age: age,
    //             contact_details: {
    //                 phone: data.phonenumber
    //             }
    //         }
    //     } else {
    //         userObj = {
    //             id: user.uid,
    //             email: user.email,
    //             accountType: data.account_type,
    //             firstname: data.firstname,
    //             middlename: data.middlename,
    //             lastname: data.lastname,
    //             birthday: data.birthday,
    //             gender: data.gender,
    //             age: age,
    //             medical_attribules: {
    //                 height: data.height,
    //                 weight: data.weight,
    //                 bloodType: data.bloodtype,
    //                 bmi: bmi,
    //                 classification: classification
    //             },
    //             contact_details: {
    //                 phone: data.phonenumber
    //             }
    //         }
    //     }
    //     DeviceInfo.getAndroidId().then(async (mac) => {
    //         await database().ref(`users/${user.uid}/devices/${mac}`).set({
    //             isBiometricLoginEnabled: false
    //         })
    //     })
    //     database().ref(`users/${user.uid}`).set(userObj).then(async () => {
    //         const displayName = data.firstname + " " + data.lastname;
    //         const account_id = "5273318";
    //         const api_key = "53562e79-015f-4155-8f90-1fbd569e8bd8";
    //         const application_id = "10499312";
    //         // "https://api.voximplant.com/platform_api/SetUserInfo/?account_id=1&user_id=1&user_password=7654321"
    //         const response = await fetch(
    //             "https://api.voximplant.com/platform_api/AddUser/?account_id=" +
    //             account_id +
    //             "&api_key=" +
    //             api_key +
    //             "&user_name=" +
    //             user.uid +
    //             "&user_display_name=" +
    //             displayName +
    //             "&user_password=" +
    //             storedAsyncedPassword +
    //             "&application_id=" + application_id
    //         );
    //         const json = await response.json();
    //         const user_id = JSON.stringify(json.user_id);
    //         console.log(json);
    //         console.log(user_id);
    //         const update = {
    //             displayName: displayName
    //         };
    //         await auth().currentUser.updateProfile(update);
    //     }).finally(() => {
    //         setLoading(false);
    //         navigation.navigate("DashboardScreen")
    //     });
    // } catch (error) {
    //     console.log(error);
    // }
  };

  const forcePersonalDetails = value => {
    if (value === 'PATIENT') {
      setShowPersonalDetail(true);
      setSpecialization('');
      setIsSpecializationSelected(false);
      setAllowSetup(true);
    }
    if (value === 'DOCTOR') {
      setShowPersonalDetail(false);
      setAllowSetup(false);
    }

    setIsAccountTypeSelected(true);
  };

  return (
    <>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
      <ScrollViewIndicator
        style={{backgroundColor: 'white'}}
        shouldIndicatorHide={false}
        flexibleIndicator={false}
        scrollIndicatorStyle={{backgroundColor: 'black'}}
        // scrollIndicatorContainerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
      >
        <Spinner
          visible={loading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <View style={styles.registerHeaderCont}>
          <Text style={styles.registerHeader}>[ PROFILE SETUP ]</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={true}
          style={styles.scrollViewStyle}>
          <View style={styles.secondaryHeader}>
            <Text style={styles.secondaryHeaderTitle}>Account Type</Text>
          </View>
          {isAccountTypeSelected === false ? (
            <>
              <CustomPicker
                name="account_type"
                placeholder={'Select'}
                options={accountType}
                close={val => {
                  setAccountTypeModal(false), forcePersonalDetails(val);
                }}
                open={() => {
                  setAccountTypeModal(true);
                }}
                isVisible={accountTypeModal}
                control={control}
                customStyle={styles.bloodTypeSelectorStyle}
              />
            </>
          ) : (
            <>
              <CustomPicker
                name="account_type"
                placeholder={'Select'}
                options={accountType}
                close={val => {
                  setAccountTypeModal(false), forcePersonalDetails(val);
                }}
                open={() => {
                  setAccountTypeModal(true);
                }}
                isVisible={accountTypeModal}
                control={control}
                customStyle={styles.bloodTypeSelectorStyle}
              />
              {accountTypeWatcher === 'DOCTOR' && (
                <>
                  <View style={styles.secondaryHeader}>
                    <Text style={styles.secondaryHeaderTitle}>
                      Medical Field
                    </Text>
                  </View>

                  <CustomPicker
                    name="medical_field"
                    placeholder={'Select'}
                    options={specializations}
                    close={() => {
                      setSpecsModal(false);
                      setShowPersonalDetail(true), setAllowSetup(true);
                    }}
                    open={() => {
                      setSpecsModal(true);
                    }}
                    isVisible={specsModal}
                    control={control}
                    customStyle={styles.bloodTypeSelectorStyle}
                  />
                </>
              )}
            </>
          )}

          {showPersonalDetail === true && (
            <>
              {/* PERSONAL INFO */}
              <View style={styles.secondaryHeader}>
                <Text style={styles.secondaryHeaderTitle}>
                  Personal Details
                </Text>
              </View>
              <CustomInput
                name="firstname"
                placeholder="Firstname"
                rules={{
                  required: 'Firstname is required',
                  pattern: {
                    value: NAME_REGEX,
                    message: 'Invalid : must not contain special shits',
                  },
                }}
                control={control}
              />

              <CustomInput // ADDED
                name="middlename"
                placeholder="Middle name"
                rules={{
                  required: 'Firstname is required',
                  pattern: {
                    value: NAME_REGEX,
                    message: 'Invalid : must not contain special shits',
                  },
                }}
                control={control}
              />

              <CustomInput
                name="lastname"
                placeholder="Lastname"
                rules={{
                  required: 'Lastname is required',
                  pattern: {
                    value: NAME_REGEX,
                    message: 'Invalid : must not contain special shits',
                  },
                }}
                control={control}
              />

              <View style={styles.twoComponents}>
                <View style={styles.firstComponentStyle}>
                  <Text style={{fontWeight: 'bold', color: 'black'}}>
                    Gender
                  </Text>
                </View>
                <View style={styles.secondComponentStyle}>
                  <CustomPicker
                    name="gender"
                    placeholder={'Select'}
                    options={genderSelection}
                    close={() => {
                      setGenderModal(false);
                    }}
                    open={() => {
                      setGenderModal(true);
                    }}
                    isVisible={genderModal}
                    control={control}
                    customStyle={styles.bloodTypeSelectorStyle}
                  />
                </View>
              </View>

              <CustomDatePicker
                name="birthday"
                placeholder={'Birthday'}
                onOpenDatePick={() => togglePicker()}
                isOpen={birthdayModal}
                onClosePicker={() => setBirthdayModal(false)}
                control={control}
              />

              {moment(new Date()).format('YYYY MM DD') !==
                moment(birthWatcher).format('YYYY MM DD') && (
                <View style={styles.twoComponents}>
                  {/* <View style={styles.firstComponentStyle}>
                    <CustomInput
                      name="age"
                      control={control}
                      placeholder={age}
                      customStyleInputStyle={{
                        width: '100%',
                        alignItems: 'center',
                      }}
                      editable={false}
                      selectTextOnFocus={false}
                    />
                  </View> */}

                  <View style={styles.secondComponentStyle}>
                    <Text style={{fontWeight: 'bold'}}>{age ? age : ''}</Text>
                  </View>

                  <View style={styles.secondComponentStyle}>
                    <Text style={{fontWeight: 'bold'}}>
                      {age ? 'year/s old' : ''}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.secondaryHeader}>
                <Text style={styles.secondaryHeaderTitle}>Contact Details</Text>
              </View>

              {/* <View style={styles.bloodTypeSelectorStyle}> */}
              <CustomPhoneInput
                name="phonenumber"
                placeholder={'9xxxxxxx'}
                control={control}
                // ref={phoneInput}

                rules={{
                  validate: value => value !== false || 'Invalid Phone number',
                }}
              />
              {/* </View> */}
            </>
          )}

          {accountTypeWatcher === 'PATIENT' && (
            <>
              <View style={styles.secondaryHeader}>
                <Text style={styles.secondaryHeaderTitle}>
                  Medical Attributes
                </Text>
              </View>

              <View style={styles.twoComponents}>
                <View style={styles.secondComponentStyle}>
                  <Text style={{fontWeight: 'bold', color: 'black'}}>
                    Weight (lbs)
                  </Text>
                </View>

                <View style={styles.secondComponentStyle}>
                  <CustomInput
                    name="weight"
                    placeholder=""
                    rules={{
                      required: 'Weight is required',
                      maxLength: {
                        value: 3,
                        message: 'you are not a monster , arent you',
                      },
                      minLength: {
                        value: 2,
                        message: 'you are not a stick , arent you',
                      },
                      pattern: {
                        value: NUM_REGEX,
                        message: 'This input must be numeric',
                      },
                    }}
                    control={control}
                    customStyleInputStyle={styles.customInputCentered}
                  />
                </View>
              </View>

              <View style={styles.twoComponents}>
                <View style={styles.secondComponentStyle}>
                  <Text style={{fontWeight: 'bold', color: 'black'}}>
                    Height (cm)
                  </Text>
                </View>

                <View style={styles.secondComponentStyle}>
                  <CustomInput
                    name="height"
                    placeholder=""
                    rules={{
                      required: 'Height is required',
                      maxLength: {
                        value: 3,
                        message: 'lol, dream big',
                      },
                      minLength: {
                        value: 2,
                        message: 'lol , is it your penis you measured',
                      },
                      pattern: {
                        value: NUM_REGEX,
                        message: 'This input must be numeric',
                      },
                    }}
                    control={control}
                    customStyleInputStyle={styles.customInputCentered}
                  />
                </View>
              </View>

              <View style={styles.twoComponents}>
                <View style={styles.secondComponentStyle}>
                  <Text style={{fontWeight: 'bold', color: 'black'}}>BMI</Text>
                </View>

                <View style={styles.secondComponentStyle}>
                  <Text style={{fontWeight: 'bold', color: 'black'}}>
                    {bmi ? bmi : '---'}
                  </Text>
                </View>
              </View>

              <View style={styles.twoComponents}>
                <View style={styles.secondComponentStyle}>
                  <Text style={{fontWeight: 'bold', color: 'black'}}>
                    Classification
                  </Text>
                </View>

                <View style={styles.secondComponentStyle}>
                  <Text style={{fontWeight: 'bold', color: 'black'}}>
                    {classification ? classification : '---'}
                  </Text>
                </View>
              </View>

              <View style={styles.twoComponents}>
                <View style={styles.firstComponentStyle}>
                  <Text style={{fontWeight: 'bold', color: 'black'}}>
                    Blood type
                  </Text>
                </View>
                <View style={styles.secondComponentStyle}>
                  <CustomPicker
                    name="bloodtype"
                    placeholder={'Select'}
                    options={bloodTypesSelection}
                    close={() => {
                      setBloodTypeModal(false);
                    }}
                    open={() => {
                      setBloodTypeModal(true);
                    }}
                    isVisible={bloodTypeModal}
                    control={control}
                    customStyle={styles.bloodTypeSelectorStyle}
                  />
                </View>
              </View>
            </>
          )}
          {allowSetup === true && (
            <CustomButton
              text="Setup"
              type="PRIMARY"
              onPress={handleSubmit(onSetupPressed)}
            />
          )}
        </ScrollView>
      </ScrollViewIndicator>
    </>
  );
};
const styles = StyleSheet.create({
  customInputCentered: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 20,
    borderColor: '#e8e8e8',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginVertical: 5,
    alignItems: 'center',
  },

  twoComponents: {
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 60,
  },
  firstComponentStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
  },
  secondComponentStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
  },
  scrollViewStyle: {
    // justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
  },
  bloodTypeSelectorStyle: {
    backgroundColor: 'white',
    alignItems: 'center',
    width: '100%',
    borderRadius: 20,
    borderColor: '#e8e8e8',
    borderWidth: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
    marginVertical: 5,
    height: 50,
  },

  birthDayInputStyle: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 20,
    borderColor: '#e8e8e8',
    borderWidth: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
  },

  registerHeader: {
    fontSize: 25,
    // fontWeight: 'bold',
    fontFamily: 'BunchBlossomsPersonalUse-0nA4',
    color: 'black',
  },

  logo: {
    width: '70%',
    maxWidth: 300,
    height: 100,
  },
  registerHeaderCont: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    height: 80,
    margin: 20,
    backgroundColor: 'white',
  },

  secondaryHeader: {
    padding: 5,
    alignItems: 'flex-start',

    borderBottomColor: 'black',
    margin: 20,
    marginBottom: 20,
  },
  secondaryHeaderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#74DA74',
  },
});
export default ProfileSetupScreen;
