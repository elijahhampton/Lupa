import React from 'react';

import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import {
    Container,
    Left,
    Right,
    Body,
    Header,
} from 'native-base';

import {
    Modal,
    Provider,
    Portal,
    IconButton,
    Divider,
    Title,
    List,
    TextInput,
    Button,
    Headline
} from 'react-native-paper';

import SafeAreaView from 'react-native-safe-area-view';

import Color from '../../../../common/Color';

import LupaController from '../../../../../controller/lupa/LupaController';
import ChangeAccountPropertyModal from '../../../Modals/User/Settings/ChangeAccountPropertyModal';

export default class  AccountSettingsView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showChangeAccountPropertyModal: false,
            property: '',
        }
    }

    handleOpenChangePropertyModal = async (key) => {
        await this.setState({ property: key})
        await this.setState({ showChangeAccountPropertyModal: true })
    }

    handleCloseChangePropertyModal = () => {
        this.setState({ showChangePropertyModal: false })
    }

    render() {
        return (
            <Container style={styles.root}>
                <Header>
                    <Left>
                        <IconButton icon="arrow-back" onPress={() => this.props.navigation.goBack()}/>
                    </Left>

                    <Right>
                        <Title>
                        Account
                        </Title>
                    </Right>
                </Header>

                <SafeAreaView style={styles.contentContainer}>
                <List.Item title="Name" description="Elijah Hampton" onPress={() => handleOpenChangePropertyModal('display_name')}/>
                <Divider />
                <List.Item title="Username" description="elijahhampton" onPress={() => handleOpenChangePropertyModal('username')}/>
                <Divider />
                <List.Item title="Email" description="ejh0017@gmail.com" onPress={() => handleOpenChangePropertyModal('email')} />
                <Divider />
                <List.Item title="Mobile Number" description="You do not have a mobile number set" onPress={() => handleOpenChangePropertyModal('mobile_number')} />
                <Divider />
                <TouchableOpacity onPress={() => alert('Recover Password')}>
                <List.Item title="Change or recover password" description="Click here to change or recover your password" />
                </TouchableOpacity>
                <Divider />
                </SafeAreaView>

                <ChangeAccountPropertyModal property={this.state.property} closeModalMethod={this.handleCloseChangePropertyModal} isVisible={this.state.showChangeAccountPropertyModal} />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    contentContainer: {
        flex: 1,
    },
    changeUsernameModal: {
        width: "80%",
        height: "40%",
        backgroundColor: 'white',
        alignSelf: 'center',
         justifyContent: 'space-evenly',
         flexDirection: 'column',
    }
})