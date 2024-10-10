import * as React from "react";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { FilteredOptionsetComponent, IFilteredOptionsetProps } from "../components/FilteredOptionsetComponent";
import { webLightTheme } from "@fluentui/react-components";

export class ColorFilteredOptionset implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private selectedValue: number | undefined;
    private context: ComponentFramework.Context<IInputs>;

    /**
     * Empty constructor.
     */
    constructor() { 
        // empty
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.context = context;
        this.context.mode.trackContainerResize(true);
    }

    private onChange = (newValue: string[] | undefined): void => {
        if (newValue !== undefined && newValue?.length > 0)
            this.selectedValue = Number(newValue[0]);
        else
            this.selectedValue = undefined;
        this.notifyOutputChanged();
    };

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const value : ComponentFramework.PropertyTypes.OptionSetProperty = context.parameters.value;

        const hideChoice = context.parameters.hideChoice;
        const hideSpecificColor = context.parameters.hideSpecificColor;

        const requiredLevel = value.attributes?.RequiredLevel;

        let disabled = context.mode.isControlDisabled;
        let masked = false;
        if (value.security) {
            disabled = disabled || !value.security.editable;
            masked = !value.security.readable;
        }

        const props: IFilteredOptionsetProps = {
            onChange: this.onChange, 
            options: [],
            hideChoice: hideChoice.raw,
            hideSpecificColor: hideSpecificColor.raw ?? undefined,
            isDisabled: disabled,
            masked: masked,
            isRequired: requiredLevel === 1 || requiredLevel === 2, // SystemRequired or ApplicationRequired
            multiSelect: false,
            theme: context.fluentDesignLanguage?.tokenTheme ?? webLightTheme,
        };

        if (value && value.attributes) {
            const options = value.attributes.Options;

            if (options) {
                props.options = options;
                props.currentValue = value.raw;
            }
        }
        return React.createElement(
            FilteredOptionsetComponent, props
        );
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return { value: this.selectedValue } as IOutputs;
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
