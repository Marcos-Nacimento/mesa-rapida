import React, { useRef, useState, useEffect, } from 'react';
import 
{ 
  Container, 
  Header,
  Label,
  Content,
  Button,
  ContentFoolter,
} from './styles';
import { heightPercentageToDP as hP } from 'react-native-responsive-screen';
import { Animated, Easing, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { userAddAction } from '../../state/actions/userAction';
import { api } from '../../api';

import NetInfo from '@react-native-community/netinfo';
import NetWork from '../../components/network';

const Login = ({ add_state }) => {
  let valueAnim = useRef(new Animated.Value(hP('35%'))).current;
  let opacityAnim = useRef(new Animated.Value(1)).current;

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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errosMsg, setErros] = useState({emailErro: '', passwordErro: ''});
  const [loading, setLoading] = useState(false);
  const [isViewFieldPassword, setViewFieldPassword] = useState(true);
  const [isConnected, setConnected] = useState(false);

  const navigation = useNavigation();

  const authentication = async () => {

    if(!email) {
      setErros({emailErro: 'campo email vazio!'});
      return;
    }else if(!password) {
      setErros({passwordErro: 'campo senha vazio!'});
      return;
    };

    setErros({emailErro: '', passwordErro: ''});

    try {
      setLoading(true);

      let { data } = await api.post(`${api.defaults.baseURL}/account/authentication`, {
        email: email,
        password: password,
      });

      switch(data.msg) {
        case 'email incorreto ou aconta nao existe!':
          setErros({emailErro: data.msg});
          break;
        case 'senha incorreta!':
          setErros({passwordErro: data.msg});
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
        
        <Header as={Animated.View} style={{height: valueAnim}}>
          <Label as={Animated.Text} style={{opacity: opacityAnim}}>Faça seu Login</Label>
        </Header>

        <Content>
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
            secureTextEntry={true}
            inputStyle={{
              fontFamily: 'Inter_300Light',
              color: '#838383',
            }}
            secureTextEntry={isViewFieldPassword}
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
            onChangeText={text => setPassword(text)}
            value={password}
            errorStyle={{color: '#a52a2a'}}
            errorMessage={errosMsg.passwordErro}
            autoCapitalize='none'
          />
          
          <TouchableOpacity
            style={{
              marginRight: hP('-29%'),
              marginBottom: hP('1%')
            }}
            onPress={() => navigation.push('forgot')}
          >
            <Label 
              style={{
                color: '#838383',
              }}
            >
              esqueci minha senha?
            </Label>
          </TouchableOpacity>

          <Button 
            onPress={() => authentication()}
            disabled={loading}
          >
            { loading ? (
              <ActivityIndicator size={hP('3%')} color='#FFFF'/>
            ): (
              <Label>Login</Label>
            )}
          </Button>

          <TouchableOpacity
            onPress={() => navigation.push('register')}
          >
            <Label 
              style={{
                color: '#838383',
              }}
            >
              Não sou cadastrado?
            </Label>
          </TouchableOpacity>

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


export default connect(null, mapDispathToProps)(Login);