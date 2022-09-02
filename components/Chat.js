import React from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { View, Platform, KeyboardAvoidingView } from "react-native";
// const firebase = require("firebase");
// require("firebase/firestore");

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: []
    };
  }

  componentDidMount() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any"
          }
        },
        {
          _id: 2,
          text: `${name} has entered the chat`,
          createdAt: new Date(),
          system: true
        }
      ]
    });
  }

  onSend(messages = []) {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));
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
            _id: 1
          }}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}
