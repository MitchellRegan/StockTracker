//Retrieves JSON data for trades of a given symbol
const SymbolSearchAPI = {
    /**
     * Retrieves JSON data for basic company info of a given stock symbol
     *
     * @param {string} givenSymbol_ NYSE ticker symbol for a company (Example: 'FB' for Facebook)
     * @returns {JSON} JSON object with company info
     */
    apiCall: async function (nameToSearch_ = '') {
        let callData = await fetch('https://ws-api.iextrading.com/1.0/ref-data/symbols', {
            method: 'GET',
            body: ''
        })
            .then((response) => response.json())
            .then((data) => {
                var i = 0;
                var entry;
                //Iterating through all the symbols to find the one that matches what we're searching for
                for (i = 0; i < data.length; i++) {
                    entry = data[i];
                    if (entry.symbol == nameToSearch_) {
                        return entry;
                    }
                }
            })
            .catch((error) => {
                console.log("SymbolSearchAPI.apiCall error");
            })

        return callData;
    }
}

export default SymbolSearchAPI;