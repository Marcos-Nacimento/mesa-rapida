import styled from 'styled-components/native';
import { heightPercentageToDP as hP } from 'react-native-responsive-screen';

export const Container = styled.View `
    flex: 1;
    align-items: center;
    background-color: #7159c2;
`;

export const Title = styled.Text `
    color: #FFFF;
    font-family: 'Inter_300Light';
`;

export const ContentMsg = styled.View `
    padding: ${hP('2%')}px;
    justify-content: center;
    align-items: center;
`;