import React, { useState, useEffect } from 'react';
import { Button, Alert, Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import TreeScreen from './screens/TreeScreen';
import {buildTree} from "./treebuilder"

import { DevSettings } from 'react-native';
import { reloadEmitter } from "./reload_emitter"
import { LanguageProvider } from './lang_setting'; // Adjust path as needed

const Stack = createNativeStackNavigator();

import { useLanguage } from './lang_setting'; // adjust path as needed
const SHEET_ID = '1ldh1NyPGubygANqZMNBu1U4mKuKeV2v53FoWtBAcLCQ';
const API_KEY = 'AIzaSyCFOUW9rwDIbbVc_4u3LpI09c10qdB0_1o';
const RANGE = 'Sheet1!A1:C20'; // Adjust to your sheet

function HeaderButtons({ navigation }: { navigation: any }) {
  const { setLanguage } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);

  const selectLanguage = (lang: string) => {
    setLanguage(lang);
    setModalVisible(false);
  };

  return (
    <>
      <Button title="Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Settings" onPress={() => setModalVisible(true)} />
      <Button
        title="Reload"
        onPress={() => {
          reloadEmitter.emit('reload-sheet');
        }}
      />

      {/* Custom Language Selection Modal */}
<Modal
  transparent
  visible={modalVisible}
  animationType="fade"
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.overlay}>
    <View style={styles.modalContent}>
      <Text style={styles.title}>Select Language</Text>
      <TouchableOpacity onPress={() => selectLanguage('English')}>
        <Text style={styles.option}>English</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => selectLanguage('Chinese')}>
        <Text style={styles.option}>Chinese</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setModalVisible(false)}>
        <Text style={styles.cancel}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </>
  );
}


const styles = StyleSheet.create({
  trigger: {
    fontSize: 16,
    color: 'blue',
    padding: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: 250,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold'
  },
  option: {
    fontSize: 16,
    paddingVertical: 10,
    color: '#333'
  },
  cancel: {
    fontSize: 16,
    paddingVertical: 10,
    color: 'red',
    marginTop: 10
  }
});

export default function App() {
  const [treeData, setTreeData] = useState<any | null>(null);
  const [language, setLanguageState] = useState("English");

  useEffect(() => {

   console.log("🧠 useEffect is running");

    const fetchData = () => {
      console.log("📡 Fetching sheet data...");
      fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`)
        .then(response => {
          console.log("✅ HTTP status:", response.status);
          return response.json();
        })
        .then(json => {
          console.log("📄 Raw JSON:", JSON.stringify(json, null, 2));
          if (json.values && Array.isArray(json.values)) {

            const tree = buildTree(json.values);
            console.log("🌲 Built tree:", tree);
            setTreeData(tree);
          } else {
            console.warn("⚠️ No 'values' found in response.");
            setTreeData({}); // Set to empty to avoid infinite spinner
          }
        })
        .catch(error => {
          console.error('❌ Error fetching sheet data:', error);
          setTreeData({}); // Prevent infinite loading
        });
    };


    fetchData();

    const subscription = reloadEmitter.addListener('reload-sheet', fetchData);

    return () => {
      subscription.remove();
    };
  }, []);

  // ✅ This goes in the main render, not inside useEffect
  if (!treeData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <LanguageProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={({ navigation }) => ({
            headerRight: () => <HeaderButtons navigation={navigation} />,
          })}
        >
          <Stack.Screen name="Home">
            {(props) => <HomeScreen {...props} treeData={treeData} />}
          </Stack.Screen>
          <Stack.Screen name="Tree" component={TreeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </LanguageProvider>
  );
}








