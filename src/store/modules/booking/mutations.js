import { set } from '@/utils/vuex'

export default {
    setOffices (state, offices) {
        state.offices = offices
    },
    setCities (state, offices) {
        state.cities = offices
    },
    setOfficeStateInForm (state, value) {
        state.hasOfficeInForm = value
    },
    setFloorsWithPlace (state, floor) {
        state.floorsWithPlace = floor
    },
    setFloor (state, floor) {
        state.floor = floor
    },
    setFloors (state, floors) {
        state.floorList = floors
    },
    setFloorPlan (state, plan) {
        state.floorPlan = plan
    },
    setFormEdit (state, value) {
        state.formEdit = value
    },
    setSelectedPlaces (state, value) {
        state.selectedPlaces = value
    },
    setTags (state, tags) {
        state.tags = tags
    },
    setSelectedPlaceForReserv: set('selectedPlaceForReserv'),
    setSelectedPlaceIndex: set('selectedPlaceIndex'),
    setBookings: set('bookings'),
    setHasSelectedTags: set('hasSelectedTags')
}
