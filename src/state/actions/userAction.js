export function userAddAction(user) {
    return {
        type: 'add_state',
        payload: user,
    };
};

export function userRemoveAction() {
    return {
        type: 'remove_state',
    };
};

