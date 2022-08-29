import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput
} from "react-native";

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "" };
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/Background-Image.png")}
          resizeMode="cover"
          style={styles.image}
        >
          <TextInput
            style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
            onChangeText={(text) => this.setState({ text })}
            value={this.state.text}
            placeholder="Type Name Here ..."
          />

          <Button
            style={styles.button}
            title="Go to Chat"
            onPress={() =>
              this.props.navigation.navigate("Chat", { name: this.state.name })
            }
          />
        </ImageBackground>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  text: {
    color: "#FFFFFF",
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 300,
    textAlign: "center",
    backgroundColor: "#000000c0"
  },
  button: {
    height: 50,
    width: "100%",
    backgroundColor: "#757083",
    justifyContent: "center"
  }
});
