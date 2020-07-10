import * as React from "react";
import {
  SafeAreaView, StyleSheet, Dimensions, View, Animated,
} from "react-native";
import * as shape from "d3-shape";
import Svg, {
    Circle,
    Ellipse,
    G,
    Text,
    TSpan,
    TextPath,
    Path,
    Polygon,
    Polyline,
    Line,
    Rect,
    Use,
    Image,
    Symbol,
    Defs,
    LinearGradient,
    RadialGradient,
    Stop,
    ClipPath,
    Pattern,
    Mask,
  } from 'react-native-svg';

import StaticTabbar from "./StaticTabbar";
import TrainerDashboardView from "../../user/dashboard/TrainerDashboardView";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const { width } = Dimensions.get("window");
const height = 64;
const tabs = [
  {
    name: "clipboard", //dashboard
    route: "Dashboard",
  },
  {
    name: "activity", //explore
    route: "Train",
  },
  {
    name: "plus-circle",
    route: "Community",
  },
  {
    name: "search",
    route: "Community",
  },
  {
    name: "globe",
    route: "Community"
  },
];
const tabWidth = width / tabs.length;
const backgroundColor = "white";

const getPath = (): string => {
  const left = shape.line().x(d => d.x).y(d => d.y)([
    { x: 0, y: 0 },
    { x: width, y: 0 },
  ]);
  const tab = shape.line().x(d => d.x).y(d => d.y).curve(shape.curveBasis)([
    { x: width, y: 0 },
    { x: width + 5, y: 0 },
    { x: width + 10, y: 10 },
    { x: width + 15, y: height },
    { x: width + tabWidth - 15, y: height },
    { x: width + tabWidth - 10, y: 10 },
    { x: width + tabWidth - 5, y: 0 },
    { x: width + tabWidth, y: 0 },
  ]);
  const right = shape.line().x(d => d.x).y(d => d.y)([
    { x: width + tabWidth, y: 0 },
    { x: width * 2, y: 0 },
    { x: width * 2, y: height },
    { x: 0, y: height },
    { x: 0, y: 0 },
  ]);
  return `${left} ${tab} ${right}`;
};
const d = getPath();
interface TabbarProps {}

export default class Tabbar extends React.PureComponent<TabbarProps> {
  value = new Animated.Value(0);

  render() {
    const { value } = this;
    const translateX = value.interpolate({
      inputRange: [0, width],
      outputRange: [-width, 0],
    });
    return (
      <>
        <View {...{ height, width}} style={{backgroundColor: 'white'}}>
         
          <View style={StyleSheet.absoluteFill}>
            <StaticTabbar {...{ tabs, value }} />
          </View>
        </View>
        <SafeAreaView style={styles.container} />
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor,
  },
});
