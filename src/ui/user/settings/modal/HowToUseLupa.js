import React from 'react';

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';

import {
    Appbar, Button,
    Caption,
    List,
} from 'react-native-paper';
import { useSelector } from 'react-redux/lib/hooks/useSelector';
import FeatherIcon from 'react-native-vector-icons/Feather'
import { DrawerActions } from '@react-navigation/native';
import PayoutsModal from './PayoutsModal';

 const HowToUseLupa = ({ navigation, route }) => {
     const [payoutsModalVisible, setPayoutsModalVisible] = useState(false);

     const currUserData = useSelector(state => {
         return state.Users.currUserData;
     });

     const onSeeHowPacksWork = () => {
         navigation.navigate('Train');
         navigation.dispatch(DrawerActions.openDrawer())
     }

     const renderComponent = () => {
        try {
        if (currUserData.isTrainer == true) {
            return (
                <ScrollView contentContainerStyle={[{ padding: 10 }]}>
                    <View style={{}}>
                    <Text style={styles.descriptionText}>
                        Lupa offers a variety of services such as Trainer Bookings, Packs, and Fitness Program Management.
                    </Text>
                    </View>

                    <View style={styles.descriptionContainer}>
                        <Text style={styles.title}>
                            Bookings
                        </Text>
                        <Text style={styles.descriptionText}>
                            As a trainer you can set your available times on an hourly basis through your profile.
                            Navigate to your profile and click the Book Me tab.  Select the date you would like to add available hours to and click the Update Available Hours button.
                        </Text>
                        <Text onPress={() => navigation.navigate('Profile', {
                            userUUID: currUserData.user_uuid
                        })} style={{fontWeight: '500', paddingVertical: 10, color: '#1089ff',}}>
                            View my profile
                        </Text>


                        <Caption>
                            Payments
                        </Caption>
                        <List.Item
    title="Payments Status"
    titleStyle={{fontSize: 15, fontFamily: 'Avenir', fontWeight: '600'}}
    description="Enable my accounts to make payments."
    left={props => <List.Icon {...props} icon={() => <FeatherIcon name="dollar-sign" size={20} />} />}
    onPress={() => navigation.push('Settings')}
  />

<List.Item
    title="Stripe Registration Status"
    titleStyle={{fontSize: 15, fontFamily: 'Avenir', fontWeight: '600'}}
    description="Register my account securely with Stripe."
    left={props => <List.Icon {...props} icon={() => <FeatherIcon name="dollar-sign" size={20} />} />}
    onPress={() => navigation.push('Settings')}
  />
                        <Text style={styles.descriptionText}>
                            Before users can book you for a one on one session you must register your account with with Stripe to enable secure payments.
                        </Text>

                        <Text style={styles.descriptionText}>
                           Your account always has two types of balances "available" and "pending".  Available balances will be paid out weekly on Tuesday whereas pending balances are waiting to be settled.  
                           <Text style={{fontFamily: 'Avenir-Light', color: '#1089ff'}} onPress={() => setPayoutsModalVisible(true)}>
                               {" "} Learn more here.
                           </Text>
                        </Text>
                    </View>

                    <View style={styles.descriptionContainer}>
                        <Text style={styles.title}>
                            Packs
                        </Text>
                        <Text style={styles.descriptionText}>
                            Packs are public or private groups that users can create or join to keep up with their friends and workout buddies.  Packs are able to invite group members to join and participate in fitness programs at a split cost of the original program price.
                        </Text>
                        <Text onPress={() => onSeeHowPacksWork()} style={{fontWeight: '500', paddingVertical: 10, color: '#1089ff',}}>
                            See how packs work
                        </Text>
                    </View>

                    <View style={styles.descriptionContainer}>
                        <Text style={styles.title}>
                            Program Management
                        </Text>
                        <Text style={styles.descriptionText}>
                           Create completely new fitness programs or simply add in programs that you have already created.  You can view all programs you have created from the My Programs tab on the explore page.
                        </Text>

                        <Text style={styles.descriptionText}>
                         Additionally, if you wish to create new programs you can click the circle-plus icon on the bottom tab bar to create one.
                        </Text>
                        <Text onPress={() => navigation.navigate('CreateProgram')} style={{fontWeight: '500', paddingVertical: 10, color: '#1089ff',}}>
                            Create a program
                        </Text>
                        <Caption>
                            Clients
                        </Caption>
                        <Text style={styles.descriptionText}>
                          Lupa takes the stress away from managing your clients and manages storing your client list for you.
                        </Text>
                        <List.Item
    title="Keep track of your client base on Lupa"
    titleStyle={{fontSize: 15, fontFamily: 'Avenir', fontWeight: '600'}}
    description="Find your client list by clicking the blue button on your dashboard."
    left={props => <List.Icon {...props} icon={() => <FeatherIcon name="users" size={20} />} />}
    onPress={() => navigation.navigate('Dashboard')}
  />
                    </View>
                    

                    <View style={styles.descriptionContainer}>
                        <Text style={styles.title}>
                            Community
                        </Text>
                        <Text style={styles.descriptionText}>
                        Are you a trainer at your local gym or do you posess a membership?  Find your community whether at your apartment, local gym, or local studio and request to be added!
                        </Text>
                        <Text style={styles.descriptionText}>
                        Keep track of all upcoming events, trainers, and members.
                        </Text>
                    </View>
                   
                </ScrollView>
            )
        } else {
            return (
                <ScrollView contentContainerStyle={[{ padding: 10 }]}>
                    <View style={{}}>
                    <Text style={styles.descriptionText}>
                        Lupa offers a variety of services such as Trainer Bookings, Packs, and Fitness Programs.
                    </Text>
                    </View>

                    <View style={styles.descriptionContainer}>
                        <Text style={styles.title}>
                            Bookings
                        </Text>
                        <Text style={styles.descriptionText}>
                            As a Lupa user you can book personal trainers for live or virtual workout sessions.
                        </Text>
                        <Text style={styles.descriptionText}>
                        Find trainers through the explore page or by searching based on your interest or trainer name.
                        </Text>
                        <Text onPress={() => navigation.push('Search')} style={{fontWeight: '500', paddingVertical: 10, color: '#1089ff',}}>
                            Search for trainers
                        </Text>


                        <Caption>
                            Payments
                        </Caption>
                        <List.Item
    title="Payments Status"
    titleStyle={{fontSize: 15, fontFamily: 'Avenir', fontWeight: '600'}}
    description="Enable my accounts to make payments."
    left={props => <List.Icon {...props} icon={() => <FeatherIcon name="dollar-sign" size={20} />} />}
    onPress={() => navigation.push('Settings')}
  />

                        <Text style={styles.descriptionText}>
                            Before users can book trainers or purchase fitness programs you must enable your account to make payments and add a card.
                            </Text>
                            
                    </View>

                    <View style={styles.descriptionContainer}>
                        <Text style={styles.title}>
                            Packs
                        </Text>
                        <Text style={styles.descriptionText}>
                            Packs are public or private groups that users can create or join to keep up with their friends and workout buddies.  Packs are able to invite group members to join and participate in fitness programs at a split cost of the original program price.
                        </Text>
                        <Text onPress={() => onSeeHowPacksWork()} style={{fontWeight: '500', paddingVertical: 10, color: '#1089ff',}}>
                            See how packs work
                        </Text>
                    </View>

                    <View style={styles.descriptionContainer}>
                        <Text style={styles.title}>
                            Fitness Programs
                        </Text>
                        <Text style={styles.descriptionText}>
                          Purchase complete fitness programs to keep forever.  Programs can be accessed from your dashboard under My Programs upon purchasing.
                        </Text>

                        <Text style={styles.descriptionText}>
                            See a program you want to share with your friends?  Find a program you like and choose to invite your friends to split the cost with you.  Press the <FeatherIcon name="user-plus"/> in the top right hand corner of any program preview to invite your pack to join in with you.
                        </Text>
                        <Text onPress={() => navigation.push('Search')} style={{fontWeight: '500', paddingVertical: 10, color: '#1089ff',}}>
                           Find a program
                        </Text>
                    </View>

                    <View style={styles.descriptionContainer}>
                        <Text style={styles.title}>
                            Community
                        </Text>
                        <Text style={styles.descriptionText}>
                        Are you a trainer at your local gym or do you posess a membership?  Find your community whether at your apartment, local gym, or local studio and request to be added!
                        </Text>
                        <Text style={styles.descriptionText}>
                        Keep track of all upcoming events, trainers, and members.
                        </Text>
                    </View>
                   
                </ScrollView>
            )
        }
    } catch(error) {
        return (
            <ScrollView contentContainerStyle={[{ padding: 10 }]}>
                    <View style={{}}>
                    <Text style={styles.descriptionText}>
                        Lupa offers a variety of services such as Trainer Bookings, Packs, and Fitness Programs.
                    </Text>
                    </View>

                    <View style={styles.descriptionContainer}>
                        <Text style={styles.title}>
                            Bookings
                        </Text>
                        <Text style={styles.descriptionText}>
                            As a Lupa user you can book personal trainers for live or virtual workout sessions.
                        </Text>
                        <Text style={styles.descriptionText}>
                        Find trainers through the explore page or by searching based on your interest or trainer name.
                        </Text>
                        <Text onPress={() => navigation.push('Search')} style={{fontWeight: '500', paddingVertical: 10, color: '#1089ff',}}>
                            Search for trainers
                        </Text>


                        <Caption>
                            Payments
                        </Caption>
                        <List.Item
    title="Payments Status"
    titleStyle={{fontSize: 15, fontFamily: 'Avenir', fontWeight: '600'}}
    description="Enable my accounts to make payments."
    left={props => <List.Icon {...props} icon={() => <FeatherIcon name="dollar-sign" size={20} />} />}
    onPress={() => navigation.push('Settings')}
  />

                        <Text style={styles.descriptionText}>
                            Before users can book trainers or purchase fitness programs you must enable your account to make payments and add a card.
                            </Text>
                    </View>

                    <View style={styles.descriptionContainer}>
                        <Text style={styles.title}>
                            Packs
                        </Text>
                        <Text style={styles.descriptionText}>
                            Packs are public or private groups that users can create or join to keep up with their friends and workout buddies.  Packs are able to invite group members to join and participate in fitness programs at a split cost of the original program price.
                        </Text>
                        <Text onPress={() => onSeeHowPacksWork()} style={{fontWeight: '500', paddingVertical: 10, color: '#1089ff',}}>
                            See how packs work
                        </Text>
                    </View>

                    <View style={styles.descriptionContainer}>
                        <Text style={styles.title}>
                            Fitness Programs
                        </Text>
                        <Text style={styles.descriptionText}>
                          Purchase complete fitness programs to keep forever.  Programs can be accessed from your dashboard under My Programs upon purchasing.
                        </Text>

                        <Text style={styles.descriptionText}>
                            See a program you want to share with your friends?  Find a program you like and choose to invite your friends to split the cost with you.  Press the <FeatherIcon name="user-plus"/> in the top right hand corner of any program preview to invite your pack to join in with you.
                        </Text>
                        <Text onPress={() => navigation.push('Search')} style={{fontWeight: '500', paddingVertical: 10, color: '#1089ff',}}>
                           Find a program
                        </Text>
                    </View>

                    <View style={styles.descriptionContainer}>
                        <Text style={styles.title}>
                            Community
                        </Text>
                        <Text style={styles.descriptionText}>
                        Are you a trainer at your local gym or do you posess a membership?  Find your community whether at your apartment, local gym, or local studio and request to be added!
                        </Text>
                        <Text style={styles.descriptionText}>
                        Keep track of all upcoming events, trainers, and members.
                        </Text>
                    </View>
                   
                </ScrollView>
        )
    }
     }

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction onPress={() => navigation.pop()} />
                <Appbar.Content title='How to Use Lupa' titleStyle={{color: 'black', fontWeight: '800', alignSelf: 'center', fontFamily: 'Avenir-Heavy', fontSize: 22}}/>
            </Appbar.Header>
            <View style={{flex: 1}}>
            {renderComponent()}
            </View>


            <PayoutsModal isVisible={payoutsModalVisible} closeModal={() => setPayoutsModalVisible(false)} />
        </View>
    )
}

export default HowToUseLupa;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    appbar: {
        backgroundColor: 'white',
        elevation: 0
    },
    title: {
        fontSize: 18,
        fontFamily: 'Avenir-Medium',
        paddingVertical: 10
    },
    descriptionText: {
        fontFamily: 'Avenir-Roman', color: '#aaaaaa', paddingVertical: 5
    },
    descriptionContainer: {
        marginVertical: 25
    }
})