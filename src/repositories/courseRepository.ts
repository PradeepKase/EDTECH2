import { fetchCourses } from '../api/courseApi';
import { getCachedCourses, saveCourses } from '../storage/courseStorage';
import { Course, Lesson } from '../types/course';
import { calculateProgress } from '../utils/progress';

export type CourseResult = {
  courses: Course[];
  fromCache: boolean;
};

export class CourseRepository {
  async getCourses(): Promise<CourseResult> {
    try {
      const remoteCourses = await fetchCourses();
      const cachedCourses = await getCachedCourses();

      let finalCourses = remoteCourses;

      if (cachedCourses && cachedCourses.length > 0) {
        finalCourses = remoteCourses.map(remoteCourse => {
          const cachedCourse = cachedCourses.find(
            c => c.id === remoteCourse.id,
          );
          if (!cachedCourse) {
            return remoteCourse;
          }

          const lessonItems: Lesson[] = remoteCourse.lessonItems.map(
            remoteLesson => {
              const cachedLesson = cachedCourse.lessonItems?.find(
                l => l.id === remoteLesson.id,
              );
              return cachedLesson
                ? { ...remoteLesson, completed: cachedLesson.completed }
                : remoteLesson;
            },
          );

          return {
            ...remoteCourse,
            lessonItems,
            progress: calculateProgress(lessonItems),
          };
        });
      }

      if (finalCourses.length > 0) {
        await saveCourses(finalCourses);
      }

      return { courses: finalCourses, fromCache: false };
    } catch (error) {
      const cached = await getCachedCourses();

      if (cached && cached.length > 0) {
        return { courses: cached, fromCache: true };
      }

      throw error;
    }
  }

  async getCachedCourses(): Promise<Course[] | null> {
    return getCachedCourses();
  }

  async updateLesson(
    course: Course,
    lessonId: number,
    completed: boolean,
  ): Promise<Course> {
    const lessonItems: Lesson[] = course.lessonItems.map(lesson =>
      lesson.id === lessonId ? { ...lesson, completed } : lesson,
    );

    const updatedCourse: Course = {
      ...course,
      lessonItems,
      progress: calculateProgress(lessonItems),
    };

    const cached = await getCachedCourses();
    if (cached) {
      const updatedCourses = cached.map(item =>
        item.id === updatedCourse.id ? updatedCourse : item,
      );
      await saveCourses(updatedCourses);
    }

    return updatedCourse;
  }
}

export const courseRepository = new CourseRepository();