import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './types';
import {useAuth} from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CourseDetailsScreen from '../screens/CourseDetailsScreen';
import {CourseProvider} from '../context/CourseContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const {isAuthenticated} = useAuth();

  if (!isAuthenticated) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{title: 'Login'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <CourseProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{title: 'My Courses'}}
          />
          <Stack.Screen
            name="CourseDetails"
            component={CourseDetailsScreen}
            options={{title: 'Course Details'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CourseProvider>
  );
}