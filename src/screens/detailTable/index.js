import React, { useState, useEffect, useContext } from 'react';
import 
{ 
    Container, 
    Label, 
    Box,
    Scroll,
    ContentHeader,
    ContentFooter,
    BoxItem,
    OnPress,
    ContentModal,
    Button,
} from './styles';
import { Divider, Input } from 'react-native-elements';
import { heightPercentageToDP as hP, widthPercentageToDP as wP } from 'react-native-responsive-screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { FloatingAction } from "react-native-floating-action";
import { api } from '../../api';

import Modal from 'react-native-modal';
import NetInfo from '@react-native-community/netinfo';
import NetWork from '../../components/network';
import NoPermission from '../../components/noPermission';
import PaymentRedirect from '../../components/paymentRedirect';
import Loading from '../../components/loading';
import io from 'socket.io-client';

const socket = io(api.defaults.baseURL);

import { TableContext } from '../../contexts/tableProvider';

function Detail({ user }) {
    
    const {table, setTable} = useContext(TableContext);

    const [reload, setReload] = useState(false);
    const [isModal, setModal] = useState(false);
    const [isProductsLoaded, setProductsLoaded] = useState(false);
    const [nameProduct, setNameProduct] = useState('');
    const [amountProduct, setAmount] = useState('');
    const [errorNameProduct, setErrorNameProduct] = useState('');
    const [errorAmountProduct, setErrorAmountProduct] = useState('');
    const [isModalCloseTable, setModalCloseTable] = useState(false);
    const [valueTotalCloseTable, setValueTotalCloseTable] = useState(table.amount);
    const [isLoadedCloseTableAndSave, setCloseTableAndSave] = useState(false);
    const [errorCloseTableAndSave, setErrorCloseAndSave] = useState('');
    const [isLoadedAnticipatePayment, setAnticipatePayment] = useState(false);
    const [valueAnticipatePayment, setValueAnticipatePayment] = useState('');
    const [errosAnticipatePayment, setErrosAnticipatePayment] = useState('');
    const [isModalAnticipatePayment, setModalAnticipatePayment] = useState(false);
    const [isConnected, setConnected] = useState(false);
    const [isPermission, setPermission] = useState(false);
    const [accountIsExpires, setExpires] = useState(false);
    const [tableNotExists, setExists] = useState(false);

    const navigation = useNavigation();

    const tableNotExistsGoBack = () => {
        setExists(true);

        setTimeout(() => {
            navigation.navigate('Mesas', { id: table._id });
            setExists(false);
        }, 3000);
    };

    const refresh = async () => {
        setExpires(false);

        try {
            setReload(true);

            let { data } = await api.get(`${api.defaults.baseURL}/table/search/${table.name}/${user.user._id}`, {
                headers: {
                    "x-access-token": user.token,
                }
            });

            setPermission(false);
            setTable(data);
        }catch(error) {
            if(error.response.status === 401) {
                setPermission(true);
            }else if(error.response.status === 400 && error.response.data === 'sua conta expirou assine já') {
                setExpires(true);
            };
        }finally {
            setReload(false);
        };
    };

    const deleteTable = (id) => {
        Alert.alert('Aviso!', 
            'Tem certeza que deseja deletetar essa mesa?',
            [
                {
                    text: 'cancelar',
                    onPress: () => {}
                }, 
                {
                    text: 'ok',
                    onPress: async () => {
                        setExpires(false);

                        try {
                            await api.delete(`${api.defaults.baseURL}/table/delete/${id}/${user.user._id}`, {
                                headers: {
                                    "x-access-token": user.token,
                                }
                            });

                            setPermission(false);
                            navigation.goBack();
                        }catch(error) {
                            if(error.response.status === 401) {
                                setPermission(true);
                            }else if(error.response.status === 400 && error.response.data === 'sua conta expirou assine já') {
                                setExpires(true);
                            };
                        };
                    },
                    style: 'cancel',
                },
            ]
        );
    };

    const deleteItemToList = async (id) => {
        Alert.alert('Aviso!', 
            'Tem certeza que deseja deletetar esse item?',
            [
                {
                    text: 'cancelar',
                    onPress: () => {}
                }, 
                {
                    text: 'ok',
                    onPress: async () => {
                        setExpires(false);

                        try {
                            await api.put(`${api.defaults.baseURL}/table/update/${user.user._id}`, {
                                id: table._id,
                                userId: user.user._id,
                                items: table.items.filter( item => item._id !== id),
                                anticipatePayment: table.anticipatePayment,
                            }, {
                                headers: {
                                    "x-access-token": user.token,
                                },
                            });

                            setPermission(false);
                        }catch(error) {
                            if(error.response.status === 401) {
                                setPermission(true);
                            }else if(error.response.status === 400 && error.response.data === 'sua conta expirou assine já') {
                                setExpires(true);
                            }else if(error.response.status === 400 && error.response.data === "Essa mesa não existe mais!") {
                                tableNotExistsGoBack();
                            };
                        };
                    },
                    style: 'cancel',
                },
            ]
        );
    };

    const updateTable = async () => {

        //reset state
        setErrorAmountProduct('');
        setErrorNameProduct('');
        
        if(!nameProduct) {
            setErrorNameProduct('campo vazio!');
            return;
        }else if (!amountProduct) {
            setErrorAmountProduct('campo vazio!');
            return;
        };

        if(isNaN(amountProduct)){
            setErrorAmountProduct('isso não é um numero!');
            return;
        }else if(amountProduct.charAt(0) === '.') {
            setErrorAmountProduct('expressão invalida!');
            return;
        };

        setExpires(false);

        try {
            setProductsLoaded(true);

            await api.put(`${api.defaults.baseURL}/table/update/${user.user._id}`, {
                id: table._id,
                userId: user.user._id,
                items: [...table.items, {
                    name: nameProduct,
                    amount: amountProduct,
                    _id: Math.random().toFixed(6),
                    status: 'pending',
                }],
                anticipatePayment: table.anticipatePayment
            }, {
                headers: {
                    "x-access-token": user.token,
                }
            });

            //reset state
            setPermission(false);
            setAmount('');
            setNameProduct('');
            setModal(false);
        }catch(error) {
            if(error.response.status === 401) {
                setPermission(true);
            }else if(error.response.status === 400 && error.response.data === 'sua conta expirou assine já') {
                setExpires(true);
            }else if(error.response.status === 400 && error.response.data === 'Essa mesa não existe mais!') {
                tableNotExistsGoBack();
            };
        }finally {
            setProductsLoaded(false);
        };
    };

    const renderItem = (item, index) => {
        return(
            <BoxItem 
                key={index}
                style={{
                    backgroundColor: item.status === "done" ? '#228b22' : item.status === "preparing" ? "#daa520" : "#778899"
                }}
            >
                <Label
                    style={{
                        width: wP('35%')
                    }}
                    numberOfLines={2}
                    ellipzeMode='tail'
                >
                    {item.name}
                </Label>
                <Label>
                    status: 
                    <MaterialCommunityIcons 
                        name={item.status === 'done' ? 'check' : item.status === 'preparing' ? 'atom-variant' : 'alarm'}
                        size={hP('2.5%')}
                    />
                </Label>

                <Label>
                    valor: {item.amount}
                </Label>

                <OnPress
                    onPress={() => deleteItemToList(item._id)}
                >
                    <MaterialCommunityIcons name='close' color='#a52a2a' size={hP('2.5%')}/>    
                </OnPress>                                    
            </BoxItem>
        );
    };

    const closeTableAndSave = async () => {

        setErrorCloseAndSave('');

        if(!valueTotalCloseTable) {
            setErrorCloseAndSave('Campo vazio!');
            return;
        };

        setExpires(false);

        try {
            setCloseTableAndSave(true);
            
            await api.put(`${api.defaults.baseURL}/table/update/${user.user._id}`, {
                id: table._id,
                userId: user.user._id,
                items: [],
                amount: '0',
                anticipatePayment: '0',
            }, {
                headers: {
                    "x-access-token": user.token,
                }
            });

            // save history box
            await api.post(`${api.defaults.baseURL}/history/create/${user.user._id}`, {
                name: table.name,
                amount: valueTotalCloseTable,
                userId: user.user._id,
            }, {
                headers: {
                    "x-access-token": user.token,
                }
            });

            setPermission(false);
            setModalCloseTable(false);

        }catch(error) {
            if(error.response.status === 401) {
                setPermission(true);
            }else if(error.response.status === 400 && error.response.data === "Essa mesa não existe mais!") {
                tableNotExistsGoBack();
            }else if(error.response.status === 400 && error.response.data === 'sua conta expirou assine já') {
                setExpires(true);
            }else if(error.response.status === 400) {
                setErrorCloseAndSave('você não pode fechar a conta com o valor 0');
            };
        }finally {
            setCloseTableAndSave(false);
        };   
    };

    const anticipatePayment = async () => {

        setErrosAnticipatePayment('');

        if(!valueAnticipatePayment) {
            setErrosAnticipatePayment('campo vazio');
            return;
        };

        setExpires(false);

        try {
            setAnticipatePayment(true);
            const valueAnticipate = parseFloat(table.anticipatePayment) + parseFloat(valueAnticipatePayment);
            const valueAmount = parseFloat(table.amount) - valueAnticipate;

            await api.put(`${api.defaults.baseURL}/table/update/${user.user._id}`, {
                id: table._id,
                userId: user.user._id,
                items: [...table.items],
                status: table.amount,
                anticipatePayment: table.anticipatePayment != '0' ? valueAnticipate.toFixed(2) : valueAnticipatePayment,
                amount: valueAmount.toFixed(2),
            }, {
                headers: {
                    "x-access-token": user.token,
                }
            });

            setPermission(false);
            setModalAnticipatePayment(false);
            setErrosAnticipatePayment('');

        }catch(error) {
            if(error.response.status === 401) {
                setPermission(true);
            }else if(error.response.status === 400 && error.response.data === 'sua conta expirou assine já') {
                setExpires(true);
            }else if(error.response.status === 400 && error.response.data === "Essa mesa não existe mais!") {
                tableNotExistsGoBack();
            };
        }finally {
            setAnticipatePayment(false);
        };
    };

    const genericFunction = (nameFunction) => {
        switch(nameFunction) {
            case 'addProduct':
                setModal(true);
                break;
            case 'closeTable':
                setModalCloseTable(true);
                break;
            case 'anticipatePayment':
                setModalAnticipatePayment(true);
                break;
        };
    };

    const actions = [
        {
          text: "Fechar conta",
          name: "closeTable",
          icon: <MaterialCommunityIcons name="door-closed-lock" color="#FFFF" size={hP('3%')}/>,
          position: 1
        },
        {
          text: "Adicionar produto",
          name: "addProduct",
          icon: <MaterialCommunityIcons name="cart-plus" color="#FFFF"  size={hP('3%')}/>,
          position: 2,
        },
        {
            text: "Adicionar o pagamento",
            name: "anticipatePayment",
            icon: <MaterialCommunityIcons name="cash-plus" color="#FFFF" size={hP('3%')}/>,            
            position: 3
        },
    ];

    useEffect(() => {

        const unsubscribe = NetInfo.addEventListener(state => {
            if(!state.isConnected) {
                setConnected(true);
            }else {
                setConnected(false);
            };
        });

        socket.on(user.user.codeRoomSocketIo + "update", (data) => {
            if(data) {
                setTable(data);
                setValueTotalCloseTable(data.amount);
            };
        });

        // cleanup useEffect.
        return () => {
            socket.removeAllListeners(user.user.codeRoomSocketIo + "update");
            unsubscribe();
        };
    }, []);

    return(
        <Container>
            <NoPermission isModal={isPermission} />

            <Box>
                <ContentHeader>

                    <ContentFooter>
                        <Label>MESA: {table.name}</Label>
                        <OnPress onPress={() => deleteTable(table._id)}>
                            <MaterialCommunityIcons name='delete' color='#800000' size={hP('4%')}/>
                        </OnPress>
                    </ContentFooter>

                    <Divider />

                    <ContentFooter>
                        <Label>pagamento antecipado: </Label>
                        <Label>R$ {table.anticipatePayment}</Label>
                    </ContentFooter>

                    <Divider />

                    <ContentFooter>
                        <Label>valor total: R$ {table.amount}</Label>
                        <Label>total de Items: {table.items.length}</Label>
                    </ContentFooter>

                </ContentHeader>
            </Box>

            {table.items.length === 0 ? (
                    <Scroll
                        contentContainerStyle={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                        }}
                    >
                            
                        <MaterialCommunityIcons name='emoticon-sad' color="#7159c2" size={hP('5%')}/>
                        <Label style={{color: '#7159c2'}}>Nenhum Pedido feito!</Label>
                    </Scroll>
            ): (
                <Scroll
                    refreshControl={
                        <RefreshControl
                            refreshing={reload}
                            onRefresh={refresh}
                            colors={['#FFFF']}
                            progressBackgroundColor="#7159c2"
                        />
                    }
                >
                    {table.items.map(renderItem)}

                </Scroll>
            )}
            
            <Modal
                isVisible={isModal}
                onBackButtonPress={() => setModal(false)}
                onBackdropPress={() => setModal(false)}
            >
                <ContentModal>
                    <Label style={{color: '#7159c3'}}>ADICIONE UM PRODUTO</Label>

                    <Input 
                        placeholder='nome do produto'
                        label="Nome"
                        inputStyle={{
                            fontFamily: 'Inter_300Light'
                        }}
                        labelStyle={{
                            fontFamily: 'Inter_300Light',
                            color: '#7159c3',
                            fontSize: hP('2.4%'),
                            fontWeight: 'normal'
                        }}
                        onChangeText={text => setNameProduct(text)}
                        value={nameProduct}
                        errorMessage={errorNameProduct}
                        leftIcon={<MaterialCommunityIcons name='room-service' size={hP('2.7%')}/>}
                        returnKeyType='go'
                    />

                    <Input 
                        placeholder='valor do produto'
                        label='Valor'
                        inputStyle={{
                            fontFamily: 'Inter_300Light'
                        }}
                        labelStyle={{
                            fontFamily: 'Inter_300Light',
                            color: '#7159c3',
                            fontSize: hP('2.4%'),
                            fontWeight: 'normal'
                        }}
                        keyboardType='decimal-pad'
                        onChangeText={text => setAmount(text)}
                        value={amountProduct}
                        errorMessage={errorAmountProduct}
                        leftIcon={<MaterialCommunityIcons name='currency-usd' size={hP('2.7%')} />}
                    />


                    <Button 
                        style={{
                            position: 'absolute',
                            width: wP('88%'),
                            height: hP('7%'),
                            top: hP('36%')
                        }}
                        onPress={() => updateTable()}
                    >
                        {isProductsLoaded ? (
                            <ActivityIndicator color="#FFFF"/>
                        ): (
                            <Label style={{color: '#FFFF'}}>salvar</Label>
                        )}
                    </Button>
                </ContentModal>
            </Modal>

            <Modal
                isVisible={isModalCloseTable}
                onBackButtonPress={() => setModalCloseTable(false)}
                onBackdropPress={() => setModalCloseTable(false)}
            >
                <ContentModal>
                    <Label style={{color: '#7159c3'}}>FECHAR CONTA</Label>
                    <Label style={{color: '#7159c3'}}>saldo total R$ {table.amount}</Label>
                    <Input 
                        placeholder='valor total'
                        label="Valor"
                        inputStyle={{
                            fontFamily: 'Inter_300Light'
                        }}
                        labelStyle={{
                            fontFamily: 'Inter_300Light',
                            color: '#7159c3',
                            fontSize: hP('2.4%'),
                            fontWeight: 'normal'
                        }}
                        leftIcon={<MaterialCommunityIcons name='currency-usd' size={hP('2.7%')} />}
                        onChangeText={text => setValueTotalCloseTable(text)}
                        value={valueTotalCloseTable}
                        keyboardType='decimal-pad'
                        errorMessage={errorCloseTableAndSave}                         
                    />
                    <Button 
                        style={{
                            position: 'absolute',
                            width: wP('88%'),
                            height: hP('7%'),
                            top: hP('36%')
                        }}
                        onPress={() => closeTableAndSave()}
                    >
                        {isLoadedCloseTableAndSave ? (
                            <ActivityIndicator color="#FFFF"/>
                        ): (
                            <Label style={{color: '#FFFF'}}>fechar conta</Label>
                        )}
                    </Button>
                </ContentModal>
            </Modal>

            <Modal
                isVisible={isModalAnticipatePayment}
                onBackButtonPress={() => setModalAnticipatePayment(false)}
                onBackdropPress={() => setModalAnticipatePayment(false)}
            >
                <ContentModal>
                    <Label 
                        style={{
                            color: '#7519c2',
                            marginBottom: hP('7%')
                        }}
                    >
                        ADICIONAR PAGAMENTO ANTECIPADO
                    </Label>
                    <Input 
                        placeholder='valor antecipado'
                        label="Valor"
                        inputStyle={{
                            fontFamily: 'Inter_300Light'
                        }}
                        labelStyle={{
                            fontFamily: 'Inter_300Light',
                            color: '#7159c3',
                            fontSize: hP('2.4%'),
                            fontWeight: 'normal'
                        }}
                        leftIcon={<MaterialCommunityIcons name='currency-usd' size={hP('2.7%')} />}
                        onChangeText={text => setValueAnticipatePayment(text)}
                        value={valueAnticipatePayment}
                        keyboardType='decimal-pad'
                        errorMessage={errosAnticipatePayment}                         
                    />

                    <Button 
                        style={{
                            position: 'absolute',
                            width: wP('88%'),
                            height: hP('7%'),
                            top: hP('36%')
                        }}
                        onPress={() => anticipatePayment()}
                    >
                        {isLoadedAnticipatePayment ? (
                            <ActivityIndicator color="#FFFF"/>
                        ): (
                            <Label style={{color: '#FFFF'}}>adicionar pagamento</Label>
                        )}
                    </Button>
                </ContentModal>
            </Modal>

            <FloatingAction 
                actions={actions}
                onPressItem={name => genericFunction(name)}
                color='#7159c2'
            />

            {isConnected && (
                <NetWork />
            )}

            {accountIsExpires && (
                <PaymentRedirect />
            )}

            {tableNotExists && (
                <Loading title="Essa mesa não existe mais, redirecionado"/>
            )}
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

export default connect(mapStateToProps)(Detail); 