import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

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

/**
 * Screen to display details about a selected company from the SavedCompaniesScreen. This screen requires props to be passed via props.navigation.navigate("Details", { companyData: cData_, tradeData: tData_ });
 * @param {any} props
 */
const CompanyDetailsScreen = props => {
    //State to hold all of the variables needed for this screen
    const [state, updateNewState] = useState(
        {
            symbol: '',
            companyData: {},
            tradeData: {}
        }
    );


    /**
     * Called by the refresh button to get updated trade info for this company
     * */
    function UpdateData() {

	}


	return (
		<View style={styles.wrapper}>
            <DefaultHeader navigation={props.navigation} />

            <Text style={styles.titleText}>Details</Text>

            {/*This section is data passed from props and not from update*/}
            {(props.route.params.companyData.symbol != state.symbol) && <View>
                <CompanyDetails
                    companyName={props.route.params.companyData.name}
                    symbol={props.route.params.companyData.symbol}
                    lastSalePrice={props.route.params.tradeData.lastSalePrice}
                    lastUpdated={props.route.params.tradeData.lastUpdated}
                    volume={props.route.params.tradeData.volume}
                    tradeData={props.route.params.tradeData}
                />

                <TradeHistoryList tradeData={props.route.params.tradeData} maxNum={50} />
            </View>}

            {/*This section is data retrieved from an update call, not the data passed from props*/}
            {(props.route.params.companyData.symbol == state.symbol) && <View>
                <CompanyDetails
                    companyName={state.companyData.name}
                    symbol={state.companyData.symbol}
                    lastSalePrice={state.tradeData.lastSalePrice}
                    lastUpdated={state.tradeData.lastUpdated}
                    volume={state.tradeData.volume}
                    tradeData={state.tradeData}
                />

                <TradeHistoryList tradeData={state.tradeData} maxNum={100} />
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
})

export default CompanyDetailsScreen;