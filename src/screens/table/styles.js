import styled from 'styled-components/native';
import { heightPercentageToDP as hP, widthPercentageToDP as wP } from 'react-native-responsive-screen';

export const Container = styled.View `
    flex: 1;
    background-color: #FFFF;
    justify-content: center;
`;

export const ContainerSearh = styled.View `
    width: ${wP('85%')}px;
    height: ${hP('8%')}px;
    background-color: #d3d3d3;
    margin: ${hP('1%')}px;
    border-radius: ${hP('1%')}px;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    padding: ${hP('2%')}px;
`;

export const OnPress = styled.TouchableOpacity ``;

export const Input = styled.TextInput `
    width: ${wP('70%')}px;
    height: ${hP('6%')}px;
    background-color: #d3d3d3;
    font-family: 'Inter_300Light';
    color: #000;
`;

export const Label = styled.Text `
    color: #b22222;
    font-family: 'Inter_300Light';
`;

export const ContentIsEmpty = styled.View `
    flex: 1;
    justify-content: center;
    align-items: center;
`;

export const ContentModal = styled.View `
    width: ${wP('90%')}px;
    background-color: #FFFF;
    height: ${hP('40%')}px;
    border-radius: ${hP('1%')}px;
    padding-top: ${hP('3%')}px;
    align-items: center;
`;

export const ButtonModal = styled.TouchableOpacity `
    width: ${wP('85%')}px;
    height: ${hP('7%')}px;
    justify-content: center;
    align-items: center;
    background-color: #7159c3;
    border-radius: ${hP('1%')}px;
    position: absolute;
    bottom: ${hP('3%')}px;
`;

export const ContainerInput = styled.View `
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: ${hP('1%')}px;
`;