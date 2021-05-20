import styled from 'styled-components/native';
import { heightPercentageToDP as hP, widthPercentageToDP as wP } from 'react-native-responsive-screen';

export const Container = styled.View `
    height: ${hP('40%')}px;
    width: ${wP('95%')}px;
    background-color: #dc143c;
    align-items: center;
`;

export const Label = styled.Text `
    color: #FFFF;
    font-family: 'Inter_300Light';
`;

export const Button = styled.TouchableOpacity `
    height: ${hP('5%')}px;
    width: ${wP('30%')}px;
    justify-content: center;
    align-items: center;
    background-color: #FFFF;
    border-radius: ${hP('1%')}px;
    position: absolute;
    top: ${hP('33%')}px;
    left: ${hP('35%')}px;
`;