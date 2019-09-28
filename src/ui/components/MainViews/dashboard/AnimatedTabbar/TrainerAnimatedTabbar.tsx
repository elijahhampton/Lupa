import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    Dimensions,
    Animated
} from 'react-native';

import {
    Surface
} from 'react-native-paper';

import * as shape from "d3-shape";

import TrainerStaticTabbar, { tabHeight as height } from "./TrainerStaticTabbar";

const tabs = [
    {name: "activity" },
    {name: "calendar" },
    {name: "briefcase"},
    {name: "bell"},
    {name: "user" }
];

const { width } = Dimensions.get('window');

const tabWidth = width / tabs.length;

import Svg, {Path} from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const left = shape.line()
.x(d => d.x)
.y(d => d.y)
([
    { x: 0, y: 0, },
    { x: width, y: 0 },
]);

//Line to add dip into tabbar
const tab = shape.line()
.x(d => d.x)
.y(d => d.y)
.curve(shape.curveBasis)([
    { x: width, y: 0 },
    { x: width + 5, y: 0 },
    { x: width + 10, y: 10 },
    { x: width + 15, y: height },
    { x: width + tabWidth - 15, y: height },
    { x: width + tabWidth - 10, y: 10 },
    { x: width + tabWidth - 5, y: 0 },
    { x: width + tabWidth, y: 0 },
])

const right = shape.line()
.x(d => d.x)
.y(d => d.y)
([
    { x: width + tabWidth, y: 0, },
    { x: width * 2.5, y: 0 },
    { x: width * 2.5, y: height },
    { x: 0, y: height },
    { x: 0, y: 0 },
]);

const d = `${left} ${right}`;

interface TabbarProps {};

export default class TrainerAnimatedTabbar extends React.PureComponent<TabbarProps> {
    value = new Animated.Value(-width);

    render() {
        const { value: translateX } = this;
        return (
            <View style={styles.container}>


            <View style={{backgroundColor: "transparent",}} {...{width, height }}>
            <AnimatedSvg width={width * 2.5} style={{ transform: [{ translateX }]}} {...{ height }}>
                <Path {...{d}} fill="white"/>
            </AnimatedSvg>
            <View style={[StyleSheet.absoluteFill, { backgroundColor: "transparent", }]}>
                <TrainerStaticTabbar value={translateX} {...{ tabs }} />
            </View>

            </View>
            <SafeAreaView style={styles.safeArea}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        backgroundColor: "transparent",
    },
    safeArea: {
        backgroundColor: "transparent",
        width: "100%",
        height: "100%",
    }
});