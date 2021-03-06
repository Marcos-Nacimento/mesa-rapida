import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { api } from '../../api';
import { Image, ActivityIndicator } from 'react-native';
import { PaymentsStripe as Stripe } from 'expo-payments-stripe';
import { useNavigation } from '@react-navigation/native';
import { Container, Box, Label, Button, BoxWarning, OnPress } from './styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { heightPercentageToDP as hP, widthPercentageToDP as wP } from 'react-native-responsive-screen';

import NetInfo from '@react-native-community/netinfo';
import NetWork from '../../components/network';
import NoPermission from '../../components/noPermission'; 

function Payment({ user }) {
    const [successPayment, setSuccess] = useState(false);
    const [cancelledPayment, setCancelled] = useState(false);
    const [failedPayment, setFailed] = useState(false);
    const [isConnected, setConnected] = useState(false);
    const [noPermission, setPermission] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [isLoaded, setLoaded] = useState(false);

    const navigation = useNavigation();

    const payment = async () => {
        
        setDisabled(true);

        // reset states
        setSuccess(false);
        setCancelled(false);
        setFailed(false);

        try {
            setLoaded(true);

            let token = await Stripe.paymentRequestWithCardFormAsync();

            let { data } = await api.post(`${api.defaults.baseURL}/user/payment`, {
                name: user.user.name,
                email: user.user.email,
                sourceToken: token.tokenId,
                userId: user.user._id,
            }, {
                headers: {
                    "x-access-token": user.token
                },
            });

            if(data.code === 200) {
                setSuccess(true);
            }else {
                setSuccess(false);
                setDisabled(false);
            };

        }catch(error) {
            if(!error.response) {
                setCancelled(true);
                setDisabled(false);
                return;
            }else if(error.response.status === 401) {
                setPermission(true);
                setDisabled(false);
            }else if(error.response.status === 400 && error.response.data ===  "n??o foi possivel efetuar o pagamento!") {
                setFailed(true);
                setDisabled(false);
            }else if(error.response.status === 400 && error.response.data == "Voc?? j?? fez o pagamento desse mes") {
                setFailed(true);
                setDisabled(false);
            };
        }finally {
            setLoaded(false);
        };
    };

    // initialize payment method
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            if(!state.isConnected) {
                setConnected(true);
            }else {
                setConnected(false);
            };
        });

        Stripe.setOptionsAsync({
            publishableKey: 'pk_test_51HBvUZHKI3JpEpODZUkDuxqOJ0wxzymcJAdWKola9YxHYlPMAZxrLUfxr9B8lZ04t0XJ6xJHYwVJMBmqSh8E6xLJ00kzmqVxxg',
        });

        return () => unsubscribe();
    }, []);

    return(
        <Container>
            <NoPermission isModal={noPermission} />
            <Box>
                <Label
                    style={{
                        marginTop: hP('3%'),
                    }}
                >
                    Aceitamos os principais cart??es de d??bito e cr??dito ????, fique avontade
                    para escolher sua melhor forma de pagamento.
                </Label>
                <Image 
                    source={require('../../assets/v.png')}
                    style={{
                        height: hP('20%'),
                        width: wP('60%'),
                    }}
                    
                />
            </Box>
            <Box>
                <Label
                    style={{
                        fontWeight: 'bold',
                        marginTop: hP('1%'),
                        marginBottom: hP('2%')
                    }}
                >
                    Aviso!
                </Label>
                <Label>
                    fique tranquilo suas informa????es est??o seguras, utilizamos criptografia
                    avan??ada para embaralhar suas informa????es ????.
                </Label>

                <Button 
                    onPress={() => payment()}
                    disabled={disabled}
                >
                    {isLoaded ? (
                        <ActivityIndicator color='#7159c2'/>
                    ): (
                        <Label style={{color: '#7159c2'}}>Pagar</Label>
                    )}
                </Button>
            </Box>

            {isConnected && (
                <NetWork />
            )}

            {failedPayment && (
                <BoxWarning 
                    style={{
                        backgroundColor: '#8b0000'
                    }}
                >
                    <Label>
                        { failedPayment ? 'Opera????o falhou tente novamente' : 'Opera????o cancelada pelo usuario'}
                    </Label>
                </BoxWarning>
            )}

            {cancelledPayment && (
                <BoxWarning 
                    style={{
                        backgroundColor: '#d2691e' 
                    }}
                >
                    <Label>
                        { failedPayment ? 'Opera????o falhou tente novamente' : 'Opera????o cancelada pelo usuario'}
                    </Label>
                </BoxWarning>
            )}

            {successPayment && (
                <OnPress onPress={() => navigation.navigate('In??cio')}>
                    <MaterialCommunityIcons name='arrow-left' color='#7159c2' size={hP('3%')}/>
                    <Label 
                    style={{
                        color: '#7159c2',
                        fontSize: hP('2.8%')
                    }}>
                        valta para in??cio
                    </Label>
                </OnPress>
            )}

            {successPayment && (
                <BoxWarning
                    style={{
                        backgroundColor: '#228b22'
                    }}
                >
                    <Label>Pagamento efetuado com sucesso!</Label>
                </BoxWarning>
            )}
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

export default connect(mapStateToProps)(Payment);