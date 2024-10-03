const mapService = {
    getPlaceByCoords(places, placeCoords) {
        let placeIndex
        var BreakException = {}
        let workPlaces = Array.from(places)
        try {
            workPlaces.forEach((place, index) => {
                if (place.coordinates) {
                    const coords = typeof(place.coordinates) === 'string' ? JSON.parse(place.coordinates) : place.coordinates
                    if (coords.length === placeCoords.length) {
                        if (coords.find((p, ind) => p.x === placeCoords[ind].x && p.y === placeCoords[ind].y)) {
                            placeIndex = index
                            throw BreakException
                        }
                    }
                }
            })
        } catch (e) {
            if (e !== BreakException) throw e
        }
        return placeIndex
    },
    showTooltipForPolygon(opt, text) {
        this.polygonTooltipTop = opt.e.pageY - 30
        this.polygonTooltipLeft = opt.e.pageX - 300
        this.polygonTooltipText = text
        this.polygonTooltip = true
        setTimeout(() => this.polygonTooltip = false, 3000)
    },
    paintSelectedPolygon(self, opt) {
        if (!self.formEdit) {
            let point = self.design.getPointer(opt.e)
            point = [point.x, point.y]
            const polygons = this.objPointsToArr(self.design.getObjects())
            polygons.forEach((polygon, index) => {
                if (this.inside(point, polygon.pointsInArray)) {
                    if (self.getHasSelectedTags && polygon.hasSelectedTag || !self.getHasSelectedTags) {
                        this.setDefaultFillInPolygons(self.design.getObjects(), self)
                        const selectedPlaceIndex = this.getPlaceByCoords(self.floorsWithPlace, polygon.points)
                        self.setSelectedPlaceIndex(selectedPlaceIndex)
                        this.showTooltipForPolygon.call(self, opt, self.floorsWithPlace[selectedPlaceIndex].name)
                        const polygonData = {
                            polygons: polygons,
                            polygon: polygon,
                            index: index,
                            selectedPlaceIndex: selectedPlaceIndex
                        }
                        this.setFillInSelectedPolygon(self, polygonData)
                    } else {
                        self.showErrorWorlplaceUnavailable()
                    }
                }
            })
        }
    },
    setFillInSelectedPolygon(self, data) {
        const status = self.floorsWithPlace[data.selectedPlaceIndex].status
        if (status === 'FREE' || status === 'SELECTED') {
            self.setSelectedPlaceForReserv(self.floorsWithPlace[data.selectedPlaceIndex])
            data.polygons[data.index].set('fill', '#ff43ca')
            self.design.renderAll()
        } else {
            self.showErrorWorlplaceInactive()
        }
    },
    setDefaultFillInPolygons(polygons, self) {
        return new Promise((resolve) => {
            polygons.forEach(polygon => {
                polygon.set('fill', this.getFillByPlaceStatus(polygon))
            })
            self.design.renderAll()
            resolve()
        })
    },
    getFillByPlaceStatus(polygon) {
        let result = '#60e23c'
        if (polygon.hasSelectedTag) {
            result = '#5069ff'
            return result
        }
        switch (polygon.status) {
            case 'FREE':
                result = '#60e23c'
                break
            case 'INACTIVE':
            case 'UNAVAILABLE':
                result = '#aaa8ac'
                break
            case 'BUSY':
                result = '#ff1e1c'
                break
        }
        return result
    },
    objPointsToArr(polygons) {
        polygons.forEach(pol => {
            pol.pointsInArray = pol.points.map(p => Object.values(p))
        })
        return polygons
    },
    inside(point, vs) {
        // ray-casting algorithm based on
        // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

        var x = point[0], y = point[1]

        var inside = false
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i][0], yi = vs[i][1]
            var xj = vs[j][0], yj = vs[j][1]

            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
            if (intersect) inside = !inside
        }
        return inside
    }

}
export default mapService
