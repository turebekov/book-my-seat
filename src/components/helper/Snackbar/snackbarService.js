const snackbarService = {
    saveInline (message = '') {
        this.$refs.snackbar.snackbar = true
        this.snackColor = 'success'
        this.snackText = message || 'Данные успешно сохранены'
    },
    cancelInline (message = '') {
        this.$refs.snackbar.snackbar = true
        this.snackColor = 'error'
        this.snackText = message || 'Отмена'
    },
    reset () {
        this.$refs.snackbar.snackbar = true
        this.snackColor = 'success'
        this.snackText = 'Data reset to default'
    },
    openInline () {
        this.$refs.snackbar.snackbar = true
        this.snackColor = 'info'
        this.snackText = 'Dialog opened'
    },
    closeInline () {
        console.log('Dialog closed')
    }
}
export default snackbarService
