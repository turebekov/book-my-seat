<template>
    <div class="d-flex flex-column align-center minimap" ref="minimap">
        <div class="map-controls">
            <v-btn
                    depressed
                    color="error"
                    class="remove"
                    @click="cancelDraw"
                    v-if="polygonMode"
            >
                Перерисовать
            </v-btn>
        </div>
        <div class="d-flex flex-column not_small_screen zoom_control">
            <v-btn
                    color="primary"
                    icon
                    tile
                    @click="zoomToPoint(125)"
            >
                <v-icon center>
                    mdi-plus-box
                </v-icon>
            </v-btn>
            <v-btn
                    color="primary"
                    icon
                    tile
                    @click="zoomToPoint(-125)"
            >
                <v-icon center>
                    mdi-minus-box
                </v-icon>
            </v-btn>
        </div>

        <canvas id="design" ref="can" width="1000" height="600"></canvas>

        <transition name="fade">
            <div class="polygon_tooltip" :style="{ top: polygonTooltipTop + 'px', left: polygonTooltipLeft + 'px' }"
                 ref="polygonTooltip" v-if="polygonTooltip">
                <p>{{polygonTooltipText}}</p>
            </div>
        </transition>

        <snackbar :title='snackText' :snackColor="snackColor"
                  ref="snackbar"/>
    </div>
</template>

