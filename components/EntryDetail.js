import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { connect } from 'react-redux';
import { addEntry } from '../actions';
import { removeEntry } from '../utils/api';
import { white } from '../utils/colors';
import { getDailyReminderValue, timeToString } from '../utils/helpers';
import MetricCard from './MetricCard';
import TextButton from './TextButton';

class EntryDetail extends Component {

  reset = () => {
    const { remove, goBack, entryId } = this.props
    remove()
    goBack()
    removeEntry(entryId)
  }

  shouldComponentUpdate (nextProps) {
    return nextProps.metrics !== null && !nextProps.metrics.today
  }

  render() {
    const { metrics } = this.props;
    return (
      <View style={styles.container}>
        <MetricCard metrics={metrics} />
        <TextButton onPress={this.reset} style={{margin: 20}}>Reset</TextButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
    padding: 15
  }
});

function mapStateToProps(entries, { route }) {
  const { entryId } = route.params;
  return {
    metrics: entries[entryId],
    entryId
  };
}

function mapDispatchToProps(dispatch, {route, navigation}) {
  const {entryId} = route.params;
  return {
    remove: () => dispatch(addEntry({
      [entryId]: timeToString() === entryId
        ? getDailyReminderValue()
        : null
    })),
    goBack: () => navigation.goBack()
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryDetail);
