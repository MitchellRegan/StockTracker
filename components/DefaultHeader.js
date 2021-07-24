import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

//Icons
import HamburgerIcon from '../assets/icons/Hamburger_icon.svg';
import StockArrowIcon from '../assets/icons/StockArrow_icon.svg';
//Styles
import Fonts from '../constants/Fonts';
import Colors from '../constants/Colors';

const DefaultHeader = props => {
    return (
        <View style={styles.wrapper}>
            <View style={styles.textView}>
                <View>
                    <Text style={styles.stonkText}>S T O C K</Text>
                    <Text style={styles.subtext}>Tracker</Text>
                </View>
                <StockArrowIcon height={45} width={45} style={styles.arrow}/>
            </View>

            <TouchableOpacity style={styles.menuButton} onPress={() => props.navigation.openDrawer()}>
                <HamburgerIcon height={35} width={35}/>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: Colors.header,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        paddingBottom: 5,
    },

    textView: {
        flexDirection: 'row',
    },

    stonkText: {
        fontFamily: Fonts.serif,
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 23,
        color: '#fff',
    },

    subtext: {
        fontFamily: Fonts.monospace,
        color: '#fff',
        fontSize: 16,
        textAlign: 'left',
        marginTop: -10
    },

    arrow: {
        alignSelf: 'flex-end',
        marginLeft: -15
    },

    menuButton: {
        alignSelf: 'center',
    }
});

export default DefaultHeader;