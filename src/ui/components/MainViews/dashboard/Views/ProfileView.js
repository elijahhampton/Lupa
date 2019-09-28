/**
 * Lupa - Preventative Health Care
 * @author Elijah Hampton
 * @date August  20, 2019
 * 
 * Profile View
 */

import React from 'react';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,

} from "react-native";

import {
    Left,
    Right,
    Body,
} from 'native-base';

import {
    Appbar,
    IconButton,
    Title,
    Surface
} from 'react-native-paper';

import ProfilePicture from '../../../../images/temp-profile.jpg';

const profileViewHeight = "40%";

function getHeaderImageContainerStyle(status) {

};

export default class ProfileView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            headerImg: undefined,
        }
    }

    render() {
        return (
            <View style={styles.root}>
                <Appbar style={styles.appbar}>
                    <Left>
                        <IconButton icon="menu" size={20} />
                    </Left>
                    <Body>
                    <Title>
                        Profile
                    </Title>
                    </Body>
                    <Right>
                        <IconButton icon="inbox" size={20} />
                    </Right>
                </Appbar>

                    {
                        if (this.state.headerImg == undefined) ? 
                            return ( <View style={getHeaderImageContainerStyle(this.state.headerImg)} />) : 
                            return (<View style={getHeaderImageContainerStyle(this.state.headerImg)}>
                                <Image style={styles.headerImg} resizeMode="cover" source={this.state.headerImg} />
                            </View>)
                    }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    appbar: {
        backgroundColor: "transparent",
        elevation: 0,
    },
    profileView: {
        backgroundColor: "#FAFAFA",
        width: "100%",
        height: profileViewHeight,
        alignItems: "center",
        justifyContent: "center",
    },
    imgSurface: {
        width: 120,
        height: 120,
        borderRadius: 60,
        elevation: 5,
    },
    img: {
        width: "100%",
        height: "100%",
        borderRadius: 60,
        borderColor: "#03A9F4",
        borderWidth: 2,
    },
    headerImg: {

    },
});

/*
<View style={styles.profileView}>
                    <TouchableOpacity>
                        <Surface style={styles.imgSurface}>
                            <Image resizeMode="cover" source={ProfilePicture} style={styles.img}/>
                        </Surface>
                    </TouchableOpacity>
                </View>
*/