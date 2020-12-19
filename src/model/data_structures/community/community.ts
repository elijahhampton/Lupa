import { LupaCommunity } from './types';
import moment from 'moment';

export default function Community(name: string, address: string, pictures: Array<string>, trainers: Array<string>, zipcode, ownerName, phoneNumber, associatedAccount,
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
export function initializeNewCommunity(name, address, pictures, trainers, zipcode, ownerName, phoneNumber, associatedAccount) : LupaCommunity {
    const dateRequested = moment().toDate();
    return new Community(name, address, pictures, trainers, zipcode, ownerName, phoneNumber, associatedAccount, dateRequested, -1);
}