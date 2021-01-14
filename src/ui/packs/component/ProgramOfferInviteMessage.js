import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    Dimensions,
    StyleSheet
} from 'react-native';

import {
    Surface,
    Caption,
    Divider,
    Button,
 Avatar,
} from 'react-native-paper';
import LOG from '../../../common/Logger';
import FeatherIcon from 'react-native-vector-icons/Feather'
import { getLupaUserStructurePlaceholder } from '../../../controller/firebase/collection_structures';
import LupaController from '../../../controller/lupa/LupaController';
import { initializeNewPackWithMembers, initializeNewPackProgramWithMembers } from '../../../model/data_structures/packs/packs';
import { PackProgramType } from '../../../model/data_structures/packs/types';
import { getLupaProgramInformationStructure } from '../../../model/data_structures/programs/program_structures';
import moment from 'moment';
import { useSelector } from 'react-redux';
import LUPA_DB from '../../../controller/firebase/firebase';

const ProgramOfferInviteMessage = ({messageData, timeCreated}) => {
    const LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    const [programData, setProgramData] = useState(getLupaProgramInformationStructure());
    const [senderData, setSenderData]  = useState(getLupaUserStructurePlaceholder());
    const [packData, setPackData] = useState(initializeNewPackWithMembers('', '', '', [], []))
    const [packProgramData, setPackProgramData] = useState(initializeNewPackProgramWithMembers('', '', []));
    const [componentDidErr, setComponentDidErr] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [acceptedMembers, setAcceptedMembers] = useState([])
    const [acceptedMembersUUIDs, setAcceptedMembersUUIDs] = useState([]);
    const [programIsLive, setProgramIsLive] = useState(false);

    
    const currUserData = useSelector(state => {
        return state.Users.currUserData
    })

    refreshAcceptedMembers = async () => {
        LOG('ProgramOfferInviteMessage.js', 'refreshAcceptedMembrs::Refreshing accepted members user data.');

        let receivedUserDataArr = [];
        LOG('ProgramOfferInviteMessage.js', 'refreshAcceptedMembrs::Found newly accepted members.  Pulling user data.');
    
        await LUPA_CONTROLLER_INSTANCE.getUserInformationFromArray(acceptedMembersUUIDs)
        .then(data => {
            receivedUserDataArr = data;
        })
        .catch(error => {
            receivedUserDataArr = []
        })

        let updatedAcceptedMembers = receivedUserDataArr;
        setAcceptedMembers(updatedAcceptedMembers);
    }

    const renderAcceptedMemberAvatars = () => {
        return acceptedMembers.map(member => {
            return (
                <Avatar.Image style={{marginHorizontal: 2}} source={{uri: member.photo_url}} size={15} />
            )
        })
    }

    const handleStartPackProgram = () => {
        const { packProgramUID } = messageData
        LUPA_CONTROLLER_INSTANCE.handleStartPackProgramOffer(packProgramUID);

        const CHARGE_PACK_PROGRAM_MEMBERS_ENDPOINT = "https://us-central1-lupa-cd0e3.cloudfunctions.net/chargePackProgramMembers";

        axios({
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            url: CHARGE_PACK_PROGRAM_MEMBERS_ENDPOINT,
            data: JSON.stringify({
                purchasing_members: acceptedMembersUUIDs,
                program: programData,
                pack_program_uid: packProgramUID
            })
        }).then(response => {
            
        }).catch(error => {
           alert('Error starting pack program. Contact customer support!')
        })
    }

    const handleAcceptPackProgram = () => {
        const { packProgramUID } = messageData

        //lupa controller accept program
        LUPA_CONTROLLER_INSTANCE.handleAcceptPackProgramOfferInvite(packProgramUID, currUserData.user_uuid);
    }

    const handleDeclinePackProgram = () => {
        const { packProgramUID } = messageData

        //lupa controller decline program
        LUPA_CONTROLLER_INSTANCE.handleDeclinePackProgramOfferInvite(packProgramUID, currUserData.user_uuid);
    }

    const handleCancelPackProgramRequest = () => {
        const { packProgramUID } = messageData
        LUPA_CONTROLLER_INSTANCE.handleDeletePackProgram(packProgramUID);
    }

    const shouldShowOptions = () => {
        if(moment(timeCreated).add('30', 'minutes')
        .isSameOrAfter(moment(new Date().getTime()))) {
            setShowOptions(true)
        } else if (packProgramData.members.includes(currUserData.user_uuid) === true) {
            setShowOptions(false)
        } else {
            setShowOptions(true)
        }
    }

    useEffect(() => {
        const { packUID, programUID, senderUID, packProgramUID } = messageData;
        async function fetchProgramData() {
            await LUPA_CONTROLLER_INSTANCE.getProgramInformationFromUUID(programUID)
            .then(data => {
                setProgramData(data);
            })
            .catch(error => {
                setProgramData(getLupaProgramInformationStructure())
                setComponentDidErr(true);
            })
        }

        async function fetchSenderData() {
            await LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(senderUID)
            .then(data => {
    
                setSenderData(data);
            })
            .catch(error => {
                setSenderData(getLupaUserStructurePlaceholder())
                setComponentDidErr(true);
            })
        }

        async function fetchPackData() {
            await LUPA_CONTROLLER_INSTANCE.getPackInformationFromUUID(packUID)
            .then(data => {
                setPackData(data);
            })
            .catch(error => {
                setPackData(initializeNewPackWithMembers('', '', '', [], []));
                setComponentDidErr(true);
            })
        }

        function handleSetPackProgramData(data) {
            setPackProgramData(data);
            setAcceptedMembersUUIDs(data.members);
            setProgramIsLive(data.is_live);
            refreshAcceptedMembers()
        }

        const PACK_PROGRAM_OBSERVER = LUPA_DB.collection('pack_programs')
        .doc(packProgramUID)
        .onSnapshot(documentSnapshot => {
            const data = documentSnapshot.data();
            if (typeof(data) === 'undefined') {
                setComponentDidErr(true)
                return;
            } else {
                handleSetPackProgramData(data);
            }


        }, (error) => {
            setComponentDidErr(true);
        });
        
        if (componentDidErr === false) {
            fetchProgramData()
            fetchSenderData()
            fetchPackData()
            shouldShowOptions()
        }


        LOG('ProgramOfferInviteMessage.js', 'Running useEffect.');
        return () => PACK_PROGRAM_OBSERVER()
    }, [])

    const renderOptionButton = () => {
        const { senderUID } = messageData

        if (currUserData.user_uuid == senderUID) {
            return;
        }

        if (acceptedMembersUUIDs.includes(currUserData.user_uuid) === false) {
            return (
                <Button 
                uppercase={false}
                color="#1089ff" 
                onPress={handleAcceptPackProgram}>
                        Accept
                    </Button>
            )
        } else {
            return (
                <Button 
                uppercase={false}
                color="#1089ff" 
                onPress={handleDeclinePackProgram}>
                        Decline
                    </Button>
            )
        }
    }

    const renderCurrentSplit = () => {
        if (acceptedMembersUUIDs.length == 1) {
            return 'Waiting for more members to accept this invite.'
        } else {
            return `$${programData.program_price / (acceptedMembersUUIDs.length)}`
        }
    }

    const renderStartProgramButton = () => {
        const { senderUID } = messageData

        if (programIsLive) {
            return;
        }

        if (acceptedMembersUUIDs.length > 2 && currUserData.user_uuid == senderUID) {
            return (
                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                <Button 
                color="rgb(34, 74, 115)"
                uppercase={false}
                onPress={handleStartPackProgram} 
                mode="contained" 
                theme={{roundness: 8}} 
                style={{alignSelf: 'center', elevation: 0}}
                contentStyle={{width: (Dimensions.get('window').width / 2) - 30, height: 35}}
                >
                    <Text style={{fontFamily: 'Avenir',}}>
                    Start Program
                    </Text>

                </Button>

                <Button 
                color="rgb(34, 74, 115)"
                uppercase={false}
                onPress={handleCancelPackProgramRequest} 
                mode="outlined" 
                theme={{roundness: 8}} 
                style={{alignSelf: 'center', elevation: 0}}
                contentStyle={{width: (Dimensions.get('window').width / 2) - 30, height: 35}}
                >
                    <Text style={{fontFamily: 'Avenir',}}>
                    Cancel Request
                    </Text>

                </Button>
        </View>
            )
        }
    }

    const renderHeaderMessage = () => {
        const { senderUID } = messageData
        if (currUserData.user_uuid == senderUID) {
            return (
                <Text style={{fontFamily: 'Avenir-Medium'}}>
                    Waiting for responses to start program {programData.program_name}...
                </Text>
            )
        } else {
            <Text style={{fontFamily: 'Avenir-Medium'}}>
                    {senderData.display_name} is inviting you to join the program {programData.program_name}.  
                </Text>
        }

    }

    const renderSubHeaderMessage = () => {
        if (componentDidErr == true) {
            return (
                <Caption>
                    Oops! Something went wrong.  This program invite has expired.
                </Caption>
            )
        } else if (programIsLive == true) {
            return (
                <Caption>
                    This program has been started and is now live.  
                </Caption>
            )
        } else if (programIsLive == false && componentDidErr == false) {
            return (
                <Caption>
                This invitation will expire 30 minutes after it was sent.  {senderData.display_name} may close this after enough members accept the invite.
            </Caption>
            )
        } else {
            return  (
                    <Caption>
                    This invitation will expire 30 minutes after it was sent.  {senderData.display_name} may close this after enough members accept the invite.
                </Caption>
            )
        }
    }

    const renderComponent = () => {
        if (componentDidErr == true) {
            return (
                <Surface style={{backgroundColor: 'rgb(244, 245, 251)', borderRadius: 10, elevation: 0, marginVertical: 10, width: Dimensions.get('window').width - 20, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', padding: 10}}>
                          <Caption>
                    Oops! Something went wrong. This program invite has expired.
                </Caption>
                </Surface>
              
            )
        } else if (programIsLive == true) {
            return (
                <Surface style={{backgroundColor: 'rgb(244, 245, 251)', borderRadius: 10, elevation: 0, marginVertical: 10, width: Dimensions.get('window').width - 20, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', padding: 10}}>
                          <Caption>
                    This program invitation has expired.
                </Caption>
                </Surface>
              
            )
        } else {
            return (
                <Surface style={{backgroundColor: 'rgb(244, 245, 251)', borderRadius: 10, elevation: 0, marginVertical: 10, width: Dimensions.get('window').width - 20, alignSelf: 'center', padding: 10}}>
                         <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingHorizontal: 20}}>
                    {renderAcceptedMemberAvatars()}
                </View>
 <Surface style={{backgroundColor: 'transparent', elevation: 0, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 10}}>
     
                <Divider style={{height: '100%', width: 3, borderRadius: 20, backgroundColor: 'rgb(34, 74, 115)'}} />
                <View style={{padding: 10}}>
                {renderHeaderMessage()}
                <Caption>
                    Total Cost: ${programData.program_price} / Current Split ({acceptedMembersUUIDs.length}): {renderCurrentSplit()}
                </Caption>
                {renderSubHeaderMessage()}
                </View>
               
                </Surface>
                {
                    showOptions === false ?
                    null
                    :
                    <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
                        {renderOptionButton()}
                </View>
                }
                {
                    renderStartProgramButton()
                }
               
                </Surface>

            )
        }
    }

    return renderComponent()
}

export default ProgramOfferInviteMessage;