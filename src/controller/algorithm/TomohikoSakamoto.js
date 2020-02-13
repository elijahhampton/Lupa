/**
 * Retrieve the day of the week from a given date
 */

 export default  getDayOfTheWeekFromDate = (month, day, year) => {
     let leadingNumberOfDays = [0, 3, 2 ,5, 0, 3, 5, 1, 4, 6, 2, 4];

     //If month is less than3 reduce year by 1
     if (month < 3)
     {
         year -= 1;
     }

     return (year + year / 4 - year / 100 + year / 400 + leadingNumberOfDays[month - 1] + day) % 7;
 }