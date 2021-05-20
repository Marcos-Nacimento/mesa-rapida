import styled from 'styled-components/native';
import 
{ 
    heightPercentageToDP as hP,
    widthPercentageToDP as wP,
} from 'react-native-responsive-screen';

export const Container = styled.View `
    height: ${hP('25%')}px;
    width: ${wP('96%')}px;
    background-color: #7159c1;
    margin: ${hP('1%')}px;
    border-radius: ${hP('2%')}px;
`;

export const Label = styled.Text `
    color: #FFFF;
    font-family: 'Inter_300Light';
`;

export const ContentHeader = styled.View `
    flex-direction: row;
    justify-content: space-between;
    margin: ${hP('2%')}px;
`;

export const OnPress = styled.TouchableOpacity ``;

export const Content = styled.View `
    justify-content: space-evenly;
    flex-direction: row;
    margin: ${hP('3%')}px;
`;

export const Header = styled.View `
    height: ${hP('10%')}px;
    background-color: #7159c3;
`;

export const ButtonAddTable = styled.TouchableOpacity `
    background-color: #7159c3;
    justify-content: center;
    align-items: center;
    height: ${hP('9%')}px;
    width: ${wP('16%')}px;
    border-radius: ${hP('6%')}px;
    position: absolute;
    top: ${hP('80%')}px;
    right: ${hP('-1%')}px;
    z-index: 1;
    elevation: 4;
    margin: ${hP('2%')}px;
`;

export const ScrollViewContainer = styled.View`
    margin-bottom: ${hP('1%')}px;
    justify-content: center;
    align-items: center;
`;

export const ScrollViewContent = styled.ScrollView ``;

export const Categorie = styled.Text `
    color: #a9a9a9;
    font-size: ${hP('2.5%')}px;
    margin: ${hP('1.9%')}px;
    font-family: 'Inter_300Light'; 
`;