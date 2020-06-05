/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  20, 2019
 * 
 * Profile View
 */

import React, { useState } from 'react';

import {
    StyleSheet,
    Modal,
} from "react-native";



import { withNavigation } from 'react-navigation';
import LupaController from '../../../controller/lupa/LupaController';
import { connect } from 'react-redux';

const mapStateToProps = (state, action) => {
    return {
        lupa_data: state
    }
}

const mapDispatchToProps = dispatchEvent => {
    
}

/**
 * Lupa Profile View
 * 
 * This view serves as the user profile for the current user to see only.  Any edits to the profile can be
 * made here.
 * 
 * TODO:
 * @todo Fix Fitness Interest surface displaying wrong caption for current user.
 */
class ModalProfileView extends React.Component {
    constructor(props) {
        super(props);

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

        this.state = {
            
        }
    }



    render() {
        return (
            <Modal presentationStyle="fullScreen" style={styles.container} visible={this.props.isVisible} animated={true} animationType="slide">
               
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FAFAFA",
    },
    menuIcon: {
        position: 'absolute',
        bottom: 0
    },
    contentSurface: {
        margin: 5,
        elevation: 0,
        padding: 15,
        borderRadius: 20,
        flexDirection: 'column',
        backgroundColor: "transparent",
        justifyContent: "space-between",
        margin: 10,
        borderColor: "#2196F3",
        borderWidth: 1
    },
    chipStyle: {
        elevation: 3,
        width: "auto",
        backgroundColor: "white",
        margin: 5
    },
    chipTextStyle: {
        color: "#2196F3",
        fontWeight: 'bold',
    },
    surfaceHeader: {
        height: "15%",
        width: "100%",
        elevation: 1
    },
    experience: {
        backgroundColor: "transparent",
        margin: 10,
    },
    myPacks: {
        backgroundColor: "transparent",
        padding: 5,
    },
    recommendedWorkouts: {
        backgroundColor: "transparent",
        margin: 10,
    },
    recommendedWorkoutsHeader: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    userInfo: {
        flexDirection: "column",
    },
    user: {
        flexDirection: "column",
        margin: 0,
        backgroundColor: "transparent"
    },
    uesrInfoText: {
        fontWeight: "600",
    },
    userAttributesContainer: {
        flexDirection: "row", alignItems: "center", justifyContent: "space-between", margin: 3, 
    },
    userAttributeText: {
        fontWeight: "500",
        color: "rgba(33,33,33 ,1)"
    },
    imageBackground: {
        width: "100%",
        height: "100%"
    },
    userInfoContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        margin: 10,
        marginBottom: 15,
    },
    alignCenterColumn: {
        flexDirection: 'column', alignItems: 'center'
    },
    fab: {
        position: 'absolute',
        marginBottom: 15,
        marginRight: 15, 
        right: 0,
        bottom: 0,
        backgroundColor: "#2196F3"
    },
    selectedChip: {
        elevation: 5,
        margin: 5,
        width: '100',
        height: 'auto',
        backgroundColor: "#2196F3",
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedChipText: {
        color: '#FFFFFF',
    },
    unselectedChip: {
        elevation: 0,
        margin: 5,
        width: 'auto',
        height: 'auto',
        opacity: 0.6,
        backgroundColor: "transparent",
        borderColor: 'rgba(30,136,229 ,1)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2, 
    },
    unselectedChipText: {
        color: "rgba(33,150,243 ,1)"
    }

});

export default connect(mapStateToProps)(withNavigation(ModalProfileView));