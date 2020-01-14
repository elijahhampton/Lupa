import React from 'react';

import {
    ScrollView,
    Text,
    StyleSheet,
    Modal,
    View,
    Image
} from 'react-native';

import {
    Surface,
    Caption,
    IconButton,
    Button,
    Divider,
    Avatar
} from 'react-native-paper';

import { ImagePicker } from 'expo-image-picker';

import SafeAreaView from 'react-native-safe-area-view';
import { Input, CheckBox } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

var packImageSource = undefined;

import Background from '../../images/background-one.jpg';

import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'

export default class CreatePack extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            packImageSource: Background,
            checked: false,
        }

        this._chooseImageFromCameraRoll = this._chooseImageFromCameraRoll.bind(this);
    }

    _chooseImageFromCameraRoll = async () => {
        packImageSource = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
        });

        if (!packImageSource.cancelled) {
            this.setState({ packImageSource: packImageSource.uri });
        }
    }

    render() {
        return (
            <Modal presentationStyle="fullScreen" style={styles.modal} visible={this.props.isOpen}>
                <SafeAreaView style={styles.safeareaview}>
                <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                        <IconButton icon="clear" onPress={this.props.closeModalMethod} />
                        <Text style={{ fontSize: 20, fontWeight: "500" }}>
                            Create a new pack
                        </Text>
                        <Button mode="text" color="#2196F3">
                            Next
                        </Button>
                        </View>
            {/* content */}
                        <View style={{display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-around", padding: 10}}>

<View style={styles.header}>

<Avatar.Image source={this.state.packImageSource} size={130} label="EH" />
<Text style={{fontSize: 20, fontWeight: "400", padding: 5}}>
    Pick an avatar for your pack
</Text>
</View>

{ /* */}
<View style={{ flex: 0.5, flexDirection: "column" }}>
<Text style={styles.sectionText}>
Pack Name
</Text>
<View>
<Input inputContainerStyle={{borderColor: "transparent"}} placeholder="Enter a name for your pack" />
</View>
</View>

{ /* */}
<View style={{ flex: 0.5, flexDirection: "column" }}>
<Text style={styles.sectionText}>
Pack Objective
</Text>
<View>
<View>
<Input inputContainerStyle={{borderColor: "transparent"}} placeholder="Enter a purpose for your pack" />
</View>
</View>
</View>

{ /* */}
<View style={{ flex: 1, flexDirection: "column", marginBottom: 10 }}>
<Text style={styles.sectionText}>
Privacy Preference
</Text>
<View style={{ flexDirection: "column" }}>

<View style={{flexDirection: "column", padding: 10 }}>
        <Text style={{fontWeight: "bold"}}>
            Public
    </Text>

    <Caption>
        This pack will be public for all users to see on the explore and search pages
</Caption>
</View>


<View style={{flexDirection: "column", padding: 10}}>
        <Text style={{fontWeight: "bold"}}>
            Private
    </Text>

    <Caption>
    Only users inside you invite and users in this pack will be able to see it on the explore and search pages
</Caption>
</View>
</View>



</View>

{ /* */}
<View style={{ flex: 1, flexDirection: "column" }}>
<Text style={styles.sectionText}>
Pack Type
</Text>

<View style={{ flexDirection: "column" }}>

<View style={{ flexDirection: "column", padding: 10}}>
        <Text style={{fontWeight: "bold"}}>
            Global
    </Text>

    <Caption>
        Users can join your pack for free
</Caption>
</View>

<View style={{flexDirection: "column", padding: 10}}>
        <Text style={{fontWeight: "bold"}}>
            Subscription
    </Text>

    <Caption>
        Users will have to pay a subscription fee to join this pack
</Caption>
</View>

</View>
</View>

                        </View>
                    

                </SafeAreaView>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        display: "flex",
        backgroundColor: "white",
        margin: 0,
        flex: 1,
    },
    sectionText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#BDBDBD",
    },
    safeareaview: {
        display: "flex",
        flex: 1,
    },
    header: {
        flex: 1.5,
        flexDirection: "column",
        justifyContent: "center", 
        alignItems: "center"
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 15,
    }
})