import React from 'react';
import { ListItem } from 'react-native-elements';
import {
    Text,
    View,
    StyleSheet,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const WelcomeContentDriver = () => {
    const navigation = useNavigation()

    return (
        <View style={styles.container}>
                            <View style={styles.headerTextContainer}>
                                <Text style={styles.headerText}>
                                   Thank you for joining Lupa.
                                </Text>
                                
                                <View>
                                <ListItem
        title='Report'
        titleStyle={styles.titleStyle}
        subtitle='Remember to report suspicious behavior.'
        subtitleStyle={styles.subtitleStyle}
        rightIcon={() => <FeatherIcon name="arrow-right" />}
        bottomDivider
      />
                                <ListItem
        title='Train Safely'
        titleStyle={styles.titleStyle}
        subtitle='Always meet trainers in a public area.'
        subtitleStyle={styles.subtitleStyle}
        rightIcon={() => <FeatherIcon name="arrow-right" />}
        bottomDivider
      />
                             <ListItem
        title='Terms of Service'
        titleStyle={styles.titleStyle}
        subtitle='Find the Lupa Terms of Service here.'
        subtitleStyle={styles.subtitleStyle}
        rightIcon={() => <FeatherIcon name="arrow-right" />}
        bottomDivider
      />
      <ListItem
        title='Get started'
        titleStyle={styles.highlightedTitleStyle}

        bottomDivider
        rightIcon={() => <FeatherIcon name="arrow-right" />}
        onPress={() => navigation.navigate('App')}
      />
                               
                            </View>
                            </View>

                        </View>
    )
}

export default WelcomeContentDriver;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleStyle: {
        fontSize: 15, fontWeight: '400', color: 'rgb(72, 72, 74)'
    },
    subtitleStyle: {
        fontSize: 15, fontWeight: '500'
    },
    headerText: {
        alignSelf: 'center', fontFamily: 'avenir-roman', fontSize: 20, color: 'rgb(58, 58, 60)', fontWeight: '700'
    },
    headerTextContainer: {
        flex: 0.5, justifyContent: "space-evenly"
    },
    highlightedTitleStyle: {
        color: '#1089ff', fontWeight: '500'
    }
})