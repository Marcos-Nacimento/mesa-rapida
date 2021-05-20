import React, { useState } from 'react';
import 
{ 
    Container,
    Label,
    Button, 
} from './styles';
import { heightPercentageToDP as hP } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

import Modal from 'react-native-modal';

function PaymentRedirect() {
    const [isModal, setModal] = useState(true);
    const navigation = useNavigation();

    return(
        <Modal
            isVisible={isModal}
            style={{
                justifyContent: 'center',
                alignItems: 'center',
            }}
            animationOut="zoomOut"
            animationIn="zoomIn"
            onBackButtonPress={() => setModal(false)}
            onBackdropPress={() => setModal(false)}
            statusBarTranslucent
        >
            <Container>
                <Label style={{
                    fontSize: hP('3%'),
                    marginBottom: hP('7%'),
                    fontWeight: 'bold',
                }}>
                    Aviso!
                </Label>
                <Label
                    style={{
                        padding: hP('2%')
                    }}
                >
                    Sua conta expirou, mas fique tranquilo 😀{'\n'}
                    você pode renovar por apenas <Label style={{fontWeight: 'bold'}}>$ 42</Label> reais por mês,{'\n'}
                    faça seu pagamento via cartão de crédito ou de débito de forma segura.
                </Label>

                <Button onPress={() => navigation.navigate('payment')}>
                    <Label style={{color: '#7159c3'}}>Quero pagar</Label>
                </Button>
            </Container>
        </Modal>
    );
};

export default PaymentRedirect;