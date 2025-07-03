import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { reloadEmitter } from './reload_emitter';
import { useLanguage } from './lang_setting'; // Adjust path if needed
import { buildTree } from './treebuilder'; // adjust path if needed


const SHEET_ID = '1ldh1NyPGubygANqZMNBu1U4mKuKeV2v53FoWtBAcLCQ';
const API_KEY = 'AIzaSyCFOUW9rwDIbbVc_4u3LpI09c10qdB0_1o';
const RANGE = 'Sheet1!A1:C20'; // Adjust to your sheet

export default function SheetScreen({ navigation }) {
  const [data, setData] = useState([]);
  const { language } = useLanguage();
const handleReload = () => {
  console.log('Reload logic triggered in SheetScreen');

  fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`)
    .then(response => response.json())
    .then(json => {
      if (json.values) {
        console.log("✅ Sheet rows:", json.values); // 🧪 Add this for debugging
        const tree = buildTree(json.values); // ✅ Pass raw rows to buildTree
        setData(tree);
      }
    })
    .catch(error => {
      console.error('Error fetching sheet data:', error);
    });
};


  useEffect(() => {
    reloadEmitter.addListener('reload-sheet', handleReload);

    return () => {
      reloadEmitter.removeListener('reload-sheet', handleReload);
    };
  }, []);

  useEffect(() => {
    handleReload();
  }, []);

const speakText = async (textToSpeak: string) => {
  if (!textToSpeak) {
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
          input: { text: textToSpeak },
          voice: {
            languageCode: language === 'Chinese' ? 'cmn-CN' : 'en-US',
            ssmlGender: 'NEUTRAL',
          },
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
      Alert.alert('Error', 'Failed to generate audio');
    }
  } catch (error) {
    console.error('TTS error:', error);
    Alert.alert('Error', 'Text-to-Speech failed');
  }
};




  return (
<View style={styles.container}>
  {Object.entries(data).map(([key, value]) => {
    const isLeaf = value._isLeaf === true && Object.keys(value).length === 1;

    return (
      <TouchableOpacity
        key={key}
        style={styles.rowButton}
        onPress={() => {
          const isLeaf = value._isLeaf === true && typeof value === 'object';

          if (isLeaf) {
            const textToSpeak = language === 'Chinese' ? value.chinese : value.english;
            speakText(textToSpeak);
          } else {
            navigation.navigate('Tree', {
              node: value,
              path: [key],
              language,
            });
          }
        }}

      >
        <Text style={styles.cell}>{key}</Text>
      </TouchableOpacity>
    );
  })}
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
