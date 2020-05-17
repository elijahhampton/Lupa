import React from 'react';

import {
    StyleSheet,
    View,
    Text,
    Image,
    Modal,
    Dimensions,
} from 'react-native';

import {
    Surface,
    Title,
    Button,
    Headline,
    Paragraph,
    Caption,
    Avatar
} from 'react-native-paper';

import ThinFeatherIcon from "react-native-feather1s";

export default class ProgramInformationPreview extends React.Component {
 constructor(props) {
     super(props)
 }

 render() {
     const program = this.props.programData;
     return (
         <Modal presentationStyle="fullScreen" visible={this.props.isVisible} style={{flex: 1}}>
             <View style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height / 1.8, backgroundColor: '#212121'}}>
                    
                    <Image source={require('../../images/programs/sample_photo_two.jpg')} style={{width: '100%', height: '100%'}} resizeMode="cover" resizeMethod="resize" />
             </View>
             <Surface style={{justifyContent: 'space-around', padding: 10, elevation: 15, borderTopLeftRadius: 25, borderTopRightRadius: 25, position: 'absolute', bottom: 0, width: Dimensions.get('window').width, height: Dimensions.get('window').height / 2.1}}>
                <View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Title style={{fontFamily: 'ARSMaquettePro-Medium', fontSize: 30}}>
                    Program Title
                </Title>
                <Avatar.Text label="EH" size={30} />
                </View>


                <Headline style={{fontSize: 20}}>
                    NASM Trainer ($25/hr)
                </Headline>
                </View>

                <View>
                <Paragraph>
                But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth,
                </Paragraph>
                <Caption>
                    HIIT, cardio
                </Caption>
                </View>

                <View>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Caption>
                        One on One
                    </Caption>

                    <Caption style={{color: '#2196F3', fontWeight: '600'}}>
                        See other programs by Elijah Hampton
                    </Caption>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Caption>
                        In Person
                    </Caption>

                    <Caption style={{fontWeight: '600'}}>
                        Tiger Iron Gym (516 West Glenn Avenue)
                    </Caption>
                </View>
                </View>
                
                <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center'}}>
                <Button mode="outlined" style={{marginHorizontal: 10, elevation: 0, flex: 1,  height: 55, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}} theme={{
                    roundness: 10,
                    colors: {
                        primary: '#2196F3'
                    }
                }}>
                    <ThinFeatherIcon
name="eye"
size={35}
color="#2196F3"
thin={true}
/>

                </Button>
                <Button mode="contained" style={{marginHorizontal: 10, elevation: 0, flex: 7, height: 55, alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}} theme={{
                    roundness: 10,
                    colors: {
                        primary: '#2196F3'
                    }
                }}>
                    <Text style={{fontFamily: 'ARSMaquettePro-Medium', fontSize: 20}}>
                        Purchase
                    </Text>

                </Button>
                </View>
                
             </Surface>
            {/* <ModalProfileView /> */}
         </Modal>
     )
 }
}

