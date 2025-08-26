import React, { useEffect, useState } from 'react';
import { View, Text, Button, SafeAreaView } from 'react-native';

export default function App() {
  const [workouts, setWorkouts] = useState([]);

  const fetchWorkouts = async () => {
    try {
      const res = await fetch('http://localhost:8000/workouts/');
      const data = await res.json();
      setWorkouts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>AI Fitness App</Text>
      {workouts.map((w) => (
        <Text key={w.id}>{w.name}</Text>
      ))}
      <Button title="Fetch Workouts" onPress={fetchWorkouts} />
    </SafeAreaView>
  );
}
