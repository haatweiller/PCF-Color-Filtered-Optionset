import * as React from 'react';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';

export interface IFilteredOptionsetProps {
  value?: number | null;
  options: ComponentFramework.PropertyHelper.OptionMetadata[];
  isDisabled?: boolean;
  hideChoice: "hideNoColor" | "hideColor" | "hideSpecificColor" | "showSpecificColor";
  hideSpecificColor?: string;
  onChange: (newValue: number | undefined) => void;
  masked: boolean;
}

export const FilteredOptionsetComponent = React.memo((props: IFilteredOptionsetProps) => {
  const { value, options, isDisabled, hideChoice, hideSpecificColor, onChange, masked } = props;

  const valueKey = value != null ? value.toString() : undefined;
  const items = React.useMemo(() => {
    let configError: string | undefined;
    if (options) {
      if (hideChoice == "hideSpecificColor" && !hideSpecificColor)
        configError = "Empty hideSpecificColor";
      return {
        error: configError,
        options: options.filter((item) => {
          if (item.Value == value) {
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
                data: { value: item.Value },
                text: item.Label,
            } as IDropdownOption;
        }),
      };
    }
    else {
      configError = 'No options found';
      return {
        error: configError,
        options: [] as IDropdownOption[],
      };
    }
  }, [options]);

  const onChangeDropdown = React.useCallback(
    (ev?: unknown, option?: IDropdownOption): void => {
        onChange(option ? (option.key as number) : undefined);
    },
    [onChange],
  );

  return (
    <>
    {items.error}
    {masked && '****'}

    {!items.error && !masked && items.options && (
      <Dropdown
        options={items.options}
        selectedKey={valueKey}
        disabled={isDisabled}
        placeholder='-- Select --'
        onChange={onChangeDropdown}
        styles={{root:{margin: "auto 0", width: "100%"}}}
      />
    )}
    </>
  );
});
FilteredOptionsetComponent.displayName = 'FilteredOptionsetComponent';
