<template>
    <v-menu
            ref="menu"
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="time"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-text-field
                    v-model="time"
                    :label="label"
                    prepend-icon="mdi-clock-time-four-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :disabled="disabled"
            ></v-text-field>
        </template>
        <v-time-picker
                v-if="menu2"
                v-model="time"
                format="24hr"
                :allowed-minutes="allowedStep"
                full-width
                :min="minTime"
                :max="maxTime"
                @click:minute="close(time)"
        ></v-time-picker>
    </v-menu>
</template>

<script>
    export default {
        name: "Timepicker",
        props: ['label', 'disabled'],
        data: () => ({
            time: null,
            menu2: false,
            maxTime: '',
            minTime: new Date().getHours() + ':' + new Date().getMinutes(),
        }),
        created() {

            },
        methods: {
            close(time) {
                this.$emit('setTime', time)
                this.$refs.menu.save(time)
                this.menu2 = false
            },
            allowedStep: m => m % 15 === 0,
            setMinTime(){
                this.minTime = new Date().getHours() + ':' + new Date().getMinutes()
            }
        }
    }
</script>

<style scoped>

</style>
