import React, {useState} from 'react';

import {
    View,
    Text,
    StyleSheet,
    Image,
} from 'react-native';

import {
    Surface,
    Caption
} from 'react-native-paper';
import { Avatar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PackModal from '../../../Modals/PackModal/PackModal';

import ImageResizeMode from 'react-native/Libraries/Image/ImageResizeMode'


const MyPacksCard = (props) => {
    const [showPack, setShowPack] = useState(false);

    _closeModal = () => {
        setShowPack(false);
    }

    return (
        <>
        <TouchableOpacity onPress={() => setShowPack(true)}>
        <View style={{ margin: 10 }}>
            <Surface style={{ width: 160, height: 180, elevation: 2, borderRadius: 10}}>
                    <Surface style={{flex: 2, alignSelf: "center",width: "80%", height: "45%", flexDirection: "column" , alignItems: "center", justifyContent: "center", elevation: 5, borderRadius: 15, marginTop: 8}}>
                    <Image style={{width: "100%", height: "100%", borderRadius: 15}} 
                                resizeMode={ImageResizeMode.cover} 
                                source={{ uri: 'https://picsum.photos/700' }} />
                    </Surface>
                    <View style={{flex: 1, width: 160, height: 80, flexDirection: "row",alignSelf: "flex-end", alignItems: "center", justifyContent: "center"}}>
                    <Avatar title="EH" rounded size="small"/>
                    <Avatar title="EH" rounded size="small"/>
                    <Avatar title="EH" rounded size="small"/>
                    <Avatar title="EH" rounded size="small"/>
                    </View>
            </Surface>
            <View style={styles.packInfo}>
                <Caption>
                { props.title }
                </Caption>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Caption>
                        Pack Leader: { " "}
                    </Caption>
                <Caption style={{color: "#2196F3"}}>
                    {props.packLeader}
                </Caption>
                </View>
                <Caption>
                    Sessions Completed { " "}
                    {props.sessionsCompleted}
                </Caption>
            </View>
        </View>
        </TouchableOpacity>
        <PackModal isOpen={showPack} _handleClose={_closeModal} />
        </>
    );
}

const styles = StyleSheet.create({
    myPacksRoot: {
        elevation: 3,
        width: 250,
        height: 200,
        borderRadius: 25,
    },
    topSurface: {
        elevation: 6,
        width: 250,
        height: 200,
        position: "absolute",
        top: -20,
        left: 100
    },
    packInfo: {
        margin: 5,
        flexDirection: "column",
    }
});

export {
    MyPacksCard,
}