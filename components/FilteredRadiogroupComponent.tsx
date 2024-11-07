import * as React from 'react';
import { RadioGroup, Radio, FluentProvider, Theme, makeStyles } from "@fluentui/react-components";
import type { RadioGroupProps } from "@fluentui/react-components";

export interface IFilteredRadiogroupProps {
  currentValue?: number | number[] | null;
  options: ComponentFramework.PropertyHelper.OptionMetadata[];
  isDisabled?: boolean;
  hideChoice: "hideNoColor" | "hideColor" | "hideSpecificColor" | "showSpecificColor";
  hideSpecificColor?: string;
  onChange: (newValue: string[] | undefined) => void;
  masked: boolean;
  isRequired: boolean;
  theme: Theme;
}

export interface IOption {
  data: number;
  text: string;
  selected: boolean;
  isValid: boolean;
}

export const FilteredRadiogroupComponent = React.memo((props: IFilteredRadiogroupProps) => {
  const { currentValue, options, isDisabled, hideChoice, hideSpecificColor, onChange, masked } = props;
  
  const [validOptions, setValidOptions] = React.useState<IOption[]>([]);
  const [error, setError] = React.useState<string>();
  const [value, setValue] = React.useState(currentValue?.toString());

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

      setValue(currentValue?.toString());
    }
    else {
      setError("No options found");
    }
  }, [options, currentValue]);

  const radioOnChange: (RadioGroupProps)["onChange"] = (ev, data) => {
    setValidOptions(validOptions.map((item) => {
      return {
        data: item.data,
        text: item.text,
        selected: data.value === item.data.toString(),
        isValid: item.isValid,
      } as IOption;
    }).filter((option) => option.selected || option.isValid));
    setValue(data.value);
    
    onChange([data.value]);
  };
  const styles = _useStyles();

  const radioGroupProps: Partial<RadioGroupProps> = {
    disabled: isDisabled,
    className: styles.radioGroup,
    onChange: radioOnChange,
    defaultValue: value,
  }

  return (
    <div className={styles.root}>
      {error}
      {masked && '****'}

      {!error && !masked && validOptions && (
        <FluentProvider theme={props.theme}>
          <RadioGroup {...radioGroupProps}>
            {validOptions.map( (option: IOption) =>(
              <Radio value={option.data.toString()} label={option.text} />
            ))}
          </RadioGroup>
        </FluentProvider>
      )}
    </div>
  );
});
FilteredRadiogroupComponent.displayName = 'FilteredRadiogroupComponent';

const _useStyles = makeStyles({
  root: { 
    margin: "auto 0", 
    width: "100%",
  },
  radioGroup: {
    margin: "auto 0",
    minWidth: 'unset',
    width: "100%",
  },
});