<template>
    <div class="d-flex flex-wrap justify-space-around align-start workplace_form">

        <div class="form_block">
            <v-card class="confirmation_card mt-9 pt-xs-2 pt-md-2 pt-lg-2">
                <v-card-text>
                    <div class="text-center confirmation_title">Добавление бронирования</div>

                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm12 md12 class="d-flex justify-space-between align-center mt-3">
                                <v-select
                                        :options="getOffices"
                                        label="name"
                                        v-model="selectedOffice"
                                        :placeholder="'Филиал'"
                                        :disabled="true"
                                >
                                    <template v-slot:no-options="{ search, searching }">
                                        <template v-if="searching">
                                            По запросу ничего не найдено <em>{{ search }}</em>.
                                        </template>
                                        <em style="opacity: 0.5;" v-else>В этом городе филиалы отсутствуют.</em>
                                    </template>
                                </v-select>
                            </v-flex>

                            <v-flex xs12 sm12 md12
                                    class="d-flex justify-space-between align-center mt-3 form_container">
                                <div>
                                    <v-select
                                            :options="getFloorsByOfficeId(selectedOffice)"
                                            label="name"
                                            v-model="selectedFloor"
                                            :placeholder="'Этаж'"
                                            :disabled="!!bookingId"
                                    >
                                        <template v-slot:no-options="{ search, searching }">
                                            <template v-if="searching">
                                                По запросу ничего не найдено <em>{{ search }}</em>.
                                            </template>
                                            <em style="opacity: 0.5;" v-else>В этом филиале этажи отсутствуют.</em>
                                        </template>
                                    </v-select>
                                </div>

                                <div>
                                    <datepicker :disabled="!!bookingId" :label="'Дата'" ref="fromDate"
                                                @setDate="setFromDate"/>
                                    <span v-if="$v.booking.fromDate.$invalid && $v.booking.fromDate.$dirty"
                                          class="v-messages error-messages error--text">Дата обязательно.</span>
                                </div>
                            </v-flex>

                            <v-flex xs12 sm12 md12
                                    class="d-flex justify-space-between align-center mt-3 form_container">
                                <div>
                                    <timepicker :disabled="!!bookingId" :label="'С'" ref="startTimeComponent"
                                                @setTime="setStartTime"/>
                                    <span v-if="$v.booking.startTime.$invalid && $v.booking.startTime.$dirty"
                                          class="v-messages error-messages error--text">Время обязательно.</span>
                                </div>

                                <div>
                                    <timepicker :disabled="!!bookingId" :label="'По'" ref="endTimeComponent"
                                                @setTime="setEndTime"/>
                                    <span v-if="$v.booking.endTime.$invalid && $v.booking.endTime.$dirty"
                                          class="v-messages error-messages error--text">Время обязательно.</span>

                                </div>
                            </v-flex>
                            <span v-if="compareTwoTime()"
                                  class="v-messages error-messages error--text">Минимальное время бронирования 30 минут.</span>
                            <span v-if="$v.booking.workplace.$invalid && $v.booking.workplace.$dirty"
                                  class="text-center v-messages error-messages error--text">РМ обязательно.</span>
                        </v-layout>
                    </v-container>


                    <div class="text-center mt-md-4 mt-lg-4 confirmation_title confirmation_reserve"
                         v-if="getTagsFromPlaces.length && !bookingId">Удобства
                    </div>
                    <div class="d-flex mt-6 flex-wrap"
                         v-bind:class="{ 'justify-space-between': hasMoreTags(3) }"

                         v-if="getTagsFromPlaces && !bookingId">
                        <div class="reserve_comfort d-flex flex-column  align-center"
                             v-for="(icon, index) in getTagsFromPlaces"
                             :key="index"
                             v-bind:class="{ 'reserve_comfort_active': hasTagInSelectedTags(icon.id),
                              'mx-2': hasMoreTags(2)}"
                             @click="addTagForReserv(icon)">
                            <div class="reserve_comfort_img_block d-flex align-center justify-center ">
                                <v-img class="facility_icon  place_cart_icons" height="24"
                                       :src="getIconSrcById(icon.id)"
                                       contain></v-img>
                            </div>
                            <p class="mt-4">{{icon.name}}</p>
                        </div>
                    </div>

                    <div class="text-center mt-md-4 mt-lg-4 confirmation_title confirmation_reserve"
                         v-if="selectedPlaceForReserv">Удобства РМ
                    </div>
                    <div class="d-flex  mt-6 flex-wrap"
                         v-bind:class="{ 'justify-space-between': hasMorePlaceTags(3) }"
                         v-if="selectedPlaceForReserv">
                        <div class="reserve_comfort d-flex flex-column  align-center"
                             v-for="(icon, index) in selectedPlaceForReserv.tags"
                             :key="index"
                             v-bind:class="{ 'reserve_comfort_active': hasTagInSelectedTags(icon.id),
                              'mx-2': hasMorePlaceTags(2)}"
                        >
                            <div class="reserve_comfort_img_block d-flex align-center justify-center ">
                                <v-img class="place_cart_icons" height="24" :src="getIconSrcById(icon.id)"
                                       contain></v-img>
                            </div>
                            <p class="mt-4">{{icon.name}}</p>
                        </div>
                    </div>

                </v-card-text>
                <v-card-actions class="justify-center">
                    <v-btn
                            class="ma-2 reserve_btns"
                            outlined
                            color="primary"
                            @click="goBack()"
                            :disabled="!!bookingId"
                    >
                        Отменить
                    </v-btn>
                    <v-btn
                            class="reserve_btns"
                            depressed
                            color="primary"
                            :disabled="!!bookingId"
                            v-if="!extend"
                            @click="validate"
                    >
                        Подтвердить
                    </v-btn>

                    <v-btn
                            class="reserve_btns"
                            depressed
                            color="primary"
                            :disabled="!bookingId"
                            v-if="extend"
                            @click="extendBooking"
                    >
                        Продлить
                    </v-btn>
                </v-card-actions>
            </v-card>
        </div>
        <div class="map_block">
            <div class="confirmation_card_map mt-9 px-3 pt-xs-2 pt-md-2 pt-lg-2">
                <div class="text-center confirmation_title mb-4">Схема бронирования</div>

                <div ref="minimap_card" class="minimap_card">
                    <editor-plan
                            ref="minimap"
                            @setWorkplacePolygon="setWorkplacePolygon"/>
                </div>

            </div>
            <!--<v-card class=" mt-10 pt-xs-2">
                <v-card-text>

                </v-card-text>
                <v-card-actions class="justify-center ">

                    <v-btn
                            class="reserve_btns"
                            depressed
                            color="primary"
                            @click="validate"
                    >
                        Подтвердить
                    </v-btn>
                </v-card-actions>
            </v-card>-->
        </div>
        <snackbar :title='snackText' :snackColor="snackColor"
                  ref="snackbar"/>
        <loading :active.sync="isLoading"
                 :can-cancel="true"
                 :on-cancel="onCancel"
                 :is-full-page="fullPage"></loading>
    </div>
