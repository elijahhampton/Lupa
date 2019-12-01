import React from "react";
import {
    View,
    TouchableWithoutFeedback,
    StyleSheet,
    Animated,
    Dimensions
} from 'react-native';

import { withNavigation, NavigationScreenProps } from 'react-navigation';

import { Feather as Icon } from "@expo/vector-icons";

interface Tab {
    name: string;
}

interface StaticTabbarProps extends NavigationScreenProps {
    tabs: Tab[];
    value: Animated.Value;
}

export const tabHeight = 64;
const { width } = Dimensions.get('window');

class TrainerStaticTabbar extends React.PureComponent<StaticTabbarProps> {
    values: Animated.Value[] = [];

    constructor(props) {
        super(props);

        const { tabs } = this.props;
        this.values = tabs.map((tab, index) => new Animated.Value(index === 0 ? 1 : 0));
        
    }
    
    onPress = (index: number) => {
        const { value, tabs } = this.props;
        const tabWidth = width / tabs.length;

        Animated.sequence([
            ...this.values.map(value => Animated.timing(value, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            })),
            Animated.parallel([
                Animated.spring(this.values[index], {
                    toValue: 1,
                    useNativeDriver: true,
                }),
                Animated.spring(value, {
                    toValue: -width + tabWidth * index,
                    useNativeDriver: true
                }),
            ]),
    ]).start();

    console.log(index);
    
    switch(index) {
        case 0:
            this.props.navigation.navigate('ActivityView');
            break;
        case 1:
            this.props.navigation.navigate('MessagesView');
            break;
        case 2:
            this.props.navigation.navigate('DashboardView');
            break;
        case 3:
            this.props.navigation.navigate('NotificationsView');
            break;
        case 4:
            this.props.navigation.navigate('ProfileView');
            break;
        default:
            this.props.navigation.navigate('DashboardView')
    }
    console.log(index);

    };

    render() {
        const { tabs, value } = this.props;
        const tabWidth = width / tabs.length;
        return (
            <View style={styles.container}>
                {

                    tabs.map(({ name }, key) => {
                        const activeValue = this.values[key];
                        const opacity = value.interpolate({
                            inputRange: [-width + tabWidth * (key - 1), -width + tabWidth * key, -width + tabWidth * (key + 1)],
                            outputRange: [1, 0, 1],
                            extrapolate: "clamp",
                        });
                        const translateY = activeValue.interpolate({
                            inputRange: [0,1],
                            outputRange: [tabHeight, 0],
                        });
                        return (
                            <React.Fragment {...{ key }}>
                                <TouchableWithoutFeedback onPress={() => this.onPress(key)}>
                                    <Animated.View style={[styles.tab, { opacity }]}>
                                        <Icon size={15} {...{ name }} />
                                    </Animated.View>
                                </TouchableWithoutFeedback>

                                
                                <Animated.View style={{ 
                                    position: "absolute",
                                    top: -15, 
                                    width: tabWidth, 
                                    left: tabWidth * key, 
                                    height: tabHeight, 
                                    justifyContent: "center", 
                                    alignItems: "center",
                                    transform: [{ translateY }],
                                    backgroundColor: "transparent",
                                    }}
                                    
                                    >
                                        <View style={styles.circle}>
                                        <Icon size={25} {...{ name }} />
                                        </View>
                                </Animated.View>

                            </React.Fragment>

                        );
                    })
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "transparent",
    },
    tab: {
        flex: 1,
        height: tabHeight,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    },
    circle: {
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: "transparent", //Change color back to white to show circle on tab popup
        justifyContent: "center",
        alignItems: "center",
    }
})

export default withNavigation(TrainerStaticTabbar);