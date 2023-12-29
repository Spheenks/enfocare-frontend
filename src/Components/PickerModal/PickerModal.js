import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  Dimensions,
} from 'react-native';

const {width, height} = Dimensions.get('screen');
const PickerModal = ({
  pickerValue,
  isVisible,
  onClose,
  options,
  onSelect,
  onOpenPicker,
  customStylePickerStyle,
  placeholder,
}) => {
  return (
    <>
      <TouchableOpacity
        style={customStylePickerStyle ? customStylePickerStyle : styles.Picker}
        onPress={onOpenPicker}>
        <Text style={styles.PickerText}>
          {pickerValue !== '' ? pickerValue : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="fade"
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
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.ItemsCont}
                  onPress={() =>
                    typeof onSelect === 'function' && onSelect(item)
                  }>
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

export default PickerModal;

const styles = StyleSheet.create({
  ItemsCont: {
    borderRadius: 10,
    marginTop: 5,
    // backgroundColor: 'pink',
    justifyContent: 'center',
  },
  Picker: {
    height: 50,
    width: '100%',
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    borderTopColor: 'black',
    borderTopWidth: 1,
  },
  PickerText: {
    fontSize: 14,
    color: 'black',
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
    backgroundColor: 'black',
    opacity: 0.2,
    position: 'absolute',
  },
  ModalView: {
    margin: 20,
    padding: 20,
    minWidth: width * 0.8,
    minHeight: height * 0.2,
    maxHeight: height * 0.6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  ItemText: {
    marginVertical: 10,

    fontSize: 20,
  },
});
