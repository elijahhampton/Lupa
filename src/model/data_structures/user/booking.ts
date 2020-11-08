import { Booking, BOOKING_STATUS } from "./types";

let booking : Booking = {
    start_time: new Date(),
    end_time: new Date(),
    date: new Date(),
    date_requested: new Date(),
    trainer_uuid: 0,
    requester_uuid: 0,
    status: BOOKING_STATUS.BOOKING_UNKNOWN,
    uid: 0,
    note: "",
    session_type: ''
}

export function getNewBookingStructure(start_time, end_time, date, date_requested, trainer_uuid, requester_uuid, trainer_note) : Booking {
    booking.start_time = start_time;
    booking.end_time = end_time;
    booking.date = date;
    booking.date_requested = date_requested;
    booking.trainer_uuid = trainer_uuid;
    booking.requester_uuid = requester_uuid;
    booking.status = Number(BOOKING_STATUS.BOOKING_REQUESTED);
    booking.note = trainer_note;
    booking.uid = Math.random().toString();
    return booking;
}

export function getBookingStructure() : Booking {
    booking.start_time = new Date();
    booking.end_time = new Date();
    booking.date = new Date();
    booking.date_requested = new Date();
    booking.trainer_uuid = 0;
    booking.requester_uuid = 0;
    booking.status = Number(BOOKING_STATUS.BOOKING_UNKNOWN);
    booking.note = "";
    return booking;
}