import { React } from 'jimu-core'
import type { AllWidgetSettingProps } from 'jimu-for-builder'
import { MapWidgetSelector } from 'jimu-ui/advanced/setting-components'

const Setting = (props: AllWidgetSettingProps<any>) => {
    const onMapWidgetSelected = (useMapWidgetIds: string[]) => {
        // call the onSettingChange method to save the selected map widget id
        props.onSettingChange({
            id: props.id, // widget instance id 
            useMapWidgetIds: useMapWidgetIds // array of map widget IDs to connect to
        })
    }

    return <div className="widget-setting-demo">
        Select a map to display coordinates:
        <MapWidgetSelector
            // current selected map widget ids (from saved config)
            useMapWidgetIds={props.useMapWidgetIds}
            // call this function when user selects/diselects a map
            onSelect={onMapWidgetSelected}
        />
    </div>
}

export default Setting
