import styled from 'styled-components/native';
import 
{
    heightPercentageToDP as hP,
    widthPercentageToDP as wP
} from 'react-native-responsive-screen';

export const Container = styled.View `
    flex: 1;
`;

export const Content = styled.View `
    align-items: center;
`;

export const Button = styled.TouchableOpacity `
    justify-content: center;
    align-items: center;
    background-color: #7159c3;
    height: ${hP('7%')}px;
    width: ${wP('96%')}px;
    border-radius: ${hP('2%')}px;
`;

export const Label = styled.Text `
    color: #FFFF;
    font-family: 'Inter_300Light';
`;

export const Header = styled.View `
    background-color: #7159c3;
    height: ${hP('30%')}px;
    width: ${wP('100%')}px;
    align-items: center;
    justify-content: center;
    margin-bottom: ${hP('2%')}px;
`;

export const ContentFoolter = styled.View `
    top: ${hP('12%')}px;
    position: absolute;
`;