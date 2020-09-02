
import React, {Component} from "react";
import {Animated, Image, Dimensions, Platform, SafeAreaView, Text, View} from 'react-native';
import {Body, Header, List, ListItem as Item, ScrollableTab, Tab, Right, Tabs, Title, Left} from "native-base";
import { Banner, FAB } from 'react-native-paper';
import MyPrograms from "./MyPrograms";
import Featured from "./Featured";
import { MenuIcon } from "./icons";

const NAVBAR_HEIGHT = 50;
const {width: SCREEN_WIDTH} = Dimensions.get("window");
const COLOR = "white";
const TAB_PROPS = {
  tabStyle: {backgroundColor: COLOR},
  activeTabStyle: {backgroundColor: COLOR},
  textStyle: {color: "rgb(174, 174, 178)", fontFamily: 'Avenir-Heavy'},
  activeTextStyle: {color: "#1089ff", fontFamily: 'Avenir-Heavy', fontWeight: 'bold'}
};

export class LupaHome extends Component {
  scroll = new Animated.Value(0);
  headerY;

  constructor(props) {
    super(props);
    this.headerY = Animated.multiply(Animated.diffClamp(this.scroll, 0, NAVBAR_HEIGHT), -1);
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
          <Header style={{backgroundColor: 'transparent', borderBottomColor: 'transparent'}}  hasTabs>
            <Left style={{paddingLeft: 10, flexDirection: 'row', alignItems: 'center'}}>
              <MenuIcon customStyle={{marginRight: 10}} onPress={() => this.props.navigation.openDrawer()}/>
          
            </Left>

            <Body>
            <Title style={{}}>
              <Text style={{color: "black", fontSize: 25, fontFamily: 'Avenir'}}>
                Lupa
              </Text>
            </Title>
            </Body>

            <Right />
          </Header>
          <SafeAreaView />
        </Animated.View>
        
        <Animated.ScrollView
          scrollEventThrottle={1}
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={{zIndex: 0, height: "100%", elevation: -1}}
          contentContainerStyle={{paddingTop: 50}}
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
          </Animated.View>
          }>
            
            <Tab heading="Featured" {...TAB_PROPS} >
            <Featured />
            </Tab>
            <Tab heading="My Programs" {...TAB_PROPS}>
              <MyPrograms />
            </Tab>
            <Tab heading="Packs" {...TAB_PROPS}>
             
            </Tab>
          </Tabs>
        </Animated.ScrollView>

        <FAB onPress={() => this.props.navigation.push('CreatePost')} icon="rss" style={{backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 16}} />
      </View>
    );
  }
}

export default LupaHome;