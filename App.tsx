import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';  // Import the Audio module from expo-av

export default function App() {
  const [sound, setSound] = useState();

  const handlePress = (buttonName: string) => {
    Alert.alert(`${buttonName} Pressed!`, `You clicked the ${buttonName} button.`);
  };

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('./No.m4a') // Replace with your song file or URL
    );
    setSound(sound);
    await sound.playAsync();
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#4CAF50' }]}
          onPress={() => handlePress('Yes')}
        >
          <Text style={styles.buttonText}>Yes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#F44336' }]}
          onPress={() => handlePress('No')}
        >
          <Text style={styles.buttonText}>No</Text>
        </TouchableOpacity>

        {/* Play Song Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#2196F3' }]}
          onPress={playSound}
        >
          <Text style={styles.buttonText}>Play Song</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '80%',
    height: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});





