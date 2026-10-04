export type Lesson = {
  id: number;
  title: string;
  completed: boolean;
};

export type Course = {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  lessons: number;
  lessonItems: Lesson[];
};