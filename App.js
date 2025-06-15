import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';
import MainNavigation from './Navigation/MainNavigation';
import {AuthProvider} from './context/AuthContext';

const App = () => {
    return (
      <AuthProvider>
          <NavigationContainer
            onReady={() => {
              BootSplash.hide({ fade: true });
            }}>
              <MainNavigation />
          </NavigationContainer>
      </AuthProvider>
    );
};

export default App;
