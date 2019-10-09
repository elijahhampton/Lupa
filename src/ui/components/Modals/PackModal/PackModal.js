import React from 'react';

import {
    Modal,
    View,
    Text,
    StyleSheet
} from 'react-native';

import {
    Button,
    Title,
    FAB,
    IconButton
} from 'react-native-paper';

import {
    LinearGradient
} from 'expo-linear-gradient';

import {
    BlurView
} from 'expo-blur';

import { getStatusBarHeight } from 'react-native-status-bar-height';

import PackMembers from './views/PackMembers.js';

function getModalPageTitle(currIndex) {
    switch(currIndex) {
        case 0:
            return (
                <Text style={{fontSize: 40, fontWeight: "400", color: "white", marginTop: 30, marginLeft: 10}}>
                    Pack Members
                </Text>
            )
        case 1:
            
        case 2:
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
            currentIndex: 0,
        }
    }
    render() {
        let pageIndex = this.state.currentIndex;
        return (
            <Modal presentationStyle="fullScreen" visible={true} style={styles.modalContainer}>
                <LinearGradient style={styles.contentContainer} colors={['#0D47A1', '#2196F3', '#FFFFFF']}>
                    <BlurView tint="light" intensity={60} style={styles.blur}>
                        <View style={{display: "flex", height: "20%", flexDirection: "column", justifyContent: "flex-end"}}>
                        <IconButton icon="clear" color="white"/>

                            {
                                getModalPageTitle(pageIndex)
                            }
                        </View>

                        <View style={styles.pageContent}>
                            {
                                getModalPage(pageIndex)
                            }
                        </View>

                    </BlurView>

                    <FAB visible={true} style={styles.fab} icon="menu" color="white" onPress={() => alert('Pack Menu')} />
                </LinearGradient>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        display: "flex",
        margin: 0,
        backgroundColor: "transparent",
    },
    contentContainer: {
        width: "100%",
        height: "100%",
    }, 
    blur: {
        ...StyleSheet.absoluteFillObject,
    },
    pageContent: {
        height: "80%",
    },
    fab: {
        backgroundColor: "#1976D2",
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
    }
});