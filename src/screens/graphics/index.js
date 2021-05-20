import React, { useState, useEffect, useRef } from 'react';
import 
{ 
    Container, 
    Content,
    ContentTop,
    Label,
    ContentModal,
    ContentBottom,
} from './styles';
import { Divider, AirbnbRating, Tooltip } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, ScrollView, RefreshControl, Animated } from 'react-native';
import { connect } from 'react-redux';
import { api } from '../../api';
import { Base64 } from 'js-base64';
import { heightPercentageToDP as hP, widthPercentageToDP as wP } from 'react-native-responsive-screen';

import Modal from 'react-native-modal';
import NetInfo from '@react-native-community/netinfo';
import NetWork from '../../components/network';
import NoPermission from '../../components/noPermission';
import PaymentRedirect from '../../components/paymentRedirect';

function Graphics({ user }) {
    const [isModal, setModal] = useState(false);
    const [counterTables, setCounter] = useState(0);
    const [ratingStar, setRatingStar] = useState(0);
    const [reload, setReload] = useState(false);
    const [amount, setAmount] = useState('');
    const [isPermission, setPermission] = useState(false);
    const [isConnected, setConnected] = useState(false);
    const [accountIsExpires, setExpires] = useState(false);

    const animatedBox = useRef(new Animated.Value(0)).current;

    let dataNow = new Date();

    const addZero = (numero) => {
        if (numero <= 9) 
            return "0" + numero;
        else
            return numero; 
    };

    const getDataNow = () => {
        let today = (addZero(dataNow.getDate().toString()) + "/" + (addZero(dataNow.getMonth()+1).toString()) + "/" + dataNow.getFullYear());
        return today;
    };

    const rating = (_amount, price) => {
        if(_amount >= 20 && _amount <= 39 || price >= 100.00 && price <= 199.00) {
            setRatingStar(1);
            return;
        }else if(_amount >= 40 && _amount <= 59 || price >= 200.00 && price <= 299.00) {
            setRatingStar(2);
            return;
        }else if(_amount >= 60 && _amount <= 79 || price >= 300.00 && price <= 399.00) {
            setRatingStar(3);
            return; 
        }else if(_amount >= 80 && _amount <= 99 || price >= 400.00 && price <= 499.00) {
            setRatingStar(4);
            return;
        }else if(_amount >= 100 || price >= 500.00) {
            setRatingStar(5);
            return;
        };

        setRatingStar(0);
    };

    const startAnimating = () => {
        Animated.timing(animatedBox, {
            toValue: 1,
            useNativeDriver: true,
            duration: 2000,
        }).start()
    };

    const getGraphics = async (isFirstExecution, isTwoExecution) => {
        let date = getDataNow();
        
        setExpires(false);

        try {
            setModal(isFirstExecution);
            setReload(isTwoExecution);

            let dateEncode = Base64.encode(date);
    
            let { data } = await api.get(`${api.defaults.baseURL}/table/graphics/${user.user._id}/${dateEncode}`, {
                headers: {
                    "x-access-token": user.token,
                },
            });

            setPermission(false);
            setCounter(data.counterTables);
            setAmount(data.total);
            rating(data.counterTables, data.total);
        }catch(error) {
            if(error.response.status === 401) {
                setPermission(true);
            }else if(error.response.status === 400 && error.response.data === 'sua conta expirou assine já') {
                setExpires(true);
            };
        }finally {
            setModal(false);
            setReload(false);
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

        getGraphics(true, false);
        startAnimating();

        return () => unsubscribe;
    }, []);

    return (
        <Container>
            <NoPermission 
                isModal={isPermission}
            />
            <Modal
                isVisible={isModal}
                backdropColor="#7159c2"
            >
                <ContentModal>
                    <ActivityIndicator color='#FFFF' size={hP('4%')}/>
                    <Label>Aguarde um momento ...</Label>
                </ContentModal>
            </Modal>
            <ScrollView
                refreshControl={
                    <RefreshControl 
                        refreshing={reload}
                        onRefresh={() => getGraphics(false, true)}
                        colors={["#7159c2"]}
                        progressBackgroundColor='#FFFF'
                    />
                }
            >
                <Content as={Animated.View} style={{opacity: animatedBox}}>
                    <ContentTop>
                        <Label>
                            {getDataNow()}
                        </Label>

                        <Tooltip 
                            popover={
                                <Label>
                                    Seu saldo total de hoje,
                                    cada conta fechada 😀.
                                </Label>
                            }
                            backgroundColor='#7159c3'
                            height={hP('20%')}
                            width={wP('50%')}
                        >
                           <MaterialCommunityIcons name='help-circle' color='#FFFF' size={hP('3%')}/>
                        </Tooltip>
                    </ContentTop>

                    <Divider />

                    <ContentBottom>
                        <AirbnbRating
                            count={5}
                            reviews={["Ruim", "Bem", "Bom", "Otimo", "Excelente"]}
                            defaultRating={ratingStar}
                            size={hP('3%')}
                            isDisabled={true}
                        />
                        <Label>Seu saldo</Label>
                        <Label style={{color: '#32cd32'}}>R${amount}</Label>
                    </ContentBottom>

                </Content>

                <Content as={Animated.View} style={{opacity: animatedBox}}>
                    <ContentTop>
                        <Label>
                            {getDataNow()}
                        </Label>

                        <Tooltip 
                            popover={
                                <Label>
                                    Suas mesas fechadas de hoje 😀.
                                </Label>
                            }
                            backgroundColor='#7159c3'
                            height={hP('20%')}
                            width={wP('50%')}
                        >
                           <MaterialCommunityIcons name='help-circle' color='#FFFF' size={hP('3%')}/>
                        </Tooltip>
                    </ContentTop>
                    <Divider />
                    <ContentBottom>
                         <AirbnbRating
                            count={5}
                            reviews={["😥", "😌", "😀", "😍", "🤩"]}
                            defaultRating={ratingStar}
                            size={hP('3%')}
                            isDisabled={true}
                        />
                        <Label>Mesas fechadas</Label>
                        <Label style={{color: '#32cd32'}}>{counterTables}</Label>
                    </ContentBottom>
                </Content>

            </ScrollView>

            {isConnected && (
                <NetWork />
            )}

            {accountIsExpires && (
                <PaymentRedirect />
            )}
        </Container>
    )
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

export default connect(mapStateToProps)(Graphics);