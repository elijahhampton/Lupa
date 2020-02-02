import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Platform,
    TouchableHighlight
} from 'react-native';

import {
  Avatar as PaperAvatar ,
  List,
  Caption,
  Button
} from 'react-native-paper';

import { withNavigation } from 'react-navigation';

import { Feather as DrawerIcon } from '@expo/vector-icons';

import SafeAreaView from 'react-native-safe-area-view';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Avatar } from 'react-native-elements';

import {
  logoutUser
} from '../../../../controller/lupa/auth';
import { Divider } from 'react-native-paper';

import { connect } from 'react-redux';

const mapStateToProps = (state, action) => {
  return {
    lupa_data: state,
  }
}

class DrawerMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      image: '',
    }

  }

  _handleLogout = () => {
    //this.props.navigation.reset();
    this.props.navigation.push('Login');
  }

  _getPermissionsAsync = async () => {
    if (Platform.OS == 'ios') {
      const { photoPermissionsStatus } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if ( photoPermissionsStatus != 'granted' ) {
        alert('Sorry, we need camera roll permissions to make this work.');
      }
    }
  }

  _chooseAvatar = async () => {
    let chosenImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4,3],
    });

    if ( !chosenImage.cancelled ) {
      this.setState({ image: chosenImage.uri });
    }
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: "#FAFAFA"}}>
        <SafeAreaView
          style={styles.container}
          forceInset={{top: 'always', horizontal: 'never', padding: 20}}>

            <View style={{margin: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'column'}}>
                  <Text style={{fontWeight: '500', fontSize: 15}}>
                    {this.props.lupa_data.Users.currUserData.display_name}
                  </Text>
                  <Text style={{fontWeight: '500', fontSize: 15}}>
                    {this.props.lupa_data.Users.currUserData.email}
                  </Text>
                </View>

              <PaperAvatar.Text label="EH" size={30} />
            </View>

            <Divider />

            <View style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
              <DrawerIcon name="activity" size={12} style={{margin: 3}}/>
            <Button mode="Dashboard" color="grey" compact onPress={() => this.props.navigation.navigate('Dashboard')}>
              Dashboard
            </Button>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
              <DrawerIcon name="user" size={12} style={{margin: 3}}/>
            <Button mode="Dashboard" color="grey" compact onPress={() => this.props.navigation.navigate('Profile')}>
              Profile
            </Button>
            </View>

            <Divider />

            <View style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
              <DrawerIcon name="heart" size={12} style={{margin: 3}}/>
            <Button mode="Dashboard" color="grey" compact>
              Register as a Lupa Trainer
            </Button>
            </View>

            <View style={{width: '100%', flexDirection: 'column', position: 'absolute', bottom: 20}}>
              <Divider />
              <Caption style={{alignSelf: 'center', padding: 5}}>
                Preventative Healthcare
              </Caption>
              <Divider />
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', }}>
              <Caption>
                Terms of Service
              </Caption>
              <Caption>
                Privacy Policy
              </Caption>
              </View>
            </View>

            <Button mode="text" compact color="#2196F3">
        Log out
        </Button>
        </SafeAreaView>
      </View>
    );
  }
}

export default connect(mapStateToProps)(withNavigation(DrawerMenu));

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    navigationItems: {
      flex: 1, 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "space-evenly"
    },
    sectionHeaderText: {
      fontSize: 17,
      fontWeight: "500",
      color: "#757575",
      flexShrink: 1,
      padding: 8
    },
    links: {
      flexDirection: "row",
      alignItems: "center",
    }
  });

  /*
    Trainers should go through their own spaces first
    

  */