import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Course} from '../types/course';

type Props = {
  course: Course;
  onContinue: () => void;
};

export default function CourseCard({course, onContinue}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{course.title}</Text>
      <Text style={styles.instructor}>Instructor: {course.instructor}</Text>

      <View style={styles.row}>
        <Text>Progress</Text>
        <Text style={styles.progressText}>{course.progress}%</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, {width: `${course.progress}%`}]} />
      </View>

      <Text style={styles.lessons}>{course.lessons} lessons</Text>

      <TouchableOpacity style={styles.button} onPress={onContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: {fontSize: 18, fontWeight: '700', marginBottom: 6},
  instructor: {color: '#6b7280', marginBottom: 14},
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  progressText: {fontWeight: '700'},
  progressTrack: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
  },
  lessons: {marginTop: 8, color: '#6b7280'},
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 14,
  },
  buttonText: {color: '#fff', fontWeight: '700'},
});