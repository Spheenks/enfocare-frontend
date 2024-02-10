import React from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <Pressable onPress={onReversePressed} style={styles.iconButton}>
          <Ionicons name="camera-reverse" size={24} color={'#333333'} />
        </Pressable>

        <Pressable onPress={onCameraToggle} style={styles.iconButton}>
          <MaterialIcons
            name={isCameraOn ? 'camera-off' : 'camera'}
            size={24}
            color={'#333333'}
          />
        </Pressable>

        <Pressable onPress={onMutePressed} style={styles.iconButton}>
          <MaterialIcons
            name={isMicOn ? 'microphone-off' : 'microphone'}
            size={24}
            color={'#333333'}
          />
        </Pressable>
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          onPress={toggleMessageOn}
          style={[styles.iconButton, styles.messageButton]}>
          <MaterialIcons
            name={isMessageEnabled ? 'message-off' : 'message'}
            size={24}
            color={'#333333'}
          />
        </Pressable>

        <Pressable onPress={onHangupPressed} style={styles.iconButton}>
          <MaterialIcons name="phone-hangup" size={24} color={'#FF6347'} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    marginTop: 'auto',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 5,
  },
  iconButton: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 50,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageButton: {
    backgroundColor: '#87CEEB',
  },
});

export default CallActionBox;
