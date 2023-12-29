import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  AppState,
  Pressable,
  Image,
  TouchableOpacity,
} from 'react-native';

const DashboardScreen = () => {
  return (
    <View style={styles.root}>
      <View>
        <Text style={{color: 'black'}}>HELLO TANGINAMO</Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  nameCont: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  settingsContainer: {
    position: 'absolute',
    height: 70,
    width: '100%',
    top: 0,
  },
  settingsIconContainer: {
    position: 'absolute',
    height: 50,
    width: 50,
    top: 10,
    right: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCont: {
    borderWidth: 1,
    borderColor: 'black',
    height: 180,
    width: 180,
    borderRadius: 100,
  },
  previewImage: {
    height: '100%',
    width: '100%',
    borderRadius: 100,
    backgroundColor: 'red',
  },

  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarAndName: {
    height: 250,
    width: '80%',
    borderBottomColor: '#D3D3D3',
    borderBottomWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  head: {
    color: 'black',
  },
});
export default DashboardScreen;
