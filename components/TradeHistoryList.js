import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';

//Formatting
import Fonts from '../constants/Fonts';
import Colors from '../constants/Colors';
//Libraries
import DateTimeLibrary from '../functions/DateTimeLibrary';
import MoneyLibrary from '../functions/MoneyLibrary';

/**
 * Displays a flatlist of trade data
 * @param {object} props Requires tradeData (JSON object containing an array), maxNum (number)
 */
const TradeHistoryList = props => {
    return(
        <View style={styles.wrapper}>
            {(DateTimeLibrary.IsExchangeOpen()) && <View style={styles.openMarket}>
                <Text style={styles.detailsText}>NYSE Is Open</Text>
            </View>}

            {(!DateTimeLibrary.IsExchangeOpen()) && <View style={styles.closedMarket}>
                <Text style={styles.detailsText}>NYSE Is Closed</Text>
            </View>}

            {(props.tradeData.trades != undefined) && <FlatList
                style={styles.dataFlatlist}
                contentContainerStyle={{ flexGrow: 1 }}
                horizontal={false}
                keyExtractor={(itemData, index) => ("" + index)}
                data={props.tradeData.trades.slice(0, props.maxNum)}
                renderItem={itemData => {
                    //Alternating the styles so every-other line is white. Makes it easier to read
                    var lineStyle = styles.dataRowOdd;
                    if (itemData.index % 2 == 0) {
                        lineStyle = styles.dataRowEven;
                    }

                    //Formatting the number of stocks sold in the last trade
                    var sizeString = '';
                    if (itemData.item.size < 10) {
                        sizeString = itemData.item.size + '   ';
                    }
                    else if (itemData.item.size < 100) {
                        sizeString = itemData.item.size + '  ';
                    }
                    else if (itemData.item.size < 1000) {
                        sizeString = itemData.item.size + ' ';
                    }
                    else if (itemData.item.size < 10000) {
                        sizeString = '' + (itemData.item.size / 1000) + 'k';
                    }
                    else if (itemData.item.size < 100000) {
                        sizeString = '' + (itemData.item.size / 10000) + 'k';
                    }
                    else {
                        sizeString = '>100K'
                    }

                    //Checking to see if there are previous trades to compare prices
                    var isLast = true;
                    if (itemData.index + 1 < props.tradeData.trades.length) {
                        isLast = false;
                    }

                    //If there are previous prices to compare to, we can find the difference in prices
                    var priceDiff = 0;
                    var diffString = '+$0.00';
                    var percentDiff = 0;
                    var percentString = '0.00%';

                    if (!isLast) {
                        //Finding the rise/fall in stock price and how much of a percentage that rise/fall was
                        priceDiff = itemData.item.price - props.tradeData.trades[itemData.index + 1].price;
                        percentDiff = 1 - (itemData.item.price / props.tradeData.trades[itemData.index + 1].price);
                        percentDiff *= -100;

                        percentString = '' + MoneyLibrary.ConvertMoneyToString(percentDiff) + '%';

                        if (priceDiff < 0) {
                            diffString = '-$' + MoneyLibrary.ConvertMoneyToString(priceDiff * -1);
                            percentString = '' + MoneyLibrary.ConvertMoneyToString(percentDiff) + '%';
                        }
                        else {
                            diffString = '+$' + MoneyLibrary.ConvertMoneyToString(priceDiff);
                        }
                    }

                    return (
                        <View style={lineStyle}>
                            <Text style={styles.detailsText}>${MoneyLibrary.ConvertMoneyToString(itemData.item.price)}</Text>

                            <Text style={styles.detailsText}>x{sizeString}</Text>

                            {(!isLast && priceDiff < 0) && <View style={styles.priceChangeRow}>
                                <Text style={styles.priceDropText}>{diffString} </Text>
                                <Text style={styles.priceDropText}>({percentString})</Text>
                            </View>}

                            {(!isLast && (priceDiff > 0)) && <View style={styles.priceChangeRow}>
                                <Text style={styles.priceRiseText}>{diffString} </Text>
                                <Text style={styles.priceRiseText}>(+{percentString})</Text>
                            </View>}

                            {(isLast || priceDiff == 0) && <View style={styles.priceChangeRow}>
                                <Text style={styles.detailsText}>{diffString} </Text>
                                <Text style={styles.detailsText}>(+{percentString})</Text>
                            </View>}

                            <Text style={styles.detailsText}>{DateTimeLibrary.ConvertEpochToCondensedUtc(itemData.item.timestamp)}</Text>
                        </View>
                    );
                }}
            />}
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        maxHeight: 250,
        borderTopColor: '#000',
        borderTopWidth: 2
    },

    openMarket: {
        width: '100%',
        backgroundColor: Colors.greenText,
        alignItems: 'center',
        padding: 2
    },

    closedMarket: {
        width: '100%',
        backgroundColor: Colors.redText,
        alignItems: 'center',
        padding: 3
    },

    dataFlatlist: {
        borderColor: '#000',
        borderWidth: 1,
        paddingBottom: 10,
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
        color: Colors.redText
    },

    priceRiseText: {
        fontFamily: Fonts.monospace,
        fontSize: 10,
        color: Colors.greenText
    }
})

export default TradeHistoryList;