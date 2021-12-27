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
        return {
            x: worldXOffsetOnScreen * this.screenPixelsPerWorldPixelX,
            y: worldYOffsetOnScreen * this.screenPixelsPerWorldPixelY
        }
    }
}

export interface Drawable {
    render(canvas: CanvasRenderingContext2D, camera: Camera, plane: ProjectionPlane, screen: ScreenProjection): void
}

export class Road implements Drawable {
    roadSegments: RoadSegment[]

    constructor(roadSegments: RoadSegment[]) {
        this.roadSegments = roadSegments
    }

    render(canvas: CanvasRenderingContext2D, camera: Camera, plane: ProjectionPlane, screen: ScreenProjection): void {
        let previousPoint1: Point2D | null = null
        let previousPoint2: Point2D | null = null
        const road = ['#cccccc', '#999999']
        const grass = ['darkgreen', 'lightgreen']

        this.roadSegments.filter(x => x.distance > camera.z).reverse().forEach(current => {

            let [point1, point2] = current.project(camera, plane, screen)
            //console.log(`Segment z:${current.distance}. (${point1.x},${point1.y})-(${point2.x},${point2.y})`)

            if (previousPoint1 != null && previousPoint2 != null) {
                canvas.fillStyle = grass[current.index % 2]
                canvas.fillRect(0, previousPoint1.y, screen.width, point2.y)
                canvas.fillStyle = road[current.index % 2]
                canvas.beginPath()
                canvas.moveTo(previousPoint1.x, previousPoint1.y)
                canvas.lineTo(point1.x, point1.y)
                canvas.lineTo(point2.x, point2.y)
                canvas.lineTo(previousPoint2.x, previousPoint2.y)
                canvas.closePath()
                canvas.fill()

                if (current.index % 2 == 0) {

    
                    const centreX1 = point1.x + ((point2.x - point1.x) / 2)
                    const centreX2 = previousPoint1.x + ((previousPoint2.x - previousPoint1.x) / 2)
                    const centreY1 = point1.y + ((point2.y - point1.y) / 2)
                    const centreY2 = previousPoint1.y + ((previousPoint2.y - previousPoint1.y) / 2)
                    canvas.fillStyle = 'white'
                    canvas.beginPath()
                    canvas.moveTo(centreX1 - 5, centreY1)
                    canvas.lineTo(centreX2 - 5, centreY2)
                    canvas.lineTo(centreX2 + 5, centreY2)
                    canvas.lineTo(centreX1 + 5, centreY1)
                    canvas.closePath()
                    canvas.fill()
                }
            }

            previousPoint1 = point1
            previousPoint2 = point2
        })
        let current: RoadSegment | null = null

    }
}

export class RoadSegment {

    index: number
    xCentre: number
    width: number
    height: number
    distance: number

    constructor(index: number, xCentre: number, width: number, height: number, distance: number) {
        this.index = index
        this.xCentre = xCentre
        this.width = width
        this.height = height
        this.distance = distance
    }

    project(camera: Camera, plane: ProjectionPlane, screen: ScreenProjection): [point1: Point2D, point2: Point2D] {
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

        return [point1, point2]
    }
}
