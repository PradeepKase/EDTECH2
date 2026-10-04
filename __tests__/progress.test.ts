import {calculateProgress} from '../src/utils/progress';

describe('calculateProgress', () => {
  it('calculates percentage from completed lessons', () => {
    const lessons = [
      {id: 1, title: 'A', completed: true},
      {id: 2, title: 'B', completed: true},
      {id: 3, title: 'C', completed: false},
      {id: 4, title: 'D', completed: false},
    ];

    expect(calculateProgress(lessons)).toBe(50);
  });
});