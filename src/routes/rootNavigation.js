import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { heightPercentageToDP as hP } from 'react-native-responsive-screen';
const Drawer = createDrawerNavigator();

// screens
import Dasbord from '../screens/dashbord';
import historyBox from '../screens/historyBox';
import Table from '../screens/table';
import KitChen from '../screens/kitchen';
import Graphics from '../screens/graphics';
import Settings from '../screens/settings';

function RootNavigation() {
  return(
    <Drawer.Navigator
      drawerStyle={{
        backgroundColor: '#7159c3',
        borderTopRightRadius: hP('3%'),
        borderBottomRightRadius: hP('3%'),
        width: hP('38%'),
      }}
      drawerContentOptions={{
        activeTintColor: '#FFFF',
        inactiveTintColor: '#a9a9a9',
      }}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFF',
          elevation: 1,
        },
        headerTitleStyle: {
          fontFamily: 'Inter_300Light',
        },
      }}
    >
      <Drawer.Screen 
        name='Início' 
        component={Dasbord}
        options={{
          drawerLabel: "Início",
          drawerIcon: ({size, color}) => <AntDesign name='home' color={color} size={size}/>
        }}
      />

      <Drawer.Screen 
        name='Mesas' 
        component={Table}
        options={{
          drawerLabel: "Mesas",
          drawerIcon: ({size, color}) => <MaterialCommunityIcons name='table' color={color} size={size}/>
        }}
      />

      <Drawer.Screen 
        name='Cozinha' 
        component={KitChen}
        options={{
          drawerLabel: "Cozinha",
          drawerIcon: ({size, color}) => <MaterialCommunityIcons name='buffer' color={color} size={size}/>
        }}
      />

      <Drawer.Screen 
        name='Visão do dia' 
        component={Graphics}
        options={{
          drawerLabel: "Visão do dia",
          drawerIcon: ({size, color}) => <MaterialCommunityIcons name='graph-outline' color={color} size={size}/>
        }}
      />
 
      <Drawer.Screen 
        name='Configurações' 
        component={Settings}
        options={{
          drawerLabel: "Configurações",
          drawerIcon: ({size, color}) => <AntDesign name='setting' color={color} size={size}/>
        }}
      />

      <Drawer.Screen 
        name='Historico de Caixa' 
        component={historyBox}
        options={{
          drawerLabel: "Historico de Caixa",
          drawerIcon: ({size, color}) => <MaterialCommunityIcons name='history' color={color} size={size}/>
        }}
      />
    </Drawer.Navigator>
  );
};

export default RootNavigation;
