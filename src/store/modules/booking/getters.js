export default {
    getOffices(state) {
        return state.offices
    },
    getOfficesWithFloors(state) {
        return state.offices.filter(office => office.floorsDTO.length > 0)
    },
    getOfficesByCityId: state => id => {
        return state.offices.filter(office => office.cityId === id);
    },
    getIconSrcById: state => id => {
        const result = state.tags.find(icon => icon.id === id);
        if (result && result.image) {
            return result.image
        }
    },
    getFloorsByOfficeId: state => item => {
        if (item) {
            const result = state.offices.find(office => office.id === item.id);
            if (result) {
                return result.floorsDTO;

            }
        }
    },
    getCities(state) {
        return state.cities
    },
    getCityById: state => id => {
        return state.cities.find(city => city.id === id)
    },
    getStateOfficeInForm(state) {
        return state.hasOfficeInForm
    },
    getFloorsWithPlace(state) {
        return state.floorsWithPlace
    },
    getTagsFromPlaces: state => {
        let result = []
        if (state.floorsWithPlace) {
            let tags = state.floorsWithPlace.filter(place => place.status === 'FREE').map(place => place.tags);
            tags = tags.reduce((a, b) => a.concat(b), []);
            const tagsId = [...new Set(tags.map(item => item.id))];
            tagsId.forEach(id => {
                result.push(tags.find(tag => tag.id === id))
            })
        }
        return result
    },
    getSelectedPlaces(state) {
        return state.selectedPlaces;
    },
    getFloors(state) {
        return state.floorList;
    },
    getFloorPlan(state) {
        return state.floorPlan
    },
    getFloor(state) {
        return state.floor
    },
    getFormEdit(state) {
        return state.formEdit
    },
    getTags(state) {
        return state.tags;
    },
    getBookings: state => {
        const user = JSON.parse(localStorage.user)
        return state.bookings.filter(booking => booking.user.id === user.id)
    },
    selectedPlaceForReserv: state => state.selectedPlaceForReserv,
    getHasSelectedTags: state => state.hasSelectedTags
}
