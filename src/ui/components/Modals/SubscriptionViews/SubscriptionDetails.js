import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Button,
    Image
} from 'react-native';

import {
    Surface,
    Divider
} from 'react-native-paper';

import {
    Header,
    Left,
    Right,
    Body,
    Title,
    Container,
    Content,
    Thumbnail
} from 'native-base';

function getSubscriptionPlanSurfaceColor(planType) {
    return {
        backgroundColor: "#002534",
    }
}

function getCardImage() {
    let CardImage = require('../images/mastercard.png')
    return CardImage;
}

class SubscriptionDetails extends React.Component {
    constructor(props) {
        super(props);


    }

    render() {
        return (
            <View style={styles.root}>
                <Container>
                <Header>
                    <Body>
                        <Title>
                            Subscription Details
                        </Title>
                    </Body>
                </Header>
                <Content style={styles.content}>
                    <View style={styles.subscriptionWelcome}>
                        <Text style={{fontSize: 25, fontWeight: "700"}}>
                            Welcome to Lupa Subscriptions
                        </Text>
                        <Text style={{fontSize: 20, fontWeight: "200"}}>
                            View your current subscription, change your plan, and manage your payment methods.
                        </Text>
                    </View>

                    <Divider style={styles.divider}/>

                    <View style={styles.subscriptionSection}>
                        <View style={styles.currentSubscriptionHeader}>
                            <View style={styles.currentSubscriptionHeaderTop}>
                            <Text style={{fontSize: 25, fontWeight: "700"}}>
                            Current Subscription
                        </Text>
                            <Button title="Change Subscription" onPress={() => alert('Change Subscription')}/>
                            </View>
                        <Text style={{fontSize: 20, fontWeight: "200"}}>
                            View your current subscription, change your plan, and manage your payment methods.
                        </Text>
                        </View>
                    </View>

                    <View style={styles.surfaceView}>
                    <Surface style={[styles.subscriptionPlanSurface, getSubscriptionPlanSurfaceColor(0)]}>
                            <Text>
                                Text
                            </Text>
                        </Surface>
                    </View>

                        <Divider style={styles.dvider}/>

                        <View style={styles.subscriptionSection}>
                        <View style={styles.currentSubscriptionHeader}>
                            <View style={styles.currentSubscriptionHeaderTop}>
                            <Text style={{fontSize: 25, fontWeight: "700"}}>
                            Payment Details
                        </Text>
                            <Button title="Change Subscription" onPress={() => alert('Change Subscription')}/>
                            </View>
                        <Text style={{fontSize: 20, fontWeight: "200"}}>
                            Edit Payment Details
                        </Text>
                        </View>
                    </View>

                    <View style={styles.surfaceView}>
                    <Surface style={styles.paymentSurface}>
                        <View style={{display: "flex", flexDirection: "row", alignItems: "center",justifyContent: "space-around", width: "80%", alignSelf: "center"}}>
                        <Thumbnail large style={styles.cardImg} source={getCardImage()} />
                    <Text style={{fontSize: 35, fontWeight: "700", textAlignVertical: "center"}}>
                        Mark Hobbs
                    </Text>
                        </View>
                    </Surface>
                    </View>

                </Content>
                </Container>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#FAFAFA",
    },
    content: {
        padding: 10,
    },
    subscriptionSection: {
        justifyContent: "space-around",
        flexDirection: "column",
    },
    currentSubscriptionHeader: {
        justifyContent: "space-around",
        flexDirection: "column",
    },
    currentSubscriptionHeaderTop: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    subscriptionPlanSurface: {
        width: "80%",
        height: "80%",
        alignSelf: "center",
        elevation: 5,
    },
    surfaceView: {
        margin: 5,
    },
    divider: {
        margin: 5,
    },
    paymentSurface: {
        width: "100%",
        height: "50%",
        borderRadius: 50,
        backgroundColor: "white",
        elevation: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    cardImg: {
 
    }
})

export default SubscriptionDetails;