import React, {useEffect} from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';

export default function Doctors({doctors, onConsultDoctor}) {
  const renderUser = ({item, index}) => {
    return (
      <View style={styles.aListCont}>
        <View style={styles.nameCont}>
          <Text style={styles.userText}>
            {item.firstname} {item.lastname}
          </Text>
        </View>

        <View style={styles.iConts}>
          {item.lobby &&
          (item.lobby.onQueue === 8 || item.lobby.onQueue >= 8) ? (
            <Text style={{color: 'red'}}>MAX</Text>
          ) : (
            <Pressable onPress={() => onConsultDoctor(item)}>
              <Text style={{color: 'blue'}}>{item.lobby.onQueue} / 8</Text>

              <Text>CONSULT</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  return (
    <>
      <FlatList
        style={styles.contactCont}
        data={doctors}
        renderItem={renderUser}
        keyExtractor={(_, index) => index.toString()}
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
