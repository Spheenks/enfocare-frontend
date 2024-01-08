// @refresh reset
import React, {useCallback, useEffect, useState} from 'react';
// import {GiftedChat} from 'react-native-gifted-chat';
import {
  StyleSheet,
  View,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Pressable,
  Text,
} from 'react-native';
const {width, height} = Dimensions.get('screen');
import AntDesign from 'react-native-vector-icons/AntDesign';

const ChatModal = ({roomRef, myData, otherUser, isMessageEnabled, onClose}) => {
  const [messages, setMessages] = useState([]);

  // useEffect(() => {

  //     console.log("ROOM", roomRef);
  //     console.log("MINE", myData.firstname);// PROBLEM
  //     console.log("HER/HIS", otherUser.firstname);
  //     console.log("ISENB?", isMessageEnabled);

  //     if (myData !== '' && otherUser !== '') {
  //         //load old messages
  //         const loadData = async () => {
  //             const myChatroom = await fetchMessages();
  //             setMessages(renderMessages(myChatroom.messages));

  //         };

  //         loadData();

  //         // set chatroom change listener

  //         // const chatRoomRef =;

  //         database().ref(`chatrooms/${roomRef}`).on('value', snapshot =>{
  //             const data = snapshot.val();
  //             setMessages(renderMessages(data.messages));
  //             console.log("LINE 40 ", data.firstUser);
  //         });

  //         return () => {
  //             //remove chatroom listener
  //             database().ref(`chatrooms/${roomRef}`).off('value', snapshot =>{
  //                 const data = snapshot.val();
  //                 setMessages(renderMessages(data.messages));

  //             });

  //         };
  //     }
  // }, [fetchMessages, renderMessages, roomRef]);

  // const renderMessages = useCallback(

  //     msgs => {
  //         console.log("DSADSAD", myData.displayPhoto);
  //         return msgs
  //             ? msgs.reverse().map((msg, index) => ({
  //                 ...msg,
  //                 _id: index,
  //                 user: {
  //                     _id:
  //                         msg.sender === myData.id
  //                             ? myData.id
  //                             : otherUser.id,
  //                     avatar:
  //                         msg.sender === myData.id
  //                             ? myData.displayPhoto
  //                             : otherUser.displayPhoto,
  //                     name:
  //                         msg.sender === myData.id
  //                             ? myData.id
  //                             : otherUser.id,
  //                 },
  //             }))
  //             : [];
  //     },
  //     [
  //         myData.displayPhoto,
  //         myData.id,
  //         otherUser.displayPhoto,
  //         otherUser.id,
  //     ],
  // );

  // const fetchMessages = useCallback(async () => {

  //     return (await database().ref(`chatrooms/${roomRef}`).once('value')).val();

  //     //  snapshot.val();

  // }, [roomRef]);

  // const onSend = useCallback(
  //     async (msg = []) => {
  //         //send the msg[0] to the other user
  //         console.log("LINE 96 ", "HERE");

  //         //fetch fresh messages from server
  //         const currentChatroom = await fetchMessages();

  //         const lastMessages = currentChatroom.messages || [];

  //         console.log("WIW" ,lastMessages);

  //         database().ref(`chatrooms/${roomRef}`).update({
  //             messages: [
  //                 ...lastMessages,
  //                 {
  //                     text: msg[0].text,
  //                     sender: myData.id,
  //                     createdAt: new Date(),
  //                 },
  //             ],
  //         });

  //         setMessages(prevMessages => GiftedChat.append(prevMessages, msg));
  //     },
  //     [fetchMessages, myData.id, roomRef],
  // );

  return (
    <>
      <Modal
        transparent={true}
        animationType="slide"
        visible={isMessageEnabled}
        onRequestClose={onClose}>
        <View style={styles.CenterView}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.transparent} />
          </TouchableWithoutFeedback>

          <View style={styles.ModalView}>
            <View style={styles.closeModal}>
              <Pressable onPress={onClose}>
                <AntDesign name="close" size={35} color="red" />
              </Pressable>
            </View>

            <Text>HAHAHAH</Text>
            {/* <GiftedChat
              messages={messages}
              onSend={newMessage => onSend(newMessage)}
              user={{
                _id: myData.id,
              }}
            /> */}
          </View>
        </View>
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({
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
    opacity: 0.5,
    position: 'absolute',
  },
  ModalView: {
    margin: 20,
    padding: 20,
    minWidth: width * 1.0,
    minHeight: height * 1.0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  closeModal: {
    height: 40,
    width: 40,
    position: 'absolute',
    top: 0,
    right: 0,
    // borderWidth:2,
    // borderColor:'red'
  },
});
export default ChatModal;
