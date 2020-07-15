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

import LupaController from '../../../controller/lupa/LupaController';

import PackInformationModal from '../modal/PackInformationModal';

import { connect } from 'react-redux';
import { LOG_ERROR } from '../../../common/Logger';

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

    _handleViewPack = async (uuid) => {
        let packInformation;

        await this.LUPA_CONTROLLER_INSTANCE.getPackInformationByUUID(uuid).then(result => {
            packInformation = result;
        });


        try {
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
        } catch(error) {
            LOG_ERROR('PackSearchResultCard.js', 'Caught exception in _handleViewPack()', error)
            this.setState({ packInformationModalIsOpen: true });
        }
    }

    renderPackAvatar = () => {
        try {
            return <Avatar.Image size={45} source={{uri: this.props.pack.pack_image}} style={{margin: 5}} />
        } catch(err)
        {
            LOG_ERROR('PackSearchResultCard.js', 'Caught exception in renderPackAvatar()', error)
            return <Avatar.Icon icon="group" size={45} style={{backgroundColor: "#212121", margin: 5}}/>
        }
    }

    renderPackTitle = () => {
            try {
                return (
                    <Text style={styles.titleText}>
                    {this.props.pack.pack_title}
                </Text>
                )
        } catch(error) {
            LOG_ERROR('PackSearchResultCard.js', 'Caught exception in renderPackTitle()', error)

            return (
                <Text style={styles.titleText}>
                {this.props.pack.pack_title}
            </Text>
            )
        }
    }

    renderPackLocation= () => {
        try {
            return (
                <Text style={styles.titleText}>
                Location Unknown
            </Text>
            )
    } catch(error) {
        LOG_ERROR('PackSearchResultCard.js', 'Caught exception in renderPackLocation()', error)
        return (
            <Text style={styles.titleText}>
            Location Unknown
        </Text>
        )
    }
}

    render() {
        return (
            <>
                <TouchableOpacity onPress={() => this._handleViewPack(this.state.packUUID)} style={styles.touchableOpacity}>
                <View style={[styles.cardContainer]}>
                    <View style={styles.cardContent}>
                        <View style={styles.userInfoContent}>
                        {this.renderPackAvatar()}
                        <View style={{flexDirection: 'column'}}>
                        {
                            this.renderPackTitle()
                        }
                            {
                                this.renderPackLocation()
                            }
                        </View>
    
                            </View>
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

export default connect(mapStateToProps)(PackSearchResultCard);