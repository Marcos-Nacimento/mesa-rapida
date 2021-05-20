import React, { useRef, useState, useEffect } from 'react';

import 
{
    Container,
    Content,
    Button,
    Label,
    Header,
    ContentFoolter,
} from './styles';
import { Input } from 'react-native-elements';
import { heightPercentageToDP as hP } from 'react-native-responsive-screen';
import { Animated, Easing, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { userAddAction } from '../../state/actions/userAction';
import { api } from '../../api';

import NetInfo from '@react-native-community/netinfo';
import NetWork from '../../components/network';

function ResetPassword({ add_state, route }) {
    let valueAnim = useRef(new Animated.Value(hP('30%'))).current;
    let opacityAnim = useRef(new Animated.Value(1)).current;
    
    let [isViewFieldOne, setViewFieldOne] = useState(true);
    let [isViewFieldTwo, setViewFieldTwo] = useState(true);
    let [passwordOne, setPasswordOne ] = useState('');
    let [passwordTwo, setPasswordTwo] = useState('');
    let [loading, setLoading] = useState(false);
    let [passwordErros, setPasswordErros] = useState({
        passwordOneErroMsg: '',
        passwordTwoErroMsg: '',
    });
    const [isConnected, setConnected] = useState(false);

    const { credentials } = route.params;

    const startingAnim = () => {
        Animated.sequence([
          Animated.timing(valueAnim, {
            toValue: hP('7%'),
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

    const resetPassword = async () => {

        setPasswordErros({passwordOneErroMsg: ''});
        setPasswordErros({passwordTwoErroMsg: ''});

        if(!passwordOne) {
            setPasswordErros({passwordOneErroMsg: 'campo requerido'});
            return;
        };

        if(!passwordTwo) {
            setPasswordErros({passwordTwoErroMsg: 'campo requerido'});
            return;
        };

        if(passwordOne !== passwordTwo) {
            setPasswordErros({passwordTwoErroMsg: 'senhas não confere'});
            return;
        };

        try {
            setLoading(true);

            let { data } = await api.post(`${api.defaults.baseURL}/account/reset`, {
                password: passwordTwo,
                userId: credentials.findCode.userId,
                sourceToken: credentials.token,
            });

            if(!data) {
                return;
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
                <Label>Confime sua senha!</Label>
            </Header>
            <Content>
                <Input
                    label="Nova senha"
                    labelStyle={{
                        fontFamily: 'Inter_300Light',
                        fontSize: hP('2.3%'),
                        fontWeight: 'bold',
                        color: '#838383'
                    }}
                    secureTextEntry={isViewFieldOne}
                    placeholder='senha'
                    inputStyle={{
                        fontFamily: 'Inter_300Light',
                        color: '#838383',
                    }}
                    errorStyle={{color: '#a52a2a'}}
                    errorMessage={passwordErros.passwordOneErroMsg}
                    onFocus={() => startingAnim()}
                    rightIcon={
                        <TouchableOpacity
                            onPress={() => setViewFieldOne(!isViewFieldOne)}
                        >
                            <MaterialCommunityIcons 
                                name={isViewFieldOne ? "eye-off" : "eye"} 
                                color="#838383" 
                                size={hP('3%')}
                            />
                        </TouchableOpacity>
                    }
                    onChangeText={text => setPasswordOne(text)}
                    value={passwordOne}
                    autoCapitalize='none'
                />

                <Input
                    label="Confirme a senha"
                    labelStyle={{
                        fontFamily: 'Inter_300Light',
                        fontSize: hP('2.3%'),
                        fontWeight: 'bold',
                        color: '#838383'
                    }}
                    secureTextEntry={isViewFieldTwo}
                    placeholder='confirme a senha'
                    inputStyle={{
                        fontFamily: 'Inter_300Light',
                        color: '#838383',
                    }}
                    errorStyle={{color: '#a52a2a'}}
                    errorMessage={passwordErros.passwordTwoErroMsg}
                    onFocus={() => startingAnim()}
                    rightIcon={
                        <TouchableOpacity
                            onPress={() => setViewFieldTwo(!isViewFieldTwo)}
                        >
                            <MaterialCommunityIcons 
                                name={isViewFieldTwo ? "eye-off" : "eye"} 
                                color="#838383" 
                                size={hP('3%')}
                            />
                        </TouchableOpacity>
                    }
                    onChangeText={text => setPasswordTwo(text)}
                    value={passwordTwo}
                    autoCapitalize='none'
                />

                <Button
                    onPress={() => resetPassword()}
                    disabled={loading}
                >
                    { loading ? (
                        <ActivityIndicator size={hP('3%')} color='#FFFF'/>
                    ): (
                        <Label>confirmar</Label>
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

export default connect(null, mapDispathToProps)(ResetPassword);