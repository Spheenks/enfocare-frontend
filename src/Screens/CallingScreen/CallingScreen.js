import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  PermissionsAndroid,
  Alert,
  Platform,
  useWindowDimensions,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CallActionBox from '../../Components/CallActionBox';
import {Voximplant} from 'react-native-voximplant';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useRef} from 'react';
import ChatModal from '../../Components/ChatModal';

const permissions = [
  PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  PermissionsAndroid.PERMISSIONS.CAMERA,
];

const CallingScreen = () => {
  //SCREEN HEIGHT

  const {height} = useWindowDimensions();
  //PERMISSIONS
  const [permissionGranted, setPermissionGranted] = useState(false);

  //CALL STATUS
  const [statusCall, setStatusCall] = useState('Initializing...');

  //VIDEO STREAM
  const [localVideoStreamId, setLocalVideoStreamId] = useState('');
  const [remoteVideoStreamId, setRemoteVideoStreamId] = useState('');

  //CAMERA
  const CameraManager = Voximplant.Hardware.CameraManager.getInstance();
  const cameraType = Voximplant.Hardware.CameraType;
  const [cameraState, setCameraState] = useState(cameraType.FRONT);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const [isMessageOn, setIsMessageOn] = useState(false);

  //NAVIGATION  & ROUTES
  const navigation = useNavigation();
  const route = useRoute();

  //AUDIO
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  //VOXIMPLANT
  const {
    call: incomingCall,
    receiverData,
    callerData,
    t,
    isIncomingCall,
  } = route?.params;
  const voximplant = Voximplant.getInstance();
  const call = useRef(incomingCall);
  const endpoint = useRef(null);

  // const [myData, setMyData] = useState([]);
  const [consultationKey, setConsultationKey] = useState('');

  const backToChat = () => {
    navigation.navigate('DashboardScreen');
  };

  const checkDevices = async () => {
    const devices =
      await Voximplant.Hardware.AudioDeviceManager.getInstance().getAudioDevices();
    setAvailableDevices(devices);

    // if(devices.includes('WiredHeadset')){
    //     Voximplant.Hardware.AudioDeviceManager.getInstance().selectAudioDevice("WiredHeadset");
    // }else{
    //     Voximplant.Hardware.AudioDeviceManager.getInstance().selectAudioDevice("Speaker");
    // }

    console.log('DSDSDS', devices.includes('WiredHeadset'));

    // devices.map(data => {
    //     if (data === "WiredHeadset") {
    //
    //     } else {
    //
    //     }
    // })
  };

  //CALL FUNCTIONALITIES
  const onCameraReverse = () => {
    if (cameraState === cameraType.FRONT) {
      CameraManager.switchCamera(cameraType.BACK);
      setCameraState(cameraType.BACK);
    } else {
      CameraManager.switchCamera(cameraType.FRONT);
      setCameraState(cameraType.FRONT);
    }
  };

  const onCameraToggle = () => {
    setIsCameraOn(!isCameraOn);
    call.current.sendVideo(isCameraOn);
  };

  const onMessageToggle = () => {
    setIsMessageOn(!isMessageOn);
  };

  const muteAudio = () => {
    setIsAudioMuted(!isAudioMuted);
    call.current.sendAudio(isAudioMuted);
  };

  const onHangupPressed = () => {
    if (statusCall === 'Connected') {
      call.current.hangup();
    } else if (statusCall === 'Calling...') {
      call.current.off(Voximplant.CallEvents.ProgressToneStart);
    }
  };

  useEffect(() => {
    const requestPermissions = async () => {
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      const recordAudioGranted =
        granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted';
      const cameraGranted =
        granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted';
      if (!cameraGranted || !recordAudioGranted) {
        Alert.alert('Permission not Granted');
      } else {
        setPermissionGranted(true);
      }
    };

    if (Platform.OS === 'android') {
      requestPermissions();
    } else {
      setPermissionGranted(true);
    }
  }, []);

  useEffect(() => {
    Voximplant.Hardware.AudioDeviceManager.getInstance().selectAudioDevice(
      'Speaker',
    );
    if (!permissionGranted) {
      return;
    }
    const callSettings = {
      video: {
        sendVideo: true,
        receiveVideo: true,
      },
    };
    const makeCall = async () => {
      const numericPhone = receiverData.phone.replace(/\D/g, '');

      // Concatenate firstname, lastname, and numeric part of the phone number
      const voxReceiver = `${receiverData.firstname.toLowerCase()}${receiverData.lastname.toLowerCase()}${numericPhone}`;

      call.current = await voximplant.call(voxReceiver, callSettings);
      subscribeToCallEvents();
    };
    const answerCall = async () => {
      subscribeToCallEvents();
      endpoint.current = call.current.getEndpoints()[0];
      subscribeToEndpointEvent();
      call.current.answer(callSettings);
    };

    //CALL EVENTS
    const subscribeToCallEvents = () => {
      call.current.on(Voximplant.CallEvents.Failed, callEvent => {
        showError(callEvent.reason);
      });
      call.current.on(Voximplant.CallEvents.ProgressToneStart, callEvent => {
        setStatusCall('Calling...');
      });
      call.current.on(Voximplant.CallEvents.Connected, callEvent => {
        setStatusCall('Connected');
      });
      call.current.on(Voximplant.CallEvents.Disconnected, callEvent => {
        if (t === 't') {
          console.log('TANGINA MO CALL ENDED');
          navigation.navigate('LobbyScreen');
          // save consultation record
        }
      });

      call.current.on(
        Voximplant.CallEvents.LocalVideoStreamAdded,
        callEvent => {
          setLocalVideoStreamId(callEvent.videoStream.id);
        },
      );
      call.current.on(
        Voximplant.CallEvents.LocalVideoStreamRemoved,
        callEvent => {
          setLocalVideoStreamId('');
        },
      );
      call.current.on(Voximplant.CallEvents.EndpointAdded, callEvent => {
        endpoint.current = callEvent.endpoint;
        subscribeToEndpointEvent();
      });
    };
    //ENDPOINT EVENTS
    const subscribeToEndpointEvent = async () => {
      endpoint.current.on(
        Voximplant.EndpointEvents.RemoteVideoStreamAdded,
        endpointEvent => {
          setRemoteVideoStreamId(endpointEvent.videoStream.id);
        },
      );

      endpoint.current.on(
        Voximplant.EndpointEvents.RemoteVideoStreamRemoved,
        endpointEvent => {
          setRemoteVideoStreamId('');
        },
      );
    };

    const showError = reason => {
      Alert.alert('Call Failed', `Reason : ${reason}`, [
        {
          text: 'OK',
          onPress: () => navigation.navigate('DashboardScreen'),
        },
      ]);
    };

    if (isIncomingCall) {
      answerCall();
    } else {
      makeCall();
    }

    return () => {
      call.current.off(Voximplant.CallEvents.Failed);
      call.current.off(Voximplant.CallEvents.ProgressToneStart);
      call.current.off(Voximplant.CallEvents.Connected);
      call.current.off(Voximplant.CallEvents.Disconnected);
    };
  }, [permissionGranted]);

  //UI
  return (
    <View style={styles.root}>
      <ChatModal
        // roomRef={}
        roomRef={route.params.roomRef}
        myData={route.params.receiver}
        otherUser={
          route.params.caller ? route.params.caller : route.params.receiver
        }
        isMessageEnabled={isMessageOn}
        onClose={() => setIsMessageOn(!isMessageOn)}
      />
      <View style={styles.nameAndButtonCont}>
        {statusCall === 'Connected' && (
          <>
            <View style={[styles.nameAndStatus, {height: height * 0.2}]}>
              <Text style={styles.nameCallConnected}>
                {callerData?.firstname
                  ? callerData?.firstname
                  : receiverData?.firstname}
              </Text>
              <Text style={styles.statusCallConnected}>{statusCall}</Text>
            </View>
          </>
        )}
      </View>
      <View style={styles.cameraPreview}>
        {statusCall !== 'Connected' && (
          <>
            <Text style={styles.nameCall}>{receiverData?.firstname}</Text>
            <Text style={styles.statusCall}>{statusCall}</Text>
          </>
        )}
      </View>

      <Voximplant.VideoView
        videoStreamId={localVideoStreamId}
        style={styles.localVideo}
        showOnTop={true}
      />

      <Voximplant.VideoView
        videoStreamId={remoteVideoStreamId}
        style={styles.remoteVideo}
      />

      <CallActionBox
        onHangupPressed={onHangupPressed}
        onMutePressed={muteAudio}
        isMicOn={isAudioMuted}
        onReversePressed={onCameraReverse}
        onCameraToggle={onCameraToggle}
        isCameraOn={isCameraOn}
        isMessageEnabled={isMessageOn}
        toggleMessageOn={onMessageToggle}
      />
    </View>
  );
};

export default CallingScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#333333',
  },
  nameAndStatus: {
    // height: 75,

    width: '70%',

    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  cameraPreview: {
    flex: 1,
    alignItems: 'center',
    // paddingTop: 50,
    paddingHorizontal: 10,
  },
  localVideo: {
    width: 100,
    height: 150,
    margin: 10,
    marginHorizontal: 0,
    borderRadius: 10,
    position: 'absolute',
    right: 10,
    top: 100,
  },
  remoteVideo: {
    height: '100%',
    backgroundColor: 'transparent',
    borderRadius: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  nameCall: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 50,
    marginBottom: 20,
  },
  statusCall: {
    fontSize: 25,
  },

  nameCallConnected: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
  },
  statusCallConnected: {
    fontSize: 25,
    color: 'green',
  },
  nameAndButtonCont: {
    backgroundColor: '#333333',
    height: 100,
    width: '100%',
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: '#4a4a4a',
    padding: 10,
    borderRadius: 50,
  },
  backCont: {
    height: 80,
    width: '100%',
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  pressableBackCont: {
    height: 75,

    width: '20%',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
