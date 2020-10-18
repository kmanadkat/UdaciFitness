import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet, Platform} from 'react-native'
import {FontAwesome} from '@expo/vector-icons'
import { gray, purple, white } from '../utils/colors'

export default function UdaciStepper({max, unit, step, value, onIncrement, onDecrement}) {
  return (
    <View style={[styles.row, {justifyContent: "space-between"}]}>
      <View style={{flexDirection: "row"}}>
        <TouchableOpacity 
          onPress={onDecrement}
          style={Platform.OS === 'ios' 
            ? [styles.iosBtn, {borderTopRightRadius: 0, borderBottomRightRadius: 0}]
            : [styles.androidBtn] }>
          <FontAwesome name="minus" size={30} color={Platform.OS === 'ios' ? purple : white} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={onIncrement}
          style={Platform.OS === 'ios' 
            ? [styles.iosBtn, {borderTopLeftRadius: 0, borderBottomLeftRadius: 0}]
            : [styles.androidBtn] }>
          <FontAwesome name="plus" size={30} color={Platform.OS === 'ios' ? purple : white} />
        </TouchableOpacity>
      </View>
      <View style={styles.metricCounter}>
        <Text style={{fontSize: 24, textAlign: "center"}}>{value}</Text>
        <Text style={{fontSize: 18, color: gray}}>{unit}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: "center"
  },
  iosBtn: {
    backgroundColor: white,
    borderColor: purple,
    borderWidth: 1,
    borderRadius: 3,
    padding: 5,
    paddingLeft: 25,
    paddingRight: 25
  },
  androidBtn: {
    margin: 5,
    backgroundColor: purple,
    padding: 10,
    borderRadius: 2,
  },
  metricCounter:{
    width: 85,
    justifyContent: "center",
    alignItems: "center"
  }
})