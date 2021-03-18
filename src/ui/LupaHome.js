
import React, { Component, createRef } from "react";

import {
  Image,
  Dimensions,
  Text,
  View,
} from 'react-native';

import {
  Body,
  Header,
  ScrollableTab,
  Tab,
  Right,
  Tabs,
  Left
} from "native-base";

import {
  FAB,
  Appbar,
  Menu,
  Dialog,
  Paragraph,
  Button
} from 'react-native-paper';

import MyPrograms from "./MyPrograms";
import Featured from "./Featured";
import GuestView from './GuestView';
import { MenuIcon } from "./icons";
import FeatherIcon from 'react-native-vector-icons/Feather'
import { connect } from 'react-redux';
import { getLupaStoreState } from "../controller/redux";
import LupaController from "../controller/lupa/LupaController";
import CreatePackDialog from "./packs/dialogs/CreatePackDialog";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import RequestCommunity from "./community/RequestCommunity";
import CommunityFeed from "./community/CommunityFeed";
import LUPA_DB from "../controller/firebase/firebase";
import { LOG_ERROR } from "../common/Logger";
import CommunityHome from "./community/CommunityHome";
import Animated from "react-native-reanimated";

const COLOR = "#23374d";
const TAB_PROPS = {
  tabStyle: { backgroundColor: COLOR },
  activeTabStyle: { backgroundColor: COLOR },
  textStyle: { color: "#AAAAAA", fontFamily: 'Avenir-Heavy', fontSize: 20 },
  activeTextStyle: { color: "#1089ff", fontFamily: 'Avenir-Heavy', fontWeight: 'bold', fontSize: 20 }
};

const mapStateToProps = (state, action) => {
  return {
    lupa_data: state,
  }
}

function PackLeaderLimitDialog({ isVisible, closeDialog }) {
  return (
    <Dialog visible={isVisible} onDismiss={closeDialog} style={{ borderRadius: 20 }}>
      <Dialog.Title>
        Leader Limit Reached
      </Dialog.Title>
      <Dialog.Content>
        <Paragraph>
          You've reached the limit of packs that you are allowed to join.  Delete a pack or try creating a pack at a later date.
        </Paragraph>
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          style={{ alignSelf: 'flex-end', elevation: 0 }}
          contentStyle={{ paddingHorizontal: 10 }}
          color="#1089ff"
          theme={{ roundness: 8 }}
          uppercase={false}
          mode="contained"
          onPress={closeDialog}
        >
          <Text style={{ fontFamily: 'Avenir', fontSize: 15 }}>
            Okay
          </Text>
        </Button>
      </Dialog.Actions>
    </Dialog>
  )
}

export class LupaHome extends Component {

  constructor(props) {
    super(props);

    this.createPackSheetRef = createRef();

    this.state = {
      refreshing: false,
      showTrainerContent: false,
      currTab: 0,
      showPackLeaderLimitReachedDialog: false,
      showCommunityRequestModal: false,
      createIsVisble: false,
      userCommunities: [],
      tabHeight: new Animated.Value(40)
    }

    this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
  }

  async componentDidMount() {
    await this.LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(this.props.lupa_data.Users.currUserData.user_uuid, 'isTrainer').then(attribute => {
      this.setState({ showTrainerContent: attribute })
    }).catch(error => {
      this.setState({ showTrainerContent: false })
    });

    let communityData = [];
    this.COMMUNITY_OBSERVER = LUPA_DB.collection('communities').where('members', 'array-contains', this.props.lupa_data.Users.currUserData.user_uuid).onSnapshot(querySnapshot => {

      querySnapshot.docs.forEach(doc => {
        if (doc.data().approved != -1) {
          communityData.push(doc.data());
        }
      })
    }, error => {
      communityData = [];
      LOG_ERROR('LupaHome.js', 'Error while fetching community data.', error)
    })


    this.setState({ userCommunities: communityData })

  }

  componentWillUnmount() {
    return () => this.COMMUNITY_OBSERVER();
  }

  handleOnRefresh = () => {
    this.setState({ refreshing: true })
    this.setState({ refreshing: false })
  }

  handleOpenCreatePack = () => {
    this.createPackSheetRef.current.open();
  }

  handleOnCloseCreatePack = () => {
    this.createPackSheetRef.current.close();
  }

  renderAppropriateFirstTab = () => {
    return <GuestView navigation={this.props.navigation} onScrollUp={this.onScrollUp} onScrollDown={this.onScrollDown} />
  }

  renderAppropriateSecondaryTab = () => {
    const updatedUserState = getLupaStoreState().Users.currUserData;
    if (updatedUserState.isTrainer == false) {
      return null;
    } else {
      return (
        <Tab heading="My Programs" {...TAB_PROPS}>
          <MyPrograms />
        </Tab>
      )
    }
  }

  renderCommunityTabs = () => {
    return this.state.userCommunities.map((community, index, arr) => {
      return (
        <Tab heading={community.name} {...TAB_PROPS}>
          <CommunityHome communityData={community} />
        </Tab>
      )
    })
  }

