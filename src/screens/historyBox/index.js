import React, { useState, useEffect, useCallback } from 'react';
import 
{
    Container,
    FlatList,
    BoxItem,
    Label,
    BoxMain,
    BoxTop,
    BoxBottom,
    OnPress,
    ContentModal,
} from './styles';
import { heightPercentageToDP as hP, widthPercentageToDP as wP } from 'react-native-responsive-screen';
import { ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { api } from '../../api';
import { Base64 } from 'js-base64';
import { Divider, Tooltip } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import NoPermission from '../../components/noPermission';
import DateTimePicker from '@react-native-community/datetimepicker';
import NetInfo from '@react-native-community/netinfo';
import NetWork from '../../components/network';
import Modal from 'react-native-modal';
import PaymentRedirect from '../../components/paymentRedirect';

function Product({ user }) {
    let dateNew = new Date();

    const addZero = (numero) => {
        if (numero <= 9) 
            return "0" + numero;
        else
            return numero; 
    };

    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [xTotalPage, setTotal] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isPermission, setPermission] = useState(false);
    const [balance, setBalance] = useState(0);
    const [dateInitial, setDate] = useState((addZero(dateNew.getDate().toString()) +"/"+ (addZero(dateNew.getMonth()+1).toString()) + "/" + dateNew.getFullYear()));
    const [show, setShow] = useState(false);
    const [errosMsg, setErros] = useState('');
    const [isModal, setModal] = useState(false);
    const [isConnected, setConnected] = useState(false);
    const [accountIsExpires, setExpires] = useState(false);

    const getHistory = async () => {
        
        if(page > xTotalPage) {
            return;
        };

        let dataEncode = Base64.encode(dateInitial);

        setExpires(false);

        try {
            setLoading(true);

            let { data } = await api.get(`${api.defaults.baseURL}/history/month/${user.user._id}/${page}/${dataEncode}`, {
                headers: {
                    "x-access-token": user.token,
                }
            });

            if(data.docs.length === 0) {
                setErros('nenhum resultado encontrado!');
            };

            setPermission(false);
            setHistory([...history, ...data.docs]);
            setTotal(data.totalPages);
            setPage(page + 1);

            //calculator
            setBalance(balance + data.docs.reduce((total, _item) => total + parseFloat(_item.amount), 0));
        }catch(error) {
            if(error.response.status === 401) {
                setPermission(true);
            }else if(error.response.status === 400 && error.response.data === 'sua conta expirou assine já') {
                setExpires(true);
            };
        }finally {
            setLoading(false);
        }
    };

    const onChange = async (event, selectedDate) => {
        setShow(false);
        setErros('');

        setExpires(false);

        if(selectedDate) {
            let _date = (addZero(selectedDate.getDate().toString()) +"/"+ (addZero(selectedDate.getMonth()+1).toString()) + "/" + selectedDate.getFullYear());
            let dateEncode = Base64.encode(_date);

            try {
                setModal(true);

                let { data } = await api.get(`${api.defaults.baseURL}/history/month/${user.user._id}/${1}/${dateEncode}`, {
                    headers: {
                        "x-access-token": user.token,
                    }
                });
            

                if(data.docs.length === 0) {
                    setErros('nenhum resultado encontrado!');
                    return;
                };

                setPermission(false);
                setPage(2);
                setHistory(data.docs);
                setTotal(data.totalPages);
                setDate((addZero(selectedDate.getDate().toString()) +"/"+ (addZero(selectedDate.getMonth()+1).toString()) + "/" + selectedDate.getFullYear()));

                //calculator
                setBalance(data.docs.reduce((total, _item) => total + parseFloat(_item.amount), 0));
            }catch(error) {
                if(error.response.status === 401) {
                    setPermission(true);
                }else if(error.response.status === 400 && error.response.data === 'sua conta expirou assine já') {
                    setExpires(true);
                };
            }finally {
                setModal(false);
            };
        };
    };

    const renderItem = useCallback(({ item }) => {
        return(
            <BoxItem >
                <Label>mesa# {item.name}</Label>
                <Label>{item.createAt}</Label>
                <Label>R$ {item.amount}</Label>
            </BoxItem>
        );
    }, []);
    

    const keyExtractor = useCallback((key) => key._id, []);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            if(!state.isConnected) {
                setConnected(true);
            }else {
                setConnected(false);
            };
        });

        getHistory();
        return () => unsubscribe();
    }, []);

    return(
        <Container>
            <NoPermission isModal={isPermission} />
            <NoPermission 
                isModal={isPermission}
            />
            <Modal
                isVisible={isModal}
                backdropColor="#7159c2"
            >
                <ContentModal>
                    <ActivityIndicator color='#FFFF' size={hP('4%')}/>
                    <Label style={{color: '#FFFF'}}>Aguarde um momento ...</Label>
                </ContentModal>
            </Modal>
            <BoxMain>
                <BoxTop>
                    <OnPress onPress={() => setShow(true)}>
                        <Label style={{color: '#FFFF'}}>{dateInitial}</Label>
                    </OnPress>
                    <Tooltip 
                        popover={
                            <Label style={{color: '#FFFF'}}>
                                Seu histórico de {dateInitial} 😀,
                                caso queira mudar click na data ao lado esquerdo.
                            </Label>
                        }
                            backgroundColor='#7159c3'
                            height={hP('20%')}
                            width={wP('50%')}
                        >
                        <MaterialCommunityIcons name='help-circle' color='#FFFF' size={hP('3%')}/>
                    </Tooltip>
                </BoxTop>
                <Divider />
                <BoxBottom>
                    <Label style={{color: '#FFFF'}}>Seu saldo total</Label>
                    <Label style={{color: '#32cd32'}}>R${balance.toFixed(2)}</Label>
                </BoxBottom>
            </BoxMain>
            <Label>{errosMsg}</Label>

            <FlatList 
                data={history}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                onEndReachedThreshold={0.1}
                onEndReached={getHistory}
                maxToRenderPerBatch={8}
                widthSizeProp={3}
                contentContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                ListFooterComponent={
                    <ActivityIndicator animating={loading} color='#7159c2'/>
                }
                windowSize={5}
            />

            {show && (
                <DateTimePicker 
                    mode='date'
                    display='spinner'
                    value={dateNew}
                    onChange={onChange}
                    textColor='#7159c2'
                    minimumDate={new Date('03/01/2021')}
                    
                />
            )}

            {isConnected && (
                <NetWork />
            )}

            {accountIsExpires && (
                <PaymentRedirect />
            )}
        </Container>
    );
};

function mapStateToProps(state) {
    return {
        user: state.user, 
    };
};

export default connect(mapStateToProps)(Product);