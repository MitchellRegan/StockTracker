import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';

//Formatting
import Fonts from '../constants/Fonts';
import Colors from '../constants/Colors';
//APIs
import DeepAPI from '../functions/apiCalls/DeepAPI';
import SymbolSearchAPI from '../functions/apiCalls/SymbolSearchAPI';
//Components
import DefaultHeader from '../components/DefaultHeader';
import CompanyDetails from '../components/CompanyDetails';
import TradeHistoryList from '../components/TradeHistoryList';
//Libraries
import DateTimeLibrary from '../functions/DateTimeLibrary';
import MoneyLibrary from '../functions/MoneyLibrary';

const TestScreen = props => {
    //State to hold all of the variables needed for this screen
    const [state, updateNewState] = useState(
        {
            haveSearched: false,
            symbol: '',
            companyData: {},
            tradeData: {},
            marketOpen: false
        }
    );


    //Function called from the Stock Symbol TextInput to save the symbol to search for
    function UpdateSymbol(newSymbol_ = '') {
        updateNewState((prevState) => {
            return ({
                ...prevState,
                symbol: newSymbol_
            })
        });
    }


    //Function that uses the DeepAPI call to get the trade data for a stock symbol
    function GetTradeHistory(symbol_ = '') {
        Keyboard.dismiss();

        DeepAPI.apiCall(symbol_)
            .then((tradeData) => {
                GetCompanyData(tradeData, symbol_);
            })
            .catch((error) => {
                console.log("TestScreen.GetTradeHistory ERROR with deep api");

                //Updating the state to show that a search still happened
                updateNewState((prevState) => {
                    return ({
                        ...prevState,
                        companyData: {},
                        haveSearched: true,
                        marketOpen: DateTimeLibrary.IsExchangeOpen()
                    })
                });
            })
    }


    //Function that uses the SymbolSearchAPI call to get company data for a stock symbol
    function GetCompanyData(tradeData_, symbol_ = '') {
        SymbolSearchAPI.apiCall(symbol_)
            .then((companyData) => {
                //Updating the state to collect the API data
                updateNewState((prevState) => {
                    return ({
                        ...prevState,
                        companyData: companyData,
                        tradeData: tradeData_,
                        haveSearched: true,
                        marketOpen: DateTimeLibrary.IsExchangeOpen()
                    })
                });
            })
            .catch((error) => {
                console.log("TestScreen.GetTradeHistory ERROR with symbol search api");

                //Updating the state to show that a search still happened
                updateNewState((prevState) => {
                    return ({
                        ...prevState,
                        companyData: {},
                        haveSearched: true,
                        marketOpen: DateTimeLibrary.IsExchangeOpen()
                    })
                });
            })
    }


    return (
        <View style={styles.wrapper}>
            <DefaultHeader navigation={props.navigation} />

            <Text style={styles.titleText}>Stock Search</Text>

            <View style={styles.inputRow}>
                <Text>NYSE Symbol: </Text>
                <TextInput
                    style={styles.symbolInput}
                    value={state.symbol}
                    placeholder={"ABCDE"}
                    numberOfLines={1}
                    maxLength={7}
                    spellCheck={false}
                    autoCorrect={false}
                    autoCapitalize={"characters"}
                    onChangeText={UpdateSymbol}
                />
                <TouchableOpacity
                    onPress={() => GetTradeHistory(state.symbol)}
                    style={styles.searchButton}>
                    <Text style={{ fontWeight: "bold" }}>Search</Text>
                </TouchableOpacity>
            </View>

            {(state.haveSearched && (state.companyData != null && state.companyData.name != null)) && <View>
                <CompanyDetails
                    companyName={state.companyData.name}
                    symbol={state.companyData.symbol}
                    lastSalePrice={state.tradeData.lastSalePrice}
                    lastUpdated={state.tradeData.lastUpdated}
                    volume={state.tradeData.volume}
                    tradeData={state.tradeData}
                />

                <TradeHistoryList tradeData={state.tradeData} maxNum={50}/>
            </View>}

            {(state.haveSearched && state.companyData == null) && <View>
                <Text>There is no data for {state.symbol}</Text>
            </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: Colors.background
    },

    titleText: {
        fontFamily: Fonts.serif,
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 28,
    },

    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomColor: '#000',
        borderBottomWidth: 1
    },

    symbolInput: {
        borderColor: '#000',
        width: 65,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomWidth: 1,
        backgroundColor: '#eee',
        textAlign: 'center'
    },

    searchButton: {
        backgroundColor: '#f66',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        marginLeft: 15,
        alignItems: 'center'
    },

    openMarket: {
        backgroundColor: '#0f0',
        alignItems: 'center',
        padding: 3,
        marginLeft: 15,
    },

    closedMarket: {
        backgroundColor: '#f00',
        alignItems: 'center',
        padding: 3,
        marginLeft: 15,
    },

    companyDataView: {
        margin: 10
    },

    companyRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    companyNameText: {
        fontFamily: Fonts.sansSerifCondensed,
        fontSize: 18,
    },

    companySymbolText: {
        fontFamily: Fonts.sansSerif,
        fontSize: 14,
        padding: 5,
        borderRadius: 2,
        backgroundColor: '#99f'
    },

    latestPriceText: {
        fontFamily: Fonts.sansSerif,
        fontSize: 30,
        fontWeight: 'bold',
    },

    lastUpdatedText: {
        fontFamily: Fonts.sansSerifThin,
        fontSize: 14
    },

    dataFlatlist: {
        borderColor: '#000',
        borderWidth: 1,
        height: '50%'
    },

    dataRowEven: {
        backgroundColor: '#fff',
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    dataRowOdd: {
        backgroundColor: '#eee',
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    priceChangeRow: {
        flexDirection: 'row'
    },

    detailsText: {
        fontFamily: Fonts.monospace,
        fontSize: 10,
        color: '#000'
    },

    priceDropText: {
        fontFamily: Fonts.monospace,
        fontSize: 10,
        color: '#f33'
    },

    priceRiseText: {
        fontFamily: Fonts.monospace,
        fontSize: 10,
        color: '#0c0'
    }
})

export default TestScreen;