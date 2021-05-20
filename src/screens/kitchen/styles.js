import styled from 'styled-components/native';
import { heightPercentageToDP as hP, widthPercentageToDP as wP } from 'react-native-responsive-screen';

export const Container = styled.View `
    flex: 1;
    background-color: #FFFF;
    align-items: center;
`;

export const OnPress = styled.TouchableOpacity ``;

export const Box = styled.TouchableOpacity `
    background-color: #f8f8ff;
    height: ${hP('9%')}px;
    width: ${wP('95%')}px;
    border-radius: ${hP('3%')}px;
    margin: ${hP('1%')}px;
    justify-content: space-between;
    align-items: center;
    padding: ${hP('2%')}px;
    flex-direction: row;
`;

export const Label = styled.Text `
    font-family: 'Inter_300Light';
    color: #7159c3;
`;

export const ContentStatus = styled.View `
    flex-direction: row;
    align-items: center;
    justify-content: center;
`;

export const ContainerSearh = styled.View `
    width: ${wP('95')}px;
    height: ${hP('8%')}px;
    background-color: #d3d3d3;
    margin: ${hP('1%')}px;
    border-radius: ${hP('1%')}px;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    padding: ${hP('2%')}px;
`;

export const Input = styled.TextInput `
    width: ${wP('82%')}px;
    height: ${hP('6%')}px;
    background-color: #d3d3d3;
    font-family: 'Inter_300Light';
    color: #000;
`;

export const ContentIsEmpty = styled.View `
    flex: 1;
    justify-content: center;
    align-items: center;
`;

