import React, { useEffect, useState } from 'react';

import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    ImageBackground,
    Animated,
    Image,
    Button as NativeButton,
    ScrollView,
    Modal,
    RefreshControl,
} from 'react-native';

import {
    Appbar,
    Title,
    Button,
    TextInput,
    Surface,
    Paragraph,
    Snackbar,
    Chip,
    Modal as PaperModal,
    Dialog,
    Portal,
    Provider,
    Card,
    FAB,
    Caption,
    Searchbar,
} from 'react-native-paper';

import {
    Header,
    Tab,
    Tabs,
    ScrollableTab,
    Left,
    Right,
    Body,
} from 'native-base';

import { withNavigation } from 'react-navigation';

import { connect, useSelector, useDispatch } from 'react-redux'

import FeatherIcon from 'react-native-vector-icons/Feather'

import LiveWorkout from '../workout/modal/LiveWorkout'
import Carousel from 'react-native-snap-carousel';
import { SearchBar, Rating, Slider, CheckBox, ListItem, Divider, Avatar} from 'react-native-elements';

import { LinearGradient } from 'expo-linear-gradient';
import ProgramListComponent from './component/ProgramListComponent';
import SearchFilter from '../sessions/component/SearchFilter';
import RBSheet from "react-native-raw-bottom-sheet";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { BlurView, VibrancyView } from "@react-native-community/blur";
import { Constants } from 'react-native-unimodules';
import ProgramsFilter from './component/ProgramsFilter';

import { Button as ElementsButton } from 'react-native-elements';
import UserSearchResult from '../user/profile/component/UserSearchResult'
import LupaController from '../../controller/lupa/LupaController'
import { TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { getLupaTrainerService } from '../../controller/firebase/collection_structures';
import { throwIfAudioIsDisabled } from 'expo-av/build/Audio/AudioAvailability';
import { getCurrentStoreState } from '../../controller/redux';

const SamplePhotoOne = require('../images/programs/sample_photo_one.jpg')
const SamplePhotoTwo = require('../images/programs/sample_photo_two.jpg')
const SamplePhotoThree = require('../images/programs/sample_photo_three.jpg')

const list = [
    {
      name: 'Based on Interest',
      subtitle: '0 Selected',
      icon: <MaterialIcon name="label" size={20} color="#FFFFFF"/>
    },
    {
      name: 'Based on Workout Type',
      subtitle: '0 Selected',
      icon: <MaterialIcon name="fitness-center" size={20} color="#FFFFFF" />
    },
  ]

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

class ShareProgramModal extends React.Component{
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            followingUserObjects: [],
            selectedUsers: [],

        }
    }

    componentDidMount = async () => {
        let results = [];
        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationFromArray(this.props.following).then(objs => {
            results = objs;
        })

        this.setState({ 
            followingUserObjects: results,
        })
    }

    handleAddToFollowList = (userObject) => {
        const updatedList = this.state.selectedUsers;
        var found = false;
        for(let i = 0; i < this.state.selectedUsers.length; i++)
        {
            if (this.state.selectedUsers[i] == userObject.user_uuid)
            {
                alert('no')
              updatedList.splice(i, 1);
              found = true;
              break;
            }
        }

        if (found == false)
        {
            alert('here')
            updatedList.push(userObject.user_uuid);
        }

        console.log(updatedList.length)

        this.setState({
            selectedUsers: updatedList,
        })


    }

    waitListIncludesUser = (userObject) => {
        for(let i = 0; i < this.state.selectedUsers.length; i++)
        {
            if (this.state.selectedUsers[i] == userObject.user_uuid)
            {
                return true;
            }
        }

        return false;
    }

    mapFollowing = () => {
        return this.state.followingUserObjects.map(user => {
            return (
                <View key={user.user_uuid} style={{backgroundColor: this.waitListIncludesUser(user) ? '#E0E0E0' : 'transparent'}}>
                    <UserSearchResult 
                        avatarSrc={user.photo_url} 
                        displayName={user.display_name} 
                        username={user.username} 
                        isTrainer={user.isTrainer}
                        hasButton={true}
                        buttonTitle="Invite"
                        buttonOnPress={() => this.handleAddToFollowList(user)}
                        />
                </View>
            );
        })
    }

    handleCancel = () => {
        this.props.closeModalMethod();
    }

    handleApply = () => {
        try {
            this.LUPA_CONTROLLER_INSTANCE.handleSendUserProgram(this.props.currUserData.user_uuid, this.props.currUserData, this.props.currUserData.display_name, this.state.selectedUsers, this.props.program);
            this.props.closeModalMethod();
        } catch(err) {
            alert(err)
        }
    }

    render() {
        return (
                <PaperModal contentContainerStyle={{width: Dimensions.get('window').width, height: Dimensions.get('window').height, backgroundColor: '#F2F2F2'}} visible={this.props.isVisible}>
                                   <Appbar.Header style={{elevation: 0}} theme={{
                    colors: {
                        primary: '#F2F2F2'
                    }
                }}>
                    <Appbar.BackAction onPress={this.props.closeModalMethod} />
                    <Appbar.Content title="Share Program" />
                </Appbar.Header>

                <View style={{flex: 1, backgroundColor: '#F2F2F2'}}>
                    <View style={{backgroundColor: '#F2F2F2'}}>
                    <Surface style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, margin: 10, elevation: 0, width: Dimensions.get('window').width-20, height: 100, backgroundColor: 'transparent'}} >
                                
                                <View style={{flex: 1, padding: 10, }}>
                                    <Surface style={{width: '100%', height: '100%', elevation: 5, borderRadius: 15}}>
                                        <Image style={{width: '100%', height: '100%', borderRadius: 15}} source={{uri: this.props.program.program_image == undefined || this.props.program.program_image == '' ? '' : this.props.program.program_image}} />
                                    </Surface>
                                </View>

                                <View style={{flex: 3, height: '100%', alignItems: 'center'}}>
                                    <View style={{flex: 2, alignSelf: 'flex-start', padding: 5}}>
                                        <Text style={{fontFamily: 'ARSMaquettePro-Medium', fontSize: 15, color: '#212121'}}>
                                        {this.props.program.program_name}
                                        </Text>
                                        <Caption numberOfLines={2} style={{lineHeight: 12, }}>
                                        {this.props.program.program_description}
                                        </Caption>
                                    </View>


                                    <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10}}>
                                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center',justifyContent: 'flex-start'}}>
                                        <Text style={{fontFamily: 'ARSMaquettePro-Regular', fontSize: 12}}>
                                        {this.props.program.program_slots} slots available
                                        </Text>
                                    </View>

                                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center',  justifyContent: 'space-evenly'}}>
                                        <Surface style={{alignItems: 'center', justifyContent: 'center', width: 20, height: 20, elevation: 8, borderRadius: 5, backgroundColor: '#2196F3'}}>
                                        <MaterialIcon name="fitness-center" size={10} color="#FFFFFF" />
                                        </Surface>
                                        <Surface style={{alignItems: 'center', justifyContent: 'center', width: 20, height: 20, elevation: 8, borderRadius: 5, backgroundColor: '#2196F3'}}>
                                        <MaterialIcon name="fitness-center" size={10} color="#FFFFFF" />
                                        </Surface>
                                        <Surface style={{alignItems: 'center', justifyContent: 'center', width: 20, height: 20, elevation: 8, borderRadius: 5, backgroundColor: '#2196F3'}}>
                                        <MaterialIcon name="fitness-center" size={10} color="#FFFFFF" />
                                        </Surface>
                                        <Surface style={{alignItems: 'center', justifyContent: 'center', width: 20, height: 20, elevation: 8, borderRadius: 5, backgroundColor: '#2196F3'}}>
                                        <MaterialIcon name="fitness-center" size={10} color="#FFFFFF" />
                                        </Surface>
                                    </View>
                                    </View>

                                    
                                </View>


                              </Surface>
                    </View>
                              <Divider />
                    <ScrollView shouldRasterizeIOS={true} contentContainerStyle={{backgroundColor: '#F2F2F2'}}>
                    {
                        this.mapFollowing()
                    }
                </ScrollView>
                <SafeAreaView />
                    </View>

                    <FAB  color="#FFFFFF" style={{position: 'absolute', bottom: 0, right: 0, margin: 16, backgroundColor: '#2196F3'}} icon="done" onPress={this.handleApply} />
            </PaperModal>
        )
    }
}

