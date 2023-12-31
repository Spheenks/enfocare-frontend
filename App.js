/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useRef, useState, useEffect} from 'react';

import {AppState, SafeAreaView, StyleSheet} from 'react-native';
// import { UserContextProvider } from './src/UserContext/UserContextProvider';

import Navigation from './src/Components/navigation';
import {AuthProvider} from './src/context/AuthContext';
import {EnfocareApiProvider} from './src/api/EnfocareApi';

const App = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      {/* <UserContextProvider> */}

      <AuthProvider>
        <EnfocareApiProvider>
          <Navigation />
        </EnfocareApiProvider>
      </AuthProvider>

      {/* </UserContextProvider> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'F9FBFC',
  },
});

export default App;
