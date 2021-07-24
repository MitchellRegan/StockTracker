const MoneyLibrary = {
    /**
     * Converts a numerical money value into a string (1 becomes 1.00)
     * 
     * @param {number} money_ Amount of currency to convert
     * @returns {string}
     */
    ConvertMoneyToString: function (money_) {
        var fullValues = money_.toFixed(0);
        var fractions = (money_ * 100) % 100;
        var fractionString = '';

        //Making sure the decimal string doesn't also have a negative sign
        if (money_ < 0) {
            fractions *= -1;
        }

        if (fractions.toFixed(0) < 10) {
            fractionString = '0' + fractions.toFixed(0);
        }
        else {
            fractionString = '' + fractions.toFixed(0);
        }

        return ('' + fullValues + '.' + fractionString);
    }
}

export default MoneyLibrary;