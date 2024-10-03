<template>
    <v-content class="login_container">
        <v-container fill-height fluid>
            <v-layout align-center justify-center>
                <v-flex xs12 sm8 md5>
                    <v-card class="elevation-12 login_form">

                        <p class="login_title">Регистрация</p>
                        <v-card-text>
                            <v-form>
                                <v-text-field
                                        v-model="registerData.email"
                                        :error-messages="emailErrors"
                                        label="E-mail"
                                        required
                                        @input="$v.registerData.email.$touch()"
                                        @blur="$v.registerData.email.$touch()"
                                ></v-text-field>
                                <v-text-field
                                        v-model="registerData.password"
                                        :error-messages="passwordErrors"
                                        :type="showPassword ? 'text' : 'password'"
                                        :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                        label="Пароль"
                                        required
                                        @input="$v.registerData.password.$touch()"
                                        @blur="$v.registerData.password.$touch()"
                                        @click:append="showPassword = !showPassword"
                                ></v-text-field>
                                <v-text-field
                                        v-model="registerData.confirmPassword"
                                        :error-messages="confirmPasswordErrors"
                                        :type="showConfirmPassword ? 'text' : 'password'"
                                        :append-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                        label="Подтвердите Пароль"
                                        required
                                        @input="$v.registerData.confirmPassword.$touch()"
                                        @blur="$v.registerData.confirmPassword.$touch()"
                                        @click:append="showConfirmPassword = !showConfirmPassword"
                                ></v-text-field>
                                <!--<v-text-field ref="password" v-model="password"
                                              :rules="[() => !!password || 'This field is required']"
                                              :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                                              :type="showPassword ? 'text' : 'password'"
                                              prepend-icon="mdi-lock" label="Password" placeholder="*********" counter
                                              required
                                              @keydown.enter="login" @click:append="showPassword = !showPassword"/>-->
                            </v-form>
                        </v-card-text>

                        <v-card-actions>

                            <v-btn
                                    align-center
                                    justify-center
                                    color="accent"
                                    @click="registerUser">Зарегистрироваться
                            </v-btn>
                            <v-btn
                                    align-center
                                    justify-center
                                    color="accent"
                                    @click="login">Войти
                            </v-btn>
                        </v-card-actions>
                        <v-snackbar
                                v-model="snackbar"
                                :color="color"
                                :top="true"
                        >
                            {{ errorMessages }}
                            <v-btn
                                    light
                                    text
                                    @click="snackbar = false"
                            >
                                Закрыть
                            </v-btn>
                        </v-snackbar>
                    </v-card>
                </v-flex>
            </v-layout>

        </v-container>
    </v-content>
</template>

<script>
    import { mapActions, mapMutations, mapGetters } from 'vuex'
    import { required, email } from 'vuelidate/lib/validators'

    export default {
        validations: {
            registerData: {
                email: { required, email },
                password: { required },
                confirmPassword: { required }
            }
        },
        data: function () {
            return {
                registerData: {
                    email: '',
                    password: '',
                    confirmPassword: ''
                },
                errorMessages: 'Incorrect login info',
                snackbar: false,
                color: 'general',
                showPassword: false,
                showConfirmPassword: false
            }
        },
        // Sends action to Vuex that will log you in and redirect to the dash otherwise, error
        computed: {
            ...mapGetters('auth', ['checkedUser']),
            emailErrors () {
                const errors = []
                if (!this.$v.registerData.email.$dirty) return errors

                !this.$v.registerData.email.required && errors.push('E-mail is required')
                return errors
            },
            passwordErrors () {
                const errors = []
                if (!this.$v.registerData.password.$dirty) return errors
                !this.$v.registerData.password.required && errors.push('Password is required')
                return errors
            },
            confirmPasswordErrors () {
                const errors = []
                if (!this.$v.registerData.confirmPassword.$dirty) return errors
                !this.$v.registerData.confirmPassword.required && errors.push('Password is required')
                this.registerData.password !== this.registerData.confirmPassword && errors.push('Пароли не совпадают')
                return errors
            }
        },
        methods: {
            ...mapActions('auth', ['loginInAction', 'checkEmail', 'register']),
            ...mapMutations('auth', ['user_status']),
            login: function () {
                this.user_status(false)
                this.$router.push('/login')
            },
            checkUser: function () {
                //if (!this.$v.registerData.email.$invalid) {
                this.checkEmail(this.registerData.email)
                    .then(() => {
                        if (!this.checkedUser) {
                            this.errorMessages = 'Не корректный логин'
                            this.snackbar = true
                        }
                    })
                    .catch(err => console.log(err))
                //}
            },
            registerUser () {
                if (!this.$v.registerData.$invalid) {
                    this.register(this.registerData)
                        .then((res) => {
                            this.user_status(false)
                            this.errorMessages = 'Для активации перейдите в почту'
                            if (res.data && res.data.errorCode && res.data.errorCode === -1){
                            this.errorMessages = 'Вы уже зарегистрированы в системе'
                            }
                            this.snackbar = true
                            setTimeout(() => {
                                this.$router.push('/control/dashboard')
                            }, 5000)
                        })
                        .catch(() => {
                            this.errorMessages = 'Не корректный логин'
                            this.snackbar = true
                            this.color = 'error'
                        })
                }
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
        background: #FFFFFF;
        padding-top: 91px;
        padding-bottom: 3vh;
        .v-form {
            width: 60% !important;
            margin-left: 20% !important;
        }
        .v-card__actions {
            margin-top: 5vh;
            display: flex;
            justify-content: center !important;
        }
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
