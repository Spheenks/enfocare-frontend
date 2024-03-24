import React, {useState, useEffect, useContext} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import {EnfocareApi} from '../../api/EnfocareApi';

const UploadDiagnosis = ({
  isVisible,
  onClose,
  onUploadSuccess,
  consultationId,
  patientEmail,
}) => {
  const {userProfile, fetchMedicalFilePatientEmails, uploadDiagnosisFile} =
    useContext(EnfocareApi);
  const [selectedFile, setSelectedFile] = useState(null);
  const [emailList, setEmailList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      console.log('UploadDiagnosis.js - Selected file:', result);
      setSelectedFile(result);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        throw err;
      }
    }
  };

  const handleUpload = async () => {
    const doctorEmail = userProfile.email;

    if (!patientEmail || !selectedFile) {
      alert('Please select a patient email and a file to upload.');
      return;
    }

    // const doctorEmail = userProfile.email;

    setIsLoading(true);

    try {
      await uploadDiagnosisFile(
        patientEmail,
        doctorEmail,
        selectedFile[0],
        consultationId,
      );

      setSelectedFile(null);

      onUploadSuccess();
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);

      alert('Upload failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Text style={styles.modalTitle}>Upload Diagnosis</Text>
            <Text style={styles.modalSubtitle}>
              Select the patient and upload a document
            </Text>
            {isLoading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
                {/* <View style={styles.pickerContainer}>
                  <Text style={styles.pickerLabel}>Recent Patients:</Text>
                  <Picker
                    selectedValue={selectedEmail}
                    onValueChange={itemValue => setSelectedEmail(itemValue)}
                    style={styles.pickerStyle}
                    mode="dropdown">
                    {emailList.map((email, index) => (
                      <Picker.Item key={index} label={email} value={email} />
                    ))}
                  </Picker>
                </View> */}
                <TouchableOpacity
                  style={styles.fileSelectButton}
                  onPress={handleFileSelect}>
                  <Text style={styles.fileSelectButtonText}>
                    {selectedFile ? selectedFile[0].name : 'Select File'}
                  </Text>
                </TouchableOpacity>
                <View style={styles.uploadButtonContainer}>
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={handleUpload}>
                    <Text style={styles.uploadButtonText}>Upload</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onClose}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adds a dark overlay to the background
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'stretch', // Change from 'center' to 'stretch' for full-width elements
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: '90%', // Ensures modal is not too wide on tablets
  },
  scrollView: {
    alignItems: 'center', // Ensure content is centered in the scroll view
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  pickerStyle: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  fileSelectButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  fileSelectButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  uploadButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
  },
  uploadButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  // Add more styles as needed
});

export default UploadDiagnosis;
