<template>
    <div class="text-center">
        <v-snackbar
                v-model="snackbar"
                :timeout="timeout"
                :color="snackColor"
                :top="true"
        >
            {{ title }}
            <v-btn
                    light
                    text
                    @click="snackbar = false"
            >
                Закрыть
            </v-btn>
        </v-snackbar>
    </div>
</template>


<script>
    export default {
        name: "snackbar",
        props: ['title', 'snackColor'],
        data: () => ({
            snackbar: false,
            color: 'general',
            text: 'My timeout is set to 2000.',
            timeout: 5000
        })
    }
</script>

<style scoped>

</style>
