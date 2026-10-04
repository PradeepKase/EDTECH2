import React, {createContext, useContext, ReactNode} from 'react';
import {useCourseViewModel, CourseState} from '../viewmodels/courseViewModel';
import {Course} from '../types/course';

type CourseContextValue = {
  state: CourseState;
  loadCourses: () => Promise<void>;
  updateLesson: (courseId: number, lessonId: number, completed: boolean) => Promise<void>;
};

const CourseContext = createContext<CourseContextValue | undefined>(undefined);

export function CourseProvider({children}: {children: ReactNode}) {
  const vm = useCourseViewModel();
  return (
    <CourseContext.Provider value={vm}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse(): CourseContextValue {
  const ctx = useContext(CourseContext);
  if (!ctx) {
    throw new Error('useCourse must be used inside <CourseProvider>');
  }
  return ctx;
}
