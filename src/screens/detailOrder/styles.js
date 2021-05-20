import styled from 'styled-components/native';
import 
{ 
    heightPercentageToDP as hP, 
    widthPercentageToDP as wP 
} from 'react-native-responsive-screen';

export const Container = styled.View `
    flex: 1;
    background-color: #FFFF;
    align-items: center;
`;

export const BoxItem = styled.View `
    height: ${hP('8%')}px;
    width: ${wP('96%')}px;
    border-radius: ${hP('1%')}px;
    flex-direction: row;
    margin: ${hP('1%')}px;
    align-items: center;
    padding: ${hP('1%')}px;
    justify-content: space-between;
`;

export const Label = styled.Text `
    font-family: Inter_300Light;
    color: #FFFF;
    padding: ${hP('1%')}px;
`;

export const OnPress = styled.TouchableOpacity ``;

export const ContentIsEmpty = styled.View `
    margin-top: ${hP('35%')}px;
    justify-content: center;
    align-items: center;
`;
