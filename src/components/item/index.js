import React, { memo, useContext, useState } from 'react';
import 
{
    Box,
    Label,
} from './styles'
import { useNavigation } from '@react-navigation/native';
import { TableContext } from '../../contexts/tableProvider';

import Loading from '../loading';

function Item({ item }) {
    const [loadingTableDetail, setLoadingTableDetail] = useState(false);

    const { setTable } = useContext(TableContext);
    
    const navigation = useNavigation();

    const navigationAndSetTable = () => {
        setLoadingTableDetail(true)
        setTable(item);

        setTimeout(() => {
            navigation.navigate('detail');
            setLoadingTableDetail(false);
        }, 2000);
    };

    return(
        <>
            <Box 
                onPress={() => navigationAndSetTable()}
                bg={item.status ? '#32cd32' : '#dc143c'}
            >
                <Label>{item.name}</Label>
            </Box>

            {loadingTableDetail && (
                <Loading title="Aguarde"/>
            )}
        </>

    );
};

export default memo(Item);