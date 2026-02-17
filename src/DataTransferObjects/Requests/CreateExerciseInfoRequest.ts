import type { MuscleGroup } from '../../Enums/MuscleGroup';

export default interface CreateExerciseInfoRequest {
    name: string;
    primaryMuscleGroup: MuscleGroup;
    secondaryMuscleGroups: MuscleGroup[];
}
