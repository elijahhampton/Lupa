import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity
} from 'react-native';


import {
    Surface,
    Button
} from 'react-native-paper';

import SpecialistImage from '../images/specialist.jpg';

class LupaSpecialistSubscriptionView extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Surface style={styles.topSurface}>
                    <Text style={{fontSize: 40, fontWeight: "200", color: "#002534", padding: 5}}>
                        Lupa Specialist
                    </Text>
                    <Text style={{fontSize: 40, fontWeight: "700", color: "#002534", padding: 5}}>
                        $15/month
                    </Text>
                </Surface>
                <Surface style={styles.bottomSurface}>
                    <Image source={SpecialistImage} style={styles.img}/>
                    <View style={styles.descriptionText}>
                        <View style={styles.txt}>
                            <Text style={{fontSize: 20, color: "white", textAlign: "center"}}>
                                Access our database of hundreds of specialized trainers in your area of fitness {"\n"}
                            </Text>

                            <Text style={{fontSize: 20, color: "white", textAlign: "center"}}>
                                Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum {"\n"}
                            </Text>

                            <Text style={{fontSize: 20, color: "white", textAlign: "center"}}>
                                Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum {"\n"}
                            </Text>

                            <Text style={{fontSize: 20, color: "white", textAlign: "center"}}>
                                Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum {"\n"}
                            </Text>

                        </View>
                        <Button color="white" mode="contained" style={{width: "25%", alignSelf: "center",}}>
                            <Text style={{color: "#002534"}}>
                                Join now
                            </Text>
                        </Button>
                        <View style={styles.bottomText}>
                            <TouchableOpacity onPressOut={() => alert('Open subscription policy on website')}>
                            <Text style={{color: "white"}}>
                                Subscription Policy
                            </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Surface>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        
    },
    topSurface: {
        alignItems: "center",
        justifyContent: "center",
        height: "35%",
        elevation: 10,
    },
    bottomSurface: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        alignSelf: "center",
        height: "65%",
        backgroundColor: "#002534",
        elevation: 5,
    },
    img: {
        width: "45%",
        height: "30%",
        alignSelf: "center",
        top: 10,
    },
    descriptionText: {
        width: "100%",
        height: "70%",
        display: "flex",
        flexDirection: "column",
        alignSelf: "center",
        justifyContent: "space-around",
    },
    bottomText: {
        position: "absolute",
        bottom: 0,
        left: 0,
    },
    txt: {
        flexDirection: "column",
        padding: 10,
        justifyContent: "space-between",
        alignSelf: "center",
    }
})

export default LupaSpecialistSubscriptionView;