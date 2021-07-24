import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';

//Formatting
import Fonts from '../constants/Fonts';
import Colors from '../constants/Colors';
//Icons
import RefreshIcon from '../assets/icons/Refresh_icon.svg';
//Components
import DefaultHeader from '../components/DefaultHeader';
import CompanyButton from '../components/CompanyButton';
//Libraries
import AsyncStorageLibrary from '../functions/AsyncStorageLibrary';

const SavedCompaniesScreen = props => {
    const [state, updateNewState] = useState(
        {
            savedCompanies: [],
            dataRetrieved: false
        }
    );


    /**
     * Finding the companies saved in AsyncStorage
     * @param {boolean} override_ If true, it forces a re-render of the saved companies to display any changes
     * */
    function GetSavedCompanies(override_ = false) {
        //If the data has already been retrieved from AsyncStorage, we prevent it from happening again and causing a loop
        if (!override_ && state.dataRetrieved) {
            return;
        }

        AsyncStorageLibrary.RetrieveCompanies()
            .then((data) => {
                //If there are any saved companies, we store the data in our state
                if (data != null) {
                    updateNewState({
                        savedCompanies: data.savedCompanies,
                        dataRetrieved: true
                    });
                }
            })
            .catch((error) => {
                console.log("SavedCompaniesScreen.GetSavedCompanies ERROR");
            })
    }


    /**
     * Updates the number of 
     * */
    function Refresh() {
        GetSavedCompanies(true);
    }


    GetSavedCompanies();

    return (
        <View style={styles.wrapper}>
            <DefaultHeader navigation={props.navigation} />

            <Text style={styles.titleText}>Favorites</Text>

            {(state.savedCompanies.length == 0) && <View style={styles.noCompaniesView}>
                <Text style={styles.noCompaniesText}>No saved companies</Text>

                <CompanyButton
                    navigation={props.navigation}
                    companyName={"Test Name"}
                    symbol={"TST"}
                    latestPrice={1337}
                    previousPrice={42069}
                    lastUpdated={1234567890}
                />
            </View>}

            {(state.savedCompanies.length > 0) && <FlatList
                style={styles.flatlist}
                horizontal={false}
                keyExtractor={(itemData, index) => ("" + index)}
                data={state.savedCompanies}
                renderItem={itemData => {
                    return (
                        < CompanyButton
                            navigation = { props.navigation }
                            companyName = { itemData.item.name }
                            symbol = { itemData.item.symbol }
                            latestPrice={itemData.item.latestPrice}
                            previousPrice={itemData.item.previousPrice}
                            lastUpdated = { itemData.item.lastUpdated }
                        />
                    );
                }}
            />}

            <TouchableOpacity onPress={() => Refresh()} style={styles.refreshButton}>
                <RefreshIcon height={35} width={35}/>
            </TouchableOpacity>
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

    refreshButton: {
        padding: 5,
        margin: 5,
        alignItems: 'flex-end',
    },

    refreshText: {

    },

    noCompaniesView: {

    },

    noCompaniesText: {

    },

    flatlist: {

    }
})

export default SavedCompaniesScreen;