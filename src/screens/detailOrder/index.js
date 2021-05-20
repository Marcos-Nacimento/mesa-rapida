import React, { useState, useEffect, useContext } from 'react';
import 
{ 
    Container,
    BoxItem,
    Label,
    ContentIsEmpty,
    OnPress,
} from './styles';
import { heightPercentageToDP as hP, widthPercentageToDP as wP } from 'react-native-responsive-screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import { Tooltip } from 'react-native-elements';
import { api } from '../../api';
import { connect } from 'react-redux';
import { TableContext } from '../../contexts/tableProvider';
import { useNavigation } from '@react-navigation/native';
import { socket } from '../../config/socket';

import NetInfo from '@react-native-community/netinfo';
import NetWork from '../../components/network';
import NoPermission from '../../components/noPermission';
import PaymentRedirect from '../../components/paymentRedirect';
import Loading from '../../components/loading';

function DetailOrder({ user }) {
    const [isConnected, setConnected] = useState(false);
    const [isPermission, setPermission] = useState(false);
    const [accountIsExpires, setExpires] = useState(false);
    const [tableNotExists, setExists] = useState(false);

    const { table, setTable } = useContext(TableContext);

    const navigation = useNavigation();
 
    const tableNotExistsGoBack = () => {
        setExists(true);

        setTimeout(() => {
            navigation.navigate('Cozinha', { id: table._id});
            setExists(false);
        }, 3000);
    };

    const handleItemStatus = async (selectedStatus, item) => {
        item.status = selectedStatus; 

        setExpires(false);
              
        try {
            await api.put(`${api.defaults.baseURL}/table/update/${user.user._id}`, {
                id: table._id,
                userId: user.user._id,
                items: [item, ...table.items.filter(_item => _item._id !== item._id)],
                anticipatePayment: table.anticipatePayment,
            }, {
                headers: {
                    "x-access-token": user.token,
                }
            });

            setPermission(false);
        }catch(error) {
            if(error.response.status === 401) {
                setPermission(true);
            }else if(error.response.status === 400 && error.response.data === 'sua conta expirou assine já') {
                setExpires(true);
            }else if(error.response.status === 400 && error.response.data === 'Essa mesa não existe mais!') {
                tableNotExistsGoBack();
            };
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

                <Tooltip 
                    popover={
                        <Label>
                            {item.name}
                        </Label>
                    }
                    backgroundColor='#7159c3'
                    height={hP('15%')}
                    width={wP('50%')}
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
                </Tooltip>

                <Label>
                    status: {item.status === 'done' ? 'feito' : item.status === 'preparing' ? 'preparando' : 'pendente'}
                </Label>

                <Tooltip
                    popover={
                        <>
                            <OnPress
                                onPress={() => handleItemStatus('preparing', item)}
                            >
                                <Label>
                                    PREPARANDO
                                </Label>
                            </OnPress>
                            <OnPress
                                onPress={() => handleItemStatus('pending', item)}
                            >
                                <Label>
                                    PENDENTE
                                </Label>
                            </OnPress>
                            <OnPress
                                onPress={() => handleItemStatus('done', item)}
                            >
                                <Label>
                                    FEITO
                                </Label>
                            </OnPress>
                        </>
                    }
                    height={hP('15%')}
                    width={wP('50%')}
                >
                    <MaterialCommunityIcons name='dots-vertical' color='#FFFF' size={hP('3%')}/>
                </Tooltip>
                                
            </BoxItem>
        );
    };

    useEffect(() => {

        const unsubscribe = NetInfo.addEventListener(state => {
            if(!state.isConnected) {
                setConnected(true);
            }else {
                setConnected(false);
            };
        });

        socket.on(user.user.codeRoomSocketIo + "update", (newItem) => {
            setTable(newItem);
        });

        return () => {
            socket.removeAllListeners(user.user.codeRoomSocketIo + "update");
            unsubscribe();
        };
    }, []);

    return(
        <Container>
            <NoPermission isModal={isPermission} />
            <Label style={{color: '#7159c2'}}>PEDIDOS DA MESA# {table.name}</Label>
            <ScrollView>
                {table.items.length === 0 ? (
                    <ContentIsEmpty>
                        <MaterialCommunityIcons name='emoticon-sad-outline' color="#7159c2" size={hP('6%')}/>
                        <Label 
                            style={{
                                color: '#7159c2'
                            }}
                        >
                            Nenhum pedido em andamento!
                        </Label>
                    </ContentIsEmpty>  
                ): table.items.map((item, index) => renderItem(item, index)) }
            </ScrollView>

            {isConnected &&(
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

export default connect(mapStateToProps)(DetailOrder);