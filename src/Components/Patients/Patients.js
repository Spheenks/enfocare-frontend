import React, {useEffect} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';

export default function Patients({patients, onCallPatient, onChatPatient}) {
  const renderUser = ({item}) => {
    return (
      <View style={styles.aListCont}>
        <View style={styles.nameCont}>
          <Text style={styles.userText}>
            {item.firstname} {item.lastname}
          </Text>
        </View>

        <View style={styles.iConts}>
          <Pressable onPress={() => onCallPatient(item)}>
            {/* <Image style={styles.avatar} source={{ uri: item.avatar }} /> */}
            <MaterialIcons name="video-call" size={40} />
          </Pressable>

          <Pressable onPress={() => onChatPatient(item)}>
            {/* <Image style={styles.avatar} source={{ uri: item.avatar }} /> */}
            <Entypo name="message" size={40} />
          </Pressable>
        </View>
      </View>
    );
  };
  return (
    <>
      <FlatList
        style={styles.contactCont}
        data={patients}
        renderItem={renderUser}
        keyExtractor={item => item.id.toString()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  aListCont: {
    flexDirection: 'row',
    alignContent: 'space-around',
    justifyContent: 'space-around',
    height: 60,
    borderStyle: 'solid',
  },
  nameCont: {
    width: '40%',
    // backgroundColor:'green',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iConts: {
    width: '40%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // backgroundColor:'red',
    alignItems: 'center',
  },

  contactCont: {
    // backgroundColor:'red',
    width: '100%',
  },
  userText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  avatar: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomColor: '#cacaca',
    borderBottomWidth: 1,
  },
  addUser: {
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    backgroundColor: '#cacaca',
    flex: 1,
    marginRight: 10,
    padding: 10,
  },
});
