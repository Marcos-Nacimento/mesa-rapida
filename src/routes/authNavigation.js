import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux';

// screen
import Login from '../screens/login';
import Forgot from '../screens/forgot';
import Register from '../screens/register';
import RootNav from './rootNavigation';
import DetailTable from  '../screens/detailTable';
import OnBording from '../screens/onBording';
import CodeSecurity from '../screens/codeSecurity';
import ResetPassword from '../screens/resetPassword';
import DetailOrder from '../screens/detailOrder';
import Payment from '../screens/payment';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

function AuthNavigation({ user }) {
    const [isOnBording, setOnBording] = useState();

    (async () => {
        const data = await AsyncStorage.getItem('@onBordingMesaRapida');
        setOnBording(data);
    })();

    return(
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            {user.auth ? (
                <>
                    <Stack.Screen name="root" component={RootNav}/>
            
                    <Stack.Screen 
                            name="detail" 
                            component={DetailTable}
                            options={{
                                headerShown: true,
                                headerTitle: 'Mesa',
                                headerTitleStyle: {
                                    fontFamily: 'Inter_300Light',
                                },
                                headerStyle: {
                                    elevation: 1,
                                }
                            }}
                        />
                        <Stack.Screen 
                            name='detailOrder'
                            component={DetailOrder}
                            options={{
                                headerShown: true,
                                headerTitle: 'Pedidos',
                                headerTitleStyle: {
                                    fontFamily: 'Inter_300Light',
                                },
                                headerStyle: {
                                    elevation: 1,
                                }
                        }}
                    />
                    
                    <Stack.Screen 
                        name='payment'
                        component={Payment}
                        options={{
                            headerShown: true,
                            headerTitle: 'Pagamento',
                            headerTitleStyle: {
                                fontFamily: 'Inter_300Light',
                            },
                            headerStyle: {
                                elevation: 1,
                            }
                        }}
                    />
                </>
            ): isOnBording ? (
                <>
                    <Stack.Screen name="login" component={Login}/>
                    <Stack.Screen name="forgot" component={Forgot}/>
                    <Stack.Screen name="register" component={Register}/>
                    <Stack.Screen name="codeSecurity" component={CodeSecurity}/>
                    <Stack.Screen name="resetPassword" component={ResetPassword}/>
                </>
            ): (
                <>
                    <Stack.Screen name="onBording" component={OnBording}/>
                    <Stack.Screen name="login" component={Login}/>
                    <Stack.Screen name="forgot" component={Forgot}/>
                    <Stack.Screen name="register" component={Register}/>
                    <Stack.Screen name="codeSecurity" component={CodeSecurity}/>
                    <Stack.Screen name="resetPassword" component={ResetPassword}/>
                </>
            )}

        </Stack.Navigator>
    );
};

function mapStateToProps(state) {
    return {
        user: state.user
    };
};

export default connect(mapStateToProps)(AuthNavigation);
