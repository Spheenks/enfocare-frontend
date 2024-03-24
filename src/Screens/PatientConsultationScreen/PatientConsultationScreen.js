import React, {useContext, useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {EnfocareApi} from '../../api/EnfocareApi';

import Icon from 'react-native-vector-icons/MaterialIcons';

const PatientConsultationScreen = () => {
  const {userProfile} = useContext(EnfocareApi);
  const {
    fetchConsultationRecordsForPatient,
    fetchMedicalFilesByConsultationId,
  } = useContext(EnfocareApi);
  const [records, setRecords] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [medicalFiles, setMedicalFiles] = useState([]);

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

  const handleViewRecord = async record => {
    setSelectedRecord(record);

    try {
      const files = await fetchMedicalFilesByConsultationId(record.id); // Assuming record.id is the consultation ID
      setMedicalFiles(files);
    } catch (error) {
      console.error('Failed to fetch medical files:', error);
      setMedicalFiles([]); // Reset to empty array on error
    }
    setIsModalVisible(true);
  };

  const renderRecord = ({item}) => (
    <View style={styles.record}>
      <Text>{item.doctor}</Text>
      <Text>{item.date}</Text>
      <Button title="View" onPress={() => handleViewRecord(item)} />
    </View>
  );

  const downloadFile = fileId => {
    // Implement file download logic here, based on fileId
    console.log(`Downloading file with ID: ${fileId}`);
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
          <ScrollView style={styles.scrollViewStyle}>
            {selectedRecord && (
              <>
                <Text style={styles.titleText}>Doctor:</Text>
                <Text style={styles.descriptionText}>
                  {selectedRecord.doctor}
                </Text>

                <View style={styles.sectionSeparator} />

                <Text style={styles.titleText}>Patient:</Text>
                <Text style={styles.descriptionText}>
                  {selectedRecord.patient}
                </Text>

                <View style={styles.sectionSeparator} />

                <Text style={styles.titleText}>Date:</Text>
                <Text style={styles.descriptionText}>
                  {selectedRecord.date}
                </Text>

                <View style={styles.sectionSeparator} />

                <Text style={styles.titleText}>Diagnosis:</Text>
                <Text style={styles.descriptionText}>
                  {selectedRecord.diagnosis}
                </Text>

                <View style={styles.sectionSeparator} />

                <Text style={styles.titleText}>Treatment:</Text>
                <Text style={styles.descriptionText}>
                  {selectedRecord.treatment}
                </Text>

                <View style={styles.sectionSeparator} />

                <Text style={styles.titleText}>Ailment:</Text>
                <Text style={styles.descriptionText}>
                  {selectedRecord.ailment}
                </Text>

                <View style={styles.sectionSeparator} />

                <Text style={styles.titleText}>Symptoms:</Text>
                <Text style={styles.descriptionText}>
                  {selectedRecord.symptoms}
                </Text>

                <View style={styles.sectionSeparator} />

                <Text style={styles.titleText}>FILES:</Text>
                {medicalFiles.map((file, index) => (
                  <View key={index} style={styles.fileContainer}>
                    <Icon
                      name="picture-as-pdf"
                      size={24}
                      color="#D32F2F"
                      style={styles.pdfIcon}
                    />
                    <Text style={styles.fileName}>
                      {file.filePath.split('\\').pop().split('.')[0]}
                    </Text>
                    <TouchableOpacity
                      onPress={() => console.log('Download', file.id)}>
                      <Text style={styles.downloadButtonText}>Download</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}
          </ScrollView>
          <Button title="Close" onPress={() => setIsModalVisible(false)} />
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
    maxHeight: '90%',
    marginHorizontal: 10,
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
  scrollViewStyle: {
    width: '100%', // Ensure the ScrollView covers the full width
    marginVertical: 20, // Add vertical margin for better spacing
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 10,
    color: '#000', // Example color for titles
    alignSelf: 'flex-start', // Align self to start for titles
  },
  descriptionText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#444', // Slightly lighter color for descriptions
    alignSelf: 'flex-start', // Align self to start for descriptions
  },
  fileContainer: {
    flexDirection: 'row', // Align items in a row
    justifyContent: 'space-between', // Space out the child elements
    padding: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9', // Light background for the container
  },
  fileName: {
    flex: 1, // Ensure the file name takes up as much space as possible
    marginRight: 10, // Spacing between the name and the download button
    color: '#333',
    fontWeight: 'bold', // Making the file names bold
  },
  downloadButton: {
    backgroundColor: '#007bff', // Example button color
    padding: 5,
    borderRadius: 5,
  },
  downloadButtonText: {
    color: '#007bff', // Adjusting for visibility
    fontWeight: 'bold', // Optional: making the text bold
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },

  sectionSeparator: {
    height: 1, // Thin line
    width: '100%', // Full width
    backgroundColor: '#ddd', // Light grey color for the separator
    marginVertical: 10, // Spacing above and below
  },
  pdfIcon: {
    marginRight: 10, // Adds some space between the icon and the filename
    // Adjust color and size in the Icon component as needed
  },
});

export default PatientConsultationScreen;
