import styled from 'styled-components/native';
import { heightPercentageToDP as hP, widthPercentageToDP as wP } from 'react-native-responsive-screen';

export const Container = styled.View `
    flex: 1;
    background-color: #FFFF;
`;

export const Box = styled.View `
    height: ${hP('35%')}px;
    width: ${wP('95%')}px;
    border-radius: ${hP('1%')}px;
    background-color: #7159c2;
    margin: ${hP("1%")}px;
    justify-content: center;
    align-items: center;
`;

export const Label = styled.Text `
    font-family: Inter_300Light;
    color: #7159c3;
`;

export const ContainerHeader = styled.View `
    align-items: center;
`;

export const ContentMain = styled.View `
    margin: ${hP('2%')}px;
`;

export const ContainerLabel = styled.View `
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

export const ContentAccordion = styled.View ``;

export const OnPress = styled.TouchableOpacity ``;

export const ContentModal = styled.View `
    justify-content: center;
    align-items: center;
`;