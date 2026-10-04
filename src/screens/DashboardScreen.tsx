import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {useCourse} from '../context/CourseContext';
import CourseCard from '../components/CourseCard';
import {useNetworkStatus} from '../hooks/useNetworkStatus';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen({navigation}: Props) {
  const {state, loadCourses} = useCourse();
  const isOnline = useNetworkStatus();

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const loading = state.status === 'loading';

  const offlineBanner = !isOnline ? (
    <View style={styles.offlineBanner}>
      <Text style={styles.offlineText}>🔴 You are Offline</Text>
    </View>
  ) : null;

  if (state.status === 'loading' && state.courses.length === 0) {
    return (
      <View style={styles.flex}>
        {offlineBanner}
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.muted}>Loading courses...</Text>
        </View>
      </View>
    );
  }

  if (state.status === 'error') {
    return (
      <View style={styles.flex}>
        {offlineBanner}
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.muted}>{state.message}</Text>
          <TouchableOpacity style={styles.button} onPress={loadCourses}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (state.status === 'empty') {
    return (
      <View style={styles.flex}>
        {offlineBanner}
        <View style={styles.center}>
          <Text style={styles.errorTitle}>No courses found</Text>
          <TouchableOpacity style={styles.button} onPress={loadCourses}>
            <Text style={styles.buttonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      {offlineBanner}
      <FlatList
        contentContainerStyle={styles.list}
        data={state.courses}
        keyExtractor={item => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadCourses} />
        }
        renderItem={({item}) => (
          <CourseCard
            course={item}
            onContinue={() =>
              navigation.navigate('CourseDetails', {courseId: item.id})
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1, backgroundColor: '#f8fafc'},
  list: {padding: 16, flexGrow: 1},
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  muted: {color: '#64748b', marginTop: 8, textAlign: 'center'},
  errorTitle: {fontSize: 20, fontWeight: '700'},
  button: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 18,
  },
  buttonText: {color: '#fff', fontWeight: '700'},
  offlineBanner: {
    backgroundColor: '#dc2626',
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.3,
  },
});