connect(mapStateToProps)(ShareProgramModal);

class InviteWaitlistFriends extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            waitList: [],
            followingUserObjects: [],
        }
    }

    componentDidMount = async () => {
        await this.setupFollowingTabInformation();
    }

    setupFollowingTabInformation = async () => {
        let results = new Array();
        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationFromArray(this.props.following).then(objs => {
            results = objs;
        });

        await this.setState({ followingUserObjects: results });
    }

    handleAddToFollowList = (userObject) => {
        const updatedList = this.state.waitList;
        var found = false;
        for(let i = 0; i < this.state.waitList.length; i++)
        {
            if (this.state.waitList[i].user_uuid == userObject.user_uuid)
            {
              updatedList.splice(i, 1);
              found = true;
              break;
            }
        }

        if (found == false)
        {
            updatedList.push(userObject);
        }

        this.setState({
            waitList: updatedList
        })

    }

    waitListIncludesUser = (userObject) => {
        for(let i = 0; i < this.state.waitList.length; i++)
        {
            if (this.state.waitList[i].user_uuid == userObject.user_uuid)
            {
                return true;
            }
        }

        return false;
    }

    mapFollowing = () => {
        return this.state.followingUserObjects.map(user => {
            return (
                <TouchableOpacity onPress={() => this.handleAddToFollowList(user)} style={{backgroundColor: this.waitListIncludesUser(user) ? '#E0E0E0' : 'transparent'}}>
                    <UserSearchResult avatarSrc={user.photo_url} displayName={user.display_name} username={user.username} isTrainer={user.isTrainer}/>
                </TouchableOpacity>
            );
        })
    }

    /**
     * Render
     * Renders component content.
     * 
     * TODO: At some point this code should be moved into a function.
     */
    render() {
        return (
            <Modal presentationStyle="fullScreen" visible={this.props.isVisible} animated={true} animationType='slide'>
                <SafeAreaView style={{flex: 1}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <NativeButton title="Cancel" onPress={() => this.props.closeModalMethod(this.state.waitList, 'CANCEL')} />
                        <NativeButton title="Apply" onPress={() => this.props.closeModalMethod(this.state.waitList, 'APPLY')}/>
                    </View>
                <ScrollView shouldRasterizeIOS={true}>
               {/* <SearchBar platform="ios" placeholder="Search" containerStyle={styles.searchContainer}/> */}
                {
                    this.mapFollowing()
                }
            </ScrollView>
                </SafeAreaView>
            </Modal>
        )
    }
}

const COLORS_LIST = [
    {
        background: '#e57373',
        accent: '#f44336'
    },
    {
        background: '#7986CB',
        accent: '#3F51B5'
    },
    {
        background: '#64B5F6',
        accent: '#2196F3'
    },
    {
        background: '#4DB6AC',
        accent: '#009688'
    },
    {
        background: '#FFF176',
        accent: '#FFEB3B'
    },
    {
        background: '#FFB74D',
        accent: '#FF9800',
    },
    {
        background: '#FF8A65',
        accent: '#FF5722',
    },
    {
        background: '#90A4AE',
        accent: '#607D8B',
    }
]

