import { LupaCommunity } from './types';
import moment from 'moment';

export default function Community(name: string, address: string, city: string, state: string, pictures: Array<string>, trainers: Array<string>, members: Array<string>, zipcode, ownerName, phoneNumber, associatedAccount,
    date_requested: Date, approved: number | boolean) {
        this.name = name;
        this.address = address;
        this.zipcode = zipcode;
        this.ownerName = ownerName;
        this.associatedAccount = associatedAccount;
        this.pictures = pictures;
        this.trainers = trainers;
        this.date_requested = date_requested;
        this.approved = approved;
        this.phoneNumber = phoneNumber;
        this.uid = '0';
        this.members = members;
        this.subscribers = members;
        this.city = city;
        this.state = state;
        this.reviews = [];
        this.events = {};
        this.programs = [];
}

export function CommunityReview(reviewerUID: string, communityUID: string, text: string) {
    this.reviewerUID = reviewerUID;
    this.communityUID = communityUID;
    this.text = text;
    this.date_created = moment().toDate();
}

export function CommunityEvent(uid, name, details, startDate, eventDuration, startTime, endTime) {
    this.name = name;
    this.details = details;
    this.startDate = startDate;
    this.eventDuration = eventDuration;
    this.startTime = startTime;
    this.endTime = endTime;
    this.communityUID = uid;
}

/**
 * initializeNewCommunity
 * Initializes new community and returns a LupaCommunity object.  Community approved status is initialized to -1
 * to signal a decision has not been made.  After the community approved status has been changed to true or false
 * manually firebase functions will take care of the rest of the logic.
 * @param name 
 * @param address 
 * @param pictures 
 * @param trainers 
 */
export function initializeNewCommunity(name, address, city, state, pictures, trainers, members, zipcode, ownerName, phoneNumber, associatedAccount) : LupaCommunity {
    const dateRequested = moment().toDate();
    return new Community(name, address, city, state, pictures, trainers, members, zipcode, ownerName, phoneNumber, associatedAccount, dateRequested, -1);
}

export function createCommunityReview(reviewerUID, text, communityUID) {
    return new CommunityReview(reviewerUID, communityUID, text);
}

export function createCommunityEvent(uid, name, details, startDate, eventDuration, startTime, endTime) {
    return new CommunityEvent(uid, name, details, startDate, eventDuration, startTime, endTime);
}