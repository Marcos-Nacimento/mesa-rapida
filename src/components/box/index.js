import React from 'react';
import 
{
    Container,
    ContentHeader,
    Label,
    OnPress,
    Content,
} from './styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { heightPercentageToDP as hP } from 'react-native-responsive-screen';
import { Divider } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';

function Card({ user, ...props }) {
    const navigation = useNavigation();

    return(
        <Container>

            <ContentHeader>
                <Label>{props.name}</Label>
                <OnPress onPress={() => props.disabledNavigation ? navigation.navigate(props.nameNavigation) : null}>
                    <MaterialCommunityIcons name="arrow-right" color='#FFFF' size={hP('3.2%')}/>
                </OnPress>
            </ContentHeader>

            <Divider />

            <Content>
                <Label>
                    {props.labelOne}{"\n"}
                    <Label style={{color: '#32cd32'}}> {props.valueOne}</Label>
                </Label>
                <Label>
                    {props.labelTwo}{"\n"}
                    <Label style={{color: '#32cd32'}}> {props.valueTwo}</Label>
                </Label>
            </Content>

        </Container>
    );
};

function mapStateToProps(state) {
    return {
        user: state.user,
    };
};

export default connect(mapStateToProps)(Card);