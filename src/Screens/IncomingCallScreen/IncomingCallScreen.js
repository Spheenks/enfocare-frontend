import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Pressable,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import bg from '../../assets/John.png';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Voximplant} from 'react-native-voximplant';
import {EnfocareApi} from '../../api/EnfocareApi';

const IncomingCallScreen = () => {
  const {userProfile, getProfile, getProfileByPhone} = useContext(EnfocareApi);
  const [callerDN, setCallerDN] = useState([]);
  const [callerId, setCallerId] = useState('');
  const route = useRoute();
  const navigation = useNavigation();
  //   const [roomref, setRoomRef] = useState('');
  const {call} = route.params;

  useEffect(() => {
    setCallerDN(call.getEndpoints()[0].displayName);
    setCallerId(call.getEndpoints()[0].userName);

    call.on(Voximplant.CallEvents.Disconnected, callEvent => {
      navigation.navigate('DashboardScreen');
    });
    return () => {
      call.off(Voximplant.CallEvents.Disconnected);
    };
  }, []);

  const onDecline = () => {
    call.decline();
  };

  const onAccept = async () => {
    try {
      const callerVoxUsername = callerId.split('@')[0];
      const callerPhone = '+' + callerVoxUsername.match(/\d+/)[0];
      const doctorProfile = await getProfileByPhone(callerPhone);

      navigation.navigate('CallingScreen', {
        call,
        isIncomingCall: true,
        callerData: doctorProfile,
        receiverData: userProfile,
      });
    } catch (error) {
      console.error('Error on call acceptance:', error);
    }
  };

  return (
    <ImageBackground
      source={bg}
      style={styles.bg}
      resizeMode="cover"
      imageStyle={{opacity: 0.5}}>
      <Text style={styles.nameCall}>{callerDN}</Text>
      <Text style={styles.statusCall}>Incoming call</Text>

      <View style={[styles.row, {marginTop: 'auto'}]}>
        <View style={styles.iconsContainer}>
          <Ionicons name="alarm" color={'white'} size={30} />
          <Text style={styles.iconText}>Remind me</Text>
        </View>
        <View style={styles.iconsContainer}>
          <Entypo name="message" color={'white'} size={30} />
          <Text style={styles.iconText}>Message</Text>
        </View>
      </View>

      <View style={styles.row}>
        {/* REJECT */}
        <Pressable onPress={onDecline} style={styles.iconsContainer}>
          <View style={styles.iconButtonCont}>
            <Feather name="x" color={'white'} size={60} />
          </View>
          <Text style={styles.iconText}>Decline</Text>
        </Pressable>

        {/* ACCEPT */}
        <Pressable onPress={onAccept} style={styles.iconsContainer}>
          <View style={[styles.iconButtonCont, {backgroundColor: 'lightblue'}]}>
            <Feather name="check" color={'white'} size={60} />
          </View>
          <Text style={styles.iconText}>Accept</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  root: {
    height: '100%',
  },

  nameCall: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 50,
    marginBottom: 20,
  },
  statusCall: {
    color: 'white',
    fontSize: 25,
  },

  bg: {
    backgroundColor: 'black',
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconsContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  iconText: {
    color: 'white',
    marginTop: 10,
  },
  iconButtonCont: {
    backgroundColor: 'red',
    borderRadius: 100,
    padding: 15,
    margin: 20,
  },
});
export default IncomingCallScreen;
