import React, { useState, useRef, useEffect, } from 'react';
import 
{
    Container,
    Header,
    Button,
    Content,
    Label,
    ContentFoolter,
} from './styles';
import { Input } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { heightPercentageToDP as hP } from 'react-native-responsive-screen';
import { Animated, Easing, ActivityIndicator, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { userAddAction } from '../../state/actions/userAction';
import { api } from '../../api';

import NetInfo from '@react-native-community/netinfo';
import NetWork from '../../components/network';

function Register({ add_state }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [errosMsg, setErros] = useState({emailErro: '', passwordErro: '', nameErro: ''});
    const [loading, setLoading] = useState(false);
    const [isViewFieldPassword, setViewFieldPassword] = useState(true);
    const [isConnected, setConnected] = useState(false);

    let valueAnim = useRef(new Animated.Value(hP('35%'))).current;
    let opacityAnim = useRef(new Animated.Value(1)).current;

    const startingAnim = () => {
        Animated.sequence([
          Animated.timing(valueAnim, {
            toValue: hP('1%'),
            duration: 1000,
            useNativeDriver: false,
            easing: Easing.back()
          }),
          
          Animated.timing(opacityAnim, {
            toValue: 0,
            useNativeDriver: false
          })
        ]).start()
      };
    
    const defaultAnim = () => {
        Animated.sequence([
          Animated.timing(valueAnim, {
            toValue: hP('35%'),
            duration: 1000,
            useNativeDriver: false,
            easing: Easing.back()
          }),
    
          Animated.timing(opacityAnim, {
            toValue: 1,
            useNativeDriver: false
          })
        ]).start()
    };

    const register = async () => {

        if(!name) {
            setErros({nameErro: 'campo name vazio'});
            return;
        }else if(!email) {
            setErros({emailErro: 'campo email vazio'});
            return;
        }else if(!password) {
            setErros({passwordErro: 'campo senha vazio'});
            return;
        }else if(password.length < 8) {
            setErros({passwordErro: 'no mínimo 8 caracteres'});
            return;
        };
        
        setErros({emailErro: '', nameErro: '', passwordErro: ''});
        
        try {
            
            setLoading(true);

            let { data } = await api.post(`${api.defaults.baseURL}/account/register`, {
                name: name,
                email: email,
                password: password,
            });

            switch(data.msg) {
                case 'email invalido!':
                    setErros({emailErro: data.msg});
                    break;
            };

            add_state(data);
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

    return(
        <Container>

            <Header as={Animated.View} style={{height: valueAnim, opacity: opacityAnim}}>
                <Label>Faça seu Cadastro</Label>
            </Header>

            <Content>
                
                <Input
                    label="Seu Nome"
                    labelStyle={{
                        fontFamily: 'Inter_300Light',
                        fontSize: hP('2.3%'),
                        fontWeight: 'bold',
                        color: '#838383'
                    }}
                    leftIcon={<MaterialCommunityIcons name='account' size={hP('3.2%')} color='#838383'/>}
                    placeholder='Nome'
                    onFocus={() => startingAnim()}
                    inputStyle={{
                        fontFamily: 'Inter_300Light',
                        color: '#838383',
                    }}
                    onChangeText={text => setName(text)}
                    value={name}
                    errorStyle={{color: '#a52a2a'}}
                    errorMessage={errosMsg.nameErro}
                />

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
                    onFocus={() => startingAnim()}
                    keyboardType='email-address'
                    inputStyle={{
                        fontFamily: 'Inter_300Light',
                        color: '#838383',
                    }}
                    onChangeText={text => setEmail(text)}
                    value={email}
                    errorStyle={{color: '#a52a2a'}}
                    errorMessage={errosMsg.emailErro}
                    autoCapitalize='none'
                />

                <Input
                    label="Sua Senha"
                    labelStyle={{
                        fontFamily: 'Inter_300Light',
                        fontSize: hP('2.3%'),
                        fontWeight: 'bold',
                        color: '#838383'
                    }}
                    leftIcon={<MaterialCommunityIcons name='lock' size={hP('3.2%')} color='#838383'/>}
                    placeholder='Senha'
                    onFocus={() => startingAnim()}
                    onBlur={() => defaultAnim()}
                    secureTextEntry={isViewFieldPassword}
                    inputStyle={{
                        fontFamily: 'Inter_300Light',
                        color: '#838383',
                    }}
                    onChangeText={text => setPassword(text)}
                    value={password}
                    errorStyle={{color: '#a52a2a'}}
                    errorMessage={errosMsg.passwordErro}
                    rightIcon={
                        <TouchableOpacity
                            onPress={() => setViewFieldPassword(!isViewFieldPassword)}
                        >
                            <MaterialCommunityIcons 
                                name={isViewFieldPassword ? "eye" : "eye-off"} 
                                color="#838383" 
                                size={hP('3%')}
                            />
                        </TouchableOpacity>
                    }
                    autoCapitalize='none'
                />

                <Button 
                    onPress={() => register()}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size={hP('3%')} color="#FFFF"/>
                    ): (
                        <Label>Registrar</Label>
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

function mapDispathToProps(dispath) {
    return {
      add_state: user => dispath(userAddAction(user))
    };
};

export default connect(null, mapDispathToProps)(Register);