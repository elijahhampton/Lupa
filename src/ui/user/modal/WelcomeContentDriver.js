import React, { useState, useEffect } from 'react';

import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from 'react-native';

import {
    Button,
    Surface
} from 'react-native-paper';

import { MaterialIcons } from '@expo/vector-icons';

import LupaController from '../../../controller/lupa/LupaController';

import { PackContentDriverCard, TrainerContentDriverCard } from './WelcomeModal/component/ContentDriverCards';

const contentDriverContext = [
    {
        title: "Lupa Packs",
        description: "But I must explain to you how all this mistaken idea of denouncing pleasure",
        icon: <MaterialIcons name="public" size={25} color="#FFFFFF" />,
        color: "#1A237E"
    },
    {
        title: "Book a Trainer",
        description: "But I must explain to you how all this mistaken idea of denouncing pleasure",
        icon: <MaterialIcons name="directions-run" size={25} color="#FFFFFF" />,
        color: "#0D47A1",
    },
    {
        title: "Design a Workout Program",
        description: "But I must explain to you how all this mistaken idea of denouncing pleasure",
        icon: <MaterialIcons name="fitness-center" size={25} color="#FFFFFF" />,
        color: "#01579B",
    },
]

function LupaPacksContent(props) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    const [packsData, setPacksData] = useState([]);

  useEffect(() => {
      let packsDataIn;
    const fetchData = async () => {
      await LUPA_CONTROLLER_INSTANCE.getDefaultPacks().then(defPacks => {
        packsDataIn = defPacks;
      })

      setPacksData(packsDataIn);
    };

    fetchData();
  }, []);
    return (
        <View style={{flex: 1}}>
            <Text style={styles.displayedContentTitle}>
                Packs that may fit your interest
            </Text>
            <ScrollView style={{padding: 10}}>
                {
                    packsData.map(pack => {
                        return <PackContentDriverCard pack={pack} />
                    })
                }
            </ScrollView>
            <Button mode="contained" color="#0D47A1" onPress={() => props.toggleContentMethod(false)}>
                Done
            </Button>
        </View>
    )
}

function DesignWorkoutProgramContent(props) {

}

function BookATrainerContent(props) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    const [trainerData, setTrainerData] = useState([]);

  useEffect(() => {
      let trainerDataIn, location;
    const fetchData = async () => {
        const uuid = await LUPA_CONTROLLER_INSTANCE.getCurrentUser().uid;

        await LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(uuid, 'location').then(res => {
            location = res;
        })

      await LUPA_CONTROLLER_INSTANCE.getTrainersBasedOnLocation(location).then(trainerResults => {
          trainerDataIn = trainerResults;
          alert(trainerDataIn.length);
      })

      setTrainerData(trainerDataIn);
    };

    fetchData();
  }, []);
    return (
        <View style={{flex: 1}}>
            <Text style={styles.displayedContentTitle}>
                Trainers in your area or near you
            </Text>
            <ScrollView horizontal contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}>
                {
                    trainerData.map(trainer => {
                        return <TrainerContentDriverCard trainer={trainer} />
                    })
                }
            </ScrollView>
            <Button mode="contained" color="#0D47A1" onPress={() => props.toggleContentMethod(false)}>
                Done
            </Button>
        </View>
    )
}

export default function WelcomeContentDriver(props) {
    const [showContent, setShowContent] = useState(false);
    const [contentToShow, setContentToShow] = useState("");

    function getContentDriverOnPress(contentDriverTitle) {
        //Set state to correct content to show
        setContentToShow(contentDriverTitle);
        //set state to show content
        setShowContent(true);
    }  

    function setShowContentWrapper(showContent) {
        setShowContent(showContent);
    }

    function handleShowContent(contentDriverTitle) {
                //Show content
                switch(contentDriverTitle)
                {
                    case 'Lupa Packs':
                        return <LupaPacksContent toggleContentMethod={setShowContentWrapper} />
                        break;
                    case 'Book a Trainer':
                        return <BookATrainerContent toggleContentMethod={setShowContentWrapper} />
                        break;
                    case 'Design a Workout Program':
                        return <DesignWorkoutProgramContent toggleContentMethod={setShowContentWrapper} />
                        break;
                    default:
                }
    }

    function handleShowLupaPacksContent() {
        return <LupaPacksContent />
    }

    function handleBookATrainerContent() {
        return <BookATrainerContent />
    }

    function handleDesignWorkoutProgramContent() {
        return <DesignWorkoutProgramContent />
    }
    return (
        <View style={{flex: 1}}>
                            <View style={{flex: 1, justifyContent: "space-evenly"}}>
                                <Text style={styles.topText}>
                                But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure.
                                </Text>

                                <Text style={styles.topText}>
                                But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure.
                                </Text>
                            </View>

                            {
                                showContent === true ?
                                handleShowContent(contentToShow)
                                :
                                <View style={{flex: 1, alignItems: "flex-start", justifyContent: "space-evenly"}}>
                                {
                                                                    contentDriverContext.map(contentDriver => {
                                        return (
                                            <TouchableOpacity onPress={() => getContentDriverOnPress(contentDriver.title)}>
                                                                                            <View style={styles.contentDriverView}>
                                                <Surface style={[styles.contentDriverSurface, {backgroundColor: contentDriver.color}]}>
                                                    {contentDriver.icon}
                                                </Surface>
                                                <View style={styles.contentDriverTextView}>
                                                <Text style={styles.contentDriverHeaderText}>
                                                    {contentDriver.title}
                                                </Text>
                                                <Text style={styles.contentDriverDescriptionText}>
                                                    {contentDriver.description}
                                                </Text>
                                                </View>
                                            </View>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                            }

                        </View>
    )
}

const styles = StyleSheet.create({
    topText: {
        fontSize: 15,
        textAlignVertical: "center",
        textAlign: "center",
    },
    contentDriverTextView: {
        width: "80%"
    },  
    contentDriverSurface: {
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
        borderRadius: 8,
        width: 50,
        height: 50,
        margin: 10, 
    },
    contentDriverView: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 5
    },
    contentDriverHeaderText: {
        fontSize: 20,
        fontWeight: "500"
    },
    contentDriverDescriptionText: {
        fontSize: 15, 
    },
    displayedContentTitle: {
        color: '#212121',
        opacity: 0.8,
        fontSize: 20, 
        alignSelf: "center"
    }
})