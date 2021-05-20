import { createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';

import userReducer from '../reducers/userReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';


const persistConfig = {
    key: 'persistedAppMesaRapida',
    storage: AsyncStorage,
};

const persistedReducer = combineReducers({
    user: persistReducer(persistConfig, userReducer),
});

const store = createStore(persistedReducer);

const persistor = persistStore(store);

export { store, persistor };

