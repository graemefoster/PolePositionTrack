import { randomInt } from 'crypto'
import { Camera, Point, Point2D, ProjectionPlane, Road, RoadSegment, ScreenProjection } from './game/SimpleGame'

let currentCentre = 500
let currentWidth = 500
let currentHeight = 300
const roadSegments: RoadSegment[] = Array.from(Array(100).keys()).map(idx => {
    currentCentre += ((Math.random() * 100) - 50)
    currentWidth += ((Math.random() * 100) - 50)
    currentHeight += ((Math.random() * 50) - 25)
    return new RoadSegment(
        idx,
        currentCentre,
        currentWidth,
        currentHeight,
        (1 + idx) * 10)
})

const road = new Road(roadSegments)

const _global = (window /* browser */ || global /* node */) as any

_global.drawScene = function drawScene(d: number) {

    const px1 = parseInt((document.getElementById('txtPlanex1') as HTMLInputElement).value)
    const py1 = parseInt((document.getElementById('txtPlaney1') as HTMLInputElement).value)
    const px2 = parseInt((document.getElementById('txtPlanex2') as HTMLInputElement).value)
    const py2 = parseInt((document.getElementById('txtPlaney2') as HTMLInputElement).value)
    const x = parseInt((document.getElementById('txtCameraX') as HTMLInputElement).value)
    const y = parseInt((document.getElementById('txtCameraY') as HTMLInputElement).value)
    const dpd = parseInt((document.getElementById('txtPlane') as HTMLInputElement).value)
    const sw = parseInt((document.getElementById('txtScreenWidth') as HTMLInputElement).value)
    const sh = parseInt((document.getElementById('txtScreenHeight') as HTMLInputElement).value)

    const camera = new Camera(x, y, d)
    const plane: ProjectionPlane = new ProjectionPlane(d + dpd)
    const screen = new ScreenProjection(px1, px2, py1, py2, sw, sh)

    const canvas = document.getElementById('game') as HTMLCanvasElement
    canvas.width = sw
    canvas.height = sh
    const canvasContext = canvas.getContext("2d")!
    canvasContext.fillStyle = 'lightblue'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    road.render(canvasContext, camera, plane, screen)

    window.setTimeout(function () {
        drawScene(d + 0.2)
    }, 10)
}