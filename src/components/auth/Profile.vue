<template>
    <v-dialog
            transition="dialog-top-transition"
            max-width="500"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-btn text
                   class="not_small_screen"
                   v-bind="attrs"
                   v-on="on"
                   color="#114471">
                <v-icon
                        left>
                    mdi-account
                </v-icon>
                Мой профиль
            </v-btn>
            <v-btn
                    class="mx-2 sm_header_card"
                    fab
                    small
                    v-bind="attrs"
                    v-on="on"
            >
                <v-icon dark>
                    mdi-account
                </v-icon>
            </v-btn>
        </template>
        <template v-slot:default="dialog">
            <v-card>
                <v-card-title class="cyan darken-1">
                    <span class="headline white--text">{{user.fullName}}</span>

                    <v-spacer></v-spacer>

                    <v-btn
                            dark
                            icon
                    >
                        <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>

                    <v-btn
                            dark
                            icon
                    >
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>

                    <v-btn
                            dark
                            icon
                    >
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </v-card-title>

                <v-list>
                    <v-list-item>
                        <v-list-item-action>
                            <v-icon>mdi-card-account-details-outline</v-icon>
                        </v-list-item-action>

                        <v-list-item-content>
                            <v-list-item-title>{{user.fullName}}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-icon>mdi-message-text</v-icon>
                        </v-list-item-action>
                    </v-list-item>

                    <v-divider inset></v-divider>

                    <v-list-item>
                        <v-list-item-action>
                            <v-icon>mdi-email</v-icon>
                        </v-list-item-action>

                        <v-list-item-content>
                            <v-list-item-title>{{user.email}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

                    <v-divider inset></v-divider>

                    <v-list-item>
                        <v-list-item-action>
                            <v-icon>mdi-phone</v-icon>
                        </v-list-item-action>

                        <v-list-item-content>
                            <v-list-item-title>{{user.cellPhone}}</v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-action>
                            <v-icon>mdi-message-text</v-icon>
                        </v-list-item-action>
                    </v-list-item>

                    <v-divider inset></v-divider>


                    <v-list-item>
                        <v-list-item-action>
                            <v-icon>mdi-map-marker</v-icon>
                        </v-list-item-action>

                        <v-list-item-content>
                            <v-list-item-title>{{getCityNameById(user.cityId)}}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <!--
                                <v-img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/User_font_awesome.svg/1200px-User_font_awesome.svg.png"
                                        height="200px"
                                ></v-img>-->
                <v-card-actions class="justify-end">
                    <v-btn
                            text
                            @click="dialog.value = false"
                    >Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: "Profile",
        data: () => ({
            coffeeIcon: require('@/assets/img/coffee.svg'),
        }),
        computed: {
            ...mapGetters('auth', ['user']),
            ...mapGetters('booking', ['getCityById'])
        },
        methods: {
            getCityNameById(id) {
                const city = this.getCityById(id)
                return city ? city.name : ''
            }
        }
    }
</script>

<style scoped>
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
</style>
