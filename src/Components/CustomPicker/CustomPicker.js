import React from 'react';
import {Controller} from 'react-hook-form';
import PickerModal from '../PickerModal/PickerModal';
const CustomPicker = ({
  rules = {},
  control,
  name,
  placeholder,
  options,
  isVisible,
  close,
  open,
  customStyle,
}) => {
  return (
    <>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
          <>
            <PickerModal
              placeholder={placeholder}
              pickerValue={value ? value : placeholder}
              options={options}
              isVisible={isVisible}
              onSelect={value => {
                typeof close === 'function' && close(value);

                onChange(value);
              }}
              onOpenPicker={open}
              onClose={close}
              customStylePickerStyle={customStyle}
            />
          </>
        )}
      />
    </>
  );
};

export default CustomPicker;
