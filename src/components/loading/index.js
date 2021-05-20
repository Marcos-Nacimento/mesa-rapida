import React from 'react';
import Modal from 'react-native-modal';
import { Content, Label } from './styles';
import 
{
    heightPercentageToDP as hP,
    widthPercentageToDP as wP,
} from 'react-native-responsive-screen';

import LottieView from 'lottie-react-native';

export default () => {
    return(
        <Modal
            isVisible={true}
            backdropColor='#7159c1'
            statusBarTranslucent
        >
            <Content>
                <LottieView 
                    source={require('../../animations/loading.json')}
                    loop={true}
                    autoPlay={true}
                    resizeMode='contain'
                    style={{
                        height: hP('20%'),
                        width: wP('20%'),
                    }}
                />
                <Label>Aguarde ...</Label>
            </Content>
        </Modal>
    );
};