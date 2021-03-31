import React from 'react';
import { Text, View, StyleSheet, Dimensions} from 'react-native';
import { Button, Dialog } from 'react-native-paper';

const LearnHowToDialog = ({ isVisible, closeModal }) => {
    return (
        <Dialog visible={isVisible} style={{padding: 10, borderRadius: 10}}>
            <Dialog.Title>
                Your dashboard
            </Dialog.Title>
            <Dialog.Content>
                <Text style={styles.explanationText}>
                Your dashboard is used for managing sessions with a trainer.  If you successfully book a session with a trainer the booking
                information will appear here.  You can also use your dashboard to:
                </Text>
                <View style={{marginVertical: 10}}>
                <Text style={styles.bulletPointText}>
                &#8226; Access programs you have bought and programs assigned to you by your trainer.
                </Text>
                <Text style={styles.bulletPointText}>
                &#8226; Redeem a coupon to receive rewards, free training sessions and or free gym memberships.
                </Text>
                <Text style={styles.bulletPointText}>
                &#8226; Fill out your PARQ Assessment so your trainer has some background for you.
                </Text>
                </View>

            </Dialog.Content> 

            <Button
                        uppercase={false}
                        onPress={closeModal}
                        style={{ marginVertical: 10, width: '100%', elevation: 0, borderColor: '#23374d' }}
                        contentStyle={{ width: '100%', height: 55 }}
                        mode="outlined"
                        theme={{ roundness: 12 }}
                        color='#23374d'>
                       I understand
                </Button>
        </Dialog>
    )
}

const styles = StyleSheet.create({
    explanationText: {
        fontSize: 12,
        fontFamily: 'Avenir-Medium',
        marginVertical: 3
    },
    bulletPointText: {
        fontSize: 15,
        fontFamily: 'Avenir',
        marginVertical: 3,
        color: '#1089ff'
    }
})

export default LearnHowToDialog;