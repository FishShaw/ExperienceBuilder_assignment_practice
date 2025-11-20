import { React, type AllWidgetProps } from 'jimu-core'
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'
import type Point from 'esri/geometry/Point'
// import packages for projection and spatial reference
import { project } from 'esri/geometry/projection'
import SpatialReference from 'esri/geometry/SpatialReference'
import { load } from 'esri/geometry/projection'

const { useState, useEffect } = React

const Widget = (props: AllWidgetProps<any>) => {
    const [latitude, setLatitude] = useState<string>('')
    const [longitude, setLongitude] = useState<string>('')
    // state for RD coordinates
    const [rdX, setRdX] = useState<string>('')
    const [rdY, setRdY] = useState<string>('')
    // track whether the projection engine has been loaded
    const [projectionLoaded, setProjectionLoaded] = useState<boolean>(false)

    // load projection engine
    useEffect(() => {
        load().then(() => {
            setProjectionLoaded(true)
        })
    }, [])


    const activeViewChangeHandler = (jmv: JimuMapView) => {
        if (jmv) {
            // When the pointer moves, take the pointer location and create a Point
            // Geometry out of it (`view.toMap(...)`), then update the state.
            jmv.view.on('pointer-move', (evt) => {
                const point: Point = jmv.view.toMap({
                    x: evt.x,
                    y: evt.y
                })
                setLatitude(point.latitude.toFixed(3))
                setLongitude(point.longitude.toFixed(3))

                // Convert to RD coordinates when projection is loaded
                if (projectionLoaded) {
                    const rdSpatialReference = new SpatialReference({ wkid: 28992 })
                    const projectedPoint = project(point, rdSpatialReference) as Point
                    setRdX(projectedPoint.x.toFixed(2))
                    setRdY(projectedPoint.y.toFixed(2))
                }
            })
        }
    }

    return <div className="widget-starter jimu-widget">
        {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
            <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
        )}
        <p>
            Lat/Lon: {latitude} {longitude}
        </p>
        <p>
            RD: X: {rdX} Y: {rdY}
        </p>
    </div>
}

export default Widget