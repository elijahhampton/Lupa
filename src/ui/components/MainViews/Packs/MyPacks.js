import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions
} from 'react-native';

import { 
    Surface, 
    Divider, 
    Avatar 
} from 'react-native-paper';

import {
    Rating
} from 'react-native-elements';

import Carousel, { Pagination } from 'react-native-snap-carousel';

import { MyPacksCard } from '../Packs/Components/PackCards';
import EventListContainer from './Components/EventListContainer';
import PackModal from '../../Modals/PackModal/PackModal';

const windowWidth = Dimensions.get('window').width;
const packCardWidth = 300;

const entries = [
    {
        title: 'packName'
    },
    {
        title: 'packName2'
    },
    {
        title: 'packName3'
    }
]

export default class MyPacks extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            packs: entries,
        }
    }

    _renderPack({item, index}) {
        return (
            <MyPacksCard />
        );
    }

    render() {
        return (
            <View style={styles.root}>

                <View style={styles.packContent}>
                    <View style={styles.myPacksCardContainer}>
                    <Carousel 
                        ref={(c) => {this._carousel = c; }}
                        data={this.state.packs}
                        renderItem={this._renderPack}
                        sliderWidth={windowWidth}
                        itemWidth={350}
                        />
                    </View>

                    <View style={styles.packContent}>
                        <View style={[styles.evenlySpaced, styles.packMembers]}>
                            <Avatar.Text size={30} label="MD" />
                            <Avatar.Text size={30} label="MD" />
                            <Avatar.Text size={30} label="MD" />
                            <Avatar.Text size={30} label="MD" />
                        </View>

                        <View style={[styles.evenlySpaced, styles.packInformation]}>
                            <View style={styles.verticallyAligned}>
                            <Rating imageSize={20}
                                readonly
                                startingValue={2}
                                style={styles.rating}
                                />
                            <Text style={styles.packInformationText}>
                                Pack Rating
                            </Text>
                            </View>

                            <View style={styles.verticallyAligned}>
                            <Text style={styles.packInformationText}>
                                0
                            </Text>
                            <Text style={styles.packInformationText}>
                                Sessions Completed
                            </Text>
                            </View>

                            <View style={styles.verticallyAligned}>
                            <Text style={styles.packInformationText}>
                                0
                            </Text>
                            <Text style={styles.packInformationText}>
                                Members
                            </Text>
                            </View>
                        </View>
                    </View>

                <Divider />

                    <EventListContainer />
                </View>

                <PackModal />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        width: "100%",
        height: "100%",
        backgroundColor: "white",
    },
    myPacksCardContainer: {

    },
    packContent: {

    },
    evenlySpaced: {
        alignItems: "center",
        justifyContent: "space-evenly",
        flexDirection: "row",
        display: "flex",
        margin: 10,
    },
    verticallyAligned: {
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: "center",
    },
    rating: {

    },
    packInformationText: {
        fontSize: 15,
        color: "#8E8E93",
    },
    packInformation: {
        width: "100%",
        alignSelf: "center",
    },
    packMembers: {
       width: "80%",
       alignSelf: "center",
    }
})