import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import DatePicker from 'react-native-date-picker'
import moment from "moment/moment";
import { Controller } from "react-hook-form";

const DateModal = ({ onOpenDatePick, isOpen, date, setDate, onClosePicker, placeholder }) => {
    const datedTime = moment(new Date(date)).format("MMMM DD, YYYY - dddd");
    const currentDate = moment(new Date()).format("MMMM DD, YYYY - dddd");

    return (
        <>
            <TouchableOpacity style={styles.datePickInput} onPress={onOpenDatePick}>
                <Text style={styles.datePickText}>{datedTime === currentDate ? placeholder : datedTime}</Text>
            </TouchableOpacity>

            <DatePicker
                modal
                open={isOpen}
                date={new Date(date)}
                onConfirm={(date) => {
                    typeof onClosePicker === 'function' && onClosePicker(false)
                    typeof setDate === 'function' && setDate(date)
                }}
                onCancel={() => {
                    typeof onClosePicker === 'function' && onClosePicker(false)
                }}
                mode={'date'}
                textColor='black'
                androidVariant='iosClone'
                title={'Birthdate'}
            />
        </>
    )
};
const styles = StyleSheet.create({
    datePickInput: {
        backgroundColor: 'white',
        width: "100%",
        borderRadius: 20,
        borderColor: "#e8e8e8",
        borderWidth: 1,
        paddingHorizontal: 10,
        marginVertical: 5,
        height: 50,
        justifyContent: 'center',

    },
    datePickText: {
        fontSize: 14,
        color: 'black',
    },
})
export default DateModal;