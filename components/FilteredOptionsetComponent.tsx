import * as React from 'react';
import { Dropdown, Option, FluentProvider, Theme, makeStyles } from "@fluentui/react-components";
import type { DropdownProps } from "@fluentui/react-components";

export interface IFilteredOptionsetProps {
  currentValue?: number | number[] | null;
  options: ComponentFramework.PropertyHelper.OptionMetadata[];
  isDisabled?: boolean;
  hideChoice: "hideNoColor" | "hideColor" | "hideSpecificColor" | "showSpecificColor";
  hideSpecificColor?: string;
  onChange: (newValue: string[] | undefined) => void;
  masked: boolean;
  isRequired: boolean;
  multiSelect: boolean;
  theme: Theme;
}

export interface IOption {
  key: string | number;
  data: number | null;
  text: string;
  selected: boolean;
}

export const FilteredOptionsetComponent = React.memo((props: IFilteredOptionsetProps) => {
  const { currentValue, options, isDisabled, hideChoice, hideSpecificColor, onChange, masked, isRequired, multiSelect } = props;
  
  const items = React.useMemo(() => {
    let configError: string | undefined;
    const selectedValue: number[] = typeof currentValue === "number" ? [currentValue] : currentValue ?? [];
    if (options) {
      if (hideChoice == "hideSpecificColor" && !hideSpecificColor)
        configError = "Empty hideSpecificColor";
      return {
        error: configError,
        options: options.filter((item) => {
          if (selectedValue.includes(item.Value)) {
            return true;
          } else {
            if (hideChoice == "hideColor") {
              return !item.Color;
            } else if (hideChoice == "hideNoColor") {
              return item.Color ?? false;
            } else if (hideChoice == "hideSpecificColor") {
              return item.Color !== hideSpecificColor;
            } else if (hideChoice == "showSpecificColor") {
              return item.Color === hideSpecificColor;
            }
            return false;
          }
        }).map((item) => {
          return {
            key: item.Value.toString(),
            data: item.Value,
            text: item.Label,
            selected: selectedValue.includes(item.Value),
          } as IOption;
        }),
      };
    }
    else {
      configError = 'No options found';
      return {
        error: configError,
        options: [] as IOption[],
      };
    }
  }, [options, currentValue]);

  const [selectedOptions, setSelectedOptions] = React.useState<string[]>(()=>{
    const options:string[] = [];
    items.options.filter((option) => option.selected).forEach((option)=>options.push(option.key.toString()));
    return options;
  });
  const [value, setValue] = React.useState(()=>{
    const options:string[] = [];
    items.options.filter((option) => option.selected).forEach((option)=>options.push(option.text));
    return options.join(", ");
  });

  const onOptionSelect: (DropdownProps)["onOptionSelect"] = (ev, data) => {
    items.options = items.options.map((item) => {
      return {
        key: item.key,
        data: item.data,
        text: item.text,
        selected: data.selectedOptions.includes(item.key.toString()),
      } as IOption;
    });
    setSelectedOptions(data.selectedOptions);
    setValue(()=>{
      const options:string[] = [];
      items.options.filter((option) => option.selected).forEach((option)=>options.push(option.text));
      return options.join(", ");
    });
    onChange(data.selectedOptions);
  };
  const styles = _useStyles();

  const dropDownProps: Partial<DropdownProps> = {
    disabled: isDisabled,
    multiselect: multiSelect,
    clearable: !isRequired,
    value: value,
    className: styles.root,
    onOptionSelect: onOptionSelect,
    selectedOptions: selectedOptions,
  }

  if (selectedOptions.length == 0) {
    dropDownProps.placeholder = '-- Select --';
  }

  return (
    <div className={styles.root}>
      {items.error}
      {masked && '****'}

      {!items.error && !masked && items.options && (
        <FluentProvider theme={props.theme}>
          <Dropdown
            {...dropDownProps}
          >
            {items.options.map( (option: IOption) =>(
              <Option key={option.key} value={option.key.toString()}>
                {option.text}
              </Option>
            ))}
          </Dropdown>
        </FluentProvider>
      )}
    </div>
  );
});
FilteredOptionsetComponent.displayName = 'FilteredOptionsetComponent';

const _useStyles = makeStyles({
  root: { 
    margin: "auto 0", 
    width: "100%",
  },
});