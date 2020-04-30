import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    Modal,
    Dimensions,
    Button as NativeButton,
    ScrollView
} from 'react-native';

import {
    Headline,
    Paragraph,
    Title,
    Caption,
    Surface,
    Button,
    Divider,
    Avatar,
    Appbar,
    IconButton
} from 'react-native-paper';

import {
    LineChart,
} from 'react-native-chart-kit';

import { Button as ReactNativeElementsButton, Icon } from 'react-native-elements';

import { connect } from 'react-redux';

import LinearGradient from 'expo-linear-gradient';

import LupaController from '../../../controller/lupa/LupaController';
import { event } from 'firebase-functions/lib/providers/analytics';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

class PackInformationModal extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            packUUID: this.props.packUUID,
            packInformation: {},
            packLeaderInformation: {},
            packImageUrl: "",
            members: [],
            ready: false,
            memberPictures: [],
            packActivityChartWidth: "",
            packActivityChartHeight: "",
        }
    }

    componentDidMount = async () => {
        await this.setupPackInformation();
        await this.generateMembersPictures();

    }

    setupPackInformation  = async () => {
        let packInformationIn, packLeaderInformationIn, packImageUrlIn;
        
        try {
            await this.LUPA_CONTROLLER_INSTANCE.getPackInformationByUUID(this.props.packUUID).then(result => {
                packInformationIn = result;
            });
        } catch (err) {
            
        }

        try {
            await this.LUPA_CONTROLLER_INSTANCE.getPackImageFromUUID(this.props.packUUID).then(result => {
                packImageUrlIn = result;
            });
        } catch (err) {
            packImageUrlIn = undefined;
        }

        try {
            await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(packInformationIn.pack_leader).then(result => {
                packLeaderInformationIn = result;
            });
        } catch(err) {
            packLeaderInformationIn = undefined
        }

        await this.setState({ 
            packInformation: packInformationIn, 
            packLeaderInformation: packLeaderInformationIn, 
            packImageUrl: packImageUrlIn, 
            members: packInformationIn.pack_members,
            ready: true
        });
    }

    renderRequestToJoinButton = () => {
        return this.state.ready ?
        this.state.packInformation.pack_requests.includes(this.props.lupa_data.Users.currUserData.user_uuid) == true ?
<Button  onPress={() => this.LUPA_CONTROLLER_INSTANCE.requestToJoinPack(this.props.lupa_data.Users.currUserData.user_uuid, this.state.packUUID)} disabled={true} mode="outlined" style={{padding: 5, borderRadius: 80, width: "85%", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"}} color="black">
<Icon type="material" name="group" color="black" />
<>
Request to join {" "}
        <Text style={{fontFamily: "Avenir-Roman", fontSize: 15, padding: 5}}>
            {this.state.packInformation.pack_title}
            </Text>
</>
</Button>
        :

<Button  onPress={() => this.LUPA_CONTROLLER_INSTANCE.requestToJoinPack(this.props.lupa_data.Users.currUserData.user_uuid, this.state.packUUID)} mode="outlined" style={{padding: 10, borderRadius: 80, width: "85%", flexDirection: "row", alignItems: "center", justifyContent: "space-evenly"}} color="black">
<Icon type="material" name="group" color="black" />
<>
Request to join {" "}
        <Text style={{fontFamily: "Avenir-Roman", fontSize: 15, padding: 5}}>
            {this.state.packInformation.pack_title}
            </Text>
</>
</Button>
:
null
    }

    mapFeaturedEvents = () => {
        return (
            <Caption>
                {this.state.packInformation.pack_title} has no featured events at the moment!
            </Caption>
        )
    }

    mapFriendsInPack = () => {
        return (
            <Caption>
                You have no friends currently in this pack.
            </Caption>
        )
    }

    getPackImage = () => {
        if (this.state.packImageUrl == undefined)
        {
            return <Avatar.Text label="LP" style={{margin: 10}} color="#212121" />
        }

        try {
            return (
                <Avatar.Image style={{margin: 10}} source={{uri: this.state.packImageUrl}} />
            )
        }
        catch(err) {
            return (
                <Avatar.Text label="LP" style={{margin: 10}} color="#212121" />
            )
        }
    }

    generateMembersPictures = async () => {
        let memberPictures = [];
        if (this.state.packInformation)
        {
            if (this.state.packInformation.pack_members.length)
            {
                for (let i = 0; i < this.state.packInformation.pack_members.length; i++)
                {
                    let uri;
                    await this.LUPA_CONTROLLER_INSTANCE.getUserProfileImageFromUUID(this.state.packInformation.pack_members[i]).then(URIRes => {
                        uri = URIRes;
                    });

                    
                    memberPictures.push(uri);
                }
           }
        }

        await this.setState({
            memberPictures: memberPictures,
        });
    }

    mapMembers = () => {
        return this.state.memberPictures.map(uri => {
            return (
                <Surface style={{ margin: 5, width: 65, height: 65, borderRadius: 65, elevation: 8}}>
                    <Image style={{ width: 65, height: 65, borderRadius: 65}} source={{uri: uri}} />
                </Surface>
            )
        })
    }

    shouldComponentUpdate(state, props) {
        return true;
    }

    render() {
        return (
                <Modal 
                    animationType="slide" 
                    presentationStyle="fullScreen" 
                    onDismiss={this.props.closeModalMethod} 
                    onRequestClose={() => this.props.closeModalMethod()} 
                    visible={this.props.isOpen}
                    >
                        <SafeAreaView style={{flex: 1}}>

                    <ScrollView contentContainerStyle={{ flexGrow: 1}}>
                        <View style={{paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Text style={{fontFamily: "Avenir-Roman"}}>
                        Community
                    </Text>
                        <NativeButton title="Close" onPress={this.props.closeModalMethod}/>
                        </View>

                    <View style={{alignItems: "center", justifyContent: "center", margin: 15}}>
                   {
                       this.getPackImage()
                   }

                    <View style={{alignItems: "center", justifyContent: "center"}}>
                    <Text style={{fontFamily: "Avenir-Roman", fontSize: 25, padding: 5}}>
                            {                            this.state.packInformation.pack_title}
                        </Text>

                        {
                            this.state.ready  ?
                            <Text style={{fontFamily: "Avenir-Roman", fontSize: 15, padding: 5}}>
                                {this.state.packInformation.pack_location.city + ", " + this.state.packInformation.pack_location.country}
                                </Text>
                                :
                                <Text style={{fontFamily: "Avenir-Roman", fontSize: 15, padding: 5}}>
                                    Pack Location not found
                                </Text>
                        }
                    </View>
                    
                    {this.renderRequestToJoinButton()}
                    </View>

                    <View>
                    <Divider />
                        <View style={{padding: 20, flexDirection: "row", alignItems: "flex-start", margin: 15}}>
                            {
                                this.state.packLeaderInformation == undefined ?
                                <Avatar.Text label="L" color="#212121" />
                                :
                                <Avatar.Image source={{uri: this.state.packLeaderInformation.photo_url}}/>
                            }
                            <View style={{padding: 10, alignItems: "center"}}>
                                <Title>
                                    Pack Leader
                                </Title>
                                
                                {
                            this.state.ready ?
                                    this.state.packLeaderInformation == undefined ?
                                    <Text style={{fontFamily: "Avenir-Roman", fontSize: 15, padding: 5}}>
                                    Couln't find pack leader name
                                </Text>
                                :
                            <Text style={{fontFamily: "Avenir-Roman", fontSize: 13, padding: 5}}>
                                {this.state.packLeaderInformation.display_name}
                                </Text>
                                :
                                null
                        }
                            </View>
                        </View>

                        <Paragraph style={{textAlign: "center", fontSize: 15, margin: 10, padding: 5}}>
                            {this.state.packInformation.pack_description}
                        </Paragraph>
                        <Divider />
                    </View>


                    <View style={{margin:  15}}>
                        <Text style={{color: "#212121", fontSize: 20, fontFamily: "avenir-roman"}}>
                            Friends in this pack (0)
                        </Text>
                        <ScrollView horizontal>
                            {
                                this.mapFriendsInPack()
                            }
                        </ScrollView>
                    </View>


                    <View style={{margin: 15}}>
                        <Text style={{color: "#212121", fontSize: 20, fontFamily: "avenir-roman"}}>
                            Featured Events
                        </Text>
                        <ScrollView horizontal>
                            {
                                this.mapFeaturedEvents()
                            }
                        </ScrollView>
                    </View>

                    <View style={{margin: 15}}>
                        <Text style={{color: "#212121", fontSize: 20, fontFamily: "avenir-roman"}}>
                            Members
                        </Text>
                        <ScrollView horizontal contentContainerStyle={{margin: 20}}>
                            {
                                this.mapMembers()
                            }
                        </ScrollView>
                    </View>

                    <View style={{margin: 20}}>
                    <Text style={{alignSelf: 'center', padding: 10, color: "#212121", fontSize: 20, fontFamily: "avenir-roman"}}>
                            Pack Activity (3 Months)
                        </Text>
                            <Surface style={{marginBottom: 10, alignSelf: 'center', elevation: 10, borderRadius: 30, width: Dimensions.get('window').width-80, height: 200}}>
                            <LineChart
    data={{
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jul"],
      datasets: [
        {
          data: [
            1,
            2,
            5,
            8,
            10,
            20
          ]
        }
      ]
    }}
    width={Dimensions.get('window').width-80} // from react-native
    height={200}
    yAxisLabel=""
    yAxisSuffix="m"
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={{
      backgroundColor: "#003459",
      backgroundGradientFrom: "#003459",
      backgroundGradientTo: "#019756",
      decimalPlaces: 0, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      }
    }}
    bezier
    style={{
      borderRadius: 30
    }}
  />
                            </Surface>
                    </View>
                    </ScrollView>
                    </SafeAreaView>
                </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        alignSelf: "center",
        width: "60%",
        height: "60%",
        backgroundColor: "white",
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        padding: 10,
        borderRadius: 10,
    },
    surface: {
        width: '100%',
        height: 70,
        elevation: 6,
        margin: 5,
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        fontSize: 20,
        fontWeight: "600",
        color: "black",
    },
    alignColumnItemsCenter: {
        flexDirection: 'column',
        alignItems: 'center'
    }
})

export default connect(mapStateToProps)(PackInformationModal);