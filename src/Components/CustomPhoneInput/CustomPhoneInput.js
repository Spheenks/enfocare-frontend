import React, { useRef, useState } from "react";
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import { Controller } from "react-hook-form";
import PhoneInput from "react-native-phone-number-input";
import { useEffect } from "react";



const CustomPhoneInput = ({ rules = {}, control, name }) => {



    const phoneInput = useRef(PhoneInput);


    return (
        <>

            <Controller
                control={control}
                name={name}
                rules={rules}
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                    <>
                        <View style={styles.main}>
                          
                                <PhoneInput
                                    ref={phoneInput}
                                    defaultValue={value}
                                    defaultCode="PH"
                                    layout="first"
                                    onChangeFormattedText={(val) => {
                                        onChange(phoneInput.current?.isValidNumber(val) === false ? phoneInput.current?.isValidNumber(val) : val);
                                        // setIsPhoneValid(phoneInput.current?.isValidNumber(val));

                                    }}
                                    // withDarkTheme
                                    // withShadow
                                    textInputStyle ={styles.defaultTextInput}
                                    textContainerStyle ={styles.defaultContainer}
                                    flagButtonStyle = {styles.flagContainer}
                                    containerStyle = {{width:'100%' , backgroundColor :'transparent'}}
                                    // codeTextStyle ={{fontSize:16}}
                                  




                                />
                        


                           
                            {
                                error && (
                                    <Text style={{ color: 'red', alignSelf: 'stretch' }}>{error.message || 'Error'}</Text>
                                )
                            }

                        </View>








                        {/* {
                            isPhoneValid === false &&
                            <Text style={{color:'red', alignSelf:'stretch'}}>DASDA</Text>
                        } */}

                    </>
                )}

            />
        </>
    );
};

const styles = StyleSheet.create({
    main: {
        height: 100,
        // borderColor: 'red',
        // borderWidth: 2
    },
   
    defaultTextInput :{
        backgroundColor: 'white',
        height: "100%",
        alignItems:'center',
        justifyContent:'center',
        padding:0,
        
        // alignSelf:'baseline'
        
    },
    defaultContainer :{
        backgroundColor: 'white',
        alignItems: 'center',
        width: "70%",



        borderRadius: 20,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,



        borderColor: "#e8e8e8",
        borderWidth: 1,
        paddingHorizontal: 10,
        justifyContent: 'center',
        marginVertical: 5,
        borderLeftWidth:0,
        height: 50
    },
    flagContainer :{
        backgroundColor: 'white',
        alignItems: 'center',
        width: "30%",


        borderRadius: 20,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,

        borderColor: "#e8e8e8",


        borderWidth: 1,
        borderRightWidth:0,



        paddingHorizontal: 10,
        justifyContent: 'center',
        marginVertical: 5,
        height: 50
    }
    

})
export default CustomPhoneInput;
