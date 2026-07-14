import type { Equipment, ExerciseCategory, MuscleGroup } from '../schema';

const muscleLabels: Record<MuscleGroup, string> = {
  chest: 'Chest',
  back: 'Back',
  lats: 'Lats',
  traps: 'Traps',
  shoulders: 'Shoulders',
  'rear-delts': 'Rear Delts',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearms: 'Forearms',
  quads: 'Quads',
  hamstrings: 'Hamstrings',
  glutes: 'Glutes',
  calves: 'Calves',
  abs: 'Abs',
  'lower-back': 'Lower Back',
  cardio: 'Cardio',
};

const equipmentLabels: Record<Equipment, string> = {
  barbell: 'Barbell',
  dumbbell: 'Dumbbell',
  cable: 'Cable',
  machine: 'Machine',
  'smith-machine': 'Smith Machine',
  bodyweight: 'Bodyweight',
  'plate-loaded': 'Plate-Loaded',
  other: 'Other',
};

const categoryLabels: Record<ExerciseCategory, string> = {
  compound: 'Compound',
  isolation: 'Isolation',
  cardio: 'Cardio',
};

export function muscleLabel(muscle: MuscleGroup): string {
  return muscleLabels[muscle];
}

export function equipmentLabel(equipment: Equipment): string {
  return equipmentLabels[equipment];
}

export function categoryLabel(category: ExerciseCategory): string {
  return categoryLabels[category];
}

export function titleCase(value: string): string {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
