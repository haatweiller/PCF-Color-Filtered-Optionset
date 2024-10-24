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
  isValid: boolean;
}

export const FilteredOptionsetComponent = React.memo((props: IFilteredOptionsetProps) => {
  const { currentValue, options, isDisabled, hideChoice, hideSpecificColor, onChange, masked, isRequired, multiSelect } = props;
  
  const [validOptions, setValidOptions] = React.useState<IOption[]>([]);
  const [error, setError] = React.useState<string>();
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
  const [value, setValue] = React.useState("");

  const isValidOption = (itemColor: string) => {
    if (hideChoice == "hideColor") {
      return !itemColor;
    } else if (hideChoice == "hideNoColor") {
      return itemColor ?? false;
    } else if (hideChoice == "hideSpecificColor") {
      return itemColor !== hideSpecificColor;
    } else if (hideChoice == "showSpecificColor") {
      return itemColor === hideSpecificColor;
    }
    return false;
  };

  React.useEffect(() => {
    if (options) {
      const selectedValue: number[] = typeof currentValue === "number" ? [currentValue] : currentValue ?? [];
      const optionMap = options.map((item) => {
        return {
          key: item.Value.toString(),
          data: item.Value,
          text: item.Label,
          selected: selectedValue.includes(item.Value),
          isValid: isValidOption(item.Color),
        } as IOption;
      });
      setValidOptions(optionMap.filter((item) => {return item.isValid || item.selected}));

      if (currentValue !== null && currentValue !== undefined) {
        const selectedOptions:string[] = [];
        const selectedValues:string[] = [];
        optionMap.filter((option) => option.selected).forEach((option)=>{
          selectedOptions.push(option.key.toString())
          selectedValues.push(option.text);
        });
        setSelectedOptions(selectedOptions);
        setValue(selectedValues.join(", "))
      }
      else {
        setSelectedOptions([]);
        setValue("");
      }
    }
    else {
      setError("No options found");
    }
  }, [options, currentValue]);

  const onOptionSelect: (DropdownProps)["onOptionSelect"] = (ev, data) => {
    setValidOptions(validOptions.map((item) => {
      return {
        key: item.key,
        data: item.data,
        text: item.text,
        selected: data.selectedOptions.includes(item.key.toString()),
        isValid: item.isValid,
      } as IOption;
    }).filter((option) => option.selected || option.isValid));
    setSelectedOptions(data.selectedOptions);
    setValue(data.optionText ?? "");
    
    onChange(data.selectedOptions);
  };
  const styles = _useStyles();

  const dropDownProps: Partial<DropdownProps> = {
    disabled: isDisabled,
    multiselect: multiSelect,
    clearable: !isRequired,
    value: value,
    className: styles.dropdown,
    onOptionSelect: onOptionSelect,
    selectedOptions: selectedOptions,
  }

  if (selectedOptions.length == 0) {
    dropDownProps.placeholder = '-- Select --';
  }

  return (
    <div className={styles.root}>
      {error}
      {masked && '****'}

      {!error && !masked && validOptions && (
        <FluentProvider theme={props.theme}>
          <Dropdown
            {...dropDownProps}
          >
            {validOptions.map( (option: IOption) =>(
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
  dropdown: { 
    minWidth: 'unset',
    width: "100%",
  },
});