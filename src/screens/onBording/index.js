import React from 'react';
import { Container, Title, ContentMsg } from './styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';
import { heightPercentageToDP as hP, widthPercentageToDP as wP } from 'react-native-responsive-screen';

import AppIntroSlides from 'react-native-app-intro-slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

function OnBording() {
    const navigation = useNavigation();

    const slides = [
        {
          key: '1',
          title: 'Bem-vindo ao Mesa Rápida!',
          img: require('../../assets/main.png'),
          text: 'O seu negócio na internet! isso mesmo agora você pode controlar seu pequeno negócio seja ele barzinho, lanchonete, restaurante e etc. pela internet com facilidade e agilidade.',
          color: '#7159c3'
        },
        {
          key: '2',
          title: 'Comunicação em tempo real!',
          img: require('../../assets/real.png'),
          text: 'Esqueça os conflitos de pedidos! seus funcionários da cozinha entre outros receberam os pedidios em tempo real, evitando eventuais conflitos de pedidos.',
          color: '#7159c3'
        },
        {
          key: '3',
          title: 'Historico de Caixa!',
          img: require('../../assets/cashHistory.png'),
          text: 'Seu historico de caixa em suas mãos! fique por dentro de seu faturamento, evitando papel e caneta.',
          color: '#7159c3'
        },
        {
          key: '4',
          title: 'Conta compartilhada!',
          img: require('../../assets/users.png'),
          text: 'Conta compartilhada! Este recurso permite você compartilhar está conta com seus eventuais funcionários, auxiliando na proatividade do seu negócio.',
          color: '#7159c3'
        },
    ];

    const renderItem = ({ item }) => {
        return(
            <Container 
                key={item.key}
                style={{
                    backgroundColor: item.color,
                }}
            >
                <Title 
                    style={{
                        marginTop: hP('20%'),
                        fontWeight: 'bold',
                        fontSize: hP('2.7%')
                    }}
                >
                    {item.title}
                </Title>
                <Image 
                    source={item.img}
                    resizeMode='contain'
                    style={{
                        height: hP('20%'),
                        width: wP("40%"),
                        marginTop: hP('10%'),
                        marginBottom: hP('5%')
                    }}
                />
                <ContentMsg>
                    <Title>
                        {item.text}
                    </Title>
                </ContentMsg>
            </Container>
        );
    };

    const storeData = async () => {
        try {
            await AsyncStorage.setItem('@onBordingMesaRapida', 'true');
            navigation.navigate('login');
        }catch(error) {
            // handle error
        };
    };

    return(
        <AppIntroSlides 
            data={slides}
            renderItem={renderItem}
            renderNextButton={() => <MaterialCommunityIcons name='arrow-right' color='#FFFF' size={hP('4%')}/>}
            renderDoneButton={() => <MaterialCommunityIcons name='door-open' color='#FFFF' size={hP('4%')} onPress={() => storeData()}/>}
        />
    );
};

export default OnBording;