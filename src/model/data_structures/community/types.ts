export type LupaCommunity = {
    name: string,
    address: string,
    pictures: Array<string>,
    trainers: Array<String>,
    approved: number | boolean,
    date_requested: Date,
    uid: string,
    members: Array<string>,
    phoneNumber: string,
    zipcode: string,
    ownerName: string,
    reviews: Array<string>,
    events: Object,
    programs: Array<string>,
    followers: Array<string>,
    subscribers: Array<string>
}

export type CommmunityReview = {
    reviewerUID: string,
    text: string,
    communityUID: string,
    date_created: Date,
}

export type CommunityEvent = {
    name: string,
    details: string,
    startDate: Date,
    eventDuration: Number,
    startTime: Date,
    endTime: Date,
    communityUID: string,
}