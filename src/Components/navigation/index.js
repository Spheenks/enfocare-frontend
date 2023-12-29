import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignInScreen from '../../Screens/SignInScreen';
import SignUpScreen from '../../Screens/SignUpScreen';
// import ResetPasswordScreen from "../../Screens/ResetPasswordScreen";
import DashboardScreen from '../../Screens/DashboardScreen';
import ProfileSetupSceen from '../../Screens/ProfileSetupSceen';
// import ChatScreen from "../../Screens/ChatScreen/ChatScreen";
// import CallingScreen from "../../Screens/CallingScreen/CallingScreen";
// import ConsultListingScreen from "../../Screens/ConsultListingScreen";
// import IncomingCallScreen from "../../Screens/IncomingCallScreen";
// import LobbyScreen from "../../Screens/LobbyScreen/LobbyScreen";
// import TestScreen from "../../Screens/TestScreen";
// import UploadFileScreen from "../../Screens/UploadFileScreen";
// import FileScreen from "../../Screens/FileScreen";
// import DiagnosticScreen from "../../Screens/DiagnosticScreen";

const Stack = createNativeStackNavigator();
const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        {/* <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen}/> */}
        <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
        <Stack.Screen name="ProfileSetupScreen" component={ProfileSetupSceen} />
        {/* <Stack.Screen name="ChatScreen" component={ChatScreen}/>
                <Stack.Screen name="CallingScreen" component={CallingScreen}/>
                <Stack.Screen name="IncomingCallScreen" component={IncomingCallScreen}/>
                <Stack.Screen name="ConsultListingScreen" component={ConsultListingScreen}/>
                <Stack.Screen name="LobbyScreen" component={LobbyScreen}/>
                <Stack.Screen name="TestScreen" component={TestScreen}/>
                <Stack.Screen name="UploadFileScreen" component={UploadFileScreen}/>
                <Stack.Screen name="FileScreen" component={FileScreen}/>
                <Stack.Screen name="DiagnosticScreen" component={DiagnosticScreen}/> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Navigation;
