<template>
    <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
    >
        <template v-slot:activator="{ on, attrs }">
            <v-text-field
                    v-model="date"
                    :label="label"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    :disabled="disabled"
                    v-on="on"
            ></v-text-field>
        </template>
        <v-date-picker
                v-model="date"
                @input="close(date)"
                :min="minDate"
                max="2022-03-20"
        ></v-date-picker>
    </v-menu>
</template>

<script>
    export default {
        name: "Datepicker",
        props: ['label', 'disabled'],
        data: () => ({
            date: new Date().toISOString().substr(0, 10),
            menu: false,
            minDate:  new Date().toISOString().slice(0, 10)
        }),
        methods: {
            close(date) {
                this.$emit("setDate", date)
                this.menu = false;
            }
        }
    }
</script>

<style scoped>

</style>
