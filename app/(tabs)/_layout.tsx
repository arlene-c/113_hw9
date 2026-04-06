import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#d63384',
        tabBarInactiveTintColor: '#8f5e7c',
        tabBarStyle: styles.tabBar,
      }}>
      <Tabs.Screen
        name="dictionary"
        options={{
          title: 'Dictionary',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="photo-library" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add sign',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="add-circle-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff4f8',
    borderTopColor: '#f6c4db',
  },
});
