import { fabric } from 'fabric'
const mapControlsService = {
    generatePolygon (pointArray) {
        var points = new Array()
        pointArray.forEach((point) => {
            points.push({
                x: point.left,
                y: point.top
            })
        })
        var polygon = new fabric.Polygon(points, {
            stroke: '#333333',
            strokeWidth: 0.5,
            fill: '#60e23c',
            opacity: 1,
            hasBorders: false,
            hasControls: false
        })
        this.design.add(polygon)
        this.addCoordsToWorkplace(points)
    },
    generatePolygonWithPoints (self, place, evented) {
        const points = JSON.parse(place.coordinates)
        let fill = this.getFillByPlaceStatus(place.status)
        if (place.hasSelectedTag){
            fill = '#5069ff'
        }
        var polygon = new fabric.Polygon(points, {
            stroke: '#333333',
            strokeWidth: 0.5,
            text: place.name,
            status: place.status,
            selectable: false,
            fill: fill,
            opacity: 1,
            hasBorders: false,
            hasControls: false,
            evented: evented,
            hasSelectedTag: place.hasSelectedTag
        })

        self.design.add(polygon)
        self.design.selection = true
        self.design.renderAll()
    },
    getFillByPlaceStatus (status) {
        let result = '#60e23c'
        switch (status) {
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
            case 'SELECTED':
                result = '#ff43ca'
                break
        }
        return result
    }

}
export default mapControlsService
