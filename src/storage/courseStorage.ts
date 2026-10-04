import AsyncStorage from '@react-native-async-storage/async-storage';
import {Course} from '../types/course';

const COURSES_CACHE_KEY = '@learning_dashboard/courses';

export async function saveCourses(courses: Course[]): Promise<void> {
  await AsyncStorage.setItem(COURSES_CACHE_KEY, JSON.stringify(courses));
}

export async function getCachedCourses(): Promise<Course[] | null> {
  const value = await AsyncStorage.getItem(COURSES_CACHE_KEY);
  return value ? (JSON.parse(value) as Course[]) : null;
}

export async function clearCoursesCache(): Promise<void> {
  await AsyncStorage.removeItem(COURSES_CACHE_KEY);
}