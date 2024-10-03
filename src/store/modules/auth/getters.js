export default {
    authorized: state => !!state.token,
    authstatus: state => state.authStatus,
    checkedUser: state => state.userStatus,
    user: state => state.user
}
