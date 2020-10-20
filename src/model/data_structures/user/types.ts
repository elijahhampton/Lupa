export enum BOOKING_STATUS {
    BOOKING_REQUESTED=0,
    BOOKING_DENIED=1,
    BOOKING_ACCEPTED=2,
    BOOKING_COMPLETED=3,
    BOOKING_UNKNOWN=4,
}

export type Booking = {
    start_time: Date,
    end_time: Date,
    date: Date,
    date_requested: Date,
    trainer_uuid: String | Number,
    requester_uuid: String | Number,
    status: BOOKING_STATUS,
    uid: String | Number,
    note: String,
}