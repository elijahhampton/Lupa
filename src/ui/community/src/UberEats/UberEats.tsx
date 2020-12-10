import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import HeaderImage from "./HeaderImage";
import Content, { defaultTabs } from "./Content";
import Header from "./Header";

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default () => {
  const [tabs, setTabs] = useState(defaultTabs);
  return (
    <View style={styles.container}>
      <HeaderImage />
      <ScrollView style={StyleSheet.absoluteFill} scrollEventThrottle={1}>
        <Content
          onMeasurement={(index, tab) => {
            tabs[index] = tab;
            setTabs([...tabs]);
          }}
        />
      </ScrollView>
      <Header {...{ tabs }} />
    </View>
  );
};
