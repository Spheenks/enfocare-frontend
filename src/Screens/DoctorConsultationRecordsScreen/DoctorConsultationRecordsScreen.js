import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {EnfocareApi} from '../../api/EnfocareApi';
import UploadDiagnosis from '../../Components/UploadDiagnosis/UploadDiagnosis';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DoctorConsultationRecordsScreen = () => {
  const {userProfile} = useContext(EnfocareApi);
  const {fetchConsultationRecordsForDoctor, fetchMedicalFilesByConsultationId} =
    useContext(EnfocareApi);
  const [records, setRecords] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [medicalFiles, setMedicalFiles] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const fetchedRecords = await fetchConsultationRecordsForDoctor(
          userProfile.email,
        );
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

  useEffect(() => {
    if (selectedRecord) {
      const fetchFiles = async () => {
        const files = await fetchMedicalFilesByConsultationId(
          selectedRecord.id,
        );
        setMedicalFiles(files);
      };
      fetchFiles();
    }
  }, [selectedRecord, fetchMedicalFilesByConsultationId]);

  const handleViewRecord = record => {
    setSelectedRecord(record);
    setIsModalVisible(true);
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
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            {selectedRecord && (
              <>
                <Text style={styles.titleText}>Doctor: </Text>
                <Text style={styles.descriptionText}>
                  {selectedRecord.doctor}
                </Text>
                <View style={styles.sectionSeparator} />
                <Text style={styles.titleText}>Patient: </Text>
                <Text style={styles.descriptionText}>
                  {selectedRecord.patient}
                </Text>
                <View style={styles.sectionSeparator} />
                <Text style={styles.titleText}>Date: </Text>
                <Text style={styles.descriptionText}>
                  {selectedRecord.date}
                </Text>
                <View style={styles.sectionSeparator} />
                <Text style={styles.titleText}>Diagnosis: </Text>
                <Text style={styles.descriptionText}>
                  {selectedRecord.diagnosis}
                </Text>
                <View style={styles.sectionSeparator} />
                <Text style={styles.titleText}>Treatment: </Text>
                <Text style={styles.descriptionText}>
                  {selectedRecord.treatment}
                </Text>
                <View style={styles.sectionSeparator} />
                <Text style={styles.titleText}>Ailment: </Text>
                <Text style={styles.descriptionText}>
                  {selectedRecord.ailment}
                </Text>
                <View style={styles.sectionSeparator} />
                <Text style={styles.titleText}>Symptoms: </Text>
                <Text style={styles.descriptionText}>
                  {selectedRecord.symptoms}
                </Text>
                <View style={styles.sectionSeparator} />
                {/* Display files */}
                <Text style={styles.filesHeader}>Files:</Text>
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
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => setIsModalVisible(false)}>
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={onUploadDiagnosis}>
                    <Text style={styles.buttonText}>Upload File</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>

      <UploadDiagnosis
        isVisible={isUploadModalVisible}
        onClose={() => setIsUploadModalVisible(false)}
        onUploadSuccess={() => {
          console.log('Upload Successful');
          setIsUploadModalVisible(false); // Close the modal after successful upload
          // Consider re-fetching the files here if you want them to immediately appear in the list
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
  descriptionText: {
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
  buttonContainer: {
    flexDirection: 'row', // Align buttons in a row
    justifyContent: 'space-around', // Space them evenly
    marginTop: 20, // Add some space from the content above
  },
  buttonStyle: {
    backgroundColor: '#007bff', // Example button color
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DoctorConsultationRecordsScreen;
