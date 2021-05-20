import React, { useState, useEffect } from 'react';
import 
{ 
    Box, 
    Label,
    OnPress,
    Container,
    ContentMain,
    ContentModal,
    ContainerLabel,
    ContainerHeader,
    ContentAccordion,
} from './styles';
import { connect } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { heightPercentageToDP as hP, widthPercentageToDP as wP } from 'react-native-responsive-screen';
import { api } from '../../api';
import { Alert, ActivityIndicator } from 'react-native';
import { userRemoveAction } from '../../state/actions/userAction';

import Accordion from 'react-native-collapsible/Accordion';
import Modal from 'react-native-modal';
import NetInfo from '@react-native-community/netinfo';
import NetWork from '../../components/network';
import NoPermission from '../../components/noPermission';

function Settings({ user, remove_state }) {
    const [activeSection, setSection] = useState([]);
    const [isModal, setModal] = useState(false);
    const [isPermission, setPermission] = useState(false);
    const [isConnected, setConnected] = useState(false);

    const SECTIONS = [
        {
          title: 'Suas informações',
          name: user.user.name,
          email: user.user.email,
          createAt: user.user.createAt,
        },
    ];

    const _updateSections = activeSections => {
        setSection(activeSections);
    };

    const _renderHeader = section => {
        return (
          <ContainerLabel>
            <Label>{section.title}</Label> 
            <MaterialCommunityIcons name='arrow-right' color='#7159c2'/>
          </ContainerLabel>
        );
    };

    const _renderContent = section => {
        return (
          <ContentAccordion>
            <Label style={{color: '#a9a9a9'}}>{section.name}</Label>
            <Label style={{color: '#a9a9a9'}}>{section.email}</Label>
            <Label style={{color: '#a9a9a9'}}>{section.createAt}</Label>
            
          </ContentAccordion>
        );
    };

    const logout = () => {
        Alert.alert('Aviso!', 
            'Tem certeza que deseja sair?',
            [
                {
                    text: 'cancelar',
                    onPress: () => {}
                }, 
                {
                    text: 'ok',
                    onPress: async () => {
                        setModal(true);
                        try {
                             await api.post(`${api.defaults.baseURL}/account/logout`, null, {
                                headers: {
                                    "x-access-token": user.token,
                                }
                            });

                            setPermission(false);
                            remove_state();
                        }catch(error) {
                            if(error.response.status === 401) {
                                setPermission(true);
                            };
                        }finally {
                            setModal(false);
                        }
                    },
                    style: 'cancel',
                },
            ]
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

        return () => unsubscribe();
    }, []);

    return(
        <Container>
            <Modal
                isVisible={isModal}
                backdropColor="#7159c2"
            >
                <ContentModal>
                    <Label style={{color: '#FFFF'}}>Até logo 👋, saindo ...</Label>
                    <ActivityIndicator color="#FFFF" size={hP('3%')}/>
                </ContentModal>
            </Modal>

            <NoPermission isModal={isPermission}/>

            <ContainerHeader>
                <Box>
                    <Label 
                        style={{
                            color: '#FFFF',
                            fontSize: hP('3%'),
                            width: wP('40%')
                        }}
                        numberOfLines={1}
                        ellipzeMode='tail'
                    >
                        Olá {user.user.name} 👋
                    </Label>
                </Box>
            </ContainerHeader>

            <ContainerHeader>
                <Box 
                    style={{
                        height: hP('20%')
                    }}
                >
                    <Label style={{color: '#FFFF'}}>você está incrito desde.</Label>
                    <Label style={{color: '#32cd32'}}>{user.user.createAt}</Label>
                </Box>
            </ContainerHeader>

            <ContentMain>
                <Accordion 
                    activeSections={activeSection}
                    sections={SECTIONS}
                    renderHeader={_renderHeader}
                    renderContent={_renderContent}
                    onChange={_updateSections}
                    underlayColor="#FFFF"
                    containerStyle={{
                        marginTop: hP('5%')
                    }}
                />
                <ContainerLabel>
                    <OnPress onPress={() => logout()}>
                        <Label>Sair</Label>
                    </OnPress>
                </ContainerLabel>
            </ContentMain>

            {isConnected && (
                <NetWork />
            )}

        </Container>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};

const mapDispathToProps = (dispath) => {
    return {
        remove_state: () => dispath(userRemoveAction()),
    }
};

export default connect(mapStateToProps, mapDispathToProps)(Settings);