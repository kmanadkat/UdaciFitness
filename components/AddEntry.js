import React, {Component} from 'react'
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native'
import {getDailyReminderValue, getMetricMetaInfo, timeToString, clearLocalNotifications, setLocalNotifications} from '../utils/helpers'
import DateHeader from './DateHeader'
import UdaciSlider from './UdaciSlider'
import UdaciStepper from './UdaciStepper'
import { Ionicons } from '@expo/vector-icons'
import TextButton from './TextButton'
import {submitEntry, removeEntry} from '../utils/api'
import { connect } from 'react-redux'
import { addEntry } from '../actions'
import { purple, white } from '../utils/colors'


function SubmitBtn({onPress}) {
  return (
    <TouchableOpacity style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn} onPress={onPress}>
      <Text style={styles.submitBtnText}>SUBMIT</Text>
    </TouchableOpacity>
  );
}

class AddEntry extends Component {
  state = {
    run: 0,
    bike: 10,
    swim: 0,
    sleep: 0,
    eat: 5,
  }

  increment = (metric) => {
    const {max, step} = getMetricMetaInfo(metric);
    this.setState((currentState)=>{
      const count = currentState[metric] + step;
      return {
        ...currentState,
        [metric] : count > max ? max : count
      };
    })
  }

  decrement = (metric) => {
    const {step} = getMetricMetaInfo(metric);
    this.setState((currentState)=>{
      const count = currentState[metric] - step;
      return {
        ...currentState,
        [metric] : count < 0 ? 0 : count
      };
    })
  }

  slide = (metric, value) => {
    this.setState({[metric]: value})
  }

  submit = () => {
    const key = timeToString();
    const entry = this.state;

    this.props.dispatch(addEntry({
      [key]: entry
    }))

    this.setState(() => ({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0,
    }))
    this.props.navigation.goBack();
    submitEntry({key, entry})
    clearLocalNotifications()
      .then(setLocalNotifications)
  }

  reset = () => {
    const key = timeToString();
    this.props.dispatch(addEntry({
      [key]: getDailyReminderValue()
    }))
    this.props.navigation.goBack();
    removeEntry(key)
  }
  
  render() {
    const metaInfo = getMetricMetaInfo();
    if(this.props.alreadyLogged){
      return (
        <View style={styles.center}>
          <Ionicons name={Platform.OS==='ios' ? 'ios-happy' : 'md-happy'} size={100} color="black" />
          <Text style={{padding: 10}}>You already logged your information button for today.</Text>
          <TextButton onPress={this.reset}>Reset</TextButton>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <DateHeader date={new Date().toLocaleDateString()} />
        {Object.keys(metaInfo).map((key) => {
          const {getIcon, type, ...rest} = metaInfo[key];
          const value = this.state[key];
          return (
            <View key={key} style={styles.row}>
              {getIcon()}
              {type === 'slider'
              ? <UdaciSlider value={value} onChange={(value) => this.slide(key, value)} {...rest} />
              : <UdaciStepper value={value} onIncrement={() => this.increment(key)} onDecrement={() => this.decrement(key)} {...rest} />}
            </View>
          )
        })}
        <SubmitBtn onPress={this.submit} />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container:{
    flex: 1,
    padding: 20, 
    backgroundColor: white
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: "center"
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginRight: 40,
    marginLeft: 40
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: "center"
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginRight: 30,
    marginLeft: 30,
  }
})


function mapStateToProps(state){
  const key = timeToString()

  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined'
  }
}

export default connect(mapStateToProps)(AddEntry)