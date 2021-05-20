import React, { useState, useEffect, useCallback } from 'react';
import 
{
    Container,
    ContainerSearh,
    OnPress,
    Input,
    Label,
    ContentIsEmpty,
    ContentModal,
    ButtonModal,
    ContainerInput,
}from './styles';

import { connect } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { heightPercentageToDP as hP } from 'react-native-responsive-screen';
import { Input as InputElements } from 'react-native-elements';
import { api } from '../../api';
import { socket } from '../../config/socket';

import Item from '../../components/item';
import Modal from 'react-native-modal';
import NetWork from '../../components/network';
import NetInfo from '@react-native-community/netinfo';
import NoPermission from '../../components/noPermission';
import PaymentRedirect from '../../components/paymentRedirect';

function Table({ user, route }) {
    const [query, setQuery] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [queryErros, setQueryErros] = useState('');
    const [tables, setTables] = useState([]);
    const [page, setPage] = useState(1);
    const [xTotal, setTotal] = useState(1);
    const [isTableNull, setTableNull] = useState(false);
    const [modal, setModal] = useState(false);
    const [isCreateTableLoading, setCreateTableLoading] = useState(false);
    const [nameTable, setNameTable] = useState('')
    const [errosTable, setErrosTable] = useState('');
    const [loadingFooterList, setLoadingFooter] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [isConnected, setConnected] = useState(false);
    const [isPermission, setPermission] = useState(false);
    const [accountIsExpires, setExpires] = useState(false);

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
                    "x-access-token": user.token
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

    const createTable = async () => {
        setErrosTable('');

        if(!nameTable) {
            setErrosTable('Campo em branco!');
            return;
        };

        setExpires(false);

        try {
            setCreateTableLoading(true);

            await api.post(`${api.defaults.baseURL}/table/create/${user.user._id}`, {
                name: nameTable,
                userId: user.user._id,
                items: [],
            }, {
                headers: {
                    "x-access-token": user.token,
                },
            });

            setPermission(false);
            setModal(false);
            setNameTable('');

        }catch(error) {
            if(error.response.status === 401) {
                setPermission(true);
            }else if(error.response.status === 400 && error.response.data === 'sua conta expirou assine já') {
                setExpires(true);
            }else if(error.response.status === 400) {
                setErrosTable('Esse mesa já existe!');
            };
        }finally {
            setCreateTableLoading(false);
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
                },
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

    const renderItem = useCallback(({item}) => <Item item={item}/>, []);

    const keyExtractor = useCallback((key) => key._id, []);

    useEffect(() => {
        if(route.params) {
            setTables((prevState) => [...prevState.filter(table => table._id !== route.params.id)])
        };
    }, [route.params]);

    useEffect(() => {

        getTables();

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
            <NoPermission isModal={isPermission}/>
            <ContainerInput>
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
                <MaterialCommunityIcons 
                    name="plus-circle" 
                    color="#7159c1" 
                    size={hP('4%')}
                    onPress={() => setModal(true)}
                />
            </ContainerInput>

            {searchLoading ? (
                <ActivityIndicator color='#7159c2'/>
            ): (
                <Label style={{color: '#7159c2', textAlign: 'center'}}>{queryErros}</Label>
            )}
       

            <Modal
                isVisible={modal}
                style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                animationOut="zoomOut"
                animationIn="zoomIn"
                onBackButtonPress={() => setModal(false)}
                onBackdropPress={() => setModal(false)}
                statusBarTranslucent
            >
                <ContentModal>
                    <Label 
                        style={{
                            color: '#7159c3',
                            marginBottom: hP('3%')
                        }}
                    >
                        CRIAR UMA MESA
                    </Label>
                    <InputElements 
                        placeholder="numero da mesa"
                        inputStyle={{
                            fontFamily: 'Inter_300Light'
                        }}
                        label="Numero da mesa"
                        labelStyle={{
                            fontFamily: 'Inter_300Light',
                            color: '#7159c3',
                            fontSize: hP('2.4%'),
                            fontWeight: 'normal'
                        }}
                        keyboardType="numeric"
                        onChangeText={text => setNameTable(text)}
                        value={nameTable}
                        errorMessage={errosTable}
                        leftIcon={<MaterialCommunityIcons name='table-plus' size={hP('2.7%')} />}
                    />
                    <ButtonModal onPress={() => createTable()}>
                        {isCreateTableLoading ? (
                            <ActivityIndicator color="#FFFF"/>
                        ): (
                            <Label style={{color: '#FFFF'}}>criar</Label>
                        )}
                    </ButtonModal>
                </ContentModal>
            </Modal>

            {isTableNull ? (
                <ContentIsEmpty>
                    <MaterialCommunityIcons name='emoticon-sad-outline' color="#7159c2" size={hP('6%')}/>
                    <Label
                        style={{
                            color: '#7159c2'
                        }}
                    >
                        Nenhuma mesa encontrada!
                    </Label>
                </ContentIsEmpty>
            ): (
                <FlatList 
                    data={tables}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    onEndReachedThreshold={0.1}
                    onEndReached={getTables}
                    showsVerticalScrollIndicator={false}
                    numColumns={3}
                    horizontal={false}
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

            {isConnected &&(
                <NetWork />
            )}

            {accountIsExpires && (
                <PaymentRedirect />
            )}
        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

export default connect(mapStateToProps)(Table);