const ICONS_LIST = [
    {
        icon: 'notifications',
        iconType: 'material'
    },
    {
        icon: 'directions-run',
        iconType: 'material'
    },
    {
        icon: 'fitness-center',
        iconType: 'material'
    },
    {
        icon: 'heart',
        iconType: 'material'
    },
    {
        icon: 'local-hospital',
        iconType: 'material'
    },
    {
        icon: 'kitchen',
        iconType: 'material'
    },
    {
        icon: 'activity',
        iconType: 'feather'
    },
    {
        icon: 'alert-circle',
        iconType: 'feather'
    },
    {
        icon: 'eye',
        iconType: 'feather'
    },
    {
        icon: 'home',
        iconType: 'feather'
    },
    {
        icon: 'phone',
        iconType: 'feather'
    },
    {
        icon: 'tablet',
        iconType: 'feather'
    },
    {
        icon: 'message-circle',
        iconType: 'feather'
    },
]

function CreateServiceDialog(props) {
    let [serviceName, setServiceName] = useState("");
    let [serviceDescription, setServiceDescription] = useState("");
    let [serviceColors, setServiceColors] = useState([]);
    let [iconName, setIconName] = useState("");
    let [iconType, setIconType]  = useState("");
    let [currIconPressed, setCurrentIconPressed] = useState("");
    let [currColorPressed, setCurrentColorPresssed] = useState("")
    let [serviceNameError, setServiceNameError] = useState(false)
    let [serviceDescriptionError, setServiceDescriptionError] = useState(false)
    let [showSnack, setShowSnack] = useState(false);
    let [rejectedReason, setRejectedReason] = useState("");

    const dispatch = useDispatch();

    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const createService = async (serviceName, serviceDescription, iconName, iconType, serviceColors) => {
        const USER_SERVICE = await getLupaTrainerService(serviceName, serviceDescription, iconName, iconType, serviceColors);

        //add to local copy
        await dispatch({type: 'ADD_CURRENT_USER_SERVICE', payload: USER_SERVICE })

        //add to firebase
        LUPA_CONTROLLER_INSTANCE.createService(USER_SERVICE);
    }

    const _onDismissSnackBar = () => {
        setShowSnack(false)
    }

    const handleCreateServiceOnPress = () => {
        if (serviceName == "" || serviceName.length > 15 || serviceName.length <= 7)
        {
            setServiceNameError(true)
            setRejectedReason("Invalid service name.  The service name must be between 8 - 15 characters.")
            setShowSnack(true)
            return;
        }
        else
        {
            setServiceNameError(false);
        }

        //TODO: Check for invalid characters

        if (serviceDescription == "" || serviceDescription.length > 120 || serviceDescription.length < 20)
        {
            setServiceDescriptionError(true)
            setRejectedReason("Invalid service description.  The service description must be between 20 - 120 characters.")
            setShowSnack(true)
            return;
        }
        else
        {
            setServiceDescriptionError(false);
        }

        //TODO: Check for invalid characters

        //check color
        if (currIconPressed == "")
        {
            setShowSnack(true);
            setRejectedReason("Sorry you must pick an icon for your service.")
            return;
        }


        //check icon
        if (currColorPressed == "")
        {
            setShowSnack(true);
            setRejectedReason("Sorry you must pick a color for your service.")
            return;
        }


        createService(serviceName, serviceDescription, iconName, iconType, serviceColors);

        props.closeDialogMethod()
    }

    const handleClickColor = (colors) => {
        setCurrentColorPresssed(colors.background);
        let colorsArr = [colors.accent, colors.background];
        setServiceColors(colorsArr);
    }

    const handleIconClick = icon => {
        setCurrentIconPressed(icon.icon)
        setIconName(icon.icon);
        setIconType(icon.iconType);
    }

    return (
        <Dialog dismissable={true} onDismiss={props.closeDialogMethod} visible={props.isVisible} style={{alignSelf: 'center', width: Dimensions.get('window').width - 30, height: Dimensions.get('window').height - 300}}>
            <View style={{flex: 1, justifyContent: 'space-between'}}>
                <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}> 
            <Surface style={{elevation: 3, margin: 10, alignItems: 'center', justifyContent: 'center', width: 45, height: 45, borderRadius: 50, backgroundColor: '#BBDEFB'}}>
                <FeatherIcon name="shield" color="#1976D2" size={25} />
            </Surface>
            <Text style={{fontSize: 20, fontFamily: 'ARSMaquettePro-Bold'}}>
                Create a Service
            </Text>
            </View>
            <Text style={{alignSelf: 'center', padding: 10 }}>
                Create services offering without going through the hassle of creating a full workout program.  Services can range from anything such as as consultations to free trials for the programs you create.
            </Text>
                </View>

            <View style={{width: '100%', justifyContent: 'space-between'}}>
                <TextInput  
                    value={serviceName} 
                    onChangeText={text => setServiceName(text)} 
                    mode="flat" 
                    placeholder="Service Name (Ex. Consultation)" 
                    label="Service Name" 
                    style={{margin: 10}}
                    theme={{
                        colors: {
                            primary: '#212121'
                        }
                    }}
                    error={serviceNameError}
                    />
                <TextInput 
                    value={serviceDescription} 
                    onChangeText={text => setServiceDescription(text)} 
                    multiline mode="flat" 
                    placeholder="Service Description" 
                    label="Service Description" 
                    style={{margin: 10}}
                    theme={{
                        colors: {
                            primary: '#212121'
                        }
                    }}
                    error={serviceDescriptionError}
                     />
            </View>

            <View style={{padding: 8}}>
                <Text style={{fontFamily: 'ARSMaquettePro-Medium', fontSize: 18}}>
                    Pick a color
                </Text>
                <View style={{padding: 10, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                    {
                        COLORS_LIST.map(color => {
                            return (
                                <TouchableWithoutFeedback onPress={ () => handleClickColor(color)} style={{backgroundColor: 'transparent'}}>
                                    <Surface style={{margin: 3, elevation: 2, borderRadius: 20, width: 20, height: 20, backgroundColor: color.background, borderColor: currColorPressed == color.background ? '#212121' : 'transparent', borderWidth: 1}} />
                                </TouchableWithoutFeedback>
                            )
                        })
                    }
                </View>
            </View>

            <View style={{padding: 8, }}>
                <Text style={{fontFamily: 'ARSMaquettePro-Medium', fontSize: 18}}>
                    Pick an icon
                </Text>
                <View style={{padding: 10, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', flexWrap: 'wrap'}}>
                    {
                        ICONS_LIST.map(icon => {
                            if (icon.iconType == "material")
                            {
                                return (
                                    <TouchableWithoutFeedback  onPress={() => handleIconClick(icon)} style={{borderRadius: 20, padding: 5}}>
                                                                            <MaterialIcon key={icon.icon} name={icon.icon} size={20} style={{backgroundColor: currIconPressed == icon.icon ? 'rgb(174,174,178)' : 'transparent', borderRadius: 20}} />
                                    </TouchableWithoutFeedback >
                                )
                            }   
                            else if (icon.iconType == "feather")
                            {
                                return (
                                    <TouchableWithoutFeedback  onPress={() => handleIconClick(icon)} style={{borderRadius: 20, padding: 5}}>
                                                                            <FeatherIcon key={icon.icon} name={icon.icon} size={20} style={{backgroundColor: currIconPressed == icon.icon ? 'rgb(174,174,178)' : 'transparent', borderRadius: 20}}/>
                                    </TouchableWithoutFeedback >
                                )
                            }

                        })
                    }
                </View>
            </View>

            <View style={{alignSelf: 'flex-end', width: '100%', padding: 10, backgroundColor: 'rgb(174,174,178)'}}>
            <Button mode="contained" style={{width: '30%', alignSelf: 'flex-end'}} theme={{
                colors: {
                    primary: '#2196F3'
                }
            }}
            onPress={() => handleCreateServiceOnPress()}>
                Create
            </Button>
</View>
            </View>
            <Snackbar
          style={{backgroundColor: '#212121'}}
          theme={{ colors: { accent: '#2196F3' }}}
          visible={showSnack}
          onDismiss={() => _onDismissSnackBar}
          action={{
            label: 'Okay',
            onPress: () => setShowSnack(false),
          }}
        >
          {rejectedReason}
        </Snackbar>
        </Dialog>
    )
}

class Programs extends React.Component {
    constructor(props) {
        super(props);

        this.props.disableSwipe();

        this.state = {
            data: [0, 1, 2, 3, 4],
            open: false, 
            showLiveWorkout: false,
            lupaProgramsHeight: 0,
            samplePhotoData: [
                SamplePhotoOne,
                SamplePhotoTwo,
                SamplePhotoThree
            ],
            checked: false,
            filterHeight: new Animated.Value(0),
            showInviteModal: false,
            waitListData: ['','','',''],
            allSpotsFilled: false,
            showCreateServiceDialog: false,
            showMyProgramSheet: false,
            pageIsPrograms: true,
            showShareProgramModal: false,
            currProgramClicked: {},
            refreshing: false,
            currUserPrograms: this.props.lupa_data.Programs.currUserProgramsData,
            searchResults: [],
            searchValue: "",
            featuredPrograms: [],
        }

      this.RBSheet = React.createRef();

    }

    async componentDidMount() {
        let featuredProgramsIn;

        await this.props.disableSwipe();
        await this.LUPA_CONTROLLER_INSTANCE.getFeaturedPrograms().then(result => {
            featuredProgramsIn = result;
        });

        await this.setState({
            featuredPrograms: featuredProgramsIn,
        })
       // this.props.navigation.state.params.setScreen('Programs')
    }

    componentWillUnmount() {
        this.props.enableSwipe();
    }

    showInviteModal = () => {
        this.setState({
            showInviteModal: true,
            pageIsPrograms: false,
        })
    }

    handleInviteWaitlist = () => {
        //invite users


        //clear waitlist
        this.setState({
            waitListData: ['', '', '', ''],
            pageIsPrograms: true,
        })
    }

    closeInviteModal = (list, action) => {
        if (action == 'APPLY')
        {
            this.setState({
                waitListData: list,
            })
        }

        if (list.length == 4)
        {
            this.setState({
                allSpotsFilled: true
            })
        }

        this.setState({
            showInviteModal: false,
            pageIsPrograms: true
        })
    }

    closeCreateServiceDialog = () => {
        this.setState({
            showCreateServiceDialog: false,
        })
    }



    showFilter = () => {
        this.setState({ pageIsPrograms: false })
        Animated.timing(this.state.filterHeight, {
            toValue: Dimensions.get('window').height,
            duration: 500
        }).start();
    }

    closeFilter = () => {
        this.setState({ pageIsPrograms: true  })
        Animated.timing(this.state.filterHeight, {
            toValue: 0,
            duration: 500
        }).start();
    }

    handleCancelButtonOnPress = () => {
        this.closeFilter()
    }

    handleApplyFilterOnPress = () => {
        this.setState({ pageIsPrograms: true })

        //apply filters

        this.closeFilter()
    }

    //move inside of program component
    handleShowLiveWorkout = async (program) => {
        await this.setState({ showLiveWorkout: true })
    }

    //move inside of program component
    handleCloseLiveWorkout = () => {
         this.setState({ showLiveWorkout: false })
    }

    _onStateChange = ({ open }) => this.setState({ open: !this.state.open });

    _renderItem = ({item, index}) => {
        return (
            <View style={{height: 650}}>
                                <Surface style={{alignItems: 'center', justifyContent: 'center', borderRadius: 15, elevation: 15, margin: 5, height: 500}}>
                                    <Image resizeMode="cover" source={item} style={{width: '100%', height: '100%', borderRadius: 15}} />
                                    <Text style={{fontFamily: 'ARSMaquettePro-Black', position: 'absolute', alignSelf: 'center', fontWeight: 'bold', fontSize: 35, color: 'white'}}>
                                        Coming Soon
                                    </Text>
                                    <Chip style={{position: 'absolute', top: 0, right: 0, margin: 14, backgroundColor: '#2196F3'}}>
                                        Curated By Lupa
                                    </Chip>
                                </Surface>

                                <Text style={{alignSelf: 'center', fontFamily: 'ARSMaquettePro-Black', color: 'white'}}>
                                    Aura Program
                                </Text>

                                <View style={{marginTop: 50, alignSelf: 'center', width: '60%', height: 'auto', alignItems: 'center', justifyContent: 'center'}}>
                                <FAB
    style={{position: 'absolute', alignSelf: 'flex-start', backgroundColor: "#FFFFFF"}}
    small
    icon={() => <FeatherIcon name="activity" size={25} />}
    onPress={() => console.log('Pressed')}
    color="#F2F2F2"
  />

<FAB
    style={{position: 'absolute', alignSelf: 'flex-end', backgroundColor: "#212121"}}
    small
    icon="share"
    onPress={() => console.log('Pressed')}
  />
                        </View>
                                </View>
        );
    }

    getRBSheet = () => {
        return (
            <RBSheet
            ref={this.RBSheet}
            height={200}
            closeOnDragDown={true}
            closeOnPressMask={false}
            openDuration={150}
            customStyles={{
            wrapper: {
                backgroundColor: 'transparent',
            },
              container: {
                borderTopRightRadius: 35,
                borderTopLeftRadius: 35,
              },
              draggableIcon: {
                  backgroundColor: 'rgb(209, 209, 214)'
              }
            }}
         >
             <SafeAreaView style={{flex: 1, padding: 15}}>
             <TouchableOpacity containerStyle={{height: 'auto', width: Dimensions.get('window').width,}} style={{ flexDirection: 'row', alignItems: 'center',}} onPress={() => alert('Launch Program')}>
                    <View style={{margin: 15, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center'}}>
                        <FeatherIcon name="activity" size={20} style={{margin: 5}} color="#212121" />
                        <Text style={{fontSize: 18, fontWeight: '300'}}>
                            Launch Program
                        </Text>
                    </View>
                    </TouchableOpacity>
                    <Divider />
                    {
                        this.userOwnsProgram() ?
                        <>
                        <TouchableOpacity containerStyle={{height: 'auto', width: Dimensions.get('window').width,}} style={{ flexDirection: 'row', alignItems: 'center',}} onPress={this.handleShareWithFriend}>
                        <View style={{margin: 15, width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'center'}}>
                            <FeatherIcon name="share" size={20} style={{margin: 5}} color="#212121" />
                            <Text style={{fontSize: 18, fontWeight: '300'}}>
                                Share program
                            </Text>
                        </View>
                        </TouchableOpacity>
                        <Divider />
                        </>
                        :
                        null
                    }
             </SafeAreaView>    
             </RBSheet>
        )
    }

    handleProgramOnPress = async (program) => {
        await this.setState({
            currProgramClicked: program
        })
        this.RBSheet.current.open();
    }

    handleOnRefresh = async () => {
        await this.setState({ refreshing: true })
        await this.setState({
            currUserPrograms: getCurrentStoreState().Programs.currUserProgramsData
        })
        await this.setState({
            refreshing: false
        })
    }
 
    mapPrograms = () => {
        if (this.state.currUserPrograms.length != undefined)
        {
            if (this.state.currUserPrograms.length > 0)
            {
                return (
                    <ScrollView contentContainerStyle={{alignItems: 'center', backgroundColor: '#F2F2F2'}}>
                        {
                              this.state.currUserPrograms.map(program => {
                                return (
                                                                        <TouchableOpacity onPress={() => this.handleProgramOnPress(program)}>
                                    <View style={{}}>
                                    <Surface style={{elevation: 0, width: Dimensions.get('screen').width - 20, height: 120, borderRadius: 16, margin: 5}}>
                                  <View style={styles.viewOverlay} />               
                                  <ImageBackground 
                                   imageStyle={{borderRadius: 16}} 
                                   style={{alignItems: 'flex-start', justifyContent: 'center', width: '100%', height: '100%', borderRadius:16 }} 
                                   source={{uri: program.program_image}}>
                                       <View style={{flex: 1, padding: 15, alignItems: 'flex-start', justifyContent: 'center' }}>
                                       <Text style={{color: 'white', fontSize: 20,fontFamily: 'ARSMaquettePro-Medium' }}>
                                            {program.program_name}
                                            </Text>
                                            <Text  numberOfLines={3} style={{ color: 'white', fontSize: 12, fontFamily: 'ARSMaquettePro-Medium'}}>
                                           {program.program_description}
                                            </Text>
                                       </View>
                                   </ImageBackground>
                                </Surface>
                                </View>
                                </TouchableOpacity>
                                )
                            })
                        }     
                    </ScrollView>
                )
            }
            else
            {
                if (this.props.lupa_data.Users.currUserData.isTrainer)
                {
                    return (
                        <View style={{flex: 1, backgroundColor: 'transparent',  justifyContent: 'center'}}>
                        <View style={{padding: 5, alignSelf: 'center', width: '80%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontWeight: '300', textAlign: 'left'}}>
                           Don't wait any longer- create programs for users looking for a trainer
                        </Text>
    
                        </View>
        
                        <ElementsButton type="solid" title="Create a Workout Program" buttonStyle={{backgroundColor: '#2196F3', borderRadius: 12}} style={{alignSelf: 'center', width: '90%'}} />
                </View>
                    )
                }  
                else
                {
                    return (
                        <View style={{flex: 1, backgroundColor: 'transparent',  justifyContent: 'center'}}>
                        <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{padding: 10,fontFamily: 'ARSMaquettePro-Regular', fontSize: 15}}>
                           How will you get started?
                        </Text>

                        <Text style={{padding: 10 }}>
                            Find a Lupa trainer 
                        </Text>
                        </View>
        
        
                        <ElementsButton type="solid" title="Find a trainer" buttonStyle={{backgroundColor: '#', borderRadius: 12}} style={{alignSelf: 'center', width: '90%'}} />
                </View>
                    )
                }
            }
        }
        else
        {
            return (
                <View style={{flex: 1, backgroundColor: 'transparent',}}>
                <Text>
                    How will you get started?
                </Text>

                <ElementsButton type="solid" title="Find a trainer" style={{width: '100%'}} />
        </View>
            )
        }
    }

    mapWaitlist = () => {
            if (this.props.lupa_data.Users.currUserData.length != undefined)
            {
                if (this.props.lupa_data.Users.currUserData.length > 0)
                {
                    return (
                        <ScrollView contentContainerStyle={{}}>
                            {
                                  this.props.lupa_data.Users.currUserData.waitlistedPrograms.map(program => {
                                    return (
                                    <Text> Program </Text>
                                    )
                                })
                            }     
                        </ScrollView>
                    )
                }
                else
                {
                    if (this.props.lupa_data.Users.currUserData.isTrainer)
                    {
                        return (
                            <View style={{flex: 1, backgroundColor: '#F2F2F2',  justifyContent: 'center'}}>
                            <View style={{padding: 5, alignSelf: 'center', width: '80%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontWeight: '300', textAlign: 'left'}}>
                               Explore programs that have a waitlist
                            </Text>
        
                            </View>
            
                            <ElementsButton type="solid" title="Explore waitlisted programs" buttonStyle={{backgroundColor: '#2196F3', borderRadius: 12}} style={{alignSelf: 'center', width: '90%'}} />
                    </View>
                        )
                    }  
                    else
                    {
                        return (
                            <View style={{flex: 1, backgroundColor: '#F2F2F2',  justifyContent: 'center'}}>
                            <View style={{padding: 5, alignSelf: 'center', width: '80%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontWeight: '300', textAlign: 'left'}}>
                               Explore programs that have a waitlist
                            </Text>
        
                            </View>
            
                            <ElementsButton type="solid" title="Explore waitlisted programs" buttonStyle={{backgroundColor: '#2196F3', borderRadius: 12}} style={{alignSelf: 'center', width: '90%'}} />
                    </View>
                        )
                    }
                }
            }
            else
            {
                return (
                    <View style={{flex: 1, backgroundColor: '#F2F2F2',  justifyContent: 'center'}}>
                    <View style={{padding: 5, alignSelf: 'center', width: '80%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontWeight: '300', textAlign: 'left'}}>
                       Explore programs that have a waitlist
                    </Text>

                    </View>
    
                    <ElementsButton type="solid" title="Explore waitlisted programs" buttonStyle={{backgroundColor: '#2196F3', borderRadius: 12}} style={{alignSelf: 'center', width: '90%'}} />
            </View>
                )
            }
    }

    handleShareWithFriend = async () => {
        this.RBSheet.current.close();
        this.setState({
            showShareProgramModal: true,
            pageIsPrograms: false,
        })
    }

    closeShareProgramModal = () => {
        this.setState({
            showShareProgramModal: false,
            pageIsPrograms: true,
        })
    }

    setPageIsPrograms = () => {
        this.setState({ pageIsPrograms: true })
    }

    navigateToCreateProgram = () => {
        this.setState({ pageIsPrograms: false })
        this.props.navigation.navigate('CreateProgram', {
            setPageIsPrograms: this.setPageIsPrograms.bind(this)
        })
    }

    userOwnsProgram = () => {
      /*  if (this.props.lupa_data.Users.currUserData.user_uuid == this.state.currProgramClicked.program_owner)
        {
            return true
        }

        return false;*/

        return true;
    }

    async _prepareSearch() {
        //await LUPA_CONTROLLER_INSTANCE.indexPrograms();
    }

    _performSearch = async search => {
        this.setState({
            searchResults: []
        })

        this.setState({
            searchValue: search
        })
        let result;
        await LUPA_CONTROLLER_INSTANCE.searchPrograms(this.state.searchValue).then(data => {
            result = data;
        })

        this.setState({
            searchResults: this.state.searchResults.concat(result)
        });
    }
    
    showSearchResults() {
        return this.state.searchResults.map(result => {
            return (
                <Surface style={{flexDirection: 'row', alignItems: 'center', borderRadius: 20, margin: 10, elevation: 0, width: Dimensions.get('window').width-20, height: 100, backgroundColor: '#FFFFFF'}} >
                                
                                <View style={{flex: 1, padding: 10, }}>
                                    <Surface style={{width: '100%', height: '100%', elevation: 5, borderRadius: 15}}>
                                        <Image style={{width: '100%', height: '100%', borderRadius: 15}} source={{uri: 'https://picsum.photos/700'}} />
                                    </Surface>
                                </View>

                                <View style={{flex: 3, height: '100%', alignItems: 'center'}}>
                                    <View style={{flex: 2, alignSelf: 'flex-end', padding: 5}}>
                                        <Text style={{fontFamily: 'ARSMaquettePro-Medium', fontSize: 15, color: '#212121'}}>
                                            5 Week Cardio
                                        </Text>
                                        <Caption numberOfLines={2} style={{lineHeight: 12, }}>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                                        </Caption>
                                    </View>


                                    <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10}}>
                                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center',justifyContent: 'flex-start'}}>
                                        <Text style={{fontFamily: 'ARSMaquettePro-Regular', fontSize: 12}}>
                                            0 spots available
                                        </Text>
                                    </View>

                                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center',  justifyContent: 'space-evenly'}}>
                                        <Surface style={{alignItems: 'center', justifyContent: 'center', width: 20, height: 20, elevation: 8, borderRadius: 5, backgroundColor: '#2196F3'}}>
                                        <MaterialIcon name="fitness-center" size={10} color="#FFFFFF" />
                                        </Surface>
                                        <Surface style={{alignItems: 'center', justifyContent: 'center', width: 20, height: 20, elevation: 8, borderRadius: 5, backgroundColor: '#2196F3'}}>
                                        <MaterialIcon name="fitness-center" size={10} color="#FFFFFF" />
                                        </Surface>
                                        <Surface style={{alignItems: 'center', justifyContent: 'center', width: 20, height: 20, elevation: 8, borderRadius: 5, backgroundColor: '#2196F3'}}>
                                        <MaterialIcon name="fitness-center" size={10} color="#FFFFFF" />
                                        </Surface>
                                        <Surface style={{alignItems: 'center', justifyContent: 'center', width: 20, height: 20, elevation: 8, borderRadius: 5, backgroundColor: '#2196F3'}}>
                                        <MaterialIcon name="fitness-center" size={10} color="#FFFFFF" />
                                        </Surface>
                                    </View>
                                    </View>

                                    
                                </View>


                              </Surface>
            )
        })
    }

    mapFeaturedPrograms = () => {
        return this.state.featuredPrograms.map(programs => {
            return (
                this.state.data.map(function(currentValue, index, arr) {
                    return (
                        <ProgramListComponent key={index} index={index} />
                    )
                })
            )
        })
    }


    render() {
        return (
            <View style={{flex: 1, backgroundColor: '#F2F2F2'}}>

<Header hasTabs style={{backgroundColor: '#F2F2F2', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
<Appbar.BackAction onPress={() => this.props.navigation.goBack()} color="#212121" />
                    <Text style={{fontFamily: 'ARSMaquettePro-Black', color: '#212121', fontSize: 20}}>
                        Lupa Programs
                    </Text>
                    <Appbar.Action icon="filter-list" onPress={this.showFilter} color="#212121" />
</Header>
        <Tabs tabContainerStyle={{backgroundColor: '#F2F2F2'}} renderTabBar={()=> <ScrollableTab ref={this.scrollableTab} tabsContainerStyle={{backgroundColor: '#F2F2F2'}} />}>
          <Tab heading="Featured" tabStyle={{backgroundColor: '#F2F2F2'}} activeTabStyle={{backgroundColor: '#F2F2F2'}}>
              <View style={{backgroundColor: '#F2F2F2', flex: 1}}>
                

                    <ScrollView contentContainerStyle={{backgroundColor: '#F2F2F2'}}>
                    <View>
                        <Text style={styles.headerText}>
                        See Trainer Profiles
                    </Text>
                    <View style={{height: 'auto'}}>
                        <ScrollView 
                        horizontal 
                        decelerationRate={0} 
                        shouldRasterizeIOS={true} 
                        snapToAlignment={'center'} 
                        centerContent
                      //  pagingEnabled={true}
                        snapToInterval={Dimensions.get('window').width / 1.2}
                        showsHorizontalScrollIndicator={false}>
                           
                        </ScrollView>
                    </View>
                        </View>


                        <View>
                        <Text style={styles.headerText}>
                        Programs
                    </Text>
                    <View style={{height: 'auto'}}>
                        <ScrollView 
                        horizontal 
                        decelerationRate={0} 
                        shouldRasterizeIOS={true} 
                        snapToAlignment={'center'} 
                        centerContent
                      //  pagingEnabled={true}
                        snapToInterval={Dimensions.get('window').width / 1.2}
                        showsHorizontalScrollIndicator={false}>
                            {
                                this.mapFeaturedPrograms()
                            }
                        </ScrollView>
                    </View>
                        </View>

                        <View>
                        <Text style={styles.headerText}>
                        Curated By Lupa
                    </Text>

                        <Carousel 
                        data={this.state.samplePhotoData}
                        itemWidth={Dimensions.get('window').width - 100}
                        sliderWidth={Dimensions.get('window').width}
                        scrollEnabled={true}
                        firstItem={1}
                        renderItem={this._renderItem}
                        />
                        </View>

                        <View style={{ }}>
                        <Text style={styles.headerText}>
                        Programs with waitlist
                    </Text>
                        <View>
                            <Text style={{margin: 20, }}>
                                It looks like currently there are no programs with waitlist!
                            </Text>
                        </View>
                        </View>

                        <View style={{backgroundColor: 'rgb(209, 209, 214)', marginVertical: 30, justifyContent: 'space-evenly', alignItems: 'center', padding: 10}}>
                            <Text style={{fontFamily: 'ARSMaquettePro-Regular', color: '#212121', fontSize: 18, fontWeight: '300'}}>
                                Add four friends and automatically get signed up to a pack when spots are available
                            </Text>
                            <View style={{width: '100%', margin: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                                <View style={{width: 60, height: 60, borderRadius: 60, backgroundColor: '#EBEBEB', alignItems: 'center', justifyContent: 'center'}}>
                                    {
                                        this.state.waitListData[0] == '' ?
                                        <MaterialIcon name="add" size={30} />
                                        :
                                        <Image source={{uri: this.state.waitListData[0].photo_url}} style={{width: 60, height: 60, borderRadius: 60}} />
                                    }
                                </View>

                                <View style={{width: 60, height: 60, borderRadius: 60, backgroundColor: '#EBEBEB', alignItems: 'center', justifyContent: 'center'}}>
                                    <MaterialIcon name="add" size={30} />
                                </View>

                                <View style={{width: 60, height: 60, borderRadius: 60, backgroundColor: '#EBEBEB', alignItems: 'center', justifyContent: 'center'}}>
                                    <MaterialIcon name="add" size={30} />
                                </View>

                                <View style={{width: 60, height: 60, borderRadius: 60, backgroundColor: '#EBEBEB', alignItems: 'center', justifyContent: 'center'}}>
                                    <MaterialIcon name="add" size={30} />
                                </View>
                            </View>

                            {
                                this.state.allSpotsFilled == true ?
                                <NativeButton title="Send out request" onPress={this.handleInviteWaitlist} />
                                :
                                <NativeButton title="Invite Friends" onPress={() => this.setState({ showInviteModal: true })} />
                            }
                        </View>
                    </ScrollView>
                    </View>
                    <SafeAreaView style={{backgroundColor: '#F2F2F2'}} />
          </Tab>
          <Tab heading="Programs" tabStyle={{backgroundColor: '#F2F2F2'}} activeTabStyle={{backgroundColor: '#F2F2F2'}}>    
          <SearchBar  
                platform="ios" 
                style={{backgroundColor: '#F2F2F2'}}
                containerStyle={{backgroundColor: '#F2F2F2', borderColor: '#F2F2F2'}} 
                style={{borderColor: '#F2F2F2'}} 
                inputContainerStyle={{borderColor: '#F2F2F2'}} 
                inputStyle={{ borderColor: '#F2F2F2'}} 
                placeholder="Search"
                value={this.state.searchValue}
                onChangeText={text => this.setState({ searchValue: text })}
                />
                            <ScrollView style={{backgroundColor: '#F2F2F2'}}>
                                {
                                    this.showSearchResults()
                                }
                            </ScrollView>
          </Tab>
          <Tab heading="My Programs" tabStyle={{backgroundColor: '#F2F2F2'}} activeTabStyle={{backgroundColor: '#F2F2F2'}}>
                            <ScrollView centerContent={this.state.currUserPrograms.length == 0 || this.state.currUserPrograms == undefined ? true : false} contentContainerStyle={{flex: 1, backgroundColor: '#F2F2F2'}} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.setState({ currUserPrograms: getCurrentStoreState().Programs.currUserProgramsData })} />}>
                                {
                                    this.mapPrograms()
                                }
                            </ScrollView>
                            {this.getRBSheet()}
          </Tab>

          <Tab heading="Waitlist" tabStyle={{backgroundColor: '#F2F2F2'}} activeTabStyle={{backgroundColor: '#F2F2F2'}}>
              {
                  this.mapWaitlist()
              }

          </Tab>
          
        </Tabs>
       
       {
           this.props.lupa_data.Users.currUserData.isTrainer && this.state.pageIsPrograms ?
                  <Portal>
                  <FAB.Group
                  color="#FFFFFF"
                    open={this.state.open}
                    icon={this.state.open ? 'list' : 'add'}
                    actions={[
                      { icon: 'fitness-center', label: 'Create a Program', color: "#212121" ,onPress: () => this.navigateToCreateProgram()},
                      { icon: () => <FeatherIcon name="shield" size={23} color="#212121" />, label: 'Create a Service', onPress: () => this.setState({ showCreateServiceDialog: true }) },
                    ]}
                    onStateChange={this._onStateChange}
                    onPress={() => {
                      if (this.state.open) {
                        // do something if the speed dial is open
                      }
                    }}
                    fabStyle={{backgroundColor: '#2196F3'}}
                  />
                </Portal>
                :
                null
       }

        <ProgramsFilter filterHeight={this.state.filterHeight} handleApplyFilterOnPress={this.handleApplyFilterOnPress} handleCancelButtonOnPress={this.handleCancelButtonOnPress} disableSwipe={this.props.disableSwipe} enableSwipe={this.props.enableSwipe} />
           <InviteWaitlistFriends following={this.props.lupa_data.Users.currUserData.following}  isVisible={this.state.showInviteModal} closeModalMethod={(list, action) => this.closeInviteModal(list, action)} />
            <CreateServiceDialog isVisible={this.state.showCreateServiceDialog} closeDialogMethod={this.closeCreateServiceDialog} />
            <ShareProgramModal isVisible={this.state.showShareProgramModal} following={this.props.lupa_data.Users.currUserData.following} currUserData={this.props.lupa_data.Users.currUserData} program={this.state.currProgramClicked} closeModalMethod={this.closeShareProgramModal} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerText: {
        fontFamily: 'ARSMaquettePro-Black', 
        margin: 5, 
        padding: 5, 
        alignSelf: 'flex-start', 
        color: '#212121', 
        fontWeight: 'bold', 
        fontSize: 25
    },
    filterText: {
        color: '#F2F2F2',
        fontFamily: 'ARSMaquettePro-Regular',
        fontSize: 15
    }
})

export default connect(mapStateToProps)(withNavigation(Programs));