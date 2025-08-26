import React from 'react';
import { View, Text } from 'react-native';

export default function WorkoutCard({ workout }) {
  return (
    <View style={{ padding: 10, margin: 5, borderWidth: 1, borderRadius: 5 }}>
      <Text>{workout.name}</Text>
    </View>
  );
}
