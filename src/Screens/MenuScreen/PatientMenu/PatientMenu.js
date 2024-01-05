import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PatientMenu = ({onLogout, onFindDoctor, viewFiles}) => {
  return (
    <View style={styles.main}>
      <View style={styles.sub_main}>
        <TouchableOpacity onPress={onFindDoctor} style={styles.iconCont}>
          <Fontisto name="doctor" size={80} color="#74DA74" />

          <Text style={styles.pressableLabel}>Find a doctor</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sub_main}>
        <TouchableOpacity onPress={viewFiles} style={styles.iconCont}>
          <Entypo name="folder" size={80} color="#74DA74" />
          <Text style={styles.pressableLabel}>Files</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sub_main}>
        <TouchableOpacity style={styles.iconCont}>
          <Fontisto name="prescription" size={80} color="#74DA74" />

          <Text style={styles.pressableLabel}>Consultations</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sub_main}>
        <TouchableOpacity onPress={onLogout} style={styles.iconCont}>
          <MaterialIcons name="logout" size={80} color="#74DA74" />
          <Text style={styles.pressableLabel}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    flexWrap: 'wrap',

    maxHeight: 400,
    width: '100%',

    overflow: 'scroll',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sub_main: {
    margin: 5,
    height: 150,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressableLabel: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  iconCont: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
export default PatientMenu;
