import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';

import {
    Avatar 
} from 'react-native-elements';

import {
    Button
} from 'react-native-paper';

const packAvatarSize = "medium";

export default class PackMembers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.membersView}>
                    <View style={{margin: 5,}}>
                        <TouchableOpacity>
                        <Avatar rounded title="MD" size={packAvatarSize} containerStyle={{borderColor: "white", borderWidth: 2}}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection: "row", alignItems: "center", width: "80%", justifyContent: "space-around", margin: 10}}>
                        <TouchableOpacity>
                        <Avatar rounded title="MD" size={packAvatarSize}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                        <Avatar rounded title="MD" size={packAvatarSize}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                        <Avatar rounded title="MD" size={packAvatarSize}/>
                        </TouchableOpacity>
                        <TouchableOpacity>
                        <Avatar rounded title="MD" size={packAvatarSize}/>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.inviteView}>
                    <Text style={{fontSize: 30, fontWeight: "200", padding: 5, color: "white"}} >
                        Invite another friend to this pack
                    </Text>
                    <Button mode="contained" color="#1976D2" onPress={() => alert('Invite a Friend')}>
                        Invite
                    </Button>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        width: "100%",
        backgroundColor: 'transparent',
    },
    membersView: {
        flex: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    inviteView: {
        flex: 1,
        padding: 10,
        alignItems: "flex-start",
    },
    surface: {
        width: ""
    }
})