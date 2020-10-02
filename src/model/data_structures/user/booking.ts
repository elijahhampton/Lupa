import { Booking } from "./types";

let booking : Booking = {
    start_time: new Date(5000),
    end_time: new Date(5000),
    trainer_uuid: '',
    requester_uuid: '',
    is_set: false,
    booking_uid: '0',
    booking_entry_date: new Date(5000)
}

export default function getBookingStructure(startTime, endTime, trainerUUID, requestUUID, isSet, bookingEntryDate) {
    booking.start_time = startTime;
    booking.end_time = endTime;
    booking.trainer_uuid = trainerUUID;
    booking.requester_uuid = requestUUID;
    booking.is_set = isSet;
    booking.booking_uid = Math.random().toString();
    booking.booking_entry_date = bookingEntryDate
    return booking;
}