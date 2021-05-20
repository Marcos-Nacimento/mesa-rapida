import styled from 'styled-components/native';
import 
{
    heightPercentageToDP as hP,
    widthPercentageToDP as wP,
} from 'react-native-responsive-screen';

export const Container = styled.View `
    height: ${hP('5%')}px;
    width: ${wP('100%')}px;
    margin: ${hP('1%')}px;
`;

export const OnPress = styled.TouchableOpacity ``;

export const Label = styled.Text `
    color: #696969;
`;

export const Value = styled.Text `
    color: #32cd32;
`;

export const Content = styled.View `
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: ${hP('1%')}px;
`;