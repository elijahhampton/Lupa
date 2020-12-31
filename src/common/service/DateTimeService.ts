import { Moment } from "moment";

export function extractTimeStringFromMomentDateString(moment : Moment) {

}

/**
 * 
 * @param moment 
 *
 */
export function extractDateStringFromMoment(moment : Moment) {
    const fullISOString = moment.subtract(1, 'day').toISOString(); ////2020-03-01T04:23:56.000Z - moment() is adding one day on to the date from the parameter?
    const dateString = fullISOString.split('T')[0];
    return dateString;
}

export function extractTimePeriodFromMomentTimeString(moment : Moment) {

}

export function getMonthStringFromDate(dateString) {
    
}

export function getDayOfMonthStringFromDate(dateString) {
    const dayOfMonth = new Date(dateString);
    return dayOfMonth.getDate()
}

export function getDayOfTheWeekStringFromDate(dateString) {
     const dayOfTheWeek = new Date(dateString).getDay()

     switch (dayOfTheWeek) {
        case 0:
            return 'Sunday';
        case 1:
            return 'Monday';
        case 2:
            return 'Tuesday';
        case 3:
            return 'Wednesday';
        case 4:
            return 'Thursday';
        case 5:
            return 'Friday';
        case 6:
            return 'Saturday';
     }
} 

export function getAbbreviatedDayOfTheWeekFromDate(dateString) {
    const dayOfTheWeek = new Date(dateString).getDay()

     switch (dayOfTheWeek) {
        case 0:
            return 'Sund';
        case 1:
            return 'Mon';
        case 2:
            return 'Tue';
        case 3:
            return 'Wed';
        case 4:
            return 'Thur';
        case 5:
            return 'Fri';
        case 6:
            return 'Sat';
     }
}