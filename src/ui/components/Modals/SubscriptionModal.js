import React from 'react';

import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import {
    Modal
} from 'react-native';

import Swiper from 'react-native-swiper';

import  LupaSpecialistSubscriptionView from './SubscriptionViews/LupaSpecialistSubscriptionView';
import SubscriptionDetails from './SubscriptionViews/SubscriptionDetails';

class SubscriptionModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentSubscriptionPage: 2,
        }
    }

    render() {
        const {index} = this.state;
        return (
        <View>
            <Modal presentationStyle="fullScreen" visible={false} style={styles.modalContainer}>
                <Swiper index={this.state.currentSubscriptionPage} horizontal={true} loop={false} paginationStyle={{position: "absolute", bottom: 0, left: null, right: 0}} dotColor="#FAFAFA">
                    <View>
                        <Text>
                            Test
                        </Text>
                    </View>
                    <View>
                        <Text>
                            Test
                        </Text>
                    </View>
                    <LupaSpecialistSubscriptionView />
                    <View>
                        <Text>
                            Test
                        </Text>
                    </View>
                    <SubscriptionDetails />
                </Swiper>
            </Modal>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        display: "flex",
        backgroundColor: "white",
        margin: 0,
    }
});

export default SubscriptionModal;