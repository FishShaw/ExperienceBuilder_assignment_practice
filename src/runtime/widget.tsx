import { React, type AllWidgetProps } from 'jimu-core'
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'
import Point from 'esri/geometry/Point'
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
    // state for user input (WGS84 coordinates))
    const [inputLat, setInputLat] = useState<string>('')
    const [inputLon, setInputLon] = useState<string>('')
    const [inputZoom, setInputZoom] = useState<string>('')
    const [jimuMapView, setJimuMapView] = useState<JimuMapView>(null)

    // load projection engine
    useEffect(() => {
        load().then(() => {
            setProjectionLoaded(true)
        })
    }, [])


    const activeViewChangeHandler = (jmv: JimuMapView) => {
        if (jmv) {
            // save the JimuMapView reference for later use
            setJimuMapView(jmv)


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

    // handle go to location button click
    const handleGoTo = () => {
        if (!jimuMapView || !inputLat || !inputLon) return

        const point = new Point({
            longitude: parseFloat(inputLon),
            latitude: parseFloat(inputLat)
        })

        jimuMapView.view.goTo({
            target: point,
            zoom: inputZoom ? parseInt(inputZoom) : undefined
        })
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
        <div>
            <div>
                <label>Lat: </label>
                <input placeholder="Latitude" value={inputLat} onChange={(e) => setInputLat(e.target.value)} />
            </div>
            <div>
                <label>Lon: </label>
                <input placeholder="Longitude" value={inputLon} onChange={(e) => setInputLon(e.target.value)} />
            </div>
            <div>
                <label>Zoom Level: </label>
                <input placeholder="Zoom" value={inputZoom} onChange={(e) => setInputZoom(e.target.value)} />
            </div>
            <button onClick={handleGoTo}>Go</button>
        </div>
    </div>
}

export default Widget