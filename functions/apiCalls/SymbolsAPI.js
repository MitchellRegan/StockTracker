//Retrieves JSON data for all stock symbols (names)
const SymbolsAPI = {
    apiCall: async function (searchForSymbol = '') {
        let callData = await fetch('https://ws-api.iextrading.com/1.0/ref-data/symbols', {
            method: 'GET',
            body: ''
        })
            .then((response) => response.json())
            .then((data) => {
                //If there was no selected symbol to look for
                if (searchForSymbol != '') {
                    JSON.st
                }
                else {
                    data.
                }
            })
            .catch((error) => {
                console.log("SymbolsAPI.apiCall error");
            })

        return callData;
    }
}

export default SymbolsAPI;