import coursesJson from '../data/courses.json';
import {Course} from '../types/course';

export async function fetchCourses(): Promise<Course[]> {
  // Mock API. Replace this function with fetch/axios when a real endpoint is available.
  await new Promise(resolve => setTimeout(resolve, 800));

  // Uncomment to test API failure:
  // throw new Error('Unable to reach course server');

  return coursesJson as Course[];
}