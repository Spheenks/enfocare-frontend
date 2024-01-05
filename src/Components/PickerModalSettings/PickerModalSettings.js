import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Modal, TouchableWithoutFeedback, FlatList, Dimensions } from 'react-native';


const { width, height } = Dimensions.get('screen')
const PickerModalSettings = ({ isVisible, onClose, options, onSelect }) => {
    return (
        <>

            {/* <TouchableOpacity style={styles.Picker} onPress={onOpenPicker}>
                <Text style={styles.PickerText}>{pickerValue}</Text>
            </TouchableOpacity> */}


            <Modal
                transparent={true}
                animationType='fade'
                visible={isVisible}
                onRequestClose={onClose}>
                <View style={styles.CenterView}>
                    <TouchableWithoutFeedback onPress={onClose}>
                        <View style={styles.transparent} />
                    </TouchableWithoutFeedback>

                    <View style={styles.ModalView}>
                        <FlatList
                            data={options}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.ItemsCont}
                                    onPress={() => typeof onSelect === 'function' && onSelect(item)}>
                                    <Text style={styles.ItemText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </>
    );
};



export default PickerModalSettings;

const styles = StyleSheet.create({

    ItemsCont: {
        borderRadius: 10,
        marginTop: 5,
        // backgroundColor: 'pink',
        paddingHorizontal:5,
        justifyContent: 'center',
        

    },
  
    CenterView: {
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    transparent: {
        width,
        height,
        // backgroundColor: 'black',
        opacity: 0.2,
        position: 'absolute',


    },
    ModalView: {
        position:'absolute',
        top:40,
        margin: 20,
        right:0,
        padding: 20,
        minWidth: width * 0.1,
        minHeight: height * 0.2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderRadius: 10,
       
        backgroundColor: '#FFF',
        paddingVertical:30,
    },
    ItemText: {
        marginVertical: 10,
        fontSize: 14,
    }
})