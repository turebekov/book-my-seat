<template>
    <v-main class="login_container">
        <v-container fill-height fluid>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md5>
                    <v-card class="elevation-12 login_form">
                        <p class="login_title">Авторизация</p>
                        <v-card-text>
                            <v-form>
                                <v-text-field ref="username" v-model="username"
                                              :rules="[() => !!username || 'This field is required']"
                                              label="E-mail" required/>
                                <v-text-field ref="password" v-model="password"
                                              :rules="[() => !!password || 'This field is required']"
                                              :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                              :type="showPassword ? 'text' : 'password'"
                                              label="Пароль"  counter
                                              required
                                              @keydown.enter="login" @click:append="showPassword = !showPassword"/>

                                <v-alert
                                        :value="snackbar"
                                        :color="color"
                                        icon="warning"
                                        outlined
                                >
                                    {{ errorMessages }}
                                </v-alert>
                            </v-form>
                        </v-card-text>

                        <v-card-actions>
                            <v-btn
                                    align-center
                                    justify-center
                                    color="accent"
                                    @click="showRegisterForm">Регистрация
                            </v-btn>
                            <v-btn
                                    align-center
                                    justify-center
                                    color="accent"
                                    @click="login">Войти
                            </v-btn>
                        </v-card-actions>

                    </v-card>
                </v-flex>
            </v-layout>

        </v-container>
    </v-main>
</template>

<script>
    import {mapActions} from 'vuex'

    export default {
        data: function () {
            return {
                username: '',
                password: '',
                errorMessages: 'Incorrect login info',
                snackbar: false,
                color: 'error',
                showPassword: false
            }
        },
        // Sends action to Vuex that will log you in and redirect to the dash otherwise, error
        methods: {
            ...mapActions('auth', ['loginInAction']),
            login: function () {
                let password = this.password;
                this.snackbar = false;
                this.loginInAction({ email: this.username, password: password })
                    .then(() => this.$router.push('/dashboard'))
                    .catch(() => {
                            this.snackbar = true;
                        }
                    )
            },
            showRegisterForm: function () {
                this.$router.push('/register')
            }
        },
        metaInfo() {
            return {
                title: 'Magnum Booking'
            }
        }
    }
</script>

<style scoped lang="scss">
    .login_container {
        height: 100%;
        background: #F0F0F7;
    }

    .login_form {
        padding-bottom: 3vh;
        .v-form{
            width: 60% !important;
            margin-left: 20% !important;
        }
        .v-card__actions{
            margin-top: 5vh;
            display: flex;
            justify-content: center !important;
        }
        background: #FFFFFF;
        padding-top: 91px;
        .login_title {
            font-family: Segoe UI Regular;
            font-style: normal;
            font-weight: normal;
            font-size: 28px !important;
            line-height: 37px !important;
            color: #43425D;
            text-align: center;
            margin-bottom: 60px;
        }
        .login_input {
            margin: auto;
        }
        .login_input_phone {
            width: 50%;
        }
        .login_input_pass {
            width: 50%;
        }
        .forgot_pass {
            display: block;
            font-family: Segoe UI Regular;
            margin-left: 25%;
            font-style: normal;
            font-weight: normal;
            font-size: 15px;
            line-height: 20px;
            text-decoration: underline;
            color: #63C9EF;
        }
        .login_submit_btn {
            background: #63C9EF !important;
            font-family: Segoe UI Regular;
            font-size: 18px;
            line-height: 24px;
            /* identical to box height */
            text-align: center;

            color: #FFFFFF;
        }
    }
</style>
