import styled from 'styled-components/native';
import { heightPercentageToDP as hP, widthPercentageToDP as wP } from 'react-native-responsive-screen';

export const Container = styled.View `
    flex: 1;
    background-color: #FFFF;
    align-items: center;
`;

export const Box = styled.View `
    height: ${hP('30%')}px;
    width: ${wP('95%')}px;
    background-color: #7159c2;
    margin: ${hP('1%')}px;
    border-radius: ${hP('2%')}px;
    padding: ${hP('1%')}px;
    align-items: center;
`;

export const Label = styled.Text `
    font-family: 'Inter_300Light';
    color: #FFFF;
`;

export const Button = styled.TouchableOpacity `
    height: ${hP('6%')}px;
    width: ${wP('50%')}px;
    border-radius: ${hP('1%')}px;
    margin-top: ${hP('7%')}px;
    background-color: #FFFF;
    justify-content: center;
    align-items: center;
`;

export const BoxWarning = styled.View `
    height: ${hP('8%')}px;
    width: ${wP('95%')}px;
    border-radius: ${hP('1%')}px;
    background-color: red;
    position: absolute;
    top: ${hP('78%')}px;
    justify-content: center;
    align-items: center;
    padding: ${hP('2%')}px;
`;

export const OnPress = styled.TouchableOpacity `
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: ${hP('4%')}px;
`;