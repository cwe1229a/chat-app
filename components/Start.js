import React, { Component } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TextInput
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      color: "color"
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/Background-Image.png")}
          resizeMode="cover"
          style={styles.image}
        >
          <Text style={{ fontSize: 45, fontWeight: "bold", color: "#FFFFFF" }}>
            Chat App
          </Text>
          <View style={styles.mainBox}>
            {/* input box for chat user's name */}
            <TextInput
              style={[styles.inputBox, styles.textBox]}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder="Your Name"
            />
            {/* color options for chat user */}
            <View style={styles.colorContainer}>
              <Text style={styles.textBox}>Choose Background Color:</Text>
              <View style={styles.colorOptions}>
                <TouchableOpacity
                  style={[styles.color, styles.black]}
                  onPress={() => this.setState({ color: "#090C08" })}
                />
                <TouchableOpacity
                  style={[styles.color, styles.purple]}
                  onPress={() => this.setState({ color: "#474056" })}
                />
                <TouchableOpacity
                  style={[styles.color, styles.blue]}
                  onPress={() => this.setState({ color: "#8A95A5" })}
                />
                <TouchableOpacity
                  style={[styles.color, styles.green]}
                  onPress={() => this.setState({ color: "#B9C6AE" })}
                />
              </View>
            </View>
            {/* button for entering chat */}
            <View style={styles.buttonWrapper}>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  this.props.navigation.navigate("Chat", {
                    name: this.state.name,
                    color: this.state.color
                  })
                }
              >
                <Text style={styles.buttonText}>Start Chatting</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    flexDirection: "column",
    resizeMode: "cover",
    alignItems: "center"
  },
  mainBox: {
    width: "88%",
    height: "44%",
    alignItms: "center",
    backgroundColor: "#FFFFFF",
    justifyContent: "space-evenly",
    marginBottom: "6%",
    paddingTop: "6%",
    paddingBottom: "6%",
    alignItems: "center"
  },
  inputBox: {
    height: 50,
    width: "88%",
    borderColor: "gray",
    borderWidth: 2,
    borderRadius: 2,
    padding: "3%"
  },
  textBox: {
    color: "#757083",
    fontSize: 16,
    fontWeight: "300"
  },
  buttonWrapper: {
    width: "88%",
    flex: 1
  },
  button: {
    height: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    backgroundColor: "#757083"
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "300"
  },
  colorContainer: {
    width: "88%",
    height: "60%",
    justifyContent: "center",
    marginLeft: "6%"
  },
  colorOptions: {
    flexDirection: "row",
    marginBottom: 1,
    width: "88%"
  },
  color: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 30
  },
  black: {
    backgroundColor: "#090C08"
  },
  purple: {
    backgroundColor: "#474056"
  },
  blue: {
    backgroundColor: "#8A95A5"
  },
  green: {
    backgroundColor: "#B9C6AE"
  }
});
