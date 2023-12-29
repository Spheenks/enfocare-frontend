import React from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity } from "react-native";


const CustomButton = ({ onPress, text, type }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, styles[`container_${type}`]]}>
            <Text style={[styles.text, styles[`text_${type}`]]}>{text}</Text>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    // CONTAINER
    container: {
        width: '100%',
        padding: 15,
        marginVertical: 5,
        alignItems: 'center',
        borderRadius: 5,
        
    },
    container_PRIMARY: {
        backgroundColor: '#74DA74',
    },
    container_TERTIARY: {
       
    },
    // TEXT
    text: {
        fontWeight: 'bold',
        color: 'white',
    },

    text_PRIMARY: {
        fontWeight: 'bold',
        color: 'white',
    },

    text_TERTIARY: {
        fontWeight: 'bold',
        color: 'gray',
        textDecorationLine:'underline'
        
    },

    text_BLUE: {
        fontWeight: 'bold',
        // color: 'gray',
        // textDecorationLine:'underline'
        
    },
    container_BLUE: {
        backgroundColor: '#2196F3',
    },
    


});
export default CustomButton;