</template>

<script>
    import vSelect from 'vue-select'
    import {mapGetters, mapActions, mapMutations} from 'vuex'
    import datepicker from '../../helper/Datepicker'
    import timepicker from '../../helper/Timepicker'
    import EditorPlan from '../minimap/EditorPlan.vue'
    import snackbar from '../../helper/Snackbar/Snackbar.vue'
    import snackbarService from '../../helper/Snackbar/snackbarService'
    import {required} from 'vuelidate/lib/validators'
    import Loading from 'vue-loading-overlay';
    // Import stylesheet
    import 'vue-loading-overlay/dist/vue-loading.css';

    export default {
        name: "WorkplaceForm",
        components: {
            vSelect,
            datepicker,
            timepicker,
            EditorPlan,
            snackbar,
            Loading
        },
        validations: {
            booking: {
                id: {},
                user: {required},
                startTime: {required},
                endTime: {required},
                fromDate: {required},
                workplace: {required}
            }
        },
        data: () => ({
            snackText: '',
            snackColor: 'success',
            dialog: false,
            coffeeIcon: require('@/assets/img/coffee.svg'),
            conditionerIcon: require('@/assets/img/conditioner.svg'),
            boardIcon: require('@/assets/img/board.svg'),
            mapIcon: require('@/assets/img/map_canvas.svg'),
            selectedOffice: null,
            selectedFloor: null,
            booking: {
                user: null,
                startTime: null,
                endTime: null,
                fromDate: '',
                id: null,
                workplace: null
            },
            selectedDate: new Date().toISOString().substr(0, 10),
            selectedTags: [],
            isLoading: false,
            fullPage: true,
            bookingId: null,
            extend: false
        }),
        watch: {
            selectedFloor(floor) {
                if (floor) {
                    this.getWorkplaceImageByFloorId(floor.id)
                    this.getWorkplaces(floor.id)

                }
            }
        },
        computed: {
            ...mapGetters('auth', ['user']),
            ...mapGetters('booking', ['getOffices', 'getOfficesWithFloors', 'getOfficesByCityId', 'getTagsFromPlaces',
                'getFloorsByOfficeId', 'getFloorsWithPlace', 'getFloorPlan', 'selectedPlaceForReserv', 'getIconSrcById'])
        },
        async mounted() {
            await this.getUserOffice(this.user.id)
            await this.getTableData({url: `offices`, commit: 'setOffices'})
            await this.getAllFloors()
            this.booking.user = this.user
            this.setFormEdit(false)
            this.setTime(null, 'fromDate')
            if (this.$route.query.bookingId) {
                this.bookingId = parseInt(this.$route.query.bookingId)
                await this.prepareDataForEdit()
                this.setFormEdit(true)
            }
            if (this.$route.query.extend) {
                this.extend = this.$route.query.extend
                this.setFormEdit(true)
            }
        },
        destroyed() {
            this.setFloorsWithPlace(null)
            this.setSelectedPlaceForReserv(null)
        },
        methods: {
            ...mapActions('booking', ['getTableData', 'getFileData', 'updateTableItem']),
            ...mapMutations('booking', ['setSelectedPlaceForReserv', 'setHasSelectedTags', 'setFloorsWithPlace', 'setFormEdit']),
            ...mapMutations('auth', ['setUser']),
            onCancel() {
                console.log('User cancelled the loader.')
            },
            getUserOffice (userId) {
                this.getTableData({ url: `/offices/users/ids/${userId} ` })
                    .then(res => {
                        this.selectedOffice = res.data
                    })
            },
            compareTwoTime() {
                if (this.$refs.startTimeComponent && this.$refs.startTimeComponent.time && this.$refs.endTimeComponent.time) {
                    let startTime = this.$refs.startTimeComponent.time
                    let endTime = this.$refs.endTimeComponent.time
                    startTime = startTime.split(':')
                    endTime = endTime.split(':')
                    if (startTime[0] < endTime[0]) {
                        return false
                    }
                    if (startTime[0] === endTime[0] && endTime[1] - startTime[1] >= 30) {
                        return false
                    }
                    return true
                } else {
                    return false
                }
            },
            goBack() {
                this.$router.push('/control/dashboard')
            },
            addTagForReserv(tag) {
                const tagIndex = this.selectedTags.findIndex(item => item.id === tag.id)
                if (tagIndex === -1) {
                    this.selectedTags.push(tag)
                    this.setHasSelectedTags(true)
                } else {
                    this.selectedTags.splice(tagIndex, 1)
                }
                this.setSelectedTagState()
                this.$refs.minimap.createPolygonWithPlaces(this.floorWorkplaces, false)
            },
            setSelectedTagState() {
                if (this.selectedTags.length) {
                    this.floorWorkplaces.forEach(place => {
                        if (place.status === 'FREE') {
                            if (this.checkHasTagInPlace(place)) {
                                place.hasSelectedTag = true
                            } else {
                                place.hasSelectedTag = false
                            }
                        }
                    })
                } else {
                    this.floorWorkplaces.forEach(place => place.hasSelectedTag = false)
                    this.setHasSelectedTags(false)
                }
            },
            checkHasTagInPlace(place) {
                let tagsId = this.selectedTags.map(tag => tag.id)
                const placeTagsId = place.tags.map(tag => tag.id)
                return this.twoTagsIdEqual(tagsId, placeTagsId)
            },
            twoTagsIdEqual(arr1, arr2) {
                arr1 = arr1.sort((a, b) => a - b)
                arr2 = arr2.sort((a, b) => a - b)

                if (arr1.length > arr2.length) {
                    return false
                }

                for (let i = 0; i < arr1.length; i++) {
                    const index = arr2.findIndex(num => num === arr1[i])
                    if (index === -1) {
                        return false
                    }
                }

                return true
            },
            hasTagInSelectedTags(id) {
                if (this.selectedTags.length) {
                    return this.selectedTags.some(item => item.id === id)
                }
            },
            hasMoreTags(num) {
                if (this.getTagsFromPlaces.length >= num) {
                    return true
                }
            },
            hasMorePlaceTags(num) {
                if (this.selectedPlaceForReserv.tags.length >= num) {
                    return true
                }
            },
            getWorkplaceImageByFloorId(id) {
                this.getFileData({url: `files/${id}`, commit: 'setFloorPlan'})
                    .then(() => {
                        this.checkHasPlan()
                    }, () => {
                        snackbarService.cancelInline.call(this, 'В этот этаж не загружен карта')
                    })
            },
            checkHasPlan() {
                if (!this.getFloorPlan.size > 0) {
                    snackbarService.cancelInline.call(this, 'Нет карты')
                }
            },
            getAllFloors() {
                this.updateTableItem({
                    endpoint: `offices/floors`, commit: 'setFloors',
                    tableItem: {filters: []}, method: 'post'
                })
            },
            setFromDate(date) {
                this.selectedDate = date;
                if (new Date(date).getDate() === new Date().getDate()) {
                    this.$refs.endTimeComponent.setMinTime()
                    this.$refs.startTimeComponent.setMinTime()
                } else {
                    this.$refs.endTimeComponent.minTime = ''
                    this.$refs.startTimeComponent.minTime = ''
                }
                this.setTime(null, 'fromDate')
            },
            setTime(time, prop) {
                const date = new Date(this.selectedDate)
                if (time) {
                    time = time.split(':')
                    date.setHours(parseInt(time[0]) + 6)
                    date.setMinutes(time[1])
                }
                this.booking[prop] = date.toISOString()
                this.getWorkplacesByTime()
            },
            getWorkplacesByTime() {
                if (this.booking.startTime && this.booking.endTime && this.booking.fromDate && this.selectedFloor) {
                    let tableItem = Object.assign({}, this.booking)
                    tableItem.floorId = this.selectedFloor.id
                    tableItem.userId = this.booking.user.id
                    let endpoint = `bookings/workplaces`
                    let method = 'post'
                    let commit = 'setFloorsWithPlace'
                    this.updateTableItem({commit, endpoint, tableItem, method})
                        .then(() => {
                            this.setWorkplaceAndRenderPolygons()
                        })
                        .catch(err => console.log(err))
                }
            },
            setWorkplaceAndRenderPolygons() {
                this.floorWorkplaces = this.getFloorsWithPlace
                this.changeStatusSelectedPlace()
                this.$refs.minimap.createPolygonWithPlaces(this.floorWorkplaces, false)
            },
            changeStatusSelectedPlace() {
                if (this.bookingId) {
                    this.floorWorkplaces.forEach(place => {
                        if (place.id === this.selectedPlaceForReserv.id) {
                            place.status = 'SELECTED'
                        }
                    })
                    this.setFloorsWithPlace(this.floorWorkplaces)
                }
            },
            setStartTime(time) {
                this.$refs.endTimeComponent.minTime = time
                this.setTime(time, 'startTime')
            },
            setEndTime(time) {
                this.setTime(time, 'endTime')
            },
            setWorkplacePolygon(polygon) {
                console.log(polygon)
            },
            getWorkplaces(floorId) {
                if (!this.bookingId) {
                    this.getTableData({url: `offices/floors/ids/${floorId}/places?pageNumber=0&size=100`, commit: 'setFloorsWithPlace'})
                        .then(() => {
                            console.log(this.getTagsFromPlaces)
                            this.$refs.minimap.createPolygonWithPlaces([], false)
                        })
                }
            },
            extendBooking() {
                let tableItem = {}
                let endpoint = `bookings?renewals/ids/${this.booking.id}`
                let method = 'put'
                this.updateTableItem({endpoint, tableItem, method})
                    .then(() => {
                        snackbarService.saveInline.call(this, 'Успешно')
                        this.setSelectedPlaceForReserv(null)
                        this.$router.back()
                    })
                    .catch(err => console.log(err))
            },
            validate() {
                if (this.selectedPlaceForReserv) {
                    this.booking.workplace = this.selectedPlaceForReserv
                } else {
                    this.$v.booking.workplace.$touch()
                    this.checkHasPlan()
                }
                if (!this.$v.booking.$invalid && !this.compareTwoTime()) {
                    let tableItem = Object.assign({}, this.booking)
                    let endpoint = `bookings?isAdmin=true`
                    let method = this.booking.id ? 'put' : 'post'
                    this.updateTableItem({endpoint, tableItem, method})
                        .then(() => {
                            snackbarService.saveInline.call(this, 'Успешно')
                            this.setSelectedPlaceForReserv(null)
                            this.$router.back()
                        })
                        .catch(err => console.log(err))
                } else {
                    this.touchAllPlaceFields()
                }
            },
            touchAllPlaceFields() {
                this.$v.booking.user.$touch()
                this.$v.booking.fromDate.$touch()
                this.$v.booking.startTime.$touch()
                this.$v.booking.endTime.$touch()
                this.$v.booking.workplace.$touch()
            },
            prepareDataForEdit() {
                this.edited = true
                this.getTableData({url: `bookings/ids/${this.bookingId}`})
                    .then(res => {
                        this.booking = Object.assign(this.booking, res.data)
                        this.setUser(this.booking.user)
                        this.setSelectedPlaceForReserv(this.booking.workplace)
                        this.setSelectedOfficeByUser()
                        this.setSelectedFloorByFloorName()
                        this.setReservDataTime(res.data)
                    })
            },
            setSelectedOfficeByUser() {
                this.selectedOffice = this.booking.office
            },
            setSelectedFloorByFloorName() {
                const floors = this.getFloorsByOfficeId(this.selectedOffice)
                this.selectedFloor = floors.find(floor => floor.name === this.booking.floorName)
            },
            setReservDataTime(reservData) {
                if (reservData.fromDate) {
                    let fromDate = new Date(reservData.startTime)
                    //const fromTime = fromDate.setMonth(fromDate.getMonth())
                    //fromDate = new Date(fromTime)
                    this.selectedDate = fromDate.toISOString().substr(0, 10)
                    this.setTime(null, 'fromDate')
                }
                if (reservData.startTime) {
                    this.setReservTime('startTime', reservData)
                }
                if (reservData.endTime) {
                    this.setReservTime('endTime', reservData)
                }
            },
            setReservTime(field, reservData) {
                let startTime = new Date(reservData[field])
                startTime = `${startTime.getHours()}:${startTime.getMinutes()}`
                startTime = this.getCorrectTime(startTime)
                this.$refs[`${field}` + 'Component'].time = startTime
                this.setTime(startTime, field)
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
        }
    }
</script>

<style src="vue-select/dist/vue-select.css"></style>
<style scoped lang="scss">
    .form_block {
        width: 25%;
        height: 100%;
    }

    .error-messages {
        position: relative;
        top: -20px;
    }

    .form_container {
        div {
            width: 45%;
            .v-select {
                width: 100%;
            }
        }
    }

    @media screen and (max-width: 1445px) {
        .minimap_card {
            overflow-x: scroll;
            -webkit-overflow-scrolling: touch;
            white-space: nowrap;
        }
    }

    @media screen and (max-width: 900px) {
        .workplace_form {
            flex-direction: column !important;
            align-items: center !important;
            height: auto !important;
        }
        .form_block {
            height: auto;
            width: 90% !important;
        }
        .map_block {
            width: 90% !important;
            margin-bottom: 5vh;
        }

    }

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

    .confirmation_card {
        height: 100%;
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
            cursor: pointer;
            .facility_icon {
                filter: invert(60%) sepia(34%) saturate(3207%) hue-rotate(185deg) brightness(80%) contrast(100%)
            }
        }

        .reserve_comfort_active {
            .facility_icon {
                filter: invert(60%) sepia(34%) saturate(3207%) hue-rotate(300deg) brightness(80%) contrast(100%)
            }
            p {
                color: #9ba2ac;
            }
        }

        .reserve_comfort:hover {
            p {
                color: #86888c;
            }
            .facility_icon {
                filter: invert(60%) sepia(34%) saturate(3207%) hue-rotate(111deg) brightness(80%) contrast(100%)
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

    .confirmation_card_map {
        @extend .confirmation_card;
        box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 2px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%);
        border-radius: 4px;

    }

    .v-select {
        width: 100%;
    }

    .map_block {
        width: 70%;
        height: 100%;
    }

    .workplace_form {
        height: 90%;
    }

</style>
