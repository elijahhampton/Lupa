import React from 'react';

import {
    Modal,
    View,
    Text,
    StyleSheet,
    Button,
} from 'react-native';

import {
    IconButton,
    Surface,
    Caption
} from 'react-native-paper';

import { Feather as Icon } from '@expo/vector-icons';

import PackMembers from './views/PackMembers.js';
import SafeAreaView from 'react-native-safe-area-view';
import { ScrollView } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-elements';

function getModalPageTitle(currIndex) {
    switch(currIndex) {
        case 0:
            return (
                <Text style={{fontSize: 40, fontWeight: "400", color: "white", marginTop: 30, marginLeft: 10}}>
                    Pack Members
                </Text>
            )
        case 1:
                <Text style={{fontSize: 40, fontWeight: "400", color: "white", marginTop: 30, marginLeft: 10}}>
                Chat
            </Text>
        case 2:
            return (
                <Text style={{fontSize: 40, fontWeight: "400", color: "white", marginTop: 30, marginLeft: 10}}>
                Announcements
            </Text>
            )
    }
}

function getModalPage(currIndex) {
    switch(currIndex) {
        case 0:
            return <PackMembers />
        case 1:
            
        case 2:
    }
}

export default class PackModal extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            isOpen: true,
        }
    }

    _closeModal = () => {
        this.setState({
            isOpen: false,
        })
    }


    render() {
        let pageIndex = this.state.currentIndex;
        return (
            <Modal presentationStyle="fullScreen" visible={this.props.isOpen} style={styles.modalContainer}>
                <SafeAreaView>
                    <View>
                    <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                        <IconButton icon="clear" color="#2196F3" onPress={this.props._handleClose}/>
                        <IconButton icon="message" color="#2196F3" />
                        </View>

                <Text style={styles.header}>
                    Announcements
                </Text>
                    </View>     

                <View style={{height: "80%"}}>
                <View style={styles.online}>
                    <Text style={styles.sectionHeader}>
                        5 people are online
                    </Text>
                    <ScrollView>
                        <View style={styles.flatUserCard}>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                            <Avatar size="medium" title="EH" rounded  />
                                <Text style={{padding: 10}}>
                                    Elijah Hampton
                                </Text>
                            </View>
                                <Icon name="message-square" size={20} style={styles.iconStyle} />
                        </View>
                        
                        <View style={styles.flatUserCard}>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                            <Avatar size="medium" title="EH" rounded  />
                                <Text style={{padding: 10}}>
                                    Elijah Hampton
                                </Text>
                            </View>
                                <Icon name="message-square" size={20} style={styles.iconStyle} />
                        </View>

                        <View style={styles.flatUserCard}>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                            <Avatar size="medium" title="EH" rounded  />
                                <Text style={{padding: 10}}>
                                    Elijah Hampton
                                </Text>
                            </View>
                                <Icon name="message-square" size={20} style={styles.iconStyle} />
                        </View>

                        <View style={styles.flatUserCard}>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                            <Avatar size="medium" title="EH" rounded  />
                                <Text style={{padding: 10}}>
                                    Elijah Hampton
                                </Text>
                            </View>
                                <Icon name="message-square" size={20} style={styles.iconStyle} />
                        </View>

                        <View style={styles.flatUserCard}>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                            <Avatar size="medium" title="EH" rounded  />
                                <Text style={{padding: 10}}>
                                    Elijah Hampton
                                </Text>
                            </View>
                                <Icon name="message-square" size={20} style={styles.iconStyle} />
                        </View>

                        <View style={styles.flatUserCard}>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                            <Avatar size="medium" title="EH" rounded  />
                                <Text style={{padding: 10}}>
                                    Elijah Hampton
                                </Text>
                            </View>
                                <Icon name="message-square" size={20} style={styles.iconStyle} />
                        </View>
                    </ScrollView>
                </View>

                <View style={styles.members}>
                    <Text style={styles.sectionHeader}>
                        Members
                    </Text>
                    <ScrollView horizontal={true}>
                    <View style={{margin: 5}}>
                    <Avatar size="small" title="EH" rounded  />
                    </View>
                    <View style={{margin: 5}}>
                    <Avatar size="small" title="EH" rounded  />
                    </View>
                    <View style={{margin: 5}}>
                    <Avatar size="small" title="EH" rounded  />
                    </View>
                    <View style={{margin: 5}}>
                    <Avatar size="small" title="EH" rounded  />
                    </View>
                    <View style={{margin: 5}}>
                    <Avatar size="small" title="EH" rounded  />
                    </View>
                    <View style={{margin: 5}}>
                    <Avatar size="small" title="EH" rounded  />
                    </View>
                    <View style={{margin: 5}}>
                    <Avatar size="small" title="EH" rounded  />
                    </View>
                    <View style={{margin: 5}}>
                    <Avatar size="small" title="EH" rounded  />
                    </View>
                    </ScrollView>
                </View>

                <View style={styles.events}>
                    <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <Text style={styles.sectionHeader}>
                        Events and Notes
                    </Text>
                    <Button title="See all"/>
                    </View>
                    <ScrollView horizontal={true}>
                        <Surface style={styles.event}>

                        </Surface>
                    </ScrollView>
                </View>
                </View>

                <Caption style={{alignSelf: "center"}}>
                    You have been apart of this pack for 71 days.
                </Caption>

                </SafeAreaView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        display: "flex",
        margin: 0,
        backgroundColor: "#FAFAFA",
    },
    flatUserCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: 15
    },
    userInfo: {
        flex: 2,
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        flex: 1,
    },
    header: {
        fontSize : 25,
        fontWeight: "900",
        padding: 10
    },
    event: {
        width: 100,
        height: 115,
        borderRadius: 10,
        elevation: 6,
        margin: 5,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: "500",
        padding: 10,
    },
    online: {
        display: "flex",
        flex: 3,
    },
    members: {
        flex: 1,
    },
    events: {
        flex: 2,
    },
    iconStyle: {
        borderColor: "#2196F3", 
        color: "#2196F3", 
        borderWidth: 1, 
        borderRadius: 8, 
        padding: 10
    }
});