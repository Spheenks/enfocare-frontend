// @refresh reset
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import 'firebase/database';
import {ref, push} from 'firebase/database';
import {useNavigation, useRoute} from '@react-navigation/native';
import Queue from '../../Components/Queue';
import {EnfocareApi} from '../../api/EnfocareApi';

const LobbyScreen = () => {
  const {userProfile, getProfile} = useContext(EnfocareApi);
  const [users, setUsers] = useState([]);
  const [myData, setMyData] = useState(null);
  const [patients, setPatients] = useState();
  const navigation = useNavigation();
  const [selectedSpecs, setSelectedSpecs] = useState('Department ▼');
  const [specsModalShow, setSpecsModalShow] = useState(false);
  const [lobbyId, setLobbyId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const route = useRoute();
  const [accType, setAccType] = useState('');
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

    console.log('WAKKKKK', doctor.lastname);
    setPatients([]);
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
              ? 'My Lobby'
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
            accountType={userProfile.isDoctor}
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
  },
  listCont: {
    height: '70%',
    width: '100%',
  },
  screenTitle: {
    height: '20%',
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  queueText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  queueTitle: {
    height: '10%',
    width: '100%',
    padding: 10,
  },
});
export default LobbyScreen;
