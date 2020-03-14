import React, { useState } from 'react';

import {
    Modal,
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    ActionSheetIOS,
    ScrollView,
    TouchableOpacity
} from 'react-native';

import {
    IconButton,
    Surface,
    Caption,
    Button,
    Modal as PaperModal,
    Portal,
    Provider,
    Paragraph,
    Headline,
    Title,
    Avatar
} from 'react-native-paper';

import SafeAreaView from 'react-native-safe-area-view';

import LupaController from '../../../controller/lupa/LupaController';

class PackRequestsModal extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            packUUID: {},
            packRequests: this.props.requestsUUIDs,
            packRequestsUserData: [],
        }
    }

    componentDidMount = async () => {
        await this.setupPackRequestModal()
    }

    setupPackRequestModal = async () => {
        let packRequestsUserDataIn = [];

        for (let i = 0; i < this.props.requestsUUIDs.length; i++)
        {
            await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(this.state.packRequests[i]).then(result => {
                packRequestsUserDataIn.push(result);
            });
        }

        await this.setState({ packRequestsUserData: packRequestsUserDataIn})
    }

    mapRequests = () => {
        return this.state.packRequestsUserData.map(userObj => {
            return <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                <Avatar.Image source={{uri: userObj.photo_url}} />
                <Text style={{fontWeight: 'bold'}}>
                    {
                        userObj.display_name
                    }
                </Text>
                </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Button mode="contained" color="#2196F3">  
                            Accept
                        </Button>

                        <Button mode="text" color="#f44336">
                            Decline
                        </Button>
                    </View>
            </View>
        })
    }

    handleClosePackRequestModal =  () => {
         this.props.refreshData();
         this.props.closeModalMethod();
    }



    render() {
        return (
            <Modal style={styles.modalContainer} presentationStyle="overFullScreen" visible={this.props.isOpen}>
                <SafeAreaView forceInset={{
                    bottom: 'never'
                }} style={{ flex: 1, backgroundColor: "white" }}>

<View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20}}>
                            <IconButton icon="clear" size={20} onPress={this.handleClosePackRequestModal} />
                            <Headline>
                                Requests
                            </Headline>
                        </View>

                        <ScrollView style={{}}>
                        {
                            this.mapRequests()
                        }
</ScrollView>
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
});

export default PackRequestsModal;