import React from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment/moment';

export default function Queue({patients, onCallPatient, isDoctor}) {
  const renderUser = ({item, index}) => {
    const time = item.timeIn;
    const prefix = moment(time).format('LT');

    const backgroundColor = index % 2 === 0 ? '#E6F7FF' : '#F1FFE5'; // Light blue for even rows, light green for odd rows

    return (
      <View style={[styles.listContainer, {backgroundColor}]}>
        <View style={styles.nameContainer}>
          <Text numberOfLines={1} style={styles.fullnameText}>
            {item.firstname} {item.lastname}
          </Text>
        </View>
        {isDoctor && (
          <View style={styles.timeIconContainer}>
            <Text style={styles.timeText}>{prefix ? prefix : 'IN'}</Text>
            <Pressable
              style={styles.iconContainer}
              onPress={() => onCallPatient(item)}>
              <MaterialCommunityIcons
                name="account-arrow-right"
                size={30}
                color={'green'}
              />
            </Pressable>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.listHeaderContainer}>
          <Text style={styles.headerText}>Name</Text>
        </View>
        {isDoctor && (
          <View style={styles.listHeaderContainer}>
            <Text style={styles.headerText}>Time In</Text>
          </View>
        )}
      </View>
      <FlatList
        data={patients}
        renderItem={renderUser}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
    backgroundColor: '#F7F7F7',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 40,
    backgroundColor: '#F7F7F7',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  listHeaderContainer: {
    flex: 1,
    justifyContent: 'center',
    margin: 5,
    borderRightWidth: 1,
    borderRightColor: '#CCCCCC',
  },
  headerText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 80,
    paddingHorizontal: 15,
    borderRadius: 10,
    overflow: 'hidden', // Clip the content inside the LinearGradient
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', // Center the content horizontally
  },
  timeIconContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullnameText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timeText: {
    color: 'black',
    fontSize: 15,
  },
});
