import styled from 'styled-components/native';
import { heightPercentageToDP as hP, widthPercentageToDP as wP } from 'react-native-responsive-screen';

export const Box = styled.TouchableOpacity `
    background-color: ${props => props.bg};
    height: ${hP('16%')}px;
    width: ${wP('30%')}px;
    border-radius: ${hP('1%')}px;
    margin: ${hP('1%')}px;
    justify-content: center;
    align-items: center;
    padding: ${hP('2%')}px;
    flex-direction: row;
`;

export const Label = styled.Text `
    font-family: 'Inter_300Light';
    color: #FFFFFF;
`;
