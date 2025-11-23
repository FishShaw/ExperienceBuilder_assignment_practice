import { React, type AllWidgetProps } from 'jimu-core'
import { JimuMapViewComponent, type JimuMapView } from 'jimu-arcgis'
import Point from 'esri/geometry/Point'
// import packages for projection and spatial reference
import { project } from 'esri/geometry/projection'
import SpatialReference from 'esri/geometry/SpatialReference'
import { load } from 'esri/geometry/projection'

// destructure React hooks
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
    // state to hold the JimuMapView reference£¬initially null
    const [jimuMapView, setJimuMapView] = useState<JimuMapView>(null)

    // load projection engine
    useEffect(() => {
        // load the projection engine asynchronously
        load().then(() => {
            // once loaded, update the state
            setProjectionLoaded(true)
        })
    }, [])


    const activeViewChangeHandler = (jmv: JimuMapView) => {
        if (jmv) {
            // save the JimuMapView reference for later use
            setJimuMapView(jmv)


            // When the pointer moves, take the pointer location and create a Point
            // evt.x and evt.y are in screen coordinates
            jmv.view.on('pointer-move', (evt) => {
                const point: Point = jmv.view.toMap({
                    x: evt.x,
                    y: evt.y
                })
                // update latitude and longitude state with 3 decimal places
                setLatitude(point.latitude.toFixed(3))
                setLongitude(point.longitude.toFixed(3))

                // Convert to RD coordinates when projection is loaded
                if (projectionLoaded) {
                    // create a SpatialReference for RD (EPSG:28992)
                    const rdSpatialReference = new SpatialReference({ wkid: 28992 })
                    // project the point to RD
                    const projectedPoint = project(point, rdSpatialReference) as Point
                    // update RD state with 2 decimal places
                    setRdX(projectedPoint.x.toFixed(2))
                    setRdY(projectedPoint.y.toFixed(2))
                }
            })
        }
    }

    // handle go to location button click
    const handleGoTo = () => {
        // check if all required inputs are available, and return early if not
        if (!jimuMapView || !inputLat || !inputLon) return

        // create a new Point from user input coordinates, parseFloat() converts string to number
        const point = new Point({
            longitude: parseFloat(inputLon),
            latitude: parseFloat(inputLat)
        })

        // navigate the map view to the specified point
        jimuMapView.view.goTo({
            target: point, // the geographic point to go to
            // if zoom level is provided, parse it to integer
            zoom: inputZoom ? parseInt(inputZoom) : undefined  // optional zoom level
        })
    }

    return <div className="widget-starter jimu-widget">
        {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
            // render the jimumap viewercomponent to embed the map in the widget
            <JimuMapViewComponent
                // pass the first (and only) map widget id to connect the map
                useMapWidgetId={props.useMapWidgetIds?.[0]}
                // register the callback function to be called when map view becomes active
                onActiveViewChange={activeViewChangeHandler} />
        )}

        {/* display for real-time WGS84 coordinates */}
        <p>
            Lat/Lon: {latitude} {longitude}
        </p>
        {/* display for real-time RD coordinates */}
        <p>
            RD: X: {rdX} Y: {rdY}
        </p>
        {/* input form section for user to enter coordinates and navigate */}
        <div>
            <div>
                <label>Lat: </label>
                <input
                    placeholder="Latitude" //placeholder text
                    value={inputLat} //controlled input value from state
                    onChange={(e) => setInputLat(e.target.value)} //update state on user input
                />
            </div>
            <div>
                <label>Lon: </label>
                <input
                    placeholder="Longitude" 
                    value={inputLon} 
                    onChange={(e) => setInputLon(e.target.value)} 
                />
            </div>
            <div>
                <label>Zoom Level: </label>
                <input
                    placeholder="Zoom" 
                    value={inputZoom} 
                    onChange={(e) => setInputZoom(e.target.value)} 
                />
            </div>

            {/* trigger handleGoTo function when clicked */}
            <button onClick={handleGoTo}>Go</button>
        </div>
    </div>
}

export default Widget