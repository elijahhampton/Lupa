import React from 'react';

import {
    View,
    StyleSheet,
    Text,
    Modal,
    ScrollView,
} from 'react-native';

import {
    Surface,
    Paragraph,
    Caption,
    Title,
    Divider,
} from 'react-native-paper';

import { Rating } from 'react-native-elements';

import LupaController from '../../../controller/lupa/LupaController';

import ReviewSegment from './ReviewSegment';
import { Pagination } from 'react-native-snap-carousel';

export default class UserReviewModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userUUID: this.props.userUUID,
            sessionReviews: [],
        }

        this.LUPA_CONTROLLER_INSTANCE = LupaController.getInstance();
    }

    componentDidMount = async () => {
        await this.generateUserReviews();
    }

    generateUserReviews = async () => {
        let sessionReviewsIn, reviewerUUID, userData, sessionReviewsArr = [];

        await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(this.props.userUUID).then(res => {
            sessionReviewsIn = res.session_reviews;
        });
        
        if (sessionReviewsIn.length != 0)
            {
                let reviewData = sessionReviewsIn;
                for (let i = 0; i < reviewData.length; ++i)
                {
                    //get users uuid from review object
                    reviewerUUID = reviewData[i].reviewBy;

                    //get users information from controller
                    await this.LUPA_CONTROLLER_INSTANCE.getUserInformationByUUID(reviewerUUID).then(userDataIn => {
                        userData = userDataIn;
                    });

                    //add it to review object and puhs into arr
                    reviewData.reviewByData = userData;
                    sessionReviewsArr.push(reviewData);
                }
            }

        await this.setState({
            sessionReviews: sessionReviewsArr,
        })
    }

    mapReviews = () => {
        return this.state.sessionReviews.map(review => {
            return (
                <>
                <ReviewSegment avatarSource={review.reviewByData.photo_url} reviewBy={review.reviewByData.display_name} reviewText={review.reviewText} />
                <Divider />
                </>
            )
        })
    }

    render() {
        return (
            <Modal presentationStyle="pageSheet" visible={this.props.isVisible} onDismiss={this.props.closeModalMethod}>
                <Title style={{alignSelf: 'center', color: "rgba(189,189,189 ,1)"}}>
                    Elijah Hampton's Reviews
                </Title>
                
                <ScrollView contentContainerStyle={{padding: 5}}>
                    {this.mapReviews()}
                </ScrollView>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modal: {

    }
})