import React from "react";
import { Dimensions, Image, StyleSheet } from "react-native";

const { height: wHeight, width: wWidth } = Dimensions.get("window");
// eslint-disable-next-line @typescript-eslint/no-var-requires
export const backgroundImage = require("./assets/background.jpeg");

export const HEADER_IMAGE_HEIGHT = wHeight / 3;
const styles = StyleSheet.create({
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    width: wWidth,
    resizeMode: "cover",
    height: HEADER_IMAGE_HEIGHT
  }
});

interface HeaderImageProps {}

export default ({}: HeaderImageProps) => {
  return <Image source={backgroundImage} style={styles.image} />;
};
