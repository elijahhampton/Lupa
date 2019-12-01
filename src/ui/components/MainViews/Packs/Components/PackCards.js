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
                    <View style={{flex: 2, flexDirection: "column" , alignItems: "center", justifyContent: "center"}}>
                    <Avatar title="EH" rounded size="medium"/>
                    <Caption> 20 Members </Caption>
                    </View>
                    <View style={{flex: 1, width: 160, height: 80, flexDirection: "row",alignSelf: "flex-end", alignItems: "center", justifyContent: "center"}}>
                    <Avatar title="EH" rounded size="small"/>
                    <Avatar title="EH" rounded size="small"/>
                    <Avatar title="EH" rounded size="small"/>
                    <Avatar title="EH" rounded size="small"/>
                    </View>
            </Surface>
            <View style={styles.packInfo}>
                <Text>
                { props.title }
                </Text>
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
        margin: 5
    }
});

export {
    MyPacksCard,
}