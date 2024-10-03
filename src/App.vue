<template>
    <transition mode="out-in">
        <router-view/>
    </transition>
</template>

<style lang="scss">
    /* * {
        --nprogress-color: red !important;
        --nprogress-height: 3px !important;
      } */

    // First override all the scss variables you want and then import the files
    // $nprogress-color: #29d !default;
    // $nprogress-height: 2px !default;
    // $nprogress-spinner-opacity: 1 !default;
    // $nprogress-spinner-size: 18px !default;
    // $nprogress-spinner-stroke-width: 2px !default;
    $nprogress-color: #389df1;
    $nprogress-height: 4px;

    @import "nprogress/css/nprogress.scss";
    @font-face {
        font-family: 'Segoe UI Regular';
        font-style: normal;
        font-weight: normal;
        src: local('Segoe UI Regular'), url('assets/fonts/Segoe-UI.woff') format('woff');
    }

    /* Remove in 1.2 */
    .v-datatable thead th.column.sortable i {
        vertical-align: unset;
    }
</style>
<script>
    import {mapGetters, mapActions, mapState} from 'vuex'

    // checks to see if auth jwt token is valid or has expired, if it gets back 401 error log out
    export default {
        computed: {
            ...mapGetters('auth', ['authorized']),
            ...mapState('auth', ['currentUser'])
        },
        created: function () {
            this.$http.interceptors.response.use(
                (response) => {
                    if (response.headers && response.headers.newtoken){
                        this.setUserWithToken(response.headers.newtoken)
                    }
                    return response
                },
                (error) => {
                    if (error.response.status === 401) {
                        if (this.authorized) {
                            this.logoutInAction()
                            this.$router.push('')
                        } else {
                            return Promise.reject(error)
                        }
                    } else {
                        return Promise.reject(error)
                    }
                }
            )
            if (localStorage.token) {
                this.setUserWithToken(localStorage.token)
            }
        },
       /* created: function () {

        },*/
        mounted() {
            this.getTableData({url: `tags`, commit: 'setTags'})
            this.getTableData({url: `cities`, commit: 'setCities'})
        },
        methods: {
            ...mapActions('auth', ['logoutInAction']),
            ...mapActions('user', ['getUserData']),
            ...mapActions('booking', ['getTableData']),
            setUserWithToken(token){
                if (localStorage.user && token) {
                    const user = JSON.parse(localStorage.user)
                    const authSuccess = this.$store._mutations['auth/auth_success']
                    authSuccess[0]({token, user})
                }
            }
        }
    }
</script>
