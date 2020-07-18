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

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import LupaController from '../../../controller/lupa/LupaController';

import { PackContentDriverCard, TrainerContentDriverCard } from './WelcomeModal/component/ContentDriverCards';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux'

const contentDriverContext = [
    {
        title: "Lupa Packs",
        description: "But I must explain to you how all this mistaken idea of denouncing pleasure",
        icon: <MaterialIcons name="public" size={20} color="#FFFFFF" />,
        color: "#1A237E"
    },
    {
        title: "Book a Trainer",
        description: "But I must explain to you how all this mistaken idea of denouncing pleasure",
        icon: <MaterialIcons name="directions-run" size={20} color="#FFFFFF" />,
        color: "#0D47A1",
    },
    {
        title: "Design a Workout Program",
        description: "But I must explain to you how all this mistaken idea of denouncing pleasure",
        icon: <MaterialIcons name="fitness-center" size={20} color="#FFFFFF" />,
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

function BookATrainerContent(props) {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    const [trainerData, setTrainerData] = useState([]);
    const currUserData = useSelector(state => {
        return state.Users.currUserData
    })

  useEffect(() => {
      let trainerDataIn, location;
    const fetchData = async () => {
        const uuid = currUserData.user_uuid
        try {
        await LUPA_CONTROLLER_INSTANCE.getAttributeFromUUID(uuid, 'location').then(res => {
            location = res;
        })


      await LUPA_CONTROLLER_INSTANCE.getTrainersBasedOnLocation(location).then(trainerResults => {
          trainerDataIn = trainerResults;
      })

      setTrainerData(trainerDataIn);
    } catch(err) {
        setTrainerData([])
    }
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
                  /*  trainerData.map(trainer => {
                        return <TrainerContentDriverCard trainer={trainer} />
                    })*/
                }
            </ScrollView>
            <Button mode="contained" color="#0D47A1" onPress={() => props.toggleContentMethod(false)}>
                Done
            </Button>
        </View>
    )
}

export default function WelcomeContentDriver(props) {
    const navigation = useNavigation()
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
                        
                    default:
                }
    }

    return (
        <View style={{flex: 1}}>
                            <View style={{flex: 0.5, justifyContent: "space-evenly"}}>
                                <Text style={styles.topText}>
                                We're excited to have you on board.  Jump right into the action by joining a pack, booking your first trainer, or
                                designing your first workout.
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
        textAlign: "left",
    },
    contentDriverTextView: {
        width: "80%"
    },  
    contentDriverSurface: {
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
        borderRadius: 8,
        width: 35,
        height: 35,
        margin: 10, 
    },
    contentDriverView: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 5
    },
    contentDriverHeaderText: {
        fontSize: 15,
    },
    contentDriverDescriptionText: {
        fontSize: 12, 
         
    },
    displayedContentTitle: {
        color: '#212121',
        opacity: 0.8,
        alignSelf: "center"
    }
})