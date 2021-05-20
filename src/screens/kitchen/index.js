import React, { useState, useEffect, useCallback, useContext } from 'react';
import 
{
    Container,
    Box,
    Label,
    ContentStatus,
    ContainerSearh,
    OnPress,
    Input,
    ContentIsEmpty,
} from './styles';
import { connect } from 'react-redux';
import { api } from '../../api';
import { FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Badge } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { heightPercentageToDP as hP } from 'react-native-responsive-screen';
import { TableContext } from '../../contexts/tableProvider';

import NetInfo from '@react-native-community/netinfo';
import NetWork from '../../components/network';
import NoPermission from '../../components/noPermission';
import PaymentRedirect from '../../components/paymentRedirect';
import Loading from '../../components/loading';
import io from 'socket.io-client';

const socket = io(api.defaults.baseURL);

function KitChen({ user, route }) {
    const [tables, setTables] = useState([]);
    const [page, setPage] = useState(1);
    const [xTotal, setTotal] = useState(1);
    const [loadingFooterList, setLoadingFooter] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [queryErros, setQueryErros] = useState('');
    const [query, setQuery] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [isTableNull, setTableNull] = useState(false);
    const [isConnected, setConnected] = useState(false);
    const [isPermission, setPermission] = useState(false);
    const [accountIsExpires, setExpires] = useState(false);
    const [loadingTableOrder, setLoadingTableOrder] = useState(false);
    
    const navigation = useNavigation();

    const { setTable } = useContext(TableContext);

    const navigationAndSetOrder = (order) => {
        setLoadingTableOrder(true)
        setTable(order);

        setTimeout(() => {
            navigation.navigate('detailOrder');
            setLoadingTableOrder(false);
        }, 2000);
    };

    const getTables = async () => {

        if(page > xTotal) {
            return;
        };
    
        setExpires(false);

        try {
            setLoadingFooter(true);

            let { data } = await api.get(`${api.defaults.baseURL}/table/${page}/${user.user._id}`, {
                headers: {
                    "x-access-token": user.token,
                }
            });

            if(data.docs.length === 0) {
                setTableNull(true);
            }else {
                setTableNull(false);
            };

            // verifica se a mesa já existe.
            // caso exista remova da lista.
            for(let i = 0; i < tables.length; ++i) {
                for(let j = 0; j < data.docs.length; ++j) {
                    if(tables[i]._id === data.docs[j]._id) {
                        data.docs.length = j;
                    };
                };
            }

            setPermission(false);
            setTables([...tables, ...data.docs]);
            setTotal(data.totalPages);
            setPage(page + 1);
        }catch(error) {
            if(error.response.status === 401) {
                setPermission(true);
            }else if(error.response.status === 400 && error.response.data === 'sua conta expirou assine já') {
                setExpires(true);
            };
        }finally {
            setLoadingFooter(false);
        };
    };

    const renderItem = useCallback(({item}) => {
        return(
            <Box
                onPress={() => navigationAndSetOrder(item)}
            >
                <Label>mesa# {item.name}</Label>
                <Label>pedidos {item.items.length}</Label>
                <ContentStatus>
                    <Label>status</Label>
                    <Badge status={item.status ? 'success' : 'error'}/>
                </ContentStatus>
            </Box>
        );
    }, [])

    const keyExtractor = useCallback((key) => key._id, []);

    const search = async () => {

        if(!query) {
            setQueryErros('Campo busca vazio!');
            return;
        };

        setSearchLoading(true);
        setQueryErros('');
        setExpires(false);

        try {
            let { data } = await api.get(`${api.defaults.baseURL}/table/search/${query}/${user.user._id}`, {
                headers: {
                    "x-access-token": user.token,
                }
            });
            
            if(!data) {
                setQueryErros('Nenhum resultado encontrado!');
                return;
            };
            
            setPermission(false);
            setTables([data]);
    
        }catch(error) {
            if(error.response.status === 401) {
                setPermission(true);
            }else if(error.response.status === 400 && error.response.data === 'sua conta expirou assine já') {
                setExpires(true);
            };
        }finally {
            setSearchLoading(false);
        };
    };

    const reloadState = async () => {
        setExpires(false);

        try {
            setRefresh(true);
            setQuery('');
            setQueryErros('');

            let { data } = await api.get(`${api.defaults.baseURL}/table/${1}/${user.user._id}`, {
                headers: {
                    "x-access-token": user.token,
                }
            });

            setPermission(false);
            setTables(data.docs);
            setPage(2);
            setTotal(data.totalPages);
        }catch(error) {
            if(error.response.status === 401) {
                setPermission(true);
            }else if(error.response.status === 400 && error.response.data === 'sua conta expirou assine já') {
                setExpires(true);
            };
        }finally {
            setRefresh(false);
        };
    };

    useEffect(() => {
        if(route.params) {
            setTables((prevState) => [...prevState.filter(table => table._id !== route.params.id)])
        };
    }, [route.params])

    useEffect(() => {
        getTables();

        // verify connection
        const unsubscribe = NetInfo.addEventListener(state => {
            if(!state.isConnected) {
                setConnected(true);
            }else {
                setConnected(false);
            };
        });

        socket.on(user.user.codeRoomSocketIo + "create", (newTable) => {
            setTables((prevState) => [newTable, ...prevState.filter(table => table._id !== newTable._id)]);
            setTableNull(false);
        });

        socket.on(user.user.codeRoomSocketIo + "update", (newTable) => {
            if(!newTable) {
                return;
            };

            setTables((prevState) => [newTable, ...prevState.filter(table => table._id !== newTable._id)])
        });

        socket.on(user.user.codeRoomSocketIo + "delete", (idTable) => {
           setTables((prevState) => [...prevState.filter(table => table._id !== idTable)]);
        });

        // cleanup useEffect
        return () => {
            socket.removeAllListeners();
            unsubscribe();
        };
    }, []);

    return(
        <Container>
            <NoPermission isModal={isPermission} />
            <ContainerSearh>
                <Input 
                    placeholder="Buscar mesa"
                    onChangeText={text => setQuery(text)}
                    value={query}
                    keyboardType="numeric"
                />
                <OnPress onPress={() => search()}>
                    <MaterialCommunityIcons name="magnify" color="#696969" size={hP('4%')}/>
                </OnPress>
            </ContainerSearh>

            {searchLoading ? (
                <ActivityIndicator color='#7159c2'/>
            ): (
                <Label>{queryErros}</Label>
            )}

            {isTableNull ? (
                <ContentIsEmpty>
                    <MaterialCommunityIcons name='emoticon-sad-outline' color="#7159c2" size={hP('6%')}/>
                    <Label 
                        style={{
                            color: '#7159c2'
                        }}
                    >
                        Nenhum pedido encontrado!
                    </Label>
                </ContentIsEmpty>
            ): (
                <FlatList 
                    data={tables}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    onEndReachedThreshold={0.1}
                    onEndReached={getTables}
                    refreshControl={
                        <RefreshControl
                            refreshing={refresh}
                            onRefresh={reloadState}
                            colors={['#FFFF']}
                            progressBackgroundColor='#7159c3'
                        />
                    }
                    ListFooterComponent={
                        <ActivityIndicator animating={loadingFooterList} color='#7159c2'/>
                    }
                    windowSize={5}
                />
            )}

            {isConnected && (
                <NetWork />
            )}

            {accountIsExpires && (
                <PaymentRedirect />
            )}

            {loadingTableOrder && (
                <Loading title="Aguarde"/>
            )}
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

export default connect(mapStateToProps)(KitChen);