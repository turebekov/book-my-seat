export default {
    data: function () {
        return {
            donutPeriods: [
                { active: true, title: 'Сегодня', type: 'day', val: null },
                { active: false, title: 'За неделю', type: 'week', val: null },
                { active: false, title: 'За месяц', type: 'month', val: null },
                { active: false, title: 'За  год', type: 'year', val: null },
                { active: false, title: 'За все время', type: 'all', val: null }
            ]
        }
    },
    created: function () {
        this.hello()
    },
    methods: {
        hello: function () {
            console.log('привет из примеси!')
        },
        changeDonutPeriodValue (period, index) {
            this.donutPeriods.forEach(item => {
                item.active = false
            })
            this.donutPeriods[index].active = true
            this.setPeriodValueByType(period)
            this.getGendersByTime()
        },
        setPeriodValueByType (period) {
            if (period.type === 'all') {
                period.value = null
                return null
            }
            let periodVal = {
                endTime: this.getEndTime(),
                startTime: this.getStartTimeByType(period)
            }
            period.value = periodVal
        },
        getEndTime () {
            let endTime = new Date()
            endTime.setHours(endTime.getHours() + 6)
            return endTime
        },
        getStartTimeByType (period) {
            let start = new Date()
            if (period.type === 'day') {
                start.setHours(6)
                start.setMinutes(0)
                return start
            }
            if (period.type === 'week') {
                start.setDate(start.getDate() - 7)
                start.setMinutes(0)
                return start
            }
            if (period.type === 'month') {
                const startMonth = start.getMonth()
                start.setMonth(startMonth - 1)
                return start
            }
            if (period.type === 'year') {
                const startYear = start.getFullYear()
                start.setFullYear(startYear - 1)
                return start
            }
        }
    }
}
