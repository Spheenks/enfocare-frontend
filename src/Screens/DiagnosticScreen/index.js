import React, {useContext} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  TextInput,
  ScrollView,
} from 'react-native';
import CustomButton from '../../Components/CustomButton';
import {useForm} from 'react-hook-form';
import CustomInput from '../../Components/CustomInput';
import {useEffect} from 'react';
import {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {EnfocareApi} from '../../api/EnfocareApi';
// import Navigation from "../../Components/navigation";

const DiagnosticScreen = () => {
  const [existingData, setExistingData] = useState({
    diagnosis: '',
    recommendation: '',
  });

  const {setProfile} = useContext(EnfocareApi);

  const route = useRoute();
  const navigation = useNavigation();

  const {control, handleSubmit, watch} = useForm();

  const onSubmitDiagnostic = data => {};
  return (
    <ScrollView style={styles.root}>
      <View
        style={{justifyContent: 'center', alignItems: 'center', padding: 20}}>
        <View style={styles.screenTitle}>
          <Text style={{fontSize: 14, fontWeight: 'bold'}}>Diagnosis</Text>
        </View>
        <CustomInput
          rules={{}}
          control={control}
          name="diagnosis"
          customStyleInputStyle={styles.contentBoxContainer}
          placeholder={
            '-Cancer\n-Stroke\n-Diabetes\n-Diarrhea\n-Alzheimer disease\n-Dementia\n\n*************************************************** \n\nPatient suffers from something unexplainable and not so far severe and is curable by any means..........................................................'
          }
          hastMultiLine={true}
          selectTextOnFocus={false}
          textInputStyle={{
            minHeight: 300,
            width: '100%',
            borderRadius: 10,
            backgroundColor: '#fff',
            padding: 10,
          }}
        />

        <View style={styles.screenTitle}>
          <Text style={{fontSize: 14, fontWeight: 'bold'}}>
            Recommendations
          </Text>
        </View>
        <CustomInput
          rules={{}}
          control={control}
          name="recommendations"
          customStyleInputStyle={styles.contentBoxContainer}
          placeholder={
            'The patient needs to smoke about 2 packs of cigarettes a day, stay awake for 3 days a week, and always take a shower every 2am everyday for a month. Avoid eating veggies and always eat oily/greasy food to maintain healthy lifestyle. Drinking 15 redbulls a day also boosts immune system to fight diseases................................................................................................................................................... '
          }
          hastMultiLine={true}
          selectTextOnFocus={false}
          textInputStyle={{
            minHeight: 200,
            width: '100%',
            borderRadius: 10,
            backgroundColor: '#fff',
            padding: 10,
          }}
        />

        <View style={styles.screenButtonContainers}>
          <CustomButton
            text="Submit"
            type="BLUE"
            onPress={handleSubmit(onSubmitDiagnostic)}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    // flex: 1,
    backgroundColor: '#74DA74',
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  screenTitle: {
    height: 20,
    width: '90%',
    // margin: 10,
    // alignItems: 'center',
    justifyContent: 'center',
  },
  screenButtonContainers: {
    height: 100,
    width: '90%',
    margin: 10,
    // backgroundColor: '#fff',
    justifyContent: 'center',
  },
  titleBoxContainer: {
    height: 50,
    width: '90%',
    margin: 10,
  },
  contentBoxContainer: {
    height: 'auto',
    width: '90%',
    margin: 5,
  },
});
export default DiagnosticScreen;
