import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
} from 'react-native';

import {
    Surface,
    Chip,
    Avatar
} from 'react-native-paper';


import { withNavigation, NavigationActions } from 'react-navigation';

import LupaController from '../../../controller/lupa/LupaController';

import PackInformationModal from '../modal/PackInformationModal';

import { connect } from 'react-redux';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state,
    }
}

class PackSearchResultCard extends React.Component {

    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            packUUID: this.props.uuid,
            packInformationModalIsOpen: false,
            packImage: "",
        }
    }

    componentDidMount = async () => {
        await this.setupComponent();
    }

    setupComponent = async () => {
        let packImageIn;
        
        await this.LUPA_CONTROLLER_INSTANCE.getPackImageFromUUID(this.props.uuid).then(result => {
            packImageIn = result;
        });

        await this.setState({
            packImage: packImageIn,
        })
    }

    _handleViewPack = async (uuid) => {
        let packInformation;

        await this.LUPA_CONTROLLER_INSTANCE.getPackInformationByUUID(uuid).then(result => {
            packInformation = result;
        });


        if (packInformation.pack_members.includes(this.props.lupa_data.Users.currUserData.user_uuid))
        {
            this.props.navigation.navigate('PackModal', {
                packUUID: uuid,
                navFrom: 'SearchView',
            });
        }
        else
        {
            this.setState({ packInformationModalIsOpen: true })
        }
    }

    getPackAvatar = () => {
        if (this.state.packImage == "" || this.state.packImage == "undefined" || this.state.packImage == '')
        {
            return <Avatar.Icon icon="group" size={45} style={{backgroundColor: "#212121", margin: 5}}/>
        }

        try {
            return <Avatar.Image size={45} source={{uri: this.state.packImage}} style={{margin: 5}} />
        } catch(err)
        {
            return <Avatar.Icon icon="group" size={45} style={{backgroundColor: "#212121", margin: 5}}/>
        }
    }

    render() {
        return (
            <>
                <TouchableOpacity onPress={() => this._handleViewPack(this.state.packUUID)} style={styles.touchableOpacity}>
                <View style={[styles.cardContainer]}>
                    <View style={styles.cardContent}>
                        <View style={styles.userInfoContent}>
                        {this.getPackAvatar()}
                        <View style={{flexDirection: 'column'}}>
                        <Text style={styles.titleText}>
                                {this.props.title}
                            </Text>
                            <Text style={styles.subtitleText}>
                                {this.props.packLocation}
                            </Text>
                        </View>
    
                            </View>
                            {
                                /*
                                                                <Chip style={[styles.chipIndicator, { backgroundColor: "#2196F3" }]} mode="flat">
    Lupa Pack
    </Chip>
                                */
                            }
                    </View>
                </View>
                    </TouchableOpacity>
                    <PackInformationModal isOpen={this.state.packInformationModalIsOpen} packUUID={this.props.uuid} />
                    </>
        );
    }
   
}

const styles = StyleSheet.create({
    touchableOpacity: {
        width: "100%",
        height: "auto",
        justifyContent: "center",
    },
    cardContainer: {
        elevation: 3,
        borderRadius: 0,
        width: "100%",
        height: "auto",
        margin: 5,
        padding: 10,
        backgroundColor: "transparent"
    },
    cardContent: {
        alignItems: "center", 
        flexDirection: "row", 
        justifyContent: "space-between", 
        width: "100%"
    },
    userInfoContent: {
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: 'flex-start'
    },
    titleText: {
        fontWeight: "600",
    },
    subtitleText: {
        fontWeight: '200',
        fontSize: 13,
        fontFamily: 'ARSMaquettePro-Regular',
        color: 'grey'
    },
    chipIndicator: {
        width: 100,
        height: 25,
        alignItems: "center",
        justifyContent: "center",
        margin: 5,

    },
    rating: {
        backgroundColor: "transparent",
    }
});

export default connect(mapStateToProps)(withNavigation(PackSearchResultCard));