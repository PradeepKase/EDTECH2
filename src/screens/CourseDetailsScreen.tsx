import React, {useMemo, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import {useCourse} from '../context/CourseContext';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseDetails'>;

export default function CourseDetailsScreen({route}: Props) {
  const {state, updateLesson} = useCourse();
  const [updatingLessonId, setUpdatingLessonId] = useState<number | null>(null);

  const course = useMemo(
    () => state.courses.find(item => item.id === route.params.courseId),
    [state.courses, route.params.courseId],
  );

  if (!course) {
    return (
      <View style={styles.center}>
        <Text>Course data is not available.</Text>
      </View>
    );
  }

  async function toggleLesson(lessonId: number, completed: boolean) {
    try {
      setUpdatingLessonId(lessonId);
      await updateLesson(course.id, lessonId, completed);
    } finally {
      setUpdatingLessonId(null);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.instructor}>Instructor: {course.instructor}</Text>

      <View style={styles.progressHeader}>
        <Text>Current progress</Text>
        <Text style={styles.progress}>{course.progress}%</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, {width: `${course.progress}%`}]} />
      </View>

      <Text style={styles.sectionTitle}>Lessons</Text>

      {course.lessonItems.map(lesson => {
        const updating = updatingLessonId === lesson.id;

        return (
          <TouchableOpacity
            key={lesson.id}
            style={styles.lesson}
            disabled={updating}
            onPress={() => toggleLesson(lesson.id, !lesson.completed)}>
            <View style={styles.lessonText}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text
                style={[
                  styles.status,
                  lesson.completed ? styles.completed : styles.pending,
                ]}>
                {lesson.completed ? 'Completed' : 'Pending'}
              </Text>
            </View>

            {updating ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.check}>
                {lesson.completed ? '✓' : '○'}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#f8fafc'},
  center: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  title: {fontSize: 26, fontWeight: '800'},
  instructor: {color: '#64748b', marginTop: 6},
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  progress: {fontWeight: '800'},
  progressTrack: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {height: '100%', backgroundColor: '#2563eb'},
  sectionTitle: {fontSize: 20, fontWeight: '700', marginTop: 28, marginBottom: 10},
  lesson: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonText: {flex: 1},
  lessonTitle: {fontSize: 16, fontWeight: '600'},
  status: {marginTop: 4, fontSize: 13},
  completed: {color: '#15803d'},
  pending: {color: '#b45309'},
  check: {fontSize: 26, marginLeft: 12},
});