<template>
    <div class="place_container">
        <p class="place_title not_small_screen">Бронирование рабочих мест</p>

        <bookingPrimeTime/>

        <p class="place_list_title ">Список бронирований</p>

        <div >
            <v-card
                    class="filter_block d-flex justify-space-between  mb-6"
                    text
                    tile
            >
                <div class="d-flex sm_picker">
                    <datepicker ref="dateFrom" @setDate="setDateFrom"/>

                    <datepicker ref="dateTo" @setDate="setDateTo"/>
                </div>

                <div class="sm_picker">
                    <v-select
                            v-model="filters[2].value"
                            :items="getOffices"
                            item-text="name"
                            item-value="id"
                            menu-props="auto"
                            label="Филиал"
                            hide-details
                            prepend-icon="mdi-map-marker"
                            single-line
                    ></v-select>
                </div>

                <div class="place_btn_block">
                    <v-btn
                            depressed
                            color="primary"
                            @click="getAllBookings"
                    >
                        Применить
                    </v-btn>

                    <v-btn
                            class="mx-2 not_small_screen"
                            fab
                            dark
                            small
                            color="primary"
                            @click="addWorkplace"
                    >
                        <v-icon dark>
                            mdi-plus
                        </v-icon>
                    </v-btn>
                </div>

            </v-card>
        </div>

        <div class="place_cart" v-for="(booking, index) in getBookings"
             :key="index"
        >
            <v-card
                    v-bind:style="{ 'border-left-color': getBorderColor(booking.stateId) }"
                    class="mx-auto"
                    max-width="100%"
                    outlined
            >
                <v-list-item three-line>
                    <v-list-item-content>
                        <div class="overline mb-4 d-flex justify-space-between  place_date">
                            <span @click="editBooking(booking)"><span class="not_small_screen">Бронирование</span> № {{booking.id}}</span>
                            <span class="reserve_time">{{getMonthWithDay(booking.startTime)}} C {{getStartTime(booking.startTime)}}
                                ПО {{getStartTime(booking.endTime)}}</span>
                        </div>
                        <!--<v-list-item-title class="headline mb-1">
                            Headline 5
                        </v-list-item-title>-->
                        <v-list-item-subtitle class="d-flex justify-space-between align-center">
                            <span class="reserve_time">
                                <v-icon class="reserve_time">mdi-map-marker</v-icon>
                                {{booking.officeName}}/{{booking.floorName}} этаж
                            </span>


                            <div class="d-flex">
                                <div v-for="(icon, index) in booking.workplace.tags"
                                     :key="index">
                                    <!--:lazy-src="tags[index].imgUrl"-->
                                    <v-img class="facility_icon place_cart_icons"
                                           max-width="22" :src="icon.image"></v-img>
                                </div>
                                <v-btn
                                        icon
                                        color="#003AA8"
                                        @click="showConfirmationDialog(booking)"
                                >
                                    <v-icon>mdi-chevron-right</v-icon>
                                </v-btn>
                            </div>
                        </v-list-item-subtitle>
                        <span class="reserve_time">
                            <v-icon class="reserve_time">mdi-fireplace-off</v-icon>
                                {{booking.workplace.name}}
                        </span>
                    </v-list-item-content>


                </v-list-item>

                <v-card-actions class="d-flex justify-end  reserve_btns_block">

                    <v-btn
                            class="ma-2 reserve_btns"
                            outlined
                            color="primary"
                            :disabled="booking.stateId !== 0"
                            @click="cancel(booking, -1)"
                    >
                        Отменить
                    </v-btn>
                    <v-btn
                            class="reserve_btns"
                            depressed
                            color="primary"
                            :disabled="booking.stateId !== 0"
                            @click="showMapDialog(booking)"
                    >
                        Подтвердить
                    </v-btn>
                </v-card-actions>
            </v-card>

        </div>

        <v-btn
                class="mx-2 add_workplace"
                fab
                small
                dark
                color="indigo"
                @click="addWorkplace"
        >
            <v-icon dark>
                mdi-plus
            </v-icon>
        </v-btn>

        <confirmationDialog :booking="selectedBooking" :cancel="cancel" :showMapDialog="showMapDialog"
                            :getMonth="getMonthWithDay" :getStartTime="getStartTime"
                            ref="confirmationDialogComponent"/>
        <app-map :booking="selectedBooking" :confirm="cancel" :officeCoords="pointCoords" ref="mapComponent"
                 @setOfficeCoordinate="setOfficeCoordinate"/>
        <snackbar :title='snackText' :snackColor="snackColor"
                  ref="snackbar"/>
    </div>
