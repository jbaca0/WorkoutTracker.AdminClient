import type { MuscleGroup } from '../../Enums/MuscleGroup';

export default interface UpdateExerciseInfoRequest {
    name: string;
    primaryMuscleGroup: MuscleGroup;
    secondaryMuscleGroups: MuscleGroup[];
}
