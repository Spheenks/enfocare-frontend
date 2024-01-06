import React, {useContext, useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import PickerModal from '../../Components/PickerModal/PickerModal';
import {EnfocareApi} from '../../api/EnfocareApi';
import Doctors from '../../Components/Doctors';
import Patients from '../../Components/Patients';
import {AuthContext} from '../../context/AuthContext';

const ConsultListingScreen = () => {
  const {userProfile, getDoctorListByField, getLobbyQueue} =
    useContext(EnfocareApi);
  const {userInfo} = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [myData, setMyData] = useState(null);
  const [user, setUser] = useState();
  const navigation = useNavigation();
  const [selectedSpecs, setSelectedSpecs] = useState('Department ▼');
  const [specsModalShow, setSpecsModalShow] = useState(false);
  const rawSpecs = [];
  const [specs, setSpecs] = useState([]);
  const [myId, setMyId] = useState('');

  const [doctors, setDoctors] = useState([]);

  const specializations = [
    'CARDIOLOGY',
    'DERMATOLOGY',
    'ENDOCRINOLOGY',
    'GASTROENTEROLOGY',
    'HEMATOLOGY',
    'IMMUNOLOGY',
    'NEPHROLOGY',
    'NEUROLOGY',
    'ONCOLOGY',
    'ORTHOPEDICS',
    'PULMONOLOGY',
    'RHEUMATOLOGY',
    'ALLERGY AND IMMUNOLOGY',
    'ANESTHESIOLOGY',
    'EMERGENCY MEDICINE',
    'FAMILY MEDICINE',
    'INTERNAL MEDICINE',
    'OBSTETRICS AND GYNECOLOGY',
    'PEDIATRICS',
    'PSYCHIATRY',
    'RADIOLOGY',
    'UROLOGY',
    'OPHTHALMOLOGY',
    'OTOLARYNGOLOGY',
    'PATHOLOGY',
    'PHYSICAL MEDICINE AND REHABILITATION',
    'PLASTIC SURGERY',
    'COLON AND RECTAL SURGERY',
    'THORACIC SURGERY',
    'VASCULAR SURGERY',
    'NUCLEAR MEDICINE',
    'GERIATRICS',
    'INFECTIOUS DISEASE',
    'PAIN MEDICINE',
    'SLEEP MEDICINE',
    'SPORTS MEDICINE',
    'MEDICAL GENETICS',
    'CLINICAL GENETICS',
    'DENTAL MEDICINE',
    'CLINICAL PHARMACOLOGY',
    'FORENSIC MEDICINE',
    'NUCLEAR RADIOLOGY',
    'GYNECOLOGIC ONCOLOGY',
    'NEONATOLOGY',
    'PEDIATRIC SURGERY',
    'HAND SURGERY',
    'INTERVENTIONAL RADIOLOGY',
    'MOLECULAR GENETICS',
    'MEDICAL MICROBIOLOGY',
    'NEUROTOLOGY',
  ];

  useEffect(() => {
    setSpecs(specializations);
  }, []);

  const setDoctorList = async selectedField => {
    console.log('setDoctorList called');
    try {
      let doctors = await getDoctorListByField(selectedField);

      if (!Array.isArray(doctors)) {
        doctors = [doctors];
      }

      console.log('setDoctorList called', doctors);

      const doctorLobbies = await Promise.all(
        doctors.map(async doctor => {
          const queueCount = await getLobbyQueue(doctor.email);
          return {
            ...doctor,
            lobby: {
              onQueue: queueCount,
            },
          };
        }),
      );

      console.log('doctorLobbies', doctorLobbies);

      setDoctors(doctorLobbies);
    } catch (error) {
      console.error('Error setting doctor list:', error);
    }
  };

  const consultDoctor = async doctorSelected => {
    navigation.navigate('LobbyScreen', {
      doctorEmail: doctorSelected.email,
    });

    // database()
    //   .ref(`lobbies/${userSelected.lobby}/onQueue/${myData.id}`)
    //   .set({
    //     firstname: myData.firstname,
    //     lastname: myData.lastname,
    //     email: myData.email,
    //     id: myData.id,
    //     timein: new Date().toUTCString(),
    //   })
    //   .then(() => {
    //     navigation.navigate('LobbyScreen', {
    //       lobbyId: userSelected.lobby,
    //       doctorId: userSelected.id,
    //     });
    //   })
    //   .then(() => {
    //     database()
    //       .ref(`users/${myData.id}/connections/${userSelected.id}`)
    //       .once('value', snapshot => {
    //         if (snapshot.val() === null) {
    //           console.log('Creating because not exists');
    //           const newChatroomRef = database().ref('chatrooms').push({
    //             firstUser: myData.id,
    //             secondUser: userSelected.id,
    //             messages: [],
    //           });
    //           const newChatroomId = newChatroomRef.key;
    //           database()
    //             .ref(`users/${myData.id}/connections/${userSelected.id}`)
    //             .set({
    //               chatroomId: newChatroomId,
    //             });
    //           database()
    //             .ref(`users/${userSelected.id}/connections/${myData.id}`)
    //             .set({
    //               chatroomId: newChatroomId,
    //             });
    //         }
    //       });
    //   });
  };

  return (
    <>
      <PickerModal
        pickerValue={selectedSpecs}
        options={specs}
        onSelect={value => {
          setSelectedSpecs(value),
            setSpecsModalShow(false),
            setDoctorList(value);
        }}
        isVisible={specsModalShow}
        onOpenPicker={() => setSpecsModalShow(true)}
        onClose={() => setSpecsModalShow(false)}
      />
      {doctors ? (
        <Doctors doctors={doctors} onConsultDoctor={consultDoctor} />
      ) : (
        <></>
      )}
    </>
  );
};

export default ConsultListingScreen;
