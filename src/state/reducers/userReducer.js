const INITIAL_STATE = {
    user: {
        
    },
    token: null,
    auth: false,
};

function userReducer(state = INITIAL_STATE, action) {
    switch(action.type) {
        case "add_state":
            return action.payload;
        case "remove_state":
            return INITIAL_STATE;
        default:
            return INITIAL_STATE;
    };
};

export default userReducer;