// https://vuex.vuejs.org/en/actions.html
import axios from 'axios'

// The login action passes vuex commit helper that we will use to trigger mutations.
export default {
    loginInAction({commit}, userData) {
        return new Promise((resolve, reject) => {
            commit('auth_request')
            axios.post('security/users/login', {email: userData.email, password: userData.password})
                .then(response => {
                    const token = response.data.token
                    const user = response.data
                    // storing jwt in localStorage. https cookie is safer place to store
                    localStorage.setItem('token', token)
                    localStorage.setItem('user', JSON.stringify(user))
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
                    // mutation to change state properties to the values passed along
                    commit('auth_success', {token, user})
                    resolve(response)
                })
                .catch(err => {
                    commit('auth_error')
                    localStorage.removeItem('token')
                    reject(err)
                })
        })
    },
    checkEmail({commit}, email) {
        return new Promise((resolve, reject) => {
            axios.get('security/users/check/' + email)
                .then(response => {
                    // mutation to change state properties to the values passed along
                    const result = response.data.isEmployee
                    commit('user_status', result)
                    resolve(response)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    register({commit}, userData) {
        return new Promise((resolve, reject) => {
            axios.post('security/users/registration', userData)
                .then(response => {
                    // mutation to change state properties to the values passed along
                    console.log(commit)
                    resolve(response)
                })
                .catch(err => {
                    reject(err)
                })
        })
    },
    logoutInAction({commit}) {
        return new Promise((resolve) => {
            commit('logout')
            localStorage.removeItem('token')
            delete axios.defaults.headers.common['Authorization']
            resolve()
        })
    },
    refreshtoken({commit}) {
        axios.get('/refresh')
            .then(response => {
                const token = response.data.access_token
                localStorage.setItem('token', token)
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
                commit('auth_success', {token})
            })
            .catch(error => {
                commit('logout')
                localStorage.removeItem('token')
                console.log(error)
            })
    },
    getTableList({commit}, tableName) {
        axios.get(`${tableName}`)
            .then(response => {
                let tableList = response.data.Keys
                commit('setTableList', {tableList})
            })
            .catch(error => console.log(error))
    }
}
