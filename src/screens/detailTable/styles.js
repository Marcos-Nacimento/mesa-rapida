import styled from 'styled-components/native';
import 
{ 
    heightPercentageToDP as hP, 
    widthPercentageToDP as wP 
} from 'react-native-responsive-screen';

export const Container = styled.View `
    flex: 1;
    background-color: #FFFF;
`;

export const Content = styled.View ``;

export const Scroll = styled.ScrollView ``;

export const Label = styled.Text `
    font-family: Inter_300Light;
    color: #FFFF;
    padding: ${hP('1%')}px;
`;

export const Box = styled.View `
    height: ${hP('22%')}px;
    width: ${wP('96%')}px;
    background-color: #7159c3;
    margin: ${hP('1%')}px;
    border-radius: ${hP('1%')}px;
`;

export const ContentHeader = styled.View `
    margin-top: ${hP('2%')}px;
`;

export const ContentFooter = styled.View `
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: ${hP('0.6%')}px;
`;

export const Button = styled.TouchableOpacity `
    height: ${hP('8%')}px;
    width: ${wP('96%')}px;
    justify-content: center;
    align-items: center;
    background-color: #7159c3;
    border-radius: ${hP('2%')}px;
    margin: ${hP('1%')}px;
`;

export const BoxItem = styled.View `
    height: ${hP('8%')}px;
    width: ${wP('96%')}px;
    border-radius: ${hP('1%')}px;
    flex-direction: row;
    margin: ${hP('1%')}px;
    align-items: center;
    justify-content: space-around;
`;

export const HeaderBox = styled.View `
    justify-content: center;
    margin: ${hP('1%')}px;
    align-items: center;
`;


export const ContentBox = styled.View `
    flex-direction: row;
    justify-content: space-between;
`;

export const OnPress = styled.TouchableOpacity ``;

export const ContentModal = styled.View `
    width: ${wP('92%')}px;
    height: ${hP('45%')}px;
    background-color: #FFFF;
    border-radius: ${hP('1%')}px;
    align-items: center;
`;

