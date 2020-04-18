import React from 'react';

import {
    View,
    StyleSheet,
    ImageBackground,
    Modal,
    Text,
    Button as NativeButton,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';

import {
    TextInput, 
    Title,
    Headline,
    Surface,
    Caption,
    Button,
    Paragraph,
    Divider
} from 'react-native-paper';

import SafeAreaView from 'react-native-safe-area-view';

import { 
    SocialIcon,
    Input,
    CheckBox,
    Overlay,
    Button as ElementsButton,
 } from 'react-native-elements';

 import { MaterialIcons, Feather as FeatherIcon } from '@expo/vector-icons';

const {
    signUpUser
} = require('../../../controller/lupa/auth/auth');

import LupaController from '../../../controller/lupa/LupaController';

import loadFonts from '../../common/Font/index'

mapStateToProps = (state) => {
    return { 
      lupa_data: state
    }
  }
  
  mapDispatchToProps = dispatch => {
    return {
      updateUser: (userObject) => {
        dispatch({
          type: 'UPDATE_CURRENT_USER',
          payload: userObject
        })
      },
      updatePacks: (packsData) => {
        dispatch({
          type: 'UPDATE_CURRENT_USER_PACKS',
          payload: packsData,
        })
      },
      updateUserPrograms: (currUserProgramsData) => {
        dispatch({
          type: 'UPDATE_CURRENT_USER_PROGRAMS',
          payload: currUserProgramsData,
        })
      },
      updateLupaWorkouts: (lupaWorkoutsData) => {
        dispatch({
          type: 'UPDATE_LUPA_WORKOUTS',
          payload: lupaWorkoutsData,
        })
      }
    }
  }

  import { connect } from 'react-redux';

  const QUESTIONS = [
    'Hi',
    'Hi',
    'Hi',
    'Hi',
    'Hi',
    'Hi',
    'Hi'
  ]

class SignupModal extends React.Component {

    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
          username: "",
            email: "",
            password: "",
            confirmedPassword: "",
            isTrainerAccount: false,
            agreedToTerms: false,
            isRegistered: false,
            passwordSecureTextEntry: true,
            secureConfirmPasswordSecureTextEntry: true,
            alertOverlayVisible: false,
            buttonYes: false,
        }
    }

  /**
   * Introduce the application
   * Finish any last minute things here before showing the application to the user.
   * This really isn't the place to be doing this, but any small last minute changes can go here.
   */
  _introduceApp = async () => {
    await this._setupRedux();
    await this.LUPA_CONTROLLER_INSTANCE.indexApplicationData();
    //await this.loadFonts();
    this.props.navigation.navigate('App');
  }

  _setupRedux = async () => {
    let currUserData, currUserPacks, currUserHealthData, currUserPrograms, lupaWorkouts;
    await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserData().then(result => {
      currUserData = result;
    })

    await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserPacks().then(result => {
      currUserPacks = result;
    })

    await this.LUPA_CONTROLLER_INSTANCE.getCurrentUserHealthData().then(result => {
      currUserHealthData = result;
    });

    await this.LUPA_CONTROLLER_INSTANCE.loadCurrentUserPrograms().then(result => {
      currUserPrograms = result;
    })

    await this.LUPA_CONTROLLER_INSTANCE.loadWorkouts().then(result => {
      lupaWorkouts = result;
    });

    let userPayload = {
      userData: currUserData,
      healthData: currUserHealthData,
    }

    await this._updatePacksInRedux(currUserPacks);
    await this._updateUserInRedux(userPayload);
    await this._updateUserProgramsDataInRedux(currUserPrograms);
    await this._updateLupaWorkoutsDataInRedux(lupaWorkouts);
  }

  _updateUserInRedux = (userObject) => {
    this.props.updateUser(userObject);
  }

  _updatePacksInRedux = (packsData) => {
    this.props.updatePacks(packsData);
  }

    /**
   * 
   */
  _updateUserHealthDataInRedux = (healthData) => {
    this.props.updateHealthData(healthData);
  }

  /**
   * 
   */
  _updateUserProgramsDataInRedux = (programsData) => {
    this.props.updateUserPrograms(programsData);
  }

  /**
   * 
   */
  _updateLupaWorkoutsDataInRedux = (lupaWorkoutsData) => {
    this.props.updateLupaWorkouts(lupaWorkoutsData);
  }


    _registerUser = async () => {
      const username = this.state.username;
        const email = this.state.email;
        const password = this.state.password;
        const confirmedPassword = this.state.confirmedPassword;
        const isTrainerAccount = this.state.isTrainerAccount;
        const agreedToTerms = this.state.agreedToTerms;

        //Check registration status
        let successfulRegistration;
        await signUpUser(username, email, password, confirmedPassword, isTrainerAccount, agreedToTerms).then(result => {
          successfulRegistration = result;
        });

        await this.handleOnRegistration(successfulRegistration);
    }

    handleOnRegistration = async (registrationStatus) => {
      if (registrationStatus)
      {
        this._introduceApp();
      }
      else
      {
        await this.setState({ failedSignupReason: registrationStatus.reason, alertOverlayVisible: true });
      }
    }


    _handleShowPassword = () => {
        this.setState({
            passwordSecureTextEntry: !this.state.passwordSecureTextEntry
        })
      }

      _handleShowConfirmPassword = () => {
        this.setState({
            confirmPasswordSecureTextEntry: !this.state.confirmPasswordSecureTextEntry
        })
      }

    render() {
        return (
          <SafeAreaView forceInset={{bottom: 'never'}}>

          <ScrollView>
            
          <View style={{width: "100%", height: Dimensions.get('window').height}}>
          <View style={styles.headerText}>
                    <Text style={{ fontSize: 35, fontWeight: '700', color: 'black' }}>
            Create an account with
                        </Text>
                        <Text style={{ fontSize: 35, fontWeight: '700', color: '#2196F3' }}>
            Lupa
                        </Text>
                        <View style={{flexDirection: 'row', marginTop: 5}}>
        <Text style={{fontSize: 17, fontWeight: '500'}}>
          Already have an account?
        </Text>
        <Text>
          {" "}
        </Text>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
          <Text style={{fontSize: 17, fontWeight: '500', color: '#2196F3'}}>
            Sign In
          </Text>
        </TouchableOpacity>
        </View>
        </View>
                    

                    <View style={{height: "60%", width: "100%", alignItems: "center", justifyContent: "space-evenly"}}>
                    <View style={{width: '80%', margin: 5}}>
                            <Text style={styles.textLabel}>
                                Username
                            </Text>
                            <Input 
                            value={this.state.username} 
                            onChangeText={text => this.setState({username: text})} 
                            placeholder="Enter a username" 
                            inputStyle={styles.inputStyle} 
                            inputContainerStyle={styles.inputContainerStyle} 
                            containerStyle={styles.containerStyle} 
                            editable={true}
                            enablesReturnKeyAutomatically={true}
                            returnKeyLabel="Done"
                            returnKeyType="done"
                            multiline={false}
                            style={{alignSelf: "center"}}
  
                            />
                        </View>

                    <View style={{width: '80%', margin: 5}}>
                            <Text style={styles.textLabel}>
                                Email
                            </Text>
                            <Input 
                            value={this.state.email} 
                            onChangeText={text => this.setState({email: text})} 
                            placeholder="Enter an email address" 
                            inputStyle={styles.inputStyle} 
                            inputContainerStyle={styles.inputContainerStyle} 
                            containerStyle={styles.containerStyle} 
                            editable={true}
                            enablesReturnKeyAutomatically={true}
                            returnKeyLabel="Done"
                            returnKeyType="done"
                            multiline={false}
  
                            />
                        </View>

                    <View style={{width: '80%', margin: 5}}>
                            <Text style={styles.textLabel}>
                                Password
                            </Text>
                            <Input 
                            rightIcon={<FeatherIcon name="eye" onPress={this._handleShowPasswords}/>} 
                            value={this.state.password} 
                            onChangeText={text => this.setState({password: text})} 
                            secureTextEntry={this.state.passwordSecureTextEntry} 
                            placeholder="Enter a password" inputStyle={{fontWeight: '500', fontSize: 15}} 
                            inputStyle={styles.inputStyle} 
                            inputContainerStyle={styles.inputContainerStyle} 
                            containerStyle={styles.containerStyle} 
                            editable={true}
                            enablesReturnKeyAutomatically={true}
                            returnKeyLabel="Done"
                            returnKeyType="done"
                            multiline={false}
                            />
                        </View>

                        <View style={{width: '80%', margin: 5}}>
                            <Text style={styles.textLabel}>
                                Confirm Password
                            </Text>
                            <Input 
                            rightIcon={<FeatherIcon name="eye" onPress={this._handleShowConfirmPassword}/>} 
                             value={this.state.confirmedPassword} 
                             onChangeText={text => this.setState({confirmedPassword: text})} 
                             secureTextEntry={this.state.secureConfirmPasswordSecureTextEntry} 
                             placeholder="Confirm your password" 
                             inputStyle={styles.inputStyle} 
                             inputContainerStyle={styles.inputContainerStyle} 
                             containerStyle={styles.containerStyle} 
                             editable={true}
                             enablesReturnKeyAutomatically={true}
                             returnKeyLabel="Done"
                             returnKeyType="done"
                             multiline={false}/>
                        </View>

                        <View style={{width: '50%', backgroundColor: "white", margin: 10}}>
                            <Text style={styles.textLabel}>
                                Birthday
                            </Text>
                            <View style={{borderRadius: 20, width: "100%", backgroundColor: "#FAFAFA", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"}}>
                            <Input 
                             value="MM"
                             onChangeText={text => {}} 
                             placeholder="MM" 
                             placeholderTextColor="black"
                             inputStyle={{width: "100%", fontSize: 10}} 
                             inputContainerStyle={{width: "100%", borderColor: "transparent"}} 
                             containerStyle={{backgroundColor: "transparent", width: "20%", }} 
                             editable={true}
                             enablesReturnKeyAutomatically={true}
                             returnKeyLabel="Done"
                             returnKeyType="done"
                             multiline={false}
                             />

<Input 
                             value="DD"
                             onChangeText={text => {}} 
                             placeholder="DD" 
                             placeholderTextColor="black"
                             inputStyle={{width: "100%", fontSize: 10}} 
                             inputContainerStyle={{width: "100%", borderColor: "transparent"}} 
                             containerStyle={{backgroundColor: "transparent", width: "20%", }} 
                             editable={true}
                             enablesReturnKeyAutomatically={true}
                             returnKeyLabel="Done"
                             returnKeyType="done"
                             multiline={false}
                             />

<Input 
                             value="YYYY"
                             onChangeText={text => {}} 
                             placeholder="YYYY" 
                             placeholderTextColor="black"
                             inputStyle={{width: "100%", fontSize: 10}} 
                             inputContainerStyle={{width: "100%", borderColor: "transparent"}} 
                             containerStyle={{backgroundColor: "transparent", width: "25%", }} 
                             editable={true}
                             enablesReturnKeyAutomatically={true}
                             returnKeyLabel="Done"
                             returnKeyType="done"
                             multiline={false}
                             />
                            </View>
                            
                        </View>
                    </View>

                    <View style={{padding: 20, alignItems: "center", justifyContent: "center", height: "auto", width: "100%"}}>
                    <TouchableOpacity style={{width: "100%", height: 70, alignSelf: "center"}}>
                        <Surface style={{elevation: 10, padding: 10, alignItems: "center", justifyContent: "center", backgroundColor: "#C7DCFF", width: '50%', height: 70, borderRadius: 70, alignSelf: "center"}}>
                            <Text style={{color: "white", textAlign: "center", textAlignVertical: "center"}}>
                              Lupa Screening Questionnaire
                            </Text>
                            <MaterialIcons name="arrow-drop-down" size={30} style={{color: "white"}} />
                        </Surface>
                    </TouchableOpacity>
                    </View>
            
</View>
            
                    <View style={{width: "80%", height: "auto"}}>
                      {
                        QUESTIONS.map((question, index, arr) => {
                          return (
                            <Surface style={[
                              {
                              backgroundColor: "white", 
                              marginTop: 20, 
                              padding: 10, 
                              width: Dimensions.get('window').width - 20, 
                              }, 
                              index % 2 == 0 ? styles.leftPositionedSurface : styles.rightPositionedSurface
                              ]}>
                            <Text style={{fontWeight: "500"}}>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </Text>
                              <View style={{alignSelf: 'center', margin: 5, width: "60%", alignItems: "center", flexDirection: "row", justifyContent: "space-evenly"}}>
                                <Surface style={{backgroundColor: "#C7DCFF" , alignItems: "center", justifyContent: "center", width: 65, height: 65, margin: 5, borderRadius: 65, elevation: 10}}>
                                  <MaterialIcons name="check" size={20} />
                                </Surface>

                                <Surface style={{backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", width: 65, height: 65, margin: 5, borderRadius: 65, elevation: 10}}>
                                  <MaterialIcons name="clear" size={20} />
                                </Surface>
                              </View>
                          </Surface>
                          )
                        })
                      }
                      </View>

                       <View style={{flex: 1, justifyContent: 'flex-end'}}>
                        <ElementsButton
  title="Create Account"
  type="solid"
  raised
  style={{backgroundColor: "#2196F3", padding: 10, borderRadius: 12}}
  buttonStyle={{backgroundColor: 'transparent'}}
  containerStyle={{borderRadius: 12}}
  onPress={this._registerUser}
/>
                        </View>

                        <View style={{margin: 10}}>
                        <CheckBox
                                center
                                title='I agree to the Terms of Service and Privacy Policy.'
                                iconRight
                                iconType='material'
                                checkedIcon='done'
                                uncheckedIcon='check-box-outline-blank'
                                checkedColor='check-box'
                                containerStyle={{backgroundColor: 'transparent', padding: 15, borderColor: 'transparent'}}
                                checked={this.state.agreedToTerms }
                                onPress={() => this.setState({ agreedToTerms: !this.state.agreedToTerms })}
                            />

                            <Overlay
                            overlayStyle={{width: '90%', height: '20%', alignItems: 'center', justifyContent: 'space-evenly'}} 
                            visible={this.state.alertOverlayVisible}
                            onRequestClose={() => this.setState({ alertOverlayVisible: false })}
                            onDismiss={() => this.setState({ alertOverlayVisible: false  })}
                            animated={true}
                            animationType="fade">
                              <>
                              <Paragraph>
                                It looks like something went wrong! {this.state.failedSignupReason}
                              </Paragraph>
                              <NativeButton title="Try again" onPress={() => this.setState({ alertOverlayVisible: false })}/>
                            </>
                            </Overlay>    
                        </View>
                        
          </ScrollView>
          </SafeAreaView>
        
                    
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        display: "flex",
        backgroundColor: "#FAFAFA",
        margin: 0,
        alignItems: "center",
        flexDirection: "column",
        flex: 1,
    },
    headerText: {
        marginTop: 15,
        padding: 10,
        height: "20%",
    },
    textLabel: {
        fontSize: 15,
        fontWeight: "600",
        color: '#424242',
        margin: 5,
        alignSelf: "flex-start",
    },
    inputStyle: {
      fontWeight: '500', 
      fontSize: 15
    },
    inputContainerStyle: {
      borderBottomColor: "transparent",
      borderTopColor: "transparent", 
      borderRightColor: "transparent", 
      borderLeftColor: "transparent", 
      padding: 3
    },
    containerStyle: {
      width: "100%", 
      borderRadius: 20, 
      backgroundColor: '#FAFAFA'
    },
    leftPositionedSurface: {
      left: 0,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      alignSelf: "flex-start",
    },
    rightPositionedSurface: {
      right: 0,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      alignSelf: "flex-end",
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupModal);