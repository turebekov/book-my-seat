<template>
    <div>
        <!---->
        <v-dialog v-model="dialog" class="map_dialog" transition="dialog-bottom-transition" max-width="100vh">


            <v-card height="92%">
                <v-card-text>
                    <!--<div class="mapouter">
                        <div class="gmap_canvas">
                            <iframe
                                    id="gmap_canvas"
                                    width="100%"
                                    height="100%"
                                    src="https://maps.google.com/maps?q=google&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                    frameborder="0"
                                    scrolling="no"
                                    marginheight="0"
                                    marginwidth="0"
                            />
                        </div>
                    </div>-->

                    <div class="mapouter">
                        <app-yandexMap ref="map"
                                       :coords="coords"
                                       :zoom="15"
                        >
                            <app-ymapMarker
                                    :coords="pointCoords"
                                    marker-id="123"
                                    hint-content="Ваше здание"
                            />
                        </app-yandexMap>
                    </div>

                </v-card-text>

                <v-card-actions>
                    <span class="not_small_screen">Для определения Вашего местоположения нажмите на
                        <v-btn  elevation="2"
                                icon
                                small
                                tile
                                class="text-center"
                        ><v-img  :src="location" height="14" contain></v-img></v-btn> на карте</span>
                    <v-spacer/>
                    <v-btn color="blue darken-1" text @click="close()">Отмена</v-btn>
                    <v-btn color="blue darken-1" text @click="confirmLocation">Подтвердить</v-btn>
                </v-card-actions>
                <span class="small_screen">Для определения Вашего местоположения нажмите на
                        <v-btn  elevation="2"
                                icon
                                small
                                tile
                                class="text-center"
                        ><v-img  :src="location" height="14" contain></v-img></v-btn> на карте</span>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>

    import {yandexMap, ymapMarker} from 'vue-yandex-maps'
    //import {ymaps} from 'vue-yandex-maps'

    export default {
        name: "ConfirmationMap",
        components: {
            'app-yandexMap': yandexMap,
            'app-ymapMarker': ymapMarker
        },
        props: ['officeCoords', 'confirm', 'booking'],
        data: () => ({
            location: require('@/assets/img/location.svg'),
            dialog: false,
            map: null,
            coords: [
                43.2402965631789, 76.93985496934185
            ],
            pointCoords: [],
            eventSettedOnLocation: false,
            geoLocation: []
        }),
        watch: {
            dialog(val) {
                val || this.close()
            }
        },
        methods: {
            close() {
                this.dialog = false;
                this.$parent.showMap = false;
            },
            confirmLocation() {
                const result = this.distance(this.geoLocation[0], this.geoLocation[1], this.pointCoords[0], this.pointCoords[1])
                if (result <= 200) {
                    this.confirm(this.booking, 1)
                    this.close()
                } else {
                    alert('Ваше местоположение не совпадает с местоположением офиса, бронь не состоялась.' +
                        'Подтвердите свое местоположение через мобильную версию приложения')
                    this.close()
                }
            },
            setPoint(e) {
                console.log(e.get('coords'));
                this.pointCoords = e.get('coords');
            },
            setOfficePoint() {
                this.pointCoords = this.officeCoords;
            },
            setEventOnLocationChange() {
                if (this.$refs.map && !this.eventSettedOnLocation && this.$refs.map.myMap) {
                    if (this.$refs.map.myMap.controls) {
                        var geolocationControl = this.$refs.map.myMap.controls.get('geolocationControl');
                        this.eventSettedOnLocation = true;
                        this.getUserLocation()
                        geolocationControl.events.add('locationchange',  (event) => {
                            this.eventSettedOnLocation = false
                            var position = event.get('position');
                            this.geoLocation = position
                        });
                    }
                }
                if (!this.eventSettedOnLocation) {
                    setTimeout(() => {
                        this.setEventOnLocationChange();
                    }, 1000)
                }
            },
            getUserLocation() {
                document.getElementsByClassName('ymaps-2-1-78-float-button ymaps-2-1-78-_hidden-text')[0].click()
            },
            distance(lat1, lng1, lat2, lng2) {
                let earthRadius = 6378137;

                let dLat = this.degreesToRadians(lat2 - lat1);
                let dLng = this.degreesToRadians(lng2 - lng1);
                let sindLat = Math.sin(dLat / 2);
                let sindLng = Math.sin(dLng / 2);

                let a = Math.pow(sindLat, 2) + Math.pow(sindLng, 2)
                    * Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2));
                let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                let dist = earthRadius * c;

                return dist;
            },
            degreesToRadians(deg) {
                return deg * (Math.PI / 180.0);
            },
        },
        beforeMount() {
            this.setOfficePoint();
        }
    }
</script>

<style lang="scss">
    .mapouter {
        text-align: right;
        height: 75vh;
        width: 100%;
        padding-top: 10px;
    }

    .ymap-container {
        height: 100%;
    }

    .gmap_canvas {
        overflow: hidden;
        background: none !important;
        height: 100%;
        width: 100%;
    }
    @media screen and (max-width: 600px) {
        .not_small_screen {
            display: none;
        }
        .small_screen {
            font-size: 12px;
            display: block !important;
            text-align: center;
            margin-top: -10px;
        }
    }

    .small_screen {
        display: none;
    }
</style>
