import type ExerciseInfo from '../DataTransferObjects/Common/ExerciseInfo';
import type CreateExerciseInfoRequest from '../DataTransferObjects/Requests/CreateExerciseInfoRequest';
import type UpdateExerciseInfoRequest from '../DataTransferObjects/Requests/UpdateExerciseInfoRequest';
import type GetExerciseInfosResponse from '../DataTransferObjects/Responses/GetExerciseInfosResponse';
import { BaseService } from './BaseService';

export class ExerciseInfoService extends BaseService {
    public static async getExerciseInfos(): Promise<GetExerciseInfosResponse> {
        return this.fetchFromServer<GetExerciseInfosResponse>('/admin/exerciseInfos');
    }

    public static async createExerciseInfo(request: CreateExerciseInfoRequest): Promise<ExerciseInfo> {
        return this.fetchFromServer<ExerciseInfo>('/admin/exerciseInfos', request);
    }

    public static async updateExerciseInfo(id: string, request: UpdateExerciseInfoRequest): Promise<ExerciseInfo> {
        return this.fetchFromServer<ExerciseInfo>(`/admin/exerciseInfos/${id}`, request, 'PUT');
    }

    public static async deleteExerciseInfo(id: string): Promise<void> {
        await this.fetchFromServer(`/admin/exerciseInfos/${id}`, undefined, 'DELETE');
    }
}
