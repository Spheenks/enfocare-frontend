import React, {useContext, useEffect, useState} from 'react';
import {View, Text, FlatList, Button, StyleSheet, Modal} from 'react-native'; // Import Modal

import {EnfocareApi} from '../../api/EnfocareApi';
import UploadDiagnosis from '../../Components/UploadDiagnosis/UploadDiagnosis';

const DoctorConsultationRecordsScreen = () => {
  const {userProfile} = useContext(EnfocareApi);
  const {fetchConsultationRecordsForDoctor} = useContext(EnfocareApi);
  const [records, setRecords] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // State to control modal visibility
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null); // State to hold the selected record

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const fetchedRecords = await fetchConsultationRecordsForDoctor(
          userProfile.email,
        );

        console.log(fetchedRecords);

        setRecords(fetchedRecords);
      } catch (error) {
        console.error(
          'Failed to fetch consultation records for doctor:',
          error,
        );
      }
    };

    fetchRecords();
  }, [fetchConsultationRecordsForDoctor, userProfile.email]);

  const handleViewRecord = record => {
    setSelectedRecord(record);
    setIsModalVisible(true); // Show the modal
  };

  const renderRecord = ({item}) => (
    <View style={styles.record}>
      <Text>{item.patient}</Text>
      <Text>{item.date}</Text>
      <Button title="View" onPress={() => handleViewRecord(item)} />
    </View>
  );

  const onUploadDiagnosis = () => {
    setIsUploadModalVisible(!isUploadModalVisible);
  };

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

              <Button title="Upload File" onPress={() => onUploadDiagnosis()} />
            </>
          )}
        </View>
      </Modal>

      <UploadDiagnosis
        isVisible={isUploadModalVisible}
        onClose={() => setIsUploadModalVisible(false)}
        onUploadSuccess={() => {
          console.log('Upload Successful');
        }}
        consultationId={selectedRecord ? selectedRecord.id : null}
        patientEmail={selectedRecord ? selectedRecord.patient : null}
      />
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

export default DoctorConsultationRecordsScreen;
