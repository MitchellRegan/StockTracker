const DateTimeLibrary = {
    /**
     * Function to convert EPOCH time to a UTC date string (DotW, Day Month Year hr:min:sec:ms GMT)
     *
     * @param {number} epochTime_ EPOCH time in miliseconds
     * @returns {string}
     */
    ConvertEpochToUtc: function (epochTime_) {
        var d = new Date(0);
        //var timezoneOffset = d.getTimezoneOffset() * 60000;
        d.setUTCMilliseconds(epochTime_);
        return (d.toUTCString());
    },


    /**
     * Converts EPOCH time to a smaller date format (hr:min, day/month/year)
     * 
     * @param {number} epochTime_ EPOCH time in miliseconds
     * @returns {string}
     */
    ConvertEpochToCondensedUtc: function (epochTime_) {
        var d = new Date(0);
        d.setUTCMilliseconds(epochTime_);
        var day = d.getDate();
        var month = d.getMonth() + 1;
        var year = d.getFullYear();
        var hour = d.getHours();

        var min = d.getMinutes();
        var minString = '';
        if (min < 10) {
            minString = '0' + min.toString();
        }
        else {
            minString += min;
        }

        return (hour + ":" + minString + ", " + day + "/" + month + "/" + year);
    },


    /**
    * Function to check if the NYSE is open
    * @returns {boolean}
    */
    IsExchangeOpen: function () {
        var time = new Date();

        //Checking if the day of the week is Saturday or Sunday (closed)
        if (time.getDay() != 0 && time.getDay() != 6) {
            //Checking if the time is later than 14:30 GMT (opens at 9:30 EST)
            if (time.getUTCHours() > (14 + this.DaylightSavingsHourOffset()) ||
                (time.getUTCHours() == (14 + this.DaylightSavingsHourOffset()) && time.getMinutes() >= 30)) {
                //Checking if the time is earlier than 21:00 GMT (closes at 4:00 EST)
                if (time.getUTCHours() < (21 + this.DaylightSavingsHourOffset())) {
                    return true;
                }
            }
        }

        //Unless all of those parameters are met, the exchange is closed
        return false;
    },


    /**
     * Checks to see if daylight savings is in effect and returns an hour offset if so
     * @returns {number} 0 if daylight savings is not in effect, -1 if it is
     */
    DaylightSavingsHourOffset: function () {
        var d = new Date();
        var january = new Date(d.getFullYear(), 0, 1).getTimezoneOffset();
        var july = new Date(d.getFullYear(), 6, 1).getTimezoneOffset();

        if (Math.max(january, july) != d.getTimezoneOffset) {
            return -1;
        }

        return 0;
    }
}

export default DateTimeLibrary;