<template>
    <v-dialog v-model="dialog" transition="dialog-top-transition" max-width="600">


        <v-card class="confirmation_card pt-xs-2 pt-md-10 pt-lg-10">
            <v-card-text v-if="booking">
                <div class="text-center confirmation_title">Подтверждение бронирования</div>
                <div class="text-center mt-md-4 mt-lg-4 confirmation_title confirmation_reserve">Бронь №
                    <span>{{booking.id}}</span></div>

                <div class="text-left confirmation_mini_title mt-md-4 mt-lg-4">Дата и время
                    <span>{{getMonthWithDay()}} c {{getStartTimeStr(booking.startTime)}}
                        по {{getStartTimeStr(booking.endTime)}}</span>
                </div>

                <div class="text-left confirmation_mini_title mt-md-4 mt-lg-4">Имя
                    <span>{{booking.user.fullName}}</span>
                </div>

                <div class="text-left confirmation_mini_title mt-md-4 mt-lg-4" v-if="booking">Место
                    <span><v-icon>mdi-map-marker</v-icon> {{booking.officeName}}/{{booking.floorName}} этаж</span>
                </div>

                <div class="text-center mt-md-4 mt-lg-4 confirmation_title confirmation_reserve">Удобства</div>

                <div class="d-flex justify-space-between mt-6 flex-wrap">
                    <div class="reserve_comfort d-flex flex-column  align-center"
                         v-for="(icon, index) in booking.workplace.tags"
                         :key="index">
                        <div class="reserve_comfort_img_block d-flex align-center justify-center ">
                            <v-img :lazy-src="getIconSrcById(icon.id)" class="facility_icon place_cart_icons"
                                   contain
                                   height="24" :src="getIconSrcById(icon.id)"></v-img>
                        </div>
                        <p class="mt-4">{{icon.name}}</p>
                    </div>
                </div>

            </v-card-text>
            <v-card-actions class="justify-center " v-if="booking">
                <v-btn
                        class="ma-2 reserve_btns"
                        outlined
                        color="primary"
                        :disabled="booking.stateId !== 0"
                        @click="close"
                >
                    Отменить
                </v-btn>
                <v-btn
                        class="reserve_btns"
                        depressed
                        color="primary"
                        :disabled="booking.stateId !== 0"
                        @click="confirm"
                >
                    Подтвердить
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: "ConfirmationDialog",
        props: ['booking', 'getMonth', 'getStartTime', 'showMapDialog', 'cancel'],
        data: () => ({
            dialog: false,
            coffeeIcon: require('@/assets/img/coffee.svg'),
            conditionerIcon: require('@/assets/img/conditioner.svg'),
            boardIcon: require('@/assets/img/board.svg'),

        }),
        computed: {
            ...mapGetters('booking', ['getIconSrcById'])
        },
        methods: {
            close() {
                this.cancel(this.booking, -1)
                this.dialog = false;
            },
            getMonthWithDay() {
                return this.getMonth(this.booking.startTime)
            },
            getStartTimeStr(date) {
                return this.getStartTime(date)
            },
            confirm(){
                this.showMapDialog(this.booking)
            }
        }
    }
</script>

<style scoped lang="scss">
    @media screen and (max-width: 600px) {
        .not_small_screen {
            display: none;
        }
        .place_list_title {
            text-align: center !important;
        }
        .reserve_time {
            letter-spacing: 0;
            font-size: 12px !important;
        }
        .reserve_btns {
            height: 28px;
            font-size: 12px;
        }
        .reserve_comfort {
            width: 33% !important;
        }
    }

    .facility_icon {
        filter: invert(60%) sepia(34%) saturate(3207%) hue-rotate(185deg) brightness(80%) contrast(100%)
    }

    .confirmation_card {
        .confirmation_title {
            font-family: Montserrat;
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 20px;
            color: #000000;
        }
        .confirmation_reserve {
            font-size: 14px;

        }

        .reserve_comfort {
            width: 15%;
            .reserve_comfort_img_block {
                background: #EFEEEE;
                width: 45px;
                height: 45px;
                border-radius: 10px;
            }
            p {
                font-size: 11px;
                line-height: 13px;
                color: #000000;
            }
        }

        .confirmation_mini_title {
            font-size: 14px;
            color: #9E9E9E;
            span {
                display: block;
                font-size: 12px;
                color: #000;
                margin-top: -5px;
            }
        }
    }


</style>
