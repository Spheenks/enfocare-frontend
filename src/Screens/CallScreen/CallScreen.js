import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import CallActionBox from '../../Components/CallActionBox';

const CallScreen = () => {
  return (
    <View style={styles.root}>
      <View style={styles.cameraPreview} />

      <View />

      <CallActionBox />
    </View>
  );
};
const styles = StyleSheet.create({
  root: {
    height: '100%',
    backgroundColor: '#74DA74',
  },
  cameraPreview: {
    height: 150,
    width: 100,
    backgroundColor: 'red',
    position: 'absolute',
    right: 10,
    top: 100,
    borderRadius: 10,
  },
});
export default CallScreen;
