import React, { RefObject } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { useSafeArea } from "react-native-safe-area-context";

import { HEADER_IMAGE_HEIGHT } from "./HeaderImage";
import TabHeader from "./TabHeader";
import { TabModel } from "./Content";

const ICON_SIZE = 24;
const PADDING = 16;
export const MIN_HEADER_HEIGHT = 45;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0
  },
  header: {
    flexDirection: "row",
    height: MIN_HEADER_HEIGHT,
    alignItems: "center",
    paddingHorizontal: PADDING
  },
  title: {
    fontFamily: "UberMoveMedium",
    fontSize: 18,
    marginLeft: PADDING,
    flex: 1
  }
});

interface HeaderProps {
  tabs: TabModel[];
}

export default ({ tabs }: HeaderProps) => {
  const insets = useSafeArea();
  const { top: paddingTop } = insets;
  return (
    <View style={[styles.container, { paddingTop }]}>
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "white"
        }}
      />
      <View style={styles.header}>
        <View>
          <Icon name="arrow-left" size={ICON_SIZE} color="black" />
        </View>
        <Text style={styles.title}>Miss Miu Europaallee</Text>
        <Icon name="heart" size={ICON_SIZE} color="white" />
      </View>
      <TabHeader {...{ tabs }} />
    </View>
  );
};
