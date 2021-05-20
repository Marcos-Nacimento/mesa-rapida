import styled from 'styled-components/native';
import 
{
    heightPercentageToDP as hP,
    widthPercentageToDP as wP,
} from 'react-native-responsive-screen';

export const Container = styled.View `
    width: ${wP('100%')}px;
    height: ${hP('4.5%')}px;
    background-color: #dc143c;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: ${hP('83%')}px;
`;

export const Label = styled.Text `
    color: #FFFF;
    font-family: 'Inter_300Light';
`;