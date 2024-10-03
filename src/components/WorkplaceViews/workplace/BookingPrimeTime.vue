<template>
    <v-card
            class="statistic_card"
            elevation="2"
            id="statisticCard"
    >
        <div>
            <div class="statistic_card_title d-flex flex-wrap justify-space-between align-center">
                <v-card-title>Прайм тайм по бронированию</v-card-title>
                <div class="statistic_card_select_content">
                    <v-select
                            :options="donutPeriods"
                            filled
                            v-model="period"
                            :placeholder="'Период'"
                            label="title"
                            @input="onChangePeriod()">
                    </v-select>
                </div>

            </div>
            <div id="chart">
                <apexchart type="bar" :width="statisticCardWidth" height="150" :options="chartOptions"
                           :series="series"></apexchart>
            </div>
            <p class="ml-2 chart_title">*Количество бронирований во временном промежутке</p>
        </div>

    </v-card>
</template>

<script>
    import statisticsMixin from '@/mixins/statistics.mixin'
    import vSelect from 'vue-select'
    import {mapActions} from 'vuex'

    export default {
        name: "BookingPrimeTime",
        components: {
            'vSelect': vSelect
        },
        mixins: [statisticsMixin],
        data() {
            return {
                period: {active: true, title: 'Сегодня', type: 'day', val: null},
                series: [
                    {
                        name: '08:00 - 10:00',
                        data: [44],
                    }, {
                        name: '11:00 - 13:00',
                        data: [53],
                    }, {
                        name: '14:00 - 16:00',
                        data: [12],
                    }, {
                        name: '17:00 - 19:00',
                        data: [9],
                    }, {
                        name: '20:00 - 24:00',
                        data: [25],
                    }],
                chartOptions: {
                    chart: {
                        type: 'bar',
                        height: 350,
                        stacked: true,
                        toolbar: {
                            show: false
                        }
                    },
                    colors: ['#7459D9', '#FF8373', '#33D69F', '#55D8FE', '#FFD600', '#114471'],
                    plotOptions: {
                        bar: {
                            horizontal: true,
                        },
                    },
                    stroke: {
                        width: 1,
                        colors: ['#fff']
                    },
                    xaxis: {
                        categories: [''],
                        labels: {
                            show: false
                        }
                    },
                    yaxis: {
                        title: {
                            text: undefined
                        },
                    },
                    tooltip: {
                        y: {
                            formatter: function (val) {
                                return val
                            }
                        }
                    },
                    fill: {
                        opacity: 1
                    },
                    legend: {
                        position: 'bottom',
                        horizontalAlign: 'left',
                        offsetX: 40
                    }
                },
                statisticCardWidth: 1000
            }
        },
        mounted() {
            this.setPeriodValueByType(this.donutPeriods[0], 0)
            this.getGendersByTime()
            this.$nextTick(() => {
                window.addEventListener('resize', this.onResize);
            })
            this.onResize()
        },
        methods: {
            ...mapActions('booking', ['getTableData', 'updateTableItem']),
            onResize() {
                this.statisticCardWidth = document.getElementById("statisticCard").offsetWidth
                console.log(this.statisticCardWidth)
            },
            onChangePeriod() {
                const index = this.donutPeriods.findIndex(period => period.type === this.period.type)
                this.changeDonutPeriodValue(this.period, index)
            },
            getGendersByTime() {
                let tableItem = Object.assign({}, this.getActivePeriodValue())
                this.updateTableItem({
                    endpoint: `statistics/bookings/top/time`, commit: null,
                    tableItem: tableItem, method: 'post'
                }).then((res) => {
                    if (res.data) {
                        res.data.forEach((time) => {
                            //if (index <= 4) {
                                time.data = [time.count]

                            //}
                        })
                        this.series = res.data
                    }
                })
            },
            getActivePeriodValue() {
                const period = this.donutPeriods.find(period => period.active === true)
                if (period) {
                    return period.value
                }
            }
        }
    }
</script>


<style src="vue-select/dist/vue-select.css"></style>
<style scoped lang="scss">
    .statistic_card {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .statistic_card_title {
            font-style: normal;
            font-weight: normal;
            font-size: 18px;
            line-height: 24px;
            /* identical to box height */
            color: #4D4F5C;
            width: 99%;
        }
    }

    .statistic_card_select_content {
        width: 30%;
    }

    @media screen and (max-width: 600px){
        .statistic_card_select_content{
            margin-left: 10%;
            width: 80%;
        }
        .statistic_card{
            margin-top: 2vh;
        }
    }

    .v-select {
        width: 100%;
    }

    .chart_title {
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 19px;
        /* identical to box height */
        color: #4D4F5C;
    }

    .apexchart_time {
        width: 100%;
    }
</style>
