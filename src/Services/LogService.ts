import type GetLogsResponse from '../DataTransferObjects/Responses/GetLogsResponse';
import { BaseService } from './BaseService';

export interface GetLogsParams {
    level?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
    limit?: number;
    offset?: number;
}

export class LogService extends BaseService {
    public static async getLogs(params: GetLogsParams = {}): Promise<GetLogsResponse> {
        const queryParts: string[] = [];
        if (params.level) queryParts.push(`level=${encodeURIComponent(params.level)}`);
        if (params.startDate) queryParts.push(`startDate=${encodeURIComponent(params.startDate)}`);
        if (params.endDate) queryParts.push(`endDate=${encodeURIComponent(params.endDate)}`);
        if (params.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
        if (params.limit !== undefined) queryParts.push(`limit=${params.limit}`);
        if (params.offset !== undefined) queryParts.push(`offset=${params.offset}`);

        const query = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
        return this.fetchFromServer<GetLogsResponse>(`/admin/logs${query}`);
    }

    public static async deleteAllLogs(): Promise<void> {
        await this.fetchFromServer('/admin/logs', undefined, 'DELETE');
    }
}
