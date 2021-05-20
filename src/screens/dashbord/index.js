import React, { useState, useEffect } from 'react';
import 
{
    Container,
    Scroll
} from './styles';
import { connect } from 'react-redux';
import { api } from '../../api';
import { RefreshControl } from 'react-native';
import { Base64 } from 'js-base64';

import Card from '../../components/box';
import NetInfo from '@react-native-community/netinfo';
import NetWork from '../../components/network';
import NoPermission from '../../components/noPermission';
import PaymentRedirect from '../../components/paymentRedirect';
import Loading from '../../components/loading';

function Dasbord({ user }) {
    const [viewDay, setViewDay] = useState({received: 0, inOpen: 0});
    const [table, setTable] = useState({free: 0, concealed: 0});
    const [isConnected, setConnected] = useState(false);
    const [isLoaded, setLoaded] = useState(false);
    const [isPermission, setPermission] = useState(false);
    const [subscribeAt, setSubscribe] = useState({createAt: '', expiresIn: ''});
    const [accountIsExpires, setExpires] = useState(false);
    const [loading, setLoading] = useState(false);

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

    const getInformation = async (isTrue) => {
        setLoading(true);
        setExpires(false);
        
        try {
            setLoaded(isTrue);

            let { data } = await api.get(`${api.defaults.baseURL}/table/counter/${user.user._id}`, {
                headers: {
                    "x-access-token": user.token,
                }
            });

            let date = getDataNow();
            let dateEncode = Base64.encode(date);
    
            let receivedToday = await api.get(`${api.defaults.baseURL}/table/graphics/${user.user._id}/${dateEncode}`, {
                headers: {
                    "x-access-token": user.token,
                },
            });

            let received = await api.get(`${api.defaults.baseURL}/table/received/${user.user._id}`, {
                headers: {
                    "x-access-token": user.token,
                },
            });
            
            setPermission(false);
            setViewDay({received: received.data.received, inOpen: receivedToday.data.total});
            setTable({free: data.tableClose, concealed: data.tableOpen});
        }catch(error) {
            if(error.response.status === 401) {
                setPermission(true);
            }else if(error.response.status === 400 && error.response.data === 'sua conta expirou assine já') {
                setExpires(true);
            };
        }finally {
            setLoaded(false);
            setLoading(false);
        };
    }; 

    useEffect(() => {

        setSubscribe({createAt: user.user.createAt, expiresIn: user.user.accountAccess});

        const unsubscribe = NetInfo.addEventListener(state => {
            if(!state.isConnected) {
                setConnected(true);
            }else {
                setConnected(false);
            };
        });

        getInformation(false);

        return () => unsubscribe();
    }, []);

    return(
        <Container>
            <NoPermission 
                isModal={isPermission}
            />
            <Scroll
                refreshControl={
                    <RefreshControl 
                        refreshing={isLoaded}
                        onRefresh={() => getInformation(true)}
                        colors={['#7159c2']}
                    />
                }
            >
                <Card 
                    name="visão do dia" 
                    labelOne='Recebido'
                    labelTwo='Em aberto'
                    valueOne={"R$" + viewDay.inOpen}
                    valueTwo={"R$" + viewDay.received}
                    disabledNavigation={true}
                    nameNavigation="Visão do dia"
                />
                <Card 
                    name="mesas"
                    labelOne='Livres'
                    labelTwo='Ocupadas'
                    valueOne={"#" + table.free}
                    valueTwo={"#" + table.concealed}
                    nameNavigation="Mesas"
                    disabledNavigation={true}
                />
                <Card 
                    name="suas informações"
                    nameNavigation="Configurações"
                    labelOne='Assinado em'
                    labelTwo="Data de expiração"
                    valueTwo={subscribeAt.expiresIn}
                    valueOne={subscribeAt.createAt}
                    disabledNavigation={true}
                />
            </Scroll>

            {isConnected && (
                <NetWork />
            )}

            {accountIsExpires && (
                <PaymentRedirect />
            )}

            {loading && (
                <Loading />
            )}
        </Container>
    );
};

function mapStateToProps(state) {
    return {
        user: state.user,
    };
};
export default connect(mapStateToProps)(Dasbord);