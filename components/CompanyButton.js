import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

//Formatting
import Fonts from '../constants/Fonts';
import Colors from '../constants/Colors';
//APIs
import DeepAPI from '../functions/apiCalls/DeepAPI';
import SymbolSearchAPI from '../functions/apiCalls/SymbolSearchAPI';
//Libraries
import DateTimeLibrary from '../functions/DateTimeLibrary';
import MoneyLibrary from '../functions/MoneyLibrary';

/**
 * Button to open up the CompanyDetails screen for a specific company. Requires navigation, companyName (string), symbol (string), lastSalePrice (number), and lastUpdated (date in miliseconds)
 * @param {any} props Requires navigation, companyName (string), symbol (string), latestPrice (number), previousPrice (number), and lastUpdated (date in miliseconds)
 */
const CompanyButton = props => {
    /**
     * Opens the CompanyDetails screen for this company
     */
    function GoToDetails() {
        //Performing the DeepAPI call to get trade data
        DeepAPI.apiCall(props.symbol)
            .then((tData) => {
                //If the API call worked, we perform another call to get basic company data
                SymbolSearchAPI.apiCall(props.symbol)
                    .then((cData) => {
                        //If both API calls worked, we send the company and trade data to the Details page
                        props.navigation.navigate("Details", {companyData: cData, tradeData: tData});
                    })
                    .catch((error) => {
                        console.log("CompanyButton.GoToDetails ERROR with symbol search api");
                    })
            })
            .catch((error) => {
                console.log("CompanyButton.GoToDetails ERROR with deep api");
            })

    }


    return (
        <View style={styles.wrapper}>
            {(props.latestPrice - props.previousPrice == 0) && <View style={styles.circleView}>
                <Text style={styles.circleText}>${MoneyLibrary.ConvertMoneyToString(props.latestPrice)}</Text>
                <Text style={styles.priceText}>${MoneyLibrary.ConvertMoneyToString(props.latestPrice - props.previousPrice)}</Text>
            </View>}
            {(props.latestPrice - props.previousPrice < 0) && <View style={styles.circleView}>
                <Text style={styles.circleText}>${MoneyLibrary.ConvertMoneyToString(props.latestPrice)}</Text>
                <Text style={styles.lowerPriceText}>-${MoneyLibrary.ConvertMoneyToString(props.previousPrice - props.latestPrice)}</Text>
            </View>}
            {(props.latestPrice - props.previousPrice > 0) && <View style={styles.circleView}>
                <Text style={styles.circleText}>${MoneyLibrary.ConvertMoneyToString(props.latestPrice)}</Text>
                <Text style={styles.higherPriceText}>+${MoneyLibrary.ConvertMoneyToString(props.latestPrice - props.previousPrice)}</Text>
            </View>}

            <TouchableOpacity style={styles.button} onPress={() => GoToDetails()}>
                <View style={styles.nameDateView}>
                    <Text style={styles.nameText} numberOfLines={1}>{props.companyName}</Text>
                    <View style={styles.symbolDateView}>
                        <Text style={styles.symbolText}>({props.symbol})</Text>
                        <Text style={styles.dateText}>{DateTimeLibrary.ConvertEpochToCondensedUtc(props.lastUpdated)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 10,
        borderColor: '#000',
        borderWidth: 1,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff',
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    circleView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    circleText: {
        fontFamily: Fonts.monospace,
        fontWeight: 'bold',
        
    },

    button: {
        flex: 3,
    },

    nameDateView: {
        paddingLeft: 10,
    },

    nameText: {
        fontFamily: Fonts.serif,
        fontSize: 14,
    },

    symbolDateView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    symbolText: {
        fontFamily: Fonts.serif,
        fontWeight: 'bold',
        fontSize: 14,
        paddingRight: 20
    },

    dateText: {
        fontFamily: Fonts.sansSerifThin,
        color: '#000',
        fontSize: 12,
        textAlign: 'right',
    },

    priceText: {
        fontFamily: Fonts.monospace,
        fontSize: 13
    },

    lowerPriceText: {
        fontFamily: Fonts.monospace,
        fontSize: 13,
        color: Colors.redText
    },

    higherPriceText: {
        fontFamily: Fonts.monospace,
        fontSize: 13,
        color: Colors.greenText
    }
})

export default CompanyButton;