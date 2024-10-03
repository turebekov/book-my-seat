<template>
    <div>
        <v-card class="not_small_screen">
            <v-app-bar
                    color="white"
                    class="header_card"
            >
                <v-app-bar-nav-icon @click="reditectToMainPage">
                    <v-img :src="logo" height="38" contain></v-img>
                </v-app-bar-nav-icon>

                <v-toolbar-title @click="reditectToMainPage">Booking</v-toolbar-title>

                <v-spacer></v-spacer>


                <profile/>

                <v-btn text
                       color="#114471"
                       @click="logout">
                    <v-icon
                            left
                    >
                        mdi-logout
                    </v-icon>
                    Выйти
                </v-btn>

            </v-app-bar>

        </v-card>
        <div class="sm_header_card d-flex justify-space-around">
            <div>
               <!-- <v-btn
                        class="mx-2"
                        fab
                        small

                >
                    <v-icon dark>
                        mdi-account
                    </v-icon>
                </v-btn>-->
                <profile/>
            </div>

            <div class="d-flex align-center" @click="reditectToMainPage">
                <v-img :src="logo" height="38" contain></v-img>
                <p class="sm_header_title">Booking</p>
            </div>

            <div>
                <v-btn
                        class="mx-2"
                        fab
                        small
                        @click="logout"
                >
                    <v-icon dark>
                        mdi-logout
                    </v-icon>
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import Profile from '../components/auth/Profile.vue'
    export default {
        name: "Header",
        data: () => ({
            logo: require('@/assets/logo.svg'),
        }),
        components:{
          Profile
        },
        methods: {
            ...mapActions('auth', ['logoutInAction']),
            logout() {
                this.logoutInAction().then(() => {
                    this.$router.push('/')
                })
            },
            reditectToMainPage() {
                this.$router.push('/control/dashboard')
            }
        }
    }
</script>

<style scoped lang="scss">
    @media screen and (max-width: 600px) {
        .not_small_screen {
            display: none;
        }

    }
    @media screen and (min-width: 600px){
        .sm_header_card{
            display: none !important;
        }
    }
    .sm_header_card{
        margin-top: 3vh;
        .sm_header_title{
            font-family: Roboto;
            font-style: normal;
            font-weight: 500;
            font-size: 24px;
            line-height: 28px;
            margin: 0 0 0 5px;
            color: #114471;
        }
    }
</style>
