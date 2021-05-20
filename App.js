import React from 'react';
import AppLoading from 'expo-app-loading';
import AuthNavigation from './src/routes/authNavigation';
import StatusBar from './src/config/statusBar';

import { NavigationContainer } from '@react-navigation/native';
import { useFonts, Inter_600SemiBold, Inter_300Light } from '@expo-google-fonts/inter';
import { Provider } from 'react-redux';
import { store, persistor } from './src/state/store';
import { PersistGate } from 'redux-persist/integration/react';
import { enableScreens } from 'react-native-screens';

import TableProvider from './src/contexts/tableProvider';

// enable screens to performance
enableScreens();

function App() {
  let [isLoaded] = useFonts({
    Inter_600SemiBold,
    Inter_300Light,
  });

  if(!isLoaded) {
    return <AppLoading />
  };

  return(
    <NavigationContainer>
      <StatusBar />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <TableProvider>
            <AuthNavigation />
          </TableProvider>
        </PersistGate>
      </Provider>
    </NavigationContainer>
  );
};

export default App;
