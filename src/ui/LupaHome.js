
import React, {Component} from "react";
import {Animated,ScrollView,  Image, Dimensions, Platform, SafeAreaView, Text, View, RefreshControl} from 'react-native';
import {Body, Header, List, ListItem as Item, ScrollableTab, Tab, Right, Tabs, Title, Left} from "native-base";
import { Banner, FAB, Appbar, Divider , Surface} from 'react-native-paper';
import MyPrograms from "./MyPrograms";
import Featured from "./Featured";
import GuestView from './GuestView';
import { MenuIcon } from "./icons";
import CreateWorkout from "./workout/createworkout/CreateWorkout";
import Feather1s from "react-native-feather1s/src/Feather1s";
import WorkoutLog from "./WorkoutLog";
import { connect } from 'react-redux';
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import MyClients from './user/trainer/MyClients'
const NAVBAR_HEIGHT = 50;
const {width: SCREEN_WIDTH} = Dimensions.get("window");
const COLOR = "#FFFFFF";
const TAB_PROPS = {
  tabStyle: {backgroundColor: COLOR},
  activeTabStyle: {backgroundColor: COLOR},
  textStyle: {color: "rgba(35, 55, 77, 0.75)", fontFamily: 'Avenir-Heavy'},
  activeTextStyle: {color: "#1089ff", fontFamily: 'Avenir-Heavy', fontWeight: 'bold'}
};

const mapStateToProps = (state, action) => {
  return {
    lupa_data: state,
  }
}

export class LupaHome extends Component {
  scroll = new Animated.Value(0);
  headerY;

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      currTab: 0,
    }
    this.headerY = Animated.multiply(Animated.diffClamp(this.scroll, 0, NAVBAR_HEIGHT), -1);
  }

  handleOnRefresh = () => {
    this.setState({ refreshing: true })
    this.setState({ refreshing: false })
  }

  renderAppropriateFirstTab = (navigation) => {
    if (this.props.lupa_data.Users.currUserData.isTrainer === true) {
      return <GuestView navigation={this.props.navigation} />
    }


    return <GuestView navigation={this.props.navigation} />
    
  }

  renderAppropriateSecondaryTab = () => {
    if (this.props.lupa_data.Users.currUserData.isTrainer === true) {
      return (
        <Tab heading="My Programs" {...TAB_PROPS}>
          <MyPrograms />
      </Tab>
      )
    } else {
      return (
       /* <Tab heading="Workout log" {...TAB_PROPS}>
        <WorkoutLog navigation={this.props.navigation} />
      </Tab>*/
      null
      )
    }
  }


  render() {
    const currTab = this.state.currTab;
    return (
        <View style={{flex: 1}}>
          <Header style={{backgroundColor: COLOR}} noShadow={false} hasTabs>
            <Left style={{flexDirection: 'row', alignItems: 'center'}}>
              <MenuIcon onPress={() => this.props.navigation.openDrawer()}/>
            </Left>

            <Body>
              <Image source={require('./icons/logo.jpg')} style={{marginTop: 5, width: 35, height: 35}} />
            </Body>

            <Right>
            <Appbar.Action onPress={() => this.props.navigation.push('Messages')} icon={() => <Feather1s thin={true} name="mail" size={20} />}/>
                <Appbar.Action onPress={() => this.props.navigation.push('Notifications')} icon={() => <Feather1s thin={true} name="bell" size={20} />}/>
            </Right>
          </Header>
          <Tabs 
          onChangeTab={tabInfo => this.setState({ currTab: tabInfo.i })} 
          style={{backgroundColor: '#FFFFFF'}}
          tabBarUnderlineStyle={{backgroundColor: '#FFFFFF', height: 1}}
          renderTabBar={(props) =>
            <ScrollableTab {...props} style={{borderBottomWidth: 0.5, borderColor: 'rgb(174, 174, 178)',  height: 40, shadowRadius: 1, justifyContent: 'flex-start', elevation: 0, backgroundColor: COLOR}} tabsContainerStyle={{justifyContent: 'flex-start', backgroundColor: COLOR, elevation: 0}} underlineStyle={{backgroundColor: "#1089ff", height: 1, elevation: 0, borderRadius: 8}}/>}>
            
            <Tab heading='Explore' {...TAB_PROPS} >
                {this.renderAppropriateFirstTab(this.props.navigation)}
            </Tab>
           {this.renderAppropriateSecondaryTab()}
           <Tab heading="Community" {...TAB_PROPS}>
           <Featured navigation={this.props.navigation} />
           </Tab>
          </Tabs>

          {this.props.lupa_data.Auth.isAuthenticated == true ?  <FAB small onPress={() => this.props.navigation.push('CreatePost')} icon="video" style={{backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 16, color: 'white', alignItems: 'center', justifyContent: 'center',}} color="white" /> : null}
      </View>
    );
  }
}

export default connect(mapStateToProps)(LupaHome);