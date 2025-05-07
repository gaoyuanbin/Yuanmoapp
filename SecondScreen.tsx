import React, { useState, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';


export default function HomeScreen({ navigation }: any) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const playSound = async (source: any) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(source);
      setSound(newSound);
      await newSound.playAsync();
    } catch (error: any) {
      console.error('Error playing sound:', error.message || error);
    }
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#191970' }]}
        onPress={() => playSound(require('./assets/one.m4a'))}
      >
        <Text style={styles.buttonText}>One</Text>
      </TouchableOpacity>

      <TouchableOpacity
          style={[styles.button, { backgroundColor: '#000080' }]}
          onPress={() => playSound(require('./assets/two.m4a'))}
        >
        <Text style={styles.buttonText}>Two</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#00008B' }]}
        onPress={() => playSound(require('./assets/three.m4a'))}
      >
      <Text style={styles.buttonText}>Three</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#4169E1' }]}
        onPress={() => playSound(require('./assets/four.m4a'))}
      >
      <Text style={styles.buttonText}>Four</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#6495ED' }]}
        onPress={() => playSound(require('./assets/five.m4a'))}
      >
      <Text style={styles.buttonText}>Five</Text>
      </TouchableOpacity>
      <TouchableOpacity
      style={[styles.button, { backgroundColor: '#ADD8E6' }]}
      onPress={() => playSound(require('./assets/six.m4a'))}
      >
      <Text style={styles.buttonText}>Six</Text>
      </TouchableOpacity>
      <TouchableOpacity
      style={[styles.button, { backgroundColor: '#B0E0E6' }]}
      onPress={() => playSound(require('./assets/seven.m4a'))}
      >
      <Text style={styles.buttonText}>Seven</Text>
      </TouchableOpacity>
      <TouchableOpacity
      style={[styles.button, { backgroundColor: '#89CFF0' }]}
      onPress={() => playSound(require('./assets/eight.m4a'))}
      >
      <Text style={styles.buttonText}>Eight</Text>
      </TouchableOpacity>
      <TouchableOpacity
      style={[styles.button, { backgroundColor: '#87CEEB' }]}
      onPress={() => playSound(require('./assets/nine.m4a'))}
      >
      <Text style={styles.buttonText}>Nine</Text>
      </TouchableOpacity>
      <TouchableOpacity
      style={[styles.button, { backgroundColor: '#AEC6CF' }]}
      onPress={() => playSound(require('./assets/ten.m4a'))}
      >
      <Text style={styles.buttonText}>Ten</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#2196F3' }]}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Go to First Page</Text>
      </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#2196F3' }]}
          onPress={() => navigation.navigate('Sheet')}
        >
          <Text style={styles.buttonText}>Go to Sheet Page</Text>
        </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 50,
    alignItems: 'center',
  },
  button: {
    width: '80%',
    paddingVertical: 20,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
  },
});