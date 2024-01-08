import React, {useState} from 'react';
import {StyleSheet, View, Pressable, Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CallActionBox = ({
  onHangupPressed,
  onMutePressed,
  isMicOn,
  onReversePressed,
  onCameraToggle,
  isCameraOn,
  isMessageEnabled,
  toggleMessageOn,
}) => {
  return (
    <View style={styles.buttonsContainer}>
      <Pressable onPress={onReversePressed} style={styles.iconButton}>
        <Ionicons name="camera-reverse" size={35} color={'white'} />
      </Pressable>

      <Pressable onPress={onCameraToggle} style={styles.iconButton}>
        <MaterialIcons
          name={isCameraOn ? 'camera-off' : 'camera'}
          size={35}
          color={'white'}
        />
      </Pressable>

      <Pressable onPress={onMutePressed} style={styles.iconButton}>
        <MaterialIcons
          name={isMicOn ? 'microphone-off' : 'microphone'}
          size={35}
          color={'white'}
        />
      </Pressable>

      <Pressable
        onPress={toggleMessageOn}
        style={[styles.iconButton, {backgroundColor: '#ADD8E6'}]}>
        <MaterialCommunityIcons
          name={isMessageEnabled ? 'message-off' : 'message'}
          size={35}
          color={'white'}
        />
      </Pressable>

      <Pressable
        onPress={onHangupPressed}
        style={[styles.iconButton, {backgroundColor: 'red'}]}>
        <MaterialIcons name="phone-hangup" size={35} color={'white'} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    backgroundColor: '#333333',
    padding: 25,
    paddingBottom: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    backgroundColor: '#4a4a4a',
    padding: 10,
    borderRadius: 50,
    margin: 5,
  },
});

export default CallActionBox;
