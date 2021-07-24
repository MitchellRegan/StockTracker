import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerView, DrawerItem } from '@react-navigation/drawer';

//Screen components
import TestScreen from './screens/TestScreen';
import SavedCompanies from './screens/SavedCompaniesScreen';
import CompanyDetails from './screens/CompanyDetailsScreen';

//Setting up the drawer menu that swipes out from the side
const Drawer = createDrawerNavigator();

export default function App() {
  return (
      <View style={styles.container}>
          <NavigationContainer>
              <Drawer.Navigator drawerPosition={'right'}>
                  <Drawer.Screen name="Home" component={SavedCompanies} />
                  <Drawer.Screen name="Search" component={TestScreen} />
                  <Drawer.Screen name="Details" component={CompanyDetails} />
              </Drawer.Navigator>
          </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 30
    },
});
