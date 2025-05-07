import React from 'react';
import { Button, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import SecondScreen from './SecondScreen';
import SheetScreen from './SheetScreen';
import { DevSettings } from 'react-native';

const Stack = createNativeStackNavigator();

function HeaderButtons({ navigation }: { navigation: any }) {
  return (
    <>
      <Button title="Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Settings" onPress={() => Alert.alert('Settings clicked')} />
      <Button
        title="Reload"
        onPress={() => {
          if (__DEV__) {
            DevSettings.reload();
          } else {
            Alert.alert('Reload only available in production mode.');
          }
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={({ navigation }) => ({
          headerRight: () => <HeaderButtons navigation={navigation} />,
        })}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Second" component={SecondScreen} />
        <Stack.Screen name="Sheet" component={SheetScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}






