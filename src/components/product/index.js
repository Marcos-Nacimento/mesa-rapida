import React from 'react';
import 
{
    Container,
    Label,
    Value,
    Content,
} from './styles';
import { Divider } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { heightPercentageToDP as hP } from 'react-native-responsive-screen';

function Product({...props}) {
    return(
        <>
            <Divider />
                <Container>
                    <Content>
                        <Label>{props.name}</Label>
                        <Value>{props.amount}</Value>
                        <MaterialCommunityIcons name="delete" size={hP('4%')} color="#dc143c"/>
                    </Content>
                </Container>
            <Divider />
        </>
    );
};

export default Product;