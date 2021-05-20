import React, { useRef, useState, useEffect } from 'react';
import 
{
    Container,
    Header,
    Button,
    Label,
    ButtonName,
    Content,
    ContentFoolter,
} from './styles';
import { Input } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { heightPercentageToDP as hP } from 'react-native-responsive-screen';
import { Animated, Easing, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../api';

import NetInfo from '@react-native-community/netinfo';
import NetWork from '../../components/network';

function Forgot() {
    let valueAnim = useRef(new Animated.Value(hP('35%'))).current;
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isConnected, setConnected] = useState(false);

    const navigation = useNavigation();

    const startingAnim = () => {
        Animated.timing(valueAnim, {
            toValue: hP('17%'),
            duration: 1000,
            useNativeDriver: false,
            easing: Easing.back()
        }).start();
    };

    const sendEmail = async () => {
        setLoading(true);

        try {
            await api.post(`${api.defaults.baseURL}/account/forgot`, {
                email: email,
            });
            
            //navigation screen codeSecurity.
            navigation.navigate('codeSecurity');
        }catch(error) {
            console.log(error);
        }finally {
            setLoading(false);
        }
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

    return(
        <Container>

            <Header as={Animated.View} style={{height: valueAnim}}>
                <Label>Recuperação de Senha.</Label>
            </Header>
            
            <Input
                label="Seu Email"
                labelStyle={{
                    fontFamily: 'Inter_300Light',
                    fontSize: hP('2.3%'),
                    fontWeight: 'bold',
                    color: '#838383'
                }}
                leftIcon={<MaterialCommunityIcons name='email' size={hP('3.2%')} color='#838383'/>}
                placeholder='Email'
                keyboardType='email-address'
                inputStyle={{
                    fontFamily: 'Inter_300Light',
                    color: '#838383',
                }}
                onChangeText={text => setEmail(text)}
                value={email}
                onFocus={() => startingAnim()}
                autoCapitalize='none'
            />

            <Content>
                <Button onPress={() => sendEmail()}>
                    { loading ? (
                        <ActivityIndicator size={hP('3%')} color='#FFFF'/>
                    ): (
                        <ButtonName>Enviar</ButtonName>
                    )}
                </Button>
            </Content>


            {isConnected ? (
                <ContentFoolter>
                    <NetWork />
                </ContentFoolter>
            ): null}
        </Container>
    );
};

export default Forgot;