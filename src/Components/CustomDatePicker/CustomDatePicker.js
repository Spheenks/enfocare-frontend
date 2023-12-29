import React from "react";
import { View, StyleSheet, Dimensions } from 'react-native';
import { Controller } from "react-hook-form";
import PickerModal from "../PickerModal/PickerModal";
import DateModal from "../DateModal";


const CustomDatePicker = ({ rules ={}, control, name, placeholder, onClosePicker, setDate, date , isOpen , onOpenDatePick}) => {
    return (
        <>

            <Controller
                control={control}
                name={name}
                rules={rules}
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                    <>
                        <DateModal
                            placeholder={placeholder}
                            onClosePicker= {onClosePicker}
                            setDate ={(val)=>{
                                onChange(val);
                            }}
                            date={value? new Date(value) : new Date()}
                            isOpen ={isOpen}
                            onOpenDatePick ={onOpenDatePick}
                        />

                    </>
                )}

            />
        </>
    );
};



export default CustomDatePicker;