<script>
    import {fabric} from 'fabric'
    import mapControlsService from '@/services/mapControlsService'
    import mapZoomService from '@/services/mapZoomService'
    import mapService from '@/services/mapService'
    import {mapGetters, mapState, mapActions, mapMutations} from 'vuex'
    import snackbar from '../../helper/Snackbar/Snackbar.vue'
    import snackbarService from '../../helper/Snackbar/snackbarService'

    export default {
        name: 'EditorPlan',
        components: {
            snackbar
        },
        data: () => ({
            design: null,
            minimap: null,
            pointArray: [],
            lineArray: [],
            polygonMode: false,
            activeLine: null,
            min: 99,
            max: 999999,
            activeShape: false,
            panning: false,
            imgWidth: null,
            imgHeight: null,
            polygonTooltip: false,
            polygonTooltipTop: 100,
            polygonTooltipLeft: 100,
            polygonTooltipText: '',
            snackText: '',
            snackColor: 'success',
            previousTouch: null
        }),
        computed: {
            ...mapGetters('booking', ['getFloorPlan', 'getHasSelectedTags']),
            ...mapState('booking', ['floorPlan', 'formEdit', 'floorsWithPlace'])
        },
        watch: {
            floorPlan: function (data) {
                this.setFloorImageToCanvas(data)
            },
        },
        mounted: function () {
            this.design = new fabric.Canvas('design', {
                containerClass: 'design',
                allowTouchScrolling: true
            })
            this.minimap = new fabric.Canvas('minimap', {
                containerClass: 'minimap',
                allowTouchScrolling: true,
                selection: false
            })
            fabric.Object.prototype.transparentCorners = false
            this.initMinimap()
            //this.changeMapWidthByElementScreen()

            this.design.on('mouse:down', (e) => this.eventMouseDown(e))
            this.design.on('mouse:wheel', (e) => this.eventMouseWheel(e))
            this.design.on('mouse:move', (e) => this.eventMouseMove(e))
            this.design.on('mouse:up', (e) => this.eventMouseUp(e))
        },
        methods: {
            ...mapActions('booking', ['setNewValueInState']),
            ...mapMutations('booking', ['setSelectedPlaceForReserv', 'setSelectedPlaceIndex']),
            async createPolygonWithPlaces(floorWorkplaces, evented = true) {
                this.design.remove(...this.design.getObjects())
                //this.$refs.can.style["width"] = `1000px`
                await floorWorkplaces.forEach((place) => {
                    if (place.coordinates) {
                        mapControlsService.generatePolygonWithPoints(this, place, evented)
                    }
                })
                //await this.changeMapWidthByElementScreen()
            },
            changeMapWidthByElementScreen() {
                const width = this.$refs.minimap.offsetWidth
                this.$refs.can.style["width"] = `${width}px`
            },
            addCoordsToWorkplace(coords) {
                this.$emit('setWorkplacePolygon', JSON.stringify(coords))
            },
            updateMiniMap() {
                this.minimap.requestRenderAll()
            },
            initMinimap() {
                this.minimap.backgroundColor = 'white'
                this.minimap.requestRenderAll()
                var minimapView = new fabric.Rect({
                    fill: 'rgba(0, 0, 255, 0.3)',
                    cornerSize: 6,
                    transparentCorners: false,
                    cornerColor: 'blue',
                    strokeWidth: 0
                })
                minimapView.controls = {
                    br: fabric.Object.prototype.controls.br
                }
                this.minimap.add(minimapView)
            },
            eventMouseDown(opt) {
                if (!this.polygonMode) {
                    mapService.paintSelectedPolygon(this, opt)
                }
                /*if (opt.target && opt.target.type === 'polygon') {
                    mapService.showTooltipForPolygon.call(this, opt)
                }*/
                this.panning = true
            },
            eventMouseWheel(opt) {
                mapZoomService._onMouseWheel.call(this, opt)
            },
            zoomToPoint(delta) {
                var zoom = this.design.getZoom();
                zoom = zoom + delta / 200;
                if (zoom > 20)
                    zoom = 20;
                if (zoom < 1)
                    zoom = 1;
                this.design.zoomToPoint({x: 500, y: 250}, zoom);
            },
            eventMouseMove(opt) {
                var e = opt.e

                if (this.panning && e) {
                    let delta = 0;

                    if (e.touches) {
                        const touch = e.touches[0];

                        if (this.previousTouch) {
                            // be aware that these only store the movement of the first touch in the touches array
                            e.movementX = Math.floor(touch.pageX - this.previousTouch.pageX);
                            e.movementY = Math.floor(touch.pageY - this.previousTouch.pageY);
                        }
                        this.previousTouch = touch;
                    }
                    if (e.movementX !== undefined && e.movementY !== undefined) {
                        delta = new fabric.Point(e.movementX, e.movementY)
                    }
                    if (delta)
                        this.design.relativePan(delta);
                }
                this.design.renderAll()
            },
            eventMouseUp() {
                this.panning = false
                this.previousTouch = null
            },
            setFloorImageToCanvas(data) {
                if (data instanceof Blob && data.size) {
                    var img = new Image()
                    var reader = new FileReader()
                    reader.onloadend = () => {
                        img.src = reader.result
                        const image = new fabric.Image(img)
                        if (image.width) {
                            this.design.setBackgroundImage(image, this.design.renderAll.bind(this.design), {
                                scaleX: this.design.width / image.width,
                                scaleY: this.design.height / image.height
                            })
                            this.imgWidth = image.width * image.scaleX
                            this.imgHeight = image.height * image.scaleY
                            return null
                        } else {
                            this.setFloorImageToCanvas(data)
                        }
                    }
                    if (data) {
                        reader.readAsDataURL(data)
                    }
                }
            },
            showErrorWorlplaceInactive() {
                snackbarService.cancelInline.call(this, 'Рабочее место неактивное')
            },
            showErrorWorlplaceUnavailable() {
                snackbarService.cancelInline.call(this, 'Это рабочее место не содержит указанных удобств')
            }
        }
    }
</script>

<style scoped lang="scss">
    .zoom_control {
        position: absolute;
        right: 4vh;
        z-index: 10000;
        bottom: 5vh;
        background: #fff;
    }

    .minimap {
        width: 100%;
    }

    .map-controls {
        .remove {
            width: 14vh;
        }
    }

    .flex-column {
        display: flex;
        justify-content: center;
        justify-items: center;
        flex-direction: column;
    }

    .polygon_tooltip {
        position: absolute;
        left: 12px;
        background: rgba(145, 138, 138, 0.57);
        border-radius: 5px;
        color: rgb(255, 255, 255);
        padding: 0 10px;
        text-transform: capitalize;
        p {
            margin: 0 !important;
        }
    }

    canvas {
        border: 2px solid #e3f2fd;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }

    @media screen and (min-width: 600px) {
        .not_small_screen {
            display: none !important;
        }
    }
</style>
