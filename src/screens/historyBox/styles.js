import styled from 'styled-components/native';
import 
{
    heightPercentageToDP as hP,
    widthPercentageToDP as wP,
} from 'react-native-responsive-screen';

export const Container = styled.View `
    flex: 1;
    background-color: #FFFF;
    align-items: center;
`;

export const ButtonAddTable = styled.TouchableOpacity `
    background-color: #7159c3;
    justify-content: center;
    align-items: center;
    height: ${hP('9%')}px;
    width: ${wP('16%')}px;
    border-radius: ${hP('6%')}px;
    position: absolute;
    top: ${hP('73%')}px;
    right: ${hP('-1%')}px;
    z-index: 1;
    elevation: 4;
    margin: ${hP('2%')}px;
`;

export const ModalContainer = styled.View `
    justify-content: center;
    align-items: center;
`;

export const ModalView = styled.View `
    justify-content: center;
    
    height: ${hP('45%')}px;
    width: ${wP('90%')}px;
    background-color: #FFF;
    border-radius: ${hP('4%')}px;
    elevation: 5;
`;

export const ModalButton = styled.TouchableOpacity `
    justify-content: center;
    align-items: center;
    height: ${hP('7%')}px;
    width: ${wP('85%')}px;
    border-radius: ${hP("3%")}px;
    elevation: 4;
    background-color: #7159c3;
`;

export const OnPress = styled.TouchableOpacity `
`;

export const ContainerButton = styled.View `
    justify-content: center;
    align-items: center;
`;

export const FlatList = styled.FlatList ``;

export const BoxItem = styled.View `
    height: ${hP('8%')}px;
    width: ${wP('93%')}px;
    background-color: #f8f8ff;
    margin: ${hP('1%')}px;
    border-radius: ${hP('1%')}px;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    padding: ${hP('1%')}px;
`;

export const Label = styled.Text `
    font-family: 'Inter_300Light';
    color: #7159c3;
`;

export const BoxMain = styled.View `
    height: ${hP('30%')}px;
    width: ${wP('95%')}px;
    background-color: #7159c2;
    border-radius: ${hP('2%')}px;
    margin: ${hP('1%')}px;
`;

export const BoxTop = styled.View `
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: ${hP('1%')}px;
`;

export const BoxBottom = styled.View `
    align-items: center;
    justify-content: center;
    margin-top: ${hP('8%')}px; 
`;

export const ContentModal = styled.View `
    align-items: center;
    justify-content: center;
`;