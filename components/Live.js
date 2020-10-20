import React, { Component } from 'react'
import { ActivityIndicator, Text, View, StyleSheet, Animated } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Foundation } from '@expo/vector-icons'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { purple, white } from '../utils/colors';
import { calculateDirection } from '../utils/helpers';

class Live extends Component {
  state = {
    coords: null,
    status: null,
    direction: '',
    bounceValue: new Animated.Value(1)
  }
  componentDidMount() {
    Permissions.getAsync(Permissions.LOCATION)
      .then(({status}) => {
        if(status === 'granted') {
          return this.setLocation();
        }
        this.setState({status});
      })
      .catch((err)=> {
        console.warn("Error getting location permission", err);
        this.setState({status: 'undetermined'})
      });
  }
  askPermission = () => {
    Permissions.askAsync(Permissions.LOCATION)
      .then(({status}) => {
        if(status === 'granted') {
          return this.setLocation();
        }
        this.setState({status});
      })
      .catch((err)=> {
        console.warn("Error asking location permission", err);
        this.setState({status: 'undetermined'})
      });
  }
  setLocation = () => {
    Location.watchPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 100,
      distanceInterval: 1
    }, ({coords}) => {
      const newDirection = calculateDirection(coords.heading)
      const {direction, bounceValue} = this.state;
      if(newDirection !== direction){
        Animated.sequence([
          Animated.timing(bounceValue, {duration: 200, toValue: 1.04, useNativeDriver: true}),
          Animated.spring(bounceValue, {toValue: 1, friction: 4, useNativeDriver: true})
        ]).start()
      }
      this.setState(() => ({
        coords,
        status: 'granted',
        direction: newDirection
      }))
    })
  }
  render() {
    const {coords, status, direction, bounceValue} = this.state;
    if(status === null){
      return (
        <View style={{flex: 1,alignItems: "center", justifyContent: "center"}}>
          <ActivityIndicator color={purple} size='large' />
        </View>
      )
    }
    if(status === 'denied') {
      return (
        <View style={styles.center}>
          <Foundation name='alert' size={50} />
          <Text style={{textAlign: "center"}}>You denied your location. You can fix this by visiting your settings and enabling location services for this app.</Text>
        </View>
      );
    }
    if(status === 'undetermined') {
      return (  
        <View style={styles.center}>
          <Foundation name='alert' size={50} />
          <Text>You need to enable location services for this app.</Text>
          <TouchableOpacity style={styles.button} onPress={this.askPermission}>
            <Text style={styles.buttonText}>Enable</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.directionContainer}>
          <Text style={styles.header}>You're heading</Text>
          <Animated.Text style={[styles.direction, {transform: [{scale: bounceValue}]}]}>{direction}</Animated.Text>
        </View>
        <View style={styles.metricContainer}>
          <View style={styles.metric}>
            <Text style={[styles.header, {color: white}]}>
              Altitude
            </Text>
            <Text style={[styles.subHeader, {color: white}]}>
              {Math.round(coords.altitude * 3.2808)} feet
            </Text>
          </View>
          <View style={styles.metric}>
            <Text style={[styles.header, {color: white}]}>
              Speed
            </Text>
            <Text style={[styles.subHeader, {color: white}]}>
              {(coords.speed * 2.2369).toFixed(1)} MPH
            </Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
  },
  button: {
    padding: 10,
    backgroundColor: purple,
    alignSelf: 'center',
    borderRadius: 5,
    margin: 20,
  },
  buttonText :{
    color: white,
    fontSize: 20,
  },
  directionContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 35,
    textAlign: 'center',
  },
  direction: {
    color: purple,
    fontSize: 120,
    textAlign: 'center',
  },
  metricContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: purple,
  },
  metric: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  subHeader: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 5,
  },
}) 

export default Live
