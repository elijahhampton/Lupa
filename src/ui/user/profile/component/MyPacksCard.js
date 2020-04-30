import React from 'react';

import {
    Surface,
    Caption
} from 'react-native-paper';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';

import PackInformationModal from '../../../packs/modal/PackInformationModal';

import LupaController from '../../../../controller/lupa/LupaController';

class MyPacksCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showPackInformation: false,
            packUUID: this.props.packUUID,
            packProfileImage: '',
        }

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();

    }

    componentDidMount = async () => {
        await this.setupComponent();
    }

    setupComponent = async () => {
        let packProfileImageIn;

        await this.LUPA_CONTROLLER_INSTANCE.getPackImageFromUUID(this.props.packUUID).then(result => {
            packProfileImageIn = result;
        })

        await this.setState({
            packProfileImage: packProfileImageIn,
        })
    }

    handleOpenPackInformationModal = () => {
        this.setState({
            showPackInformation: true,
        })
    }

    handleClosePackInformationModal = () => {
        this.setState( {
            showPackInformation: false,
        })
    }

    render() {
        return (
            <TouchableOpacity onPress={() => this.handleOpenPackInformationModal()}>
                        <View style={{flexDirection: 'column', alignItems: 'center'}}>
                        <Surface style={styles.surface}>
                <Image resizeMethod="resize" resizeMode="cover" source={{ uri: this.state.packProfileImage }} style={{width: "100%", height: "100%", borderRadius: 60}}/>
            </Surface>
             <View style={{margin: 2, flexDirection: 'column', alignItems: 'center'}}>
                 <Caption>
                     {this.props.packTitle}
                 </Caption>
             </View>
            </View>
            <PackInformationModal isOpen={this.state.showPackInformation} closeModalMethod={this.handleClosePackInformationModal} packUUID={this.props.packUUID} />
            </TouchableOpacity>
        )
    }
}

export default MyPacksCard;

const styles = StyleSheet.create({
    surface: {
        margin: 15, 
        width: 60, 
        height: 60,
        borderRadius: 60, 
        elevation: 8
    }
})

