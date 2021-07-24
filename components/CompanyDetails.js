import React, {useState} from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

//Formatting
import Fonts from '../constants/Fonts';
//Icons
import StarFilled from '../assets/icons/StarFilled_icon.svg';
import StarEmpty from '../assets/icons/StarEmpty_icon.svg';
//Libraries
import DateTimeLibrary from '../functions/DateTimeLibrary';
import MoneyLibrary from '../functions/MoneyLibrary';
import AsyncStorageLibrary from '../functions/AsyncStorageLibrary';

/**
 * Displays an asortment of details for a company's stock
 * @param {any} props Requires the companyName (string), symbol (string), tradeData (JSON object), lastSalePrice (number), volume (number), and lastUpdated (date miliseconds)
 */
const CompanyDetails = props => {
    const [state, setState] = useState({
        symbol: '',
        favorited: false
    });


    /**
     * Function called when this component is loaded to check if this company is currently saved in our favorites list
     * */
    function CheckIfSaved() {
        if (props.symbol == state.symbol) {
            return;
        }

        AsyncStorageLibrary.RetrieveCompanies()
            .then((data) => {
                for (var i = 0; i < data.savedCompanies.length; i++) {
                    if (data.savedCompanies[i].symbol == props.symbol) {
                        setState((prevState) => {
                            return ({
                                symbol: props.symbol,
                                favorited: true
                            });
                        });
                    }
                }
            })
            .catch((error) => {
                console.log("CompanyDetails.CheckIfSaved ERROR couldn't retrieve AsyncStorage saved company data");
            })
    }


    /**
     * Saves this company for quick reference on the home page
     * */
    function SaveCompany() {
        AsyncStorageLibrary.SaveCompany(props.symbol, props.companyName, props.lastSalePrice, props.lastUpdated, props.tradeData.trades[props.tradeData.trades.length - 1].price);
        setState((prevState) => {
            return ({
                ...prevState,
                favorited: true
            });
        });
    }


    /**
     * Removes this company from the list of saved companies
     * */
    function RemoveCompany() {
        AsyncStorageLibrary.RemoveCompany(props.symbol);
        setState((prevState) => {
            return ({
                ...prevState,
                favorited: false
            });
        });
    }


    /**
     * Finds the price difference between the stock's current price and the price it was at the beginning of our trade data
     * @returns {number} The price difference between the stock's current price and the starting price
     * */
    function FindPriceDifference() {
        if (props.tradeData.trades.length == 0) {
            return 0.000;
        }

        var currentPrice = props.tradeData.trades[0].price;
        var startingPrice = props.tradeData.trades[props.tradeData.trades.length - 1].price;

        return (currentPrice - startingPrice);
    }


    /**
     * Finds the percent increase or decrease in value of the stock since the beginning of our trade data
     * @returns {string} The percentage increase or decrease in value, rounded to 2 decimal places
     * */
    function FindPercentDifference() {
        var priceDiff = FindPriceDifference();
        var percentDiff = priceDiff / props.tradeData.trades[props.tradeData.trades.length - 1].price;
        percentDiff *= 100;

        return percentDiff.toFixed(2);
    }


    /**
     * Iterates through the trade data to find the highest sale price
     * @returns {number} the highest price of the stocks in our data. If it returns -1.0, there were no sales.
     * */
    function FindHighestSalePrice() {
        var highest = -1.0;

        for (var i = 0; i < props.tradeData.trades.length; i++) {
            if (props.tradeData.trades[i].price > highest) {
                highest = props.tradeData.trades[i].price;
            }
        }

        return highest;
    }


    /**
     * Iterates through the trade data to find the lowest sale price
     * @returns {number} the lowest price of the stocks in our data. If it returns -1.0, there were no sales.
     * */
    function FindLowestSalePrice() {
        if (props.tradeData.trades.length < 1) {
            return -1.0;
        }

        var lowest = props.tradeData.trades[0].price;

        for (var i = 0; i < props.tradeData.trades.length; i++) {
            if (props.tradeData.trades[i].price < lowest) {
                lowest = props.tradeData.trades[i].price;
            }
        }

        return lowest;
    }


    //When this component loads, we check if this company has been favorited or not
    CheckIfSaved();

    return (
        <View style={styles.wrapper}>
            <View style={styles.companyDataView}>
                <View style={styles.companyRow}>
                    <Text style={styles.companyNameText}>{props.companyName} ({props.symbol})</Text>

                    {(state.favorited) && <TouchableOpacity style={styles.removeButton} onPress={() => RemoveCompany()}>
                        <StarFilled height={32} width={32}/>
                    </TouchableOpacity>}

                    {(!state.favorited) && <TouchableOpacity style={styles.saveButton} onPress={() => SaveCompany()}>
                        <StarEmpty height={32} width={32}/>
                    </TouchableOpacity>}
                </View>

                <View style={styles.fiftyFifty}>
                    <View style={styles.priceChangeView}>
                        <Text style={styles.latestPriceText}>${MoneyLibrary.ConvertMoneyToString(props.lastSalePrice)}</Text>

                        {(FindPriceDifference() > 0) && <View style={styles.changesView}>
                            <Text style={styles.changesTextRise}>+${MoneyLibrary.ConvertMoneyToString(FindPriceDifference())}</Text>
                            <Text style={styles.changesTextRise}>+{FindPercentDifference()}%</Text>
                        </View>}

                        {(FindPriceDifference() < 0) && <View style={styles.changesView}>
                            <Text style={styles.changesTextDrop}>-${MoneyLibrary.ConvertMoneyToString(FindPriceDifference() * -1)}</Text>
                            <Text style={styles.changesTextDrop}>{FindPercentDifference()}%</Text>
                        </View>}

                        {(FindPriceDifference() == 0) && <View style={styles.changesView}>
                            <Text style={styles.changesTextRise}>+$0.00</Text>
                            <Text style={styles.changesTextRise}>+0.00%</Text>
                        </View>}
                    </View>

                    <View style={styles.dateSaveView}>
                        <View style={{ width: '100%' }}>
                            {(props.tradeData.trades.length > 0) && <View>
                                <View style={styles.row}>
                                    <Text style={styles.detailText}>Open:</Text>
                                    <Text style={styles.detailText}>${MoneyLibrary.ConvertMoneyToString(props.tradeData.trades[props.tradeData.trades.length - 1].price)}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.detailText}>High:</Text>
                                    <Text style={styles.detailText}>${MoneyLibrary.ConvertMoneyToString(FindHighestSalePrice())}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.detailText}>Low:</Text>
                                    <Text style={styles.detailText}>${MoneyLibrary.ConvertMoneyToString(FindLowestSalePrice())}</Text>
                                </View>
                            </View>}
                            {(props.tradeData.trades.length == 0) && <View>
                                <View style={styles.row}>
                                    <Text style={styles.detailText}>Open:</Text>
                                    <Text style={styles.detailText}>---</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.detailText}>High:</Text>
                                    <Text style={styles.detailText}>---</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.detailText}>Low:</Text>
                                    <Text style={styles.detailText}>---</Text>
                                </View>
                            </View>}

                            <View style={styles.row}>
                                <Text style={styles.detailText}>Volume:</Text>
                                <Text style={styles.detailText}>{props.volume}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <Text style={styles.lastUpdatedText}>Last Updated: {DateTimeLibrary.ConvertEpochToCondensedUtc(props.lastUpdated)}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#eee',
    },

    companyDataView: {
        margin: 10
    },

    companyRow: {
        justifyContent: 'space-between',
        flexDirection: 'row'
    },

    companyNameText: {
        fontFamily: Fonts.sansSerifCondensed,
        fontSize: 18,
    },

    fiftyFifty: {
        flexDirection: 'row',
        marginTop: 5,
    },

    priceChangeView: {
        width: '50%',
        alignItems: 'center',
    },

    latestPriceText: {
        fontFamily: Fonts.sansSerif,
        fontSize: 30,
        fontWeight: 'bold',
    },

    changesView: {
        marginLeft: 20,
        alignSelf: 'center'
    },

    changesTextNone: {
        fontFamily: Fonts.monospace,
        fontSize: 12,
        color: '#000'
    },

    changesTextRise: {
        fontFamily: Fonts.monospace,
        fontSize: 12,
        color: '#0c0'
    },

    changesTextDrop: {
        fontFamily: Fonts.monospace,
        fontSize: 12,
        color: '#f33'
    },

    dateSaveView: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '50%'
    },

    lastUpdatedText: {
        fontFamily: Fonts.sansSerifThin,
        fontSize: 14
    },

    saveButton: {
        borderRadius: 2,
    },

    removeButton: {
        borderRadius: 2,
    },

    saveText: {
        padding: 5,
        fontWeight: 'bold'
    },

    detailText: {
        fontFamily: Fonts.monospace,
        fontSize: 13
    },

    row: {
        flexDirection: 'row',
        justifyContent: "space-between",
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        paddingTop: 3,
    }
})

export default CompanyDetails;