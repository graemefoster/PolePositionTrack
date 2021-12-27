import { Camera, Point, Point2D, ProjectionPlane, RoadSegment, ScreenProjection } from './game/SimpleGame'

const roadSegments: RoadSegment[] = [
    new RoadSegment(500, 500, 300, 10),
    new RoadSegment(500, 500, 300, 20),
    new RoadSegment(500, 500, 300, 30),
    new RoadSegment(500, 400, 300, 40),
    new RoadSegment(500, 500, 290, 50),
    new RoadSegment(510, 500, 290, 60),
    new RoadSegment(530, 500, 300, 70),
    new RoadSegment(530, 500, 300, 80)
]

const _global = (window /* browser */ || global /* node */) as any

_global.drawScene = function drawScene(x: number, y: number, d: number, dp: number) {

    const camera = new Camera(x, y, d)
    const plane: ProjectionPlane = new ProjectionPlane(10) //300, 600,0, 200, dp, 800.0, 600.0)
    const screen = new ScreenProjection(250, 750, 10, 30, 800, 600)

    const canvas = document.getElementById('game') as HTMLCanvasElement
    const canvasContext = canvas.getContext("2d")!
    canvasContext.clearRect(0, 0, canvas.width, canvas.height)
    roadSegments.forEach(s => {
        s.render(canvasContext, camera, plane, screen)
    })
}