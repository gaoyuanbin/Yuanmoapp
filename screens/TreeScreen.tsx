import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
const API_KEY = 'AIzaSyCFOUW9rwDIbbVc_4u3LpI09c10qdB0_1o';
import { useLanguage } from '../lang_setting'; // Adjust path if needed

type TreeNode = {
  [key: string]: TreeNode | { _isLeaf: true };
};

interface TreeScreenProps {
  route: {
    params: {
      node: TreeNode;
      path?: string[];
    };
  };
  navigation: any;
}

export default function TreeScreen({ route, navigation }: TreeScreenProps) {
  const { node, path = [] } = route.params;
    const { language } = useLanguage();


const entries = Object.entries(node).filter(
  ([key, val]) => typeof val === 'object' && !['_isLeaf', 'english', 'chinese'].includes(key)
);

  if (entries.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No items to display</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {entries.map(([key, value]) => {
        const isLeaf = value._isLeaf === true;

        return (
          <View key={key} style={styles.buttonContainer}>
        <Button
          title={key}
          onPress={async () => {
            if (isLeaf) {
              const textToSpeak = value[language.toLowerCase()] || key;
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

                const data = await response.json();

                if (data.audioContent) {
                  const sound = new Audio.Sound();
                  await sound.loadAsync({ uri: `data:audio/mp3;base64,${data.audioContent}` });
                  await sound.playAsync();

                  sound.setOnPlaybackStatusUpdate((status) => {
                    if (status.isLoaded && status.didJustFinish) {
                      sound.unloadAsync();
                    }
                  });
                } else {
                  console.error('TTS: No audioContent in response', data);
                }
              } catch (error) {
                console.error('TTS Error:', error);
              }
            } else {
              navigation.push('Tree', {
                node: value,
                path: [...path, key],
                language,
              });
            }
          }}
        />


          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginVertical: 8,
    width: '80%',
  },
  text: {
    fontSize: 16,
  },
});
