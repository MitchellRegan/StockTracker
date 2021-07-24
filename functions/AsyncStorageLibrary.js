import AsyncStorage from '@react-native-async-storage/async-storage';

const AsyncStorageLibrary = {
    myCompanies: '@myCompanies', //Used to save/retrieve the companies stored for quick reference

    ClearSaveData: function () {
        var defaultData = {
            savedCompanies: []
        };

        AsyncStorage.setItem(this.myCompanies, JSON.stringify(defaultData));
    },

    /**
     * Saves a company's data in async storage for quick reference
     * @param {string} symbol_ The company's NYSE ticker symbol
     * @param {string} name_ The name of the company
     * @param {number} latestPrice_ The company's current stock price
     * @param {number} lastUpdated_ Timestamp in UTC miliseconds of the latest price update
     * @param {number} previousPrice_ The stock price from the beginning of the day
     * */
    SaveCompany: function (symbol_, name_, latestPrice_, lastUpdated_, previousPrice_) {
        var newCompany = {
            symbol: symbol_,
            name: name_,
            latestPrice: latestPrice_,
            previousPrice: previousPrice_,
            lastUpdated: lastUpdated_
        }

        AsyncStorage.getItem(this.myCompanies)
            .then((data) => {
                //Parsing the JSON string into an object to get data from it
                var companyData = JSON.parse(data);

                //If there's no data already saved, we have to make the saved data
                if (companyData == null || companyData == {}) {
                    var newData = {
                        savedCompanies: [newCompany]
                    };

                    AsyncStorage.setItem(this.myCompanies, JSON.stringify(newData));
                }
                //Otherwise we have to add the new company to the array
                else {
                    companyData.savedCompanies.push(newCompany);
                    AsyncStorage.setItem(this.myCompanies, JSON.stringify(companyData));
                }
            })
            .catch((error) => {
                console.log("AsyncStorageLibrary.SaveCompany ERROR");
            })
    },


    /**
     * Removes a stored company from saved data
     * @param {string} symbol_ The company's NYSE ticker symbol
     */
    RemoveCompany: function (symbol_) {
        AsyncStorage.getItem(this.myCompanies)
            .then((data) => {
                //Parsing the JSON string into an object
                var companyData = JSON.parse(data);
                var indexToRemove = -1;

                //Iterating through each company in the array to find the one to remove
                for (var i = 0; i < companyData.savedCompanies.length; i++) {
                    if (companyData.savedCompanies[i].symbol == symbol_) {
                        indexToRemove = i;
                        break;
                    }
                }

                //If a valid index was found, we remove it from the array
                if (indexToRemove > -1) {
                    companyData.savedCompanies.splice(indexToRemove, 1);

                    AsyncStorage.setItem(this.myCompanies, JSON.stringify(companyData));
                }
            })
            .catch((error) => {
                console.log("AsyncStorageLibrary.RemoveCompany ERROR");
            })
    },


    /**
     * Updates the price of a saved company's stock
     * @param {string} symbol_ The company's NYSE ticker symbol
     * @param {number} newPrice_ The company's current stock price
     * @param {number} previousPrice_ The price of the stock from the beginning of the day
     * @param {number} lastUpdated_ Timestamp in UTC miliseconds of the latest price update
     */
    UpdateCompanyPrice: function (symbol_, newPrice_, previousPrice_, lastUpdated_) {
        AsyncStorage.getItem(this.myCompanies)
            .then((data) => {
                //Parsing the JSON string into an object
                var companyData = JSON.parse(data);

                //Iterating through each company in the array to find the one to remove
                for (var i = 0; i < companyData.savedCompanies.length; i++) {
                    if (companyData.savedCompanies[i].symbol == symbol_) {
                        companyData.savedCompanies[i].latestPrice = newPrice_;
                        companyData.savedCompanies[i].previousPrice = previousPrice_;
                        companyData.savedCompanies[i].lastUpdated = lastUpdated_;
                        break;
                    }
                }

                AsyncStorage.setItem(this.myCompanies, JSON.stringify(companyData));
            })
            .catch((error) => {
                console.log("AsyncStorageLibrary.RemoveCompany ERROR");
            })
    },


    /**
     * Retrieves the JSON object with an array of all saved company data
     * @returns {Array} Array of JSON objects for each company
     */
    RetrieveCompanies: async function () {
        let companyData = await AsyncStorage.getItem(this.myCompanies)
            .then((data) => {
                return JSON.parse(data);
            })
            .catch((error) => {
                console.log("AsyncStorageLibrary.RetrieveCompanies ERROR")
                return {
                    savedCompanies: []
                };
            })

        return companyData;
    }
}

export default AsyncStorageLibrary;