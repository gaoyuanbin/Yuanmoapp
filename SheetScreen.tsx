import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';

const SHEET_ID = '1ldh1NyPGubygANqZMNBu1U4mKuKeV2v53FoWtBAcLCQ';
const API_KEY = 'AIzaSyCFOUW9rwDIbbVc_4u3LpI09c10qdB0_1o';
const RANGE = 'Sheet1!A1:B20'; // Adjust to your sheet

export default function App({ navigation }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`)
      .then(response => response.json())
      .then(json => {
        if (json.values) {
          setData(json.values);
        }
      })
      .catch(error => {
        console.error('Error fetching sheet data:', error);
      });
  }, []);

const speakText = async (text) => {
  if (!text) {
    Alert.alert('Error', 'No text to speak');
    return;
  }

  try {
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text },
          voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
          audioConfig: { audioEncoding: 'MP3' },
        }),
      }
    );

    const result = await response.json();

    if (result.audioContent) {
      const soundObject = new Audio.Sound();
      await soundObject.loadAsync({
        uri: `data:audio/mp3;base64,${result.audioContent}`,
      });
      await soundObject.playAsync();
    } else {
      console.error('Text-to-speech error:', result);
      Alert.alert('Error', 'Failed to generate audio');
    }
  } catch (error) {
    console.error('Error with TTS:', error);
    Alert.alert('Error', 'Text-to-Speech failed');
  }
};


  return (
    <View style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.rowButton}
              onPress={() => speakText(item[0])}
            >
              <View style={styles.row}>
                <Text style={styles.cell}>{item[0]}</Text>
              </View>
            </TouchableOpacity>
          )}
        />


      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
        onPress={speakText}
      >
        <Text style={styles.buttonText}>Speak First Row</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#2196F3' }]}
        onPress={() => navigation.navigate('Second')}
      >
        <Text style={styles.buttonText}>Go to Second Page</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
  },
  rowButton: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  cell: {
    marginRight: 15,
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
