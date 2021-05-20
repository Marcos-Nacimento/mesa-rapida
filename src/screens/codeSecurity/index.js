import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import 
{
    Container,
    Label,
    Content,
    Box,
    Button,
    ContentFoolter,
} from './styles';

import 
{
    heightPercentageToDP as hP,
    widthPercentageToDP as wP
} from 'react-native-responsive-screen';

import 
{
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../api';
 
import NetInfo from '@react-native-community/netinfo';
import NetWork from '../../components/network';

const CELL_COUNT = 6;
 
function App() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeErros, setErrors] = useState('');

  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });
  const [isConnected, setConnected] = useState(false);

  const navigation = useNavigation();

  const sendCode = async () => {
      setLoading(true);
      setErrors('');

      try {
        let { data } = await api.post(`${api.defaults.baseURL}/account/code`, {
            code: value,
        });

        if(data.code === 400) {
            setErrors('código invalido!');
            return;
        };

        navigation.navigate('resetPassword', {credentials: data});
      }catch(error) {
          console.log(error);
      }finally {
        setLoading(false);
      };
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if(!state.isConnected) {
        setConnected(true);
      }else {
        setConnected(false);
      };
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
        <Container>

          <MaterialCommunityIcons name="lock" size={hP('6%')} color="#7159c2"/>
          <Box>
            <Label>
                Por favor, digite o código de verificação 
                que enviamos para o seu endereço de e-mail.
            </Label>
            <Label style={{color: '#dc143c'}}>{codeErros}</Label>
          </Box>

          <Content>
            <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({index, symbol, isFocused}) => (
                    <Label
                        key={index}
                        style={[styles.cell, isFocused && styles.focusCell]}
                        onLayout={getCellOnLayoutHandler(index)}
                    >
                        {symbol || (isFocused ? <Cursor /> : null)}
                    </Label>

                )}
            />
          </Content>

          <Button
            disabled={value ? false : true}
            onPress={() => sendCode()}
          >
            { loading ? (
                  <ActivityIndicator size={hP('3%')} color='#FFFF'/>
            ): (
                <Label style={{color: '#FFFF'}}>confirmar</Label>
            )}
          </Button>
        </Container>

        {isConnected ? (
          <ContentFoolter>
            <NetWork />
          </ContentFoolter>
        ): null}
    </>
  );
};
 
const styles = StyleSheet.create({
    cell: {
      width: wP('10%'),
      height: hP('6%'),
      lineHeight: 38,
      fontSize: hP('2.4%'),
      borderWidth: hP('0.1%'),
      borderColor: '#7159c3',
      textAlign: 'center',
      marginLeft: hP('1%'),
      marginRight: hP('1%'),
      marginBottom: hP('1%'),
    },
    focusCell: {
      borderColor: '#7159c3',
    },
  });

export default App;