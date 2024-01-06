import moment from 'moment/moment';
import React from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Queue({patients, onCallPatient, isDoctor}) {
  const renderUser = ({item}) => {
    const time = item.timein;
    const datedtime = new Date(time);
    const hours = datedtime.getUTCHours().toString();
    const posfix = datedtime.toTimeString();
    const prefix = datedtime.toLocaleTimeString();
    const stringed = moment(datedtime);

    console.log(stringed.isValid());

    var minutes = '';

    if (datedtime.getUTCMinutes().toString() < 10) {
      minutes = '0' + datedtime.getUTCMinutes().toString();
    } else {
      minutes = datedtime.getUTCMinutes().toString();
    }

    return (
      <>
        <View style={styles.listContainer}>
          <View style={styles.nameContainer}>
            <Text numberOfLines={1} style={styles.fullnameText}>
              {item.firstname} {item.lastname}
            </Text>
          </View>

          {isDoctor ? (
            <>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>
                  {stringed === true ? prefix : 'IN'}
                </Text>
              </View>

              <View style={styles.iConts}>
                <Pressable onPress={() => onCallPatient(item)}>
                  {/* <Image style={styles.avatar} source={{ uri: item.avatar }} /> */}
                  <MaterialCommunityIcons
                    name="account-arrow-right"
                    size={40}
                    color={'green'}
                  />
                </Pressable>
              </View>
            </>
          ) : (
            <View style={styles.timeContainer}>
              {/* <Text>{time}</Text> */}
              {/* <Text>{hours + ":" + minutes}</Text> */}
              <Text style={styles.timeText}>{prefix}</Text>
            </View>
          )}
        </View>
      </>
    );
  };
  return (
    <>
      <View style={styles.headerContainer}>
        <View style={styles.listHeaderContainer}>
          <Text style={styles.userLabel}>Name</Text>
        </View>

        <View style={styles.listHeaderContainer}>
          <Text style={styles.userLabel}>Time in</Text>
        </View>
      </View>

      <FlatList
        style={styles.contactCont}
        data={patients}
        renderItem={renderUser}
        keyExtractor={item => item.email.toString()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    alignContent: 'space-around',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 35,
    marginVertical: 5,
  },
  listHeaderContainer: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    margin: 5,
  },

  iConts: {
    width: 60,
    flexDirection: 'row',
  },
  timeContainer: {
    height: '100%',
    width: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },

  nameContainer: {
    height: '100%',
    width: '50%',
    justifyContent: 'center',
  },
  contactCont: {
    width: '100%',
  },
  fullnameText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 30,
  },
  timeText: {
    color: 'black',
    fontSize: 15,
  },
  userLabel: {
    color: 'black',
    fontSize: 15,
    width: '100%',
    fontWeight: '200',
    textAlign: 'center',
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
