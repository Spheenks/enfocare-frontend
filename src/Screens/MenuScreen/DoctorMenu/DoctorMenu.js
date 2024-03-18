import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DoctorMenu = ({onLogout, onDoctorQueue, onUpload, onConsultations}) => {
  return (
    <View style={styles.main}>
      <View style={styles.sub_main}>
        <TouchableOpacity onPress={onDoctorQueue} style={styles.iconCont}>
          <MaterialCommunityIcons
            name="human-queue"
            size={80}
            color="#74DA74"
          />

          <Text style={styles.pressableLabel}>Queue</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sub_main}>
        <TouchableOpacity style={styles.iconCont} onPress={onUpload}>
          <MaterialCommunityIcons name="upload" size={80} color="#74DA74" />
          <Text style={styles.pressableLabel}>Upload</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sub_main}>
        <TouchableOpacity style={styles.iconCont} onPress={onConsultations}>
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
export default DoctorMenu;
