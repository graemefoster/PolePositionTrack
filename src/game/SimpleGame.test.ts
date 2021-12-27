import exp = require('constants');
import { Camera, Point, Point2D, ProjectionPlane, RoadSegment, ScreenProjection } from './SimpleGame'

describe("Projections", () => {
  it("Can project a world point to a projection plane", () => {

    const camera = new Camera(500, 18, 3)
    const projectionPlane = new ProjectionPlane(10)
    const worldPoint: Point = {
        x: 255,
        y: 3,
        z: 27
    }

    const projectedPoint = camera.projectPoint(worldPoint, projectionPlane)
    expect(projectedPoint.x).toBe(428.5416666666667)
    expect(projectedPoint.y).toBe(13.625)

  });
  it("Can project a plane point to a screen", () => {
      const projectionPlanePoint: Point2D = {
          x: 400,
          y: 13.625
      }
      const screen = new ScreenProjection(250, 750, 10, 20, 800, 600)
      const screenPoint = screen.project(projectionPlanePoint)

      expect(screenPoint.x).toBe(240)
      expect(screenPoint.y).toBe(217.5)
      });
});
