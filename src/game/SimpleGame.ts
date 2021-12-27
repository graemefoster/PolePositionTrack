//                    o
//        |           o 
//   -    |            
//        |           
//                    o
//                    o
//   <----><---------->
//     c         d
//
//   - === camera
//   | === screen (-1 -> 1)
//   o === points to project onto screen from camera
//   c === length from camera to screen
//   d === distance from screen to earth

export interface Point {
    x: number
    y: number
    z: number
}

export interface Point2D {
    x: number
    y: number
}

export class Camera {

    x: number
    y: number
    z: number

    constructor(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
    }

    projectPoint(point: Point, plane: ProjectionPlane): Point2D {

        let adjacent = this.z - point.z
        let otherAdjacent = plane.z - this.z

        let yOpposite = ((this.y - point.y) * otherAdjacent) / adjacent
        let pointOnProjectionPlaneY = this.y + yOpposite

        let xOpposite = ((this.x - point.x) * otherAdjacent) / adjacent
        let pointOnProjectionPlaneX = this.x + xOpposite

        console.log(`Original ${point.x}, ${point.y}: Point on plane: ${xOpposite}, ${yOpposite}`)

        return { x: pointOnProjectionPlaneX, y: pointOnProjectionPlaneY }

    }


}

export class ProjectionPlane {
    z: number

    constructor(z: number) {
        this.z = z
    }
}

export class ScreenProjection {

    x1: number
    x2: number
    y1: number
    y2: number
    width: number
    height: number
    screenPixelsPerWorldPixelX: number
    screenPixelsPerWorldPixelY: number

    constructor(x1: number, x2: number, y1: number, y2: number, width: number, height: number) {
        this.x1 = x1
        this.x2 = x2
        this.y1 = y1
        this.y2 = y2
        this.width = width
        this.height = height
        this.screenPixelsPerWorldPixelX = width / (x2 - x1)
        this.screenPixelsPerWorldPixelY = height / (y2 - y1)
    }

    project(point: Point2D): Point2D {
        const worldXOffsetOnScreen = point.x - this.x1
        const worldYOffsetOnScreen = point.y - this.y1
        console.log(`world offset Y:${worldYOffsetOnScreen}`)
        console.log(`pixels per Y:${this.screenPixelsPerWorldPixelY}`)
        return {
            x: worldXOffsetOnScreen * this.screenPixelsPerWorldPixelX,
            y: worldYOffsetOnScreen * this.screenPixelsPerWorldPixelY
        }
    }
}

export interface Drawable {
    render(canvas: CanvasRenderingContext2D, camera: Camera, plane: ProjectionPlane, screen: ScreenProjection): void
}

export class RoadSegment implements Drawable {

    xCentre: number
    width: number
    height: number
    distance: number

    constructor(xCentre: number, width: number, height: number, distance: number) {
        this.xCentre = xCentre
        this.width = width
        this.height = height
        this.distance = distance
    }

    render(canvas: CanvasRenderingContext2D, camera: Camera, plane: ProjectionPlane, screen: ScreenProjection): void {
        const point1: Point2D = screen.project(camera.projectPoint({
            x: this.xCentre - (this.width / 2),
            y: this.height,
            z: this.distance
        }, plane))

        const point2 = screen.project(camera.projectPoint({
            x: this.xCentre + (this.width / 2),
            y: this.height,
            z: this.distance
        }, plane))

        canvas.beginPath()
        canvas.moveTo(point1.x, point1.y)
        canvas.lineTo(point2.x, point2.y)
        canvas.closePath()
        canvas.stroke()

        console.log(`${point1.x},${point1.y} -> ${point2.x},${point2.y}`)

    }
}
