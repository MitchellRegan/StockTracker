//Retrieves JSON data for trades of a given symbol
const TopsAPI = {
    /**
     * Retrieves JSON data for trades of a given symbol
     *
     * @param {string} givenSymbol_ NYSE ticker symbol for a company (Example: 'FB' for Facebook)
     * @returns {JSON} JSON object with recent trade information
     */
    apiCall: async function (givenSymbol_ = '') {
        let callData = await fetch('https://ws-api.iextrading.com/1.0/tops?symbols=' + givenSymbol_, {
            method: 'GET',
            body: ''
        })
            .then((response) => response.json())
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.log("TopsAPI.apiCall error");
            })

        return callData;
    }
}

export default TopsAPI;