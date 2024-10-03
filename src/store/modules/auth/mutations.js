export default {
    auth_request (state) {
        state.authStatus = 'loading'
    },
    auth_success (state, {token, user}) {
        state.authStatus = 'success'
        state.token = token
        state.user = user
    },
    auth_error (state) {
        state.authStatus = 'error'
    },
    logout (state) {
        state.authStatus = ''
        state.token = ''
    },
    user_status (state, status) {
        state.userStatus = status
    },
    setUser(state, user){
        state.user = user
    }
}
