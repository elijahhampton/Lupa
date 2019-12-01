import React from 'react';

import {
    View,
    ScrollView,
    Text,
    Button,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Image,
    Platform,
    TouchableHighlight
} from 'react-native';

import { withNavigation } from 'react-navigation';

import { Feather as DrawerIcon } from '@expo/vector-icons';

import SafeAreaView from 'react-native-safe-area-view';
import { DrawerItems } from 'react-navigation-drawer';
import { Surface, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { LinearGradient } from 'expo-linear-gradient';
import { Avatar } from 'react-native-elements';

class DrawerMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      image: '',
    }

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

            <View style={{margin: 15, alignSelf: "center"}}>
                <Avatar label="EH" showEditButton={true} rounded size={80} onEditPress={this._chooseAvatar} source={this.state.image} />
            </View>


            <View style={styles.navigationItems}>

            <View style={styles.links}>
                <DrawerIcon name="activity" />
                <TouchableHighlight onPress={() => this.props.navigation.navigate('Dashboard')}>
                <Text style={styles.sectionHeaderText}>
                  Dashboard
                </Text>
                </TouchableHighlight>
              </View>


              <View style={styles.links}>
                <DrawerIcon name="user" />
                <TouchableHighlight onPress={() => this.props.navigation.navigate('Profile')}>
                <Text style={styles.sectionHeaderText}>
                  Profile
                </Text>
                </TouchableHighlight>
              </View>

              <View style={styles.links}>
              <DrawerIcon name="heart" />
                <Text style={styles.sectionHeaderText}>
                  Register as a Lupa Trainer
                </Text>
              </View>

              <TouchableHighlight onPress={() => this.props.navigation.navigate('Notifications')}>
              <View style={styles.links}>
              <DrawerIcon name="briefcase" />
                <Text style={styles.sectionHeaderText}>
                  Notifications
                </Text>
              </View>
              </TouchableHighlight>

              <TouchableHighlight onPress={() => this.props.navigation.navigate('Goals')}>
              <View style={styles.links}>
              <DrawerIcon name="trending-up" />
              <Text style={styles.sectionHeaderText}>
                  Goals
                </Text>
              </View>
              </TouchableHighlight>

            </View>
        </SafeAreaView>
      </View>
    );
  }
}

export default withNavigation(DrawerMenu);

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