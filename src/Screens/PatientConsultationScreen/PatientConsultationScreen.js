import React, {useContext, useEffect, useState} from 'react';
import {Modal, View, Text, FlatList, Button, StyleSheet} from 'react-native';

import {EnfocareApi} from '../../api/EnfocareApi';

const PatientConsultationScreen = () => {
  const {userProfile} = useContext(EnfocareApi);
  const {fetchConsultationRecordsForPatient} = useContext(EnfocareApi);
  const [records, setRecords] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const fetchedRecords = await fetchConsultationRecordsForPatient(
          userProfile.email,
        );
        setRecords(fetchedRecords);
      } catch (error) {
        console.error(
          'Failed to fetch consultation records for patient:',
          error,
        );
      }
    };

    fetchRecords();
  }, [fetchConsultationRecordsForPatient, userProfile.email]);

  const handleViewRecord = record => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const renderRecord = ({item}) => (
    <View style={styles.record}>
      <Text>{item.doctor}</Text>
      <Text>{item.date}</Text>
      <Button title="View" onPress={() => handleViewRecord(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}>
        <View style={styles.modalView}>
          {selectedRecord && (
            <>
              <Text style={styles.modalText}>
                Doctor: {selectedRecord.doctor}
              </Text>
              <Text style={styles.modalText}>
                Patient: {selectedRecord.patient}
              </Text>
              <Text style={styles.modalText}>Date: {selectedRecord.date}</Text>
              <Text style={styles.modalText}>
                Diagnosis: {selectedRecord.diagnosis}
              </Text>
              <Text style={styles.modalText}>
                Treatment: {selectedRecord.treatment}
              </Text>
              <Text style={styles.modalText}>
                Ailment: {selectedRecord.ailment}
              </Text>
              <Text style={styles.modalText}>
                Symptoms: {selectedRecord.symptoms}
              </Text>
              <Button title="Close" onPress={() => setIsModalVisible(false)} />
            </>
          )}
        </View>
      </Modal>
      {records.length > 0 ? (
        <FlatList
          data={records}
          renderItem={renderRecord}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text>No records found.</Text>
      )}
    </View>
  );
};

// Styles would be the same as for DoctorConsultationRecordsScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  record: {
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default PatientConsultationScreen;
