<template>
    <div class="flex-container activate_container">
        <div class="row">
            <p>Активация пользователя ..</p>
            <v-progress-linear
                    indeterminate
                    color="cyan">

            </v-progress-linear>

        </div>
        <snackbar :title='message' :snackColor="'success'"
                  ref="snackbar"/>
    </div>

</template>

<script>
    import axios from 'axios'
    import snackbar from '../../components/helper/Snackbar/Snackbar.vue'

    export default {
        name: "UserActivate",
        data: () => ({
            message: 'Ваша учетная запись зарегистрирована'
        }),
        beforeMount() {
            this.activateUser()
        },
        methods: {
            getActivateToken: function () {
                return new URL(location.href).searchParams.get('code')
            },
            activateUser: function () {
                axios.get(`security/users/registration/${this.getActivateToken()}`)
                    .then(() => {
                        this.$refs.snackbar.snackbar = true
                        setTimeout(() => {
                            this.$router.push('/')
                        }, 5000)
                    })
                    .catch(error => console.log(error))
            }
        },
        components: {snackbar}
    }
</script>

<style scoped>
    .activate_container {
        height: 100%;
        flex-direction: column !important;
    }

    .flex-container {
        height: 100%;
        padding: 0;
        margin: 0;
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .row {
        width: 100%
    }

    p {
        text-align: center;
    }
</style>
