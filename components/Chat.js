import React from "react";
import { GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { View, Platform, KeyboardAvoidingView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

import CustomActions from "./CustomActions";

import * as Location from "expo-location";
import MapView from "react-native-maps";

const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
        avatar: ""
      },
      isConnected: null,
      image: null,
      location: null
    };

    // set up firebase
    const firebaseConfig = {
      apiKey: "AIzaSyBP_FTsteHUWeawUQowhsO9LrYUHssVkg4",
      authDomain: "chatapp-af9d0.firebaseapp.com",
      projectId: "chatapp-af9d0",
      storageBucket: "chatapp-af9d0.appspot.com",
      messagingSenderId: "44516583816"
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // reference to firestore collection
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name
        },
        image: data.image || null,
        location: data.location || null
      });
    });
    this.setState({
      messages: messages
    });
  };

  // adding messages to firestore
  addMessages = (message) => {
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null
    });
  };

  // add messages to the state
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages)
      }),
      () => {
        this.saveMessages();
        if (this.state.isConnected === true) {
          this.addMessages(this.state.messages[0]);
        }
      }
    );
  }

  // getting, saving and deleting messages for asyncstorage
  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: []
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    // set name at top of the chat
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    // check if user is offline or online
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({
          isConnected: true
        });

        // ref load messages from Firebase
        this.referenceChatMessages = firebase
          .firestore()
          .collection("messages");

        // authenticate user anonymously
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              firebase.auth().signInAnonymously();
            }
            this.setState({
              uid: user.uid,
              messages: [],
              user: {
                _id: user.uid,
                name: name
              }
            });
            this.unsubscribe = this.referenceChatMessages
              .orderBy("createdAt", "desc")
              .onSnapshot(this.onCollectionUpdate);
          });
      } else {
        this.setState({
          isConnected: false
        });
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    if (this.isConnected) {
      this.unsubscribe();
      this.authUnsubscribe();
    }
  }

  renderInputToolbar(props) {
    if (this.state.isConnected === false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  renderCustomActions = (props) => <CustomActions {...props} />;

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
      );
    }
    return null;
  }

  render() {
    let name = this.props.route.params.name;
    let color = this.props.route.params.color;

    this.props.navigation.setOptions({ title: name });

    return (
      <View style={{ backgroundColor: color, flex: 1 }}>
        <GiftedChat
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          messages={this.state.messages}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.user._id,
            name: name
          }}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}
