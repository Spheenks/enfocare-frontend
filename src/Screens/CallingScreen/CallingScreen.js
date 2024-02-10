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
  PanResponder,
  Animated,
} from 'react-native';
import Draggable from 'react-native-draggable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CallActionBox from '../../Components/CallActionBox';
import {Voximplant} from 'react-native-voximplant';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useRef} from 'react';
import ChatModal from '../../Components/ChatModal';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {EnfocareApi} from '../../api/EnfocareApi';

const permissions = [
  PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  PermissionsAndroid.PERMISSIONS.CAMERA,
];

const CallingScreen = () => {
  const {userProfile, saveConsultation} = useContext(EnfocareApi);
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
    isIncomingCall,
  } = route?.params;
  const voximplant = Voximplant.getInstance();
  const call = useRef(incomingCall);
  const endpoint = useRef(null);

  const backToChat = () => {
    navigation.navigate('DashboardScreen');
  };

  const checkDevices = async () => {
    const devices =
      await Voximplant.Hardware.AudioDeviceManager.getInstance().getAudioDevices();
    setAvailableDevices(devices);
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

    const goBack = () => {};

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
        if (userProfile.isDoctor) {
          const currentDate = new Date();
          const consultationInfo = {
            doctor: userProfile.email, // Assuming this is the correct identifier for the doctor
            patient: receiverData.email, // Assuming this is the correct identifier for the patient
            date: currentDate.toISOString(), // ISO string format for date
            diagnosis: '', // Initialize as empty or null based on your needs
            treatment: '',
            ailment: '',
            symptoms: '',
          };

          saveConsultation(consultationInfo)
            .then(() => navigation.navigate('LobbyScreen')) // Navigate on success
            .catch(error => console.log(error)); // Handle error without stopping the flow
        }
      });
      call.current.on(
        Voximplant.CallEvents.LocalVideoStreamAdded,
        callEvent => {
          setLocalVideoStreamId(callEvent.videoStream.id);
        },
      );
      call.current.on(Voximplant.CallEvents.EndpointAdded, callEvent => {
        endpoint.current = callEvent.endpoint;
        subscribeToEndpointEvent();
      });

      //  call.current.on(
      //    Voximplant.CallEvents.LocalVideoStreamRemoved,
      //    callEvent => {
      //      setLocalVideoStreamId('');
      //    },
      //  );
    };

    //ENDPOINT EVENTS
    const subscribeToEndpointEvent = async () => {
      endpoint.current.on(
        Voximplant.EndpointEvents.RemoteVideoStreamAdded,
        endpointEvent => {
          setRemoteVideoStreamId(endpointEvent.videoStream.id);
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
    // <View style={styles.root}>
    //   {/* <ChatModal
    //     roomRef={route.params.roomRef}
    //     myData={route.params.receiver}
    //     otherUser={
    //       route.params.caller ? route.params.caller : route.params.receiver
    //     }
    //     isMessageEnabled={isMessageOn}
    //     onClose={() => setIsMessageOn(!isMessageOn)}
    //   />
    //   <View style={styles.nameAndButtonCont}>
    //     {statusCall === 'Connected' && (
    //       <View style={styles.nameAndStatus}>
    //         <Text style={styles.nameCallConnected}>
    //           {userProfile?.isDoctor
    //             ? receiverData.firstname
    //             : callerData.firstname}
    //         </Text>
    //         <Text style={styles.statusCallConnected}>{statusCall}</Text>
    //       </View>
    //     )}
    //   </View> */}

    //   <Voximplant.VideoView
    //     videoStreamId={localVideoStreamId}
    //     style={styles.localVideo}
    //     showOnTop={true}
    //   />

    //   <Voximplant.VideoView
    //     videoStreamId={remoteVideoStreamId}
    //     style={styles.remoteVideo}
    //     scaleType={Voximplant.RenderScaleType.SCALE_FIT}
    //   />

    //   <View style={styles.cameraPreview}>
    //     {statusCall !== 'Connected' && (
    //       <>
    //         <Text style={styles.nameCall}>{receiverData?.firstname}</Text>
    //         <Text style={styles.statusCall}>{statusCall}</Text>
    //       </>
    //     )}
    //   </View>

    //   <CallActionBox
    //     onHangupPressed={onHangupPressed}
    //     onMutePressed={muteAudio}
    //     isMicOn={isAudioMuted}
    //     onReversePressed={onCameraReverse}
    //     onCameraToggle={onCameraToggle}
    //     isCameraOn={isCameraOn}
    //     isMessageEnabled={isMessageOn}
    //     toggleMessageOn={onMessageToggle}
    //   />
    // </View>

    <View style={styles.page}>
      <Pressable onPress={backToChat} style={styles.backButton}>
        <Ionicons name="caret-back-sharp" color="white" size={25} />
      </Pressable>

      <Voximplant.VideoView
        videoStreamId={remoteVideoStreamId}
        style={styles.remoteVideo}
        showOnTop={true}
        scaleType={Voximplant.RenderScaleType.SCALE_FIT}
      />

      <Voximplant.VideoView
        videoStreamId={localVideoStreamId}
        style={styles.localVideo}
        scaleType={Voximplant.RenderScaleType.SCALE_FIT}
        // showOnTop={true}
      />

      <View style={styles.cameraPreview}>
        <Text style={styles.name}>{receiverData?.firstname}</Text>
        <Text style={styles.phoneNumber}>{statusCall}</Text>
      </View>

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

const styles = StyleSheet.create({
  page: {
    height: '100%',
    backgroundColor: '#7b4e80',
  },
  cameraPreview: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  localVideo: {
    width: 100,
    height: 150,
    backgroundColor: '#ffff6e',

    borderRadius: 10,

    position: 'absolute',
    right: 10,
    top: 100,
  },
  remoteVideo: {
    backgroundColor: '#7b4e80',
    borderRadius: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 100,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 50,
    marginBottom: 15,
  },
  phoneNumber: {
    fontSize: 20,
    color: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 10,
    zIndex: 10,
  },
});

export default CallingScreen;
