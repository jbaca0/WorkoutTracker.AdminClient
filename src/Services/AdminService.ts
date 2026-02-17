import type GetUsersResponse from '../DataTransferObjects/Responses/GetUsersResponse';
import type GetRolesResponse from '../DataTransferObjects/Responses/GetRolesResponse';
import type CreateUserRequest from '../DataTransferObjects/Requests/CreateUserRequest';
import type UserSummary from '../DataTransferObjects/Common/UserSummary';
import { BaseService } from './BaseService';

export class AdminService extends BaseService {
    public static async getUsers(): Promise<GetUsersResponse> {
        return this.fetchFromServer<GetUsersResponse>('/admin/users');
    }

    public static async getRoles(): Promise<GetRolesResponse> {
        return this.fetchFromServer<GetRolesResponse>('/admin/roles');
    }

    public static async updateUserRoles(userId: string, roles: string[]): Promise<void> {
        await this.fetchFromServer(`/admin/users/${userId}/roles`, { roles }, 'PUT');
    }

    public static async createUser(request: CreateUserRequest): Promise<UserSummary> {
        return this.fetchFromServer<UserSummary>('/admin/users', request);
    }

    public static async deleteUser(userId: string): Promise<void> {
        await this.fetchFromServer(`/admin/users/${userId}`, undefined, 'DELETE');
    }
}
