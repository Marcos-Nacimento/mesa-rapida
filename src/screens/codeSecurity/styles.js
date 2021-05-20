import styled from 'styled-components/native';
import 
{
    heightPercentageToDP as hP,
    widthPercentageToDP as wP
} from 'react-native-responsive-screen';

export const Container = styled.View `
    flex: 1;
    justify-content: center;
    align-items: center;
`;

export const Label = styled.Text `
    color: #000;
    font-family: 'Inter_300Light';
`;

export const Content = styled.View `
    padding: ${hP('1%')}px;
    margin-top: ${hP("3%")}px;
`;

export const Box = styled.View `
    margin-left: ${hP('7%')}px;
    margin-right: ${hP('7%')}px;
    justify-content: center;
    align-items: center;
    margin-top: ${hP('2%')}px;
`;

export const Button = styled.TouchableOpacity `
    justify-content: center;
    align-items: center;
    background-color: #7159c3;
    height: ${hP('7%')}px;
    width: ${wP('82%')}px;
    border-radius: ${hP('2%')}px;
`;

export const ContentFoolter = styled.View `
    top: ${hP('12%')}px;
    position: absolute;
`;