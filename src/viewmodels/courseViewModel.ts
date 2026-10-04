import {useCallback, useState} from 'react';
import {courseRepository} from '../repositories/courseRepository';
import {Course} from '../types/course';

export type CourseState =
  | {status: 'idle'; courses: Course[]}
  | {status: 'loading'; courses: Course[]}
  | {status: 'success'; courses: Course[]; fromCache: boolean}
  | {status: 'empty'; courses: Course[]}
  | {status: 'error'; courses: Course[]; message: string};

export function useCourseViewModel() {
  const [state, setState] = useState<CourseState>({
    status: 'idle',
    courses: [],
  });

  const loadCourses = useCallback(async () => {
    setState(previous => ({
      status: 'loading',
      courses: previous.courses,
    }));

    try {
      const result = await courseRepository.getCourses();

      if (result.courses.length === 0) {
        setState({status: 'empty', courses: []});
        return;
      }

      setState({
        status: 'success',
        courses: result.courses,
        fromCache: result.fromCache,
      });
    } catch {
      setState({
        status: 'error',
        courses: [],
        message: 'Unable to load courses. Please try again.',
      });
    }
  }, []);

  const updateLesson = useCallback(
    async (courseId: number, lessonId: number, completed: boolean) => {
      const currentCourse = state.courses.find(course => course.id === courseId);
      if (!currentCourse) {
        return;
      }

      const updatedCourse = await courseRepository.updateLesson(
        currentCourse,
        lessonId,
        completed,
      );

      setState(previous => ({
        ...previous,
        courses: previous.courses.map(course =>
          course.id === updatedCourse.id ? updatedCourse : course,
        ),
      }));
    },
    [state.courses],
  );

  return {state, loadCourses, updateLesson};
}