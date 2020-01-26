import React from 'react';

import {
    Modal,
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
} from 'react-native';

import {
    Header,
    Container,
    Left,
    Body,
    Right,
} from 'native-base';

import {
    Button,
    IconButton,
    Divider,
    List,
    Title
} from 'react-native-paper';

import { ListItem } from 'react-native-elements';

import { withNavigation } from 'react-navigation';

import { logoutUser } from '../../../../../controller/lupa/auth';

const list = [
    {
        key: 'account',
        title: 'Account',
        subtitle: 'Manage properties for your account',
        icon: undefined,
    },
    {
        key: 'notifications',
        title: 'Notifications',
        subtitle: 'Turn notifications on and off for various features',
        icon: undefined,
    },
    {
        key: 'payments',
        title: 'Payments',
        subtitle: 'Manage payment methods',
        icon: undefined,
    },
    {
        key: 'privacy',
        title: 'Privacy',
        subtitle: 'Manage privacy settings for your account',
        icon: undefined,
    },
    {
        key: 'fitness_profile',
        title: 'Fitness Profile',
        subtitle: 'Manage goals, experience, interest...'
    }
]

class SettingsModal extends React.Component {

    constructor(props) {
        super(props);
    }
    
    _handleUserLogout = async () => {
        await logoutUser();
        this.props.navigation.navigate('LoginView');
      }

    _navigateToAccountSettings = () => {
        console.log('navigate')
        this.props.navigation.navigate('AccountSettingsView');
    }
    
      handleListItemOnPress = (key) => {
          console.log(key);
        switch(key) {
            case 'account':
                this._navigateToAccountSettings();
                break;
            case 'notifications':
            case 'payments':
            case 'privacy':
            case 'fitness_profile':
        }
    }

    render() {
        return (
                <Container style={styles.root}>
                    <Header>
                        <Left>
                            <IconButton icon="arrow-back" onPress={this.props.closeModalMethod} />
                        </Left>
                        <Right>
                            <Title>
                                Settings
                            </Title>
                        </Right>
                    </Header>
                    <View style={{flex: 1}}>
                    {
                        list.map(listItem => {
                            return <>
        <ListItem
          title={listItem.title}
          subtitle={listItem.subtitle}
          onPress={() => this.handleListItemOnPress(listItem.key)}
       />
                            <Divider />
                            </>
                        })
                    }
                    <Button mode="text" compact color="#2196F3" onPress={this._handleUserLogout}>
                        Log out
                    </Button>
                </View>
                </Container>
        )
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#FAFAFA"
    }
});

export default withNavigation(SettingsModal);