</template>

<script>
    import datepicker from '../../helper/Datepicker'
    import confirmationDialog from './ConfirmationDialog'
    import confirmationMap from './ConfirmationMap'
    import {mapActions, mapGetters, mapMutations} from 'vuex'
    import snackbar from '../../helper/Snackbar/Snackbar.vue'
    import snackbarService from '../../helper/Snackbar/snackbarService'
    import bookingPrimeTime from './BookingPrimeTime'

    export default {
        name: "WorkplaceList",
        data: () => ({
            date: new Date().toISOString().substr(0, 10),
            menu: false,
            e1: '',
            pointCoords: [43.207327911897366, 76.91332807257072],
            selectedBooking: null,
            imgUploaded: false,
            snackText: '',
            snackColor: 'success',
            page: 1,
            totalPages: 2,
            pageSize: 100,
            filters: [
                {
                    field: 'startTime',
                    operation: 'GREATER',
                    value: null,
                },
                {
                    field: 'endTime',
                    operation: 'LESS',
                    value: null,
                },
                {
                    field: 'office',
                    operation: 'EQUAL',
                    value: null,
                }]
        }),
        computed: {
            ...mapGetters('booking', ['getCities', 'getBookings', 'getOffices']),
            ...mapGetters('auth', ['user'])
        },
        watch: {
            getBookings: function () {
                this.getBookings.forEach((booking, index) => {
                    if (booking.stateId === 0) {
                        this.settingTimerToExtend(booking, index)
                    }
                })
            }
        },
        async mounted() {
            this.$refs.dateFrom.minDate = ''
            this.$refs.dateTo.minDate = ''
            await this.getTableData({url: `bookings/users/ids/${this.user.id}`, commit: 'setBookings'})
            this.getTableData({url: `offices/cities/${this.user.cityId}`, commit: 'setOffices'})
        },
        methods: {
            ...mapActions('booking', ['getTableData', 'getFileData', 'updateTableItem']),
            ...mapMutations('booking', ['setTags']),
            getAllBookings() {
                const filterTable = this.filters.filter(item => !!item.value)
                this.updateTableItem({
                    endpoint: `bookings/filters?pageNumber=${this.page - 1}&size=${this.pageSize}`,
                    commit: 'setBookings',
                    tableItem: {filters: filterTable}, method: 'post'
                })
            },
            settingTimerToExtend(booking, index) {
                const endTime = new Date(booking.startTime)
                let currentTime = new Date()
                if (endTime.getDate() === currentTime.getDate() && endTime.getMonth() === currentTime.getMonth()) {
                    let difference = endTime - currentTime
                    let differenceMin = difference / 60000
                    if (differenceMin > 15) {
                        booking.confirmationMin = differenceMin - 15
                        let timeForTimeout = booking.confirmationMin * 60000

                        setTimeout(() => {
                            console.log(timeForTimeout)
                            this.getBookings[index].hasLive = true
                        }, timeForTimeout)
                    } else {
                        this.getBookings[index].hasLive = true
                    }
                }
            },
            setDateFrom(date) {
                date = new Date(date)
                this.filters[0].value = date.toISOString()
            },
            setDateTo(date) {
                date = new Date(date)
                this.filters[1].value = date.toISOString()
            },
            editBooking(item) {
                this.$router.push({path: '/dashboard/form', query: {bookingId: item.id}})
            },
            showConfirmationDialog(booking) {
                this.selectedBooking = booking
                this.$refs.confirmationDialogComponent.dialog = true;
            },
            setOfficeCoordinate(coords) {
                console.log(coords);
            },
            showMapDialog(booking) {
                if (booking.hasLive) {
                    this.selectedBooking = booking
                    this.pointCoords = [booking.office.longitude, booking.office.latitude]
                    this.$refs.mapComponent.setOfficePoint()
                    this.$refs.mapComponent.dialog = true;
                    this.$refs.mapComponent.setEventOnLocationChange()
               } else {
                    const confirmDate = new Date(booking.startTime)
                    confirmDate.setMinutes(confirmDate.getMinutes() - 15)
                    snackbarService.cancelInline.call(this,
                        `Вы можете подтвердить бронь только в ${confirmDate.getHours()} : ${confirmDate.getMinutes()} - за 15 минут до начала брони`)
                }

            },
            addWorkplace() {
                this.$router.push({path: '/dashboard/add'})
            },
            getMonthWithDay(date) {
                const currentDate = new Date(date);
                const month = currentDate.toLocaleString('default', {month: 'long'});
                return `${currentDate.getDate()} ${month}`
            },
            getStartTime(date) {
                let startTime = new Date(date)
                startTime = `${startTime.getHours()}:${startTime.getMinutes()}`
                startTime = this.getCorrectTime(startTime)
                return startTime
            },
            getCorrectTime(time) {
                const times = time.split(':')
                let correctTime = ''
                times.forEach(item => {
                    correctTime = correctTime + ':' + this.pad(item)
                })
                return correctTime.substring(1)
            },
            pad(n) {
                return n < 10 ? '0' + n : n
            },
            cancel(booking, state) {
                if (confirm(`Вы точно хотите ${this.getConfirmMsg(state)} бронь ?`)) {
                    if (booking) {
                        booking.stateId = state
                        let fromDate = new Date(booking.startTime)
                        booking.fromDate = fromDate.toISOString()

                        let tableItem = Object.assign({}, booking)
                        let endpoint = `bookings`
                        let method = booking.id ? 'put' : 'post'
                        this.updateTableItem({endpoint, tableItem, method})
                            .then(() => {
                                this.getTableData({url: `bookings/users/ids/${this.user.id}`, commit: 'setBookings'})
                                snackbarService.saveInline.call(this, 'Успешно')
                            })
                            .catch(err => console.log(err))
                    }
                }
            },
            getConfirmMsg(state) {
                return state === 1 ? 'подтвердить' : 'отменить'
            },
            getBorderColor(state) {
                let result = ''
                switch (state) {
                    case 0:
                        result = '#1976d2'
                        break
                    case 1:
                        result = '#17d22b'
                        break
                    case -1:
                        result = '#ff1e1c'
                        break
                    case -2:
                        result = '#ff1e1c'
                        break
                }
                return result
            }
        },

        components: {
            datepicker,
            confirmationDialog,
            'app-map': confirmationMap,
            snackbar,
            bookingPrimeTime
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
        .add_workplace {
            display: block !important;
            position: fixed;
            bottom: 2vh;
            right: 1vh;
        }
        .place_container {
            width: 94% !important;
            margin-left: 3% !important;
        }
        .reserve_btns_block {
            justify-content: space-between !important;
        }
    }

    @media screen and (max-width: 1230px) {
        .place_btn_block {
            display: flex;
        }
    }

    @media screen and (max-width: 600px) {
        .place_btn_block {
            width: 100%;
            margin-bottom: 2vh;
            align-items: center;
            justify-content: center;
        }
        .sm_picker{
            flex-direction: column;
            width: 95%;
        }
    }

    @media screen and (max-width: 900px) {
        .filter_block {
            flex-wrap: wrap !important;
        }
    }

    .facility_icon {
        filter: invert(60%) sepia(34%) saturate(3207%) hue-rotate(185deg) brightness(80%) contrast(100%)
    }

    .add_workplace {
        display: none;
    }

    .place_container {
        width: 70%;
        margin-left: 15%;
        margin-bottom: 5vh;
        .place_list_title {
            font-size: 20px;
            font-style: normal;
            font-weight: 500;
            line-height: 24px;
            text-align: left;
            margin-top: 4vh;
        }
        .place_btn_block {
            margin-top: 10px;
        }

    }

    .place_cart {
        .place_date {
            font-style: normal;
            font-weight: 600;
            font-size: 14px;
            line-height: 17px;
            color: #000000;
            margin-top: 10px;
        }

        .v-card {
            margin-top: 5vh !important;
            border-left-width: 8px;
            border-radius: 10px;
        }
    }

    .place_cart_icons {
        margin: 6px 5px 0 5px !important;
    }

    .place_title {
        font-style: normal;
        font-weight: 500;
        font-size: 25px;
        line-height: 30px;
        margin-top: 3vh;
        text-align: center;
        color: #000000;
    }

</style>
