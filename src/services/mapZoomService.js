const mapZoomService = {
    _onMouseWheel(opt) {
        var delta = opt.e.deltaY;
        var zoom = this.design.getZoom();
        zoom = zoom + delta / 200;
        if (zoom > 20)
            zoom = 20;
        if (zoom < 1)
            zoom = 1;
        this.design.zoomToPoint({x: opt.e.offsetX, y: opt.e.offsetY}, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
        var vpt = this.design.viewportTransform;
        if (vpt[4] >= 0) {
            this.design.viewportTransform[4] = 0;
        } else if (vpt[4] < this.design.getWidth() - this.imgWidth * zoom) {
            this.design.viewportTransform[4] = this.design.getWidth() - this.imgWidth * zoom;
        }
        if (vpt[5] >= 0) {
            this.design.viewportTransform[5] = 0;
        } else if (vpt[5] < this.design.getHeight() - this.imgHeight * zoom) {
            this.design.viewportTransform[5] = this.design.getHeight() - this.imgHeight * zoom;
        }

    }
}

export default mapZoomService
