import React from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { View, Platform, KeyboardAvoidingView } from "react-native";

const firebase = require("firebase");
require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBP_FTsteHUWeawUQowhsO9LrYUHssVkg4",
  authDomain: "chatapp-af9d0.firebaseapp.com",
  projectId: "chatapp-af9d0",
  storageBucket: "chatapp-af9d0.appspot.com",
  messagingSenderId: "44516583816",
};

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: ""
      }
    };
  }

  const firebaseConfig = {
    apiKey: 'AIzaSyAd6fGIIwQWI5MqB6oiUWCWWIsA88GJSb8',
    authDomain: 'chat-app-ca5fc.firebaseapp.com',
    projectId: 'chat-app-ca5fc',
    storageBucket: 'chat-app-ca5fc.appspot.com',
    messagingSenderId: '567584485893',
    appId: '1:567584485893:web:64055bf80360e210f3226c',
    measurementId: 'G-03TJLPBFZ7',
  };
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  // Reference to Firestore collection
  this.referenceChatMessages = firebase.firestore().collection('messages');
}

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createAt: data.createdAt.toDate(),
        user: data.user
      });
    });
    this.setState({
      messages: messages
    });
  };

  addMessages = (message) => {
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user
    });
  };

  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages)
      }),
      () => {
        this.addMessages();
      }
    );
  }

  componentDidMount() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    // Reference to load messages from Firebase
    this.referenceChatMessages = firebase.firestore().collection("messages");

    // Authenticate user anonymously in Firebase
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
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
  }
  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    let name = this.props.route.params.name;
    let color = this.props.route.params.color;

    this.props.navigation.setOptions({ title: name });

    return (
      <View style={{ backgroundColor: color, flex: 1 }}>
        <GiftedChat
          messages={this.state.messages}
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
