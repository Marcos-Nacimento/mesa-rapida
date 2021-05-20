import styled from 'styled-components/native';
import { heightPercentageToDP as hP } from 'react-native-responsive-screen';

export const Content = styled.View `
    flex: 1;
    justify-content: center;
    align-items: center;
`;

export const Label = styled.Text `
    color: #FFFF;
    font-family: 'Inter_300Light';
    font-size: ${hP('3%')}px;
`;