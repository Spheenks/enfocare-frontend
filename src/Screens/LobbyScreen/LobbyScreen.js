import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {useNavigation, useRoute} from '@react-navigation/native';
import Queue from '../../Components/Queue';
import {EnfocareApi} from '../../api/EnfocareApi';

const LobbyScreen = () => {
  const {userProfile, getProfile, getPatientQueue} = useContext(EnfocareApi);

  const [patients, setPatients] = useState();
  const navigation = useNavigation();
  const [selectedSpecs, setSelectedSpecs] = useState('Department ▼');
  const [specsModalShow, setSpecsModalShow] = useState(false);

  const route = useRoute();

  const [roomDoctor, setRoomDoctor] = useState('');

  useEffect(() => {
    if (userProfile.isDoctor) {
      getQueue(userProfile.email);
    } else {
      getQueue(route.params.doctorEmail);
    }
  }, []);

  const getQueue = async doctorEmail => {
    let doctor = await getProfile(doctorEmail);

    let patients = await getPatientQueue(
      userProfile.isDoctor ? userProfile.email : doctorEmail,
    );

    let patientList = await Promise.all(
      patients.map(async patient => {
        const profile = await getProfile(patient.patient);

        console.log(profile);

        return {
          ...profile,
          timeIn: patient.timeIn,
        };
      }),
    );

    // const doctorLobbies = await Promise.all(
    //   doctors.map(async doctor => {
    //     const queueCount = await getLobbyQueue(doctor.email);
    //     return {
    //       ...doctor,
    //       lobby: {
    //         onQueue: queueCount,
    //       },
    //     };
    //   }),
    // );

    setPatients(patientList);
    setRoomDoctor(doctor);
  };

  const onCallUser = async patientSelected => {
    // database().ref(`lobbies/${myData.lobby}/onQueue/${userSelected.id}`).update({
    //     timein: "IN"
    // })
    // database().ref(`users/${myData.id}/connections/${userSelected.id}/chatroomId`).once('value').then((res) => {
    //     navigation.navigate('CallingScreen', {
    //         receiverData: userSelected,
    //         callerData: myData,
    //         t: 't',
    //         roomRef: res.val()
    //     });
    // });
  };

  return (
    <>
      <View style={styles.root}>
        <View style={styles.screenTitle}>
          <Text style={styles.titleText}>
            {userProfile.isDoctor
              ? 'PATIENT LIST'
              : 'Dr.' + roomDoctor.firstname + ' ' + roomDoctor.lastname}
          </Text>
        </View>
        <View style={styles.queueTitle}>
          <Text style={styles.queueText}>On Queue</Text>
        </View>

        <View style={styles.listCont}>
          <Queue
            patients={patients}
            onCallPatient={onCallUser}
            isDoctor={userProfile.isDoctor}
          />
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7', // Set a light background color
  },
  listCont: {
    flex: 1,
    width: '100%',
  },
  screenTitle: {
    height: 60, // Reduced height
    width: '100%',
    borderBottomWidth: 1, // Reduced border
    borderBottomColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20, // Reduced font size
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333', // Set text color
  },
  queueText: {
    fontSize: 20, // Reduced font size
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333', // Set text color
  },
  queueTitle: {
    height: 30, // Reduced height
    width: '100%',
    padding: 5, // Reduced padding
  },
});
export default LobbyScreen;
