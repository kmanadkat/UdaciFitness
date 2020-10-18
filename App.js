import React, { Component } from 'react'
import {View, StatusBar } from 'react-native'
import { Constants } from 'react-native-unimodules'

import {createStore} from 'redux'
import {Provider} from 'react-redux'
import reducer from './reducers'

import AddEntry from './components/AddEntry'
import History from './components/History'
import EntryDetail from './components/EntryDetail'
import { gray, orange, purple, white } from './utils/colors'

import {NavigationContainer} from '@react-navigation/native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';


function UdaciStatusBar({backgroundColor, ...props}){
  return (
    <View style={{backgroundColor, height: Constants.statusBarHeight}}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  )
}

const Tab = createMaterialTopTabNavigator();
function TabNaviagtor(){
  return (
    <Tab.Navigator 
      tabBarOptions={{
        activeTintColor: white, 
        inactiveTintColor: gray,
        style: {backgroundColor: purple},
        tabStyle: {height: 54},
        indicatorStyle: {backgroundColor: orange}
      }}>
      <Tab.Screen name="History" component={History}/>
      <Tab.Screen name="Add Entry" component={AddEntry}/>
    </Tab.Navigator>
  )
}

const Stack = createStackNavigator();
function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={TabNaviagtor} options={{headerShown: false}}/>
      <Stack.Screen name="Entry Detail" component={EntryDetail} options={{headerTintColor: white, headerStyle: {backgroundColor: purple}}}  />
    </Stack.Navigator>
  );
}

export default class App extends Component {
  render() {
    return (
      <Provider store={createStore(reducer)}>
        <View style={{flex: 1}}>
          <UdaciStatusBar backgroundColor={purple} barStyle='light-content' />
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </View>
      </Provider>
    );
  }
}