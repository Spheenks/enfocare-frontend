import React from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
import { Controller } from "react-hook-form";
const CustomInput = ({ rules = {}, control, name, placeholder, secureTextEntry, editable, selectTextOnFocus, customStyleInputStyle, hastMultiLine, textInputStyle }) => {
    return (

        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <>
                    <View
                        style={[customStyleInputStyle ? customStyleInputStyle : styles.container,
                        { borderColor: error ? 'red' : '#e8e8e8' },
                        ]}>
                        <TextInput
                            multiline={hastMultiLine}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder={placeholder}
                            style={textInputStyle? textInputStyle : styles.input}
                            secureTextEntry={secureTextEntry}
                            placeholderTextColor="#BEBEBE"
                            editable={editable}
                            selectTextOnFocus={selectTextOnFocus}
                        />
                    </View>
                    {
                        error && (
                            <Text style={{ color: 'red', alignSelf: 'stretch' }}>{error.message || 'Error'}</Text>
                        )
                    }

                </>
            )}
        />


    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: "100%",
        borderRadius: 20,
        borderColor: "#e8e8e8",
        borderWidth: 1,
        paddingHorizontal: 10,
        marginVertical: 5,

    },
    input: {
        color: 'black'
    },
});
export default CustomInput;