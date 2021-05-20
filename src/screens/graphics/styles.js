import styled from 'styled-components/native';
import { heightPercentageToDP as hP, widthPercentageToDP as wP } from 'react-native-responsive-screen';

export const Container = styled.View `
    flex: 1;
    background-color: #FFFF;
    align-items: center;
`;

export const Content = styled.View `
    height: ${hP('30%')}px;
    width: ${wP('95%')}px;
    background-color: #7159c2;
    border-radius: ${hP('2%')}px;
    margin: ${hP('1%')}px;
`;

export const ContentTop = styled.View `
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: ${hP('1%')}px;
`;

export const ContentBottom = styled.View `
    align-items: center;
    justify-content: center; 
`;

export const Label = styled.Text `
    color: #FFFF;
    font-family: 'Inter_300Light';
`;

export const OnPress = styled.TouchableOpacity ``;

export const ContentModal = styled.View `
    align-items: center;
    justify-content: center;
`;


