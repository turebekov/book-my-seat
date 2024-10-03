// https://vuex.vuejs.org/en/actions.html
import axios from 'axios'

// The login action passes vuex commit helper that we will use to trigger mutations.
export default {
    updateTableItem ({ commit }, tableData) {
        return new Promise((resolve, reject) => {
            let httpmethod = tableData.method
            axios({ url: `/${tableData.endpoint}`, method: httpmethod, data: tableData.tableItem })
                .then(response => {
                    if (tableData.commit) {
                        commit(tableData.commit, response.data.content || response.data)
                    }
                    resolve(response)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    getTableData ({ commit }, data) {
        return new Promise((resolve, reject) => {
            axios.get(data.url, data.filters || null)
                .then(response => {
                    if (data.commit) {
                        commit(data.commit, response.data.content || response.data)
                    }
                    resolve(response)
                })
                .catch(err => {
                    console.log('office error')
                    reject(err)
                })
        })
    },
    getFileData ({ commit }, data) {
        return new Promise((resolve, reject) => {
            const config = { responseType: 'blob' }
            axios.get(data.url, config)
                .then(response => {
                    commit('setFloorPlan', response.data)
                    resolve(response)
                })
                .catch(err => {
                    console.log('office error')
                    reject(err)
                })
        })
    },
    setNewValueInState ({ commit }, data) {
        return new Promise(resolve => {
            commit(data.commit, data.val)
            resolve(true)
        })
    }
}
