
import React, {Component} from "react";
import {Animated, Image, Dimensions, Platform, SafeAreaView, Text, View, RefreshControl} from 'react-native';
import {Body, Header, List, ListItem as Item, ScrollableTab, Tab, Right, Tabs, Title, Left} from "native-base";
import { Banner, FAB, Appbar, Divider , Surface} from 'react-native-paper';
import MyPrograms from "./MyPrograms";
import Featured from "./Featured";
import { MenuIcon } from "./icons";
import CreateWorkout from "./workout/createworkout/CreateWorkout";
import Feather1s from "react-native-feather1s/src/Feather1s";
import { throwIfAudioIsDisabled } from "expo-av/build/Audio/AudioAvailability";

const NAVBAR_HEIGHT = 50;
const {width: SCREEN_WIDTH} = Dimensions.get("window");
const COLOR = "white";
const TAB_PROPS = {
  tabStyle: {backgroundColor: COLOR},
  activeTabStyle: {backgroundColor: COLOR},
  textStyle: {color: "rgba(35, 55, 77, 0.75)", fontFamily: 'Avenir-Heavy'},
  activeTextStyle: {color: "#1089ff", fontFamily: 'Avenir-Heavy', fontWeight: 'bold'}
};

export class LupaHome extends Component {
  scroll = new Animated.Value(0);
  headerY;

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    }
    this.headerY = Animated.multiply(Animated.diffClamp(this.scroll, 0, NAVBAR_HEIGHT), -1);
  }

  handleOnRefresh() {
    this.setState({ refreshing: true })
    console.log('Refreshing LupaHome')
    this.setState({ refreshing: false })
  }

  render() {
    const tabContent = (
      <List>{new Array(20).fill(null).map((_, i) => <Item
        key={i}><Text>Item {i}</Text></Item>)}</List>);
    const tabY = Animated.add(this.scroll, this.headerY);
    return (
      <View>
        {Platform.OS === "ios" && 
        <View style={{backgroundColor: COLOR, height: 30, width: "100%", position: "absolute", zIndex: 2}}/>}
        <Animated.View style={{
          width: "100%",
          position: "absolute",
          transform: [{
            translateY: this.headerY
          }],
          elevation: 0,
          flex: 1,
          zIndex: 1,
          backgroundColor: COLOR
        }}>
          <Header style={{backgroundColor: 'white', borderBottomColor: 'transparent', borderColor: 'transparent'}} noShadow={true} hasTabs>
            <Left style={{flexDirection: 'row', alignItems: 'center'}}>
              <MenuIcon customStyle={{}} onPress={() => this.props.navigation.openDrawer()}/>
            </Left>

            <Body>
            <Title style={{}}>
              <Text style={{color: "black", fontSize: 25, fontFamily: 'Avenir'}}>
                Lupa
              </Text>
            </Title>
            </Body>

            <Right>
            <Appbar.Action onPress={() => this.props.navigation.push('Messages')} icon={() => <Feather1s thin={true} name="mail" size={20} />}/>
                <Appbar.Action onPress={() => this.props.navigation.push('Notifications')} icon={() => <Feather1s thin={true} name="bell" size={20} />}/>
            </Right>
          </Header>
          <SafeAreaView />
        </Animated.View>
        
        <Animated.ScrollView
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.handleOnRefresh}/>}
          scrollEventThrottle={1}
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={{zIndex: 0, height: "100%", elevation: -1}}
          contentContainerStyle={{paddingTop: 50, backgroundColor: 'white'}}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.scroll}}}],
            {useNativeDriver: true},
          )}
          overScrollMode="never">
          <Tabs 
          
          renderTabBar={(props) => <Animated.View
            style={[{
              transform: [{translateY: tabY}],
              zIndex: 1,
  
              width: "100%",
              backgroundColor: COLOR,
              justifyContent: 'flex-start',
            }, Platform.OS === "ios" ? {paddingTop: 30} : null]}>
            <ScrollableTab {...props} style={{ height: 40, shadowRadius: 1, justifyContent: 'flex-start', elevation: 0, borderBottomColor: 'transparent'}} tabsContainerStyle={{justifyContent: 'flex-start', backgroundColor: '#FFFFFF', elevation: 0, borderBottomColor: 'transparent'}} underlineStyle={{backgroundColor: "#1089ff", height: 2, elevation: 0, borderRadius: 8}}/>
            <Divider />
          </Animated.View>
          }>
            
            <Tab heading="Home" {...TAB_PROPS} >
            <Featured />
            </Tab>
            <Tab heading="My Programs" {...TAB_PROPS}>
              <MyPrograms />
            </Tab>
          </Tabs>
        </Animated.ScrollView>

        <FAB onPress={() => this.props.navigation.push('CreatePost')} icon="rss" style={{backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 16}} />
      </View>
    );
  }
}

export default LupaHome;