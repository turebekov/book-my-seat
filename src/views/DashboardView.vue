<template>
    <v-app
            id="dashboard-view"
            light>
        <app-header></app-header>
        <v-main>
            <v-fade-transition mode="out-in">
                <router-view/>
            </v-fade-transition>
        </v-main>


    </v-app>
</template>

<script>
    import appHeader from './Header.vue'
    export default {
        name: 'DashboardView',
        components: {
            'app-header': appHeader
        }
    }
</script>

<style>

</style>