  renderFAB = () => {
    if (this.props.lupa_data.Auth.isAuthenticated == true) {
      if (this.props.lupa_data.Users.currUserData.isTrainer == true) {
        if (this.state.currTab != 0 || this.state.currTab != 1) {
          return (
            <FAB small={false} onPress={() => this.props.navigation.push('CreatePost')} icon="video" style={{ backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 16, color: 'white', alignItems: 'center', justifyContent: 'center', }} color="white" />
          )
        }

      } else if (this.props.lupa_data.Users.currUserData.isTrainer == false) {
        if (this.state.currTab != 0) {
          return <FAB small={false} onPress={() => this.props.navigation.push('CreatePost')} icon="video" style={{ backgroundColor: '#1089ff', position: 'absolute', bottom: 0, right: 0, margin: 16, color: 'white', alignItems: 'center', justifyContent: 'center', }} color="white" />
        }
      }
    }
  }

  handleOnChooseCreatePack = () => {
    const userPacks = getLupaStoreState().Packs.currUserPacksData;
    const updatedUserState = getLupaStoreState().Users.currUserData;


    let count = 0;
    for (let i = 0; i < userPacks.length; i++) {
      if (userPacks[i].leader == updatedUserState.user_uuid) {
        count++;
      }
    }

    if (count >= 2) {
      this.setState({ showPackLeaderLimitReachedDialog: true })
      return;
    }

    this.setState({ createIsVisble: false }, this.handleOpenCreatePack);
  }

  handleOnChooseAddCommunity = () => {
    this.setState({ showCommunityRequestModal: true })
  }

  onScrollUp = () => {
    this.shrinkTabs();
  } 

  onScrollDown = () => {
    this.expandTabs();
  }

  expandTabs = () => {
    const { tabHeight } = this.state;
    
    Animated.timing(
      tabHeight,
      {
        toValue: 40,
        duration: 1000,
      }
    ).start();
  }

  shrinkTabs = () => {
    const { tabHeight } = this.state;
    Animated.timing(
      tabHeight,
      {
        toValue: 0,
        duration: 1000,
      }
    ).start();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header style={{ backgroundColor: '#23374d' }} noShadow={false} hasTabs>
          <Left>
          <Text style={{paddingLeft: 10, color: 'white', fontFamily: 'Avenir-Black', fontSize: 18 }}>
              Explore
            </Text>
          </Left>

          <Right>
            <Menu onDismiss={() => this.setState({ createIsVisble: false })} visible={this.state.createIsVisble} anchor={
              <Appbar.Action key='globe' onPress={() => this.setState({ createIsVisble: true })} icon={() => <FeatherIcon name="globe" size={20} style={{ padding: 0, margin: 0 }} color="white" />} />
            }>
              <Menu.Item
                onPress={() => this.setState({ showCommunityRequestModal: true })}
                theme={{ roundness: 20 }}
                contentStyle={{ borderRadius: 20, width: 'auto' }}
                style={{ height: 30 }}
                icon={() => <MaterialIcon name="business" color="black" size={18} />}
                titleStyle={{ fontSize: 13, fontFamily: 'Avenir' }}
                title="Add your community" />
            </Menu>

            <Appbar.Action key='message-circle' onPress={() => this.props.navigation.openDrawer()} icon={() => <FeatherIcon name="message-circle" size={20} style={{ padding: 0, margin: 0 }} color="white" />} />

          </Right>
        </Header>
        <Tabs
          onChangeTab={tabInfo => this.setState({ currTab: tabInfo.i })}
          style={{ backgroundColor: '#23374d'}}
          tabBarUnderlineStyle={{ backgroundColor: '#1089ff', height: 2, alignSelf: 'center' }}
          tabContainerStyle={{ borderBottomWidth: 0}}
          renderTabBar={(props) => (
                <ScrollableTab 
                {...props} 
                style={{ borderBottomWidth: 0,  borderColor: 'rgb(174, 174, 178)',  shadowRadius: 1, justifyContent: 'flex-start', elevation: 0, backgroundColor: COLOR }} 
                tabsContainerStyle={{ justifyContent: 'flex-start', backgroundColor: COLOR,  elevation: 0 }} 
              />  
          )

                }>
    
          <Tab heading='Explore' {...TAB_PROPS} >
            {this.renderAppropriateFirstTab(this.onScrollUp, this.onScrollDown)}
          </Tab>
          {this.renderAppropriateSecondaryTab()}
          <Tab heading="Community" {...TAB_PROPS}>
            <Featured navigation={this.props.navigation} />
          </Tab>
          {this.renderCommunityTabs()}
        </Tabs>

        <CreatePackDialog ref={this.createPackSheetRef} />
        <PackLeaderLimitDialog
          isVisible={this.state.showPackLeaderLimitReachedDialog}
          closeDialog={() => this.setState({ showPackLeaderLimitReachedDialog: false })}
        />
        <RequestCommunity isVisible={this.state.showCommunityRequestModal} closeModal={() => this.setState({ showCommunityRequestModal: false })} />
      </View>
    );
  }
}

export default connect(mapStateToProps)(LupaHome);