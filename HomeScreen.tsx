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
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
        onPress={() => playSound(require('./assets/Yes.mp3'))}
      >
        <Text style={styles.buttonText}>Play Yes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#F44336' }]}
        onPress={() => playSound(require('./assets/No.mp3'))}
      >
        <Text style={styles.buttonText}>Play No</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#2196F3' }]}
        onPress={() => navigation.navigate('Second')}
      >
        <Text style={styles.buttonText}>Go to Second Page</Text>
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
