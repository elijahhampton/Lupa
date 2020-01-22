import React from 'react';

import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import {
    SocialIcon
} from 'react-native-elements';

export default class Promotions extends React.Component {
    render() {
        return (
            <View style={styles.root}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text>
                        Connect your other social media account to Lupa to share progress and find more workout partners and trainers.
                    </Text>
                </View>
                <View style={{ flex: 2, alignItems: "center", justifyContent: "space-evenly", flexDirection: "row", flexWrap: "wrap" }}>
                    <SocialIcon
                        type='twitter'
                    />

                    <SocialIcon
                        type='medium'
                    />
                    <SocialIcon

                        type='facebook' />

                    <SocialIcon
                        type='instagram'
                    />

                    <SocialIcon
                        iconSize={60}
                        type='snapchat'
                    />

                    <SocialIcon
                        type='google'
                    />

                    <SocialIcon
                        type='tumblr'
                    />

                    <SocialIcon
                        type='youtube'
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#FAFAFA",
        alignItems: "center",
        justifyContent: "center",
    }
})