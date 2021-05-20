import React from 'react';
import Modal from 'react-native-modal';

import { Content, Label } from './styles';
import { ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { userRemoveAction } from '../../state/actions/userAction';

function NoPermission({ isModal, remove_state }) {

    const resetUserState = () => {
        setTimeout(() => remove_state(), 5000);
    };

    return(
        <Modal
            isVisible={isModal}
            backdropColor="#7159c2"
            statusBarTranslucent
        >
            {isModal ? (
                resetUserState()
            ): null}

            <Content>
                <Label>você não está autorizado</Label>
                <Label>redirecionado ...</Label>
                <ActivityIndicator color='#FFFF'/>
            </Content>
        </Modal>
    );
};

const mapDispathToProps = (dispath) => {
    return {
        remove_state: () => dispath(userRemoveAction()),
    }
};

export default connect(null, mapDispathToProps)(NoPermission);

