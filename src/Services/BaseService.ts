import type AuthResponse from '../DataTransferObjects/Responses/AuthResponse';
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, clearTokens } from '../Utils/tokenStorage';

export class BaseService {

    protected static serverUrl = import.meta.env.VITE_SERVER_URL;

    private static async refreshToken(): Promise<boolean> {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            return false;
        }

        try {
            const response = await fetch(`${this.serverUrl}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                clearTokens();
                return false;
            }

            const authResponse: AuthResponse = await response.json();
            setAccessToken(authResponse.accessToken);
            setRefreshToken(authResponse.refreshToken);
            return true;
        } catch {
            clearTokens();
            return false;
        }
    }

    protected static async fetchFromServer<T>(endpoint: string, body?: any, method?: string): Promise<T> {
        const fetchMethod = method || (body ? "POST" : "GET");

        const makeRequest = async (token: string | null) => {
            const headers: Record<string, string> = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            return fetch(`${this.serverUrl}${endpoint}`, {
                method: fetchMethod,
                headers,
                body: body ? JSON.stringify(body) : undefined,
                mode: 'cors'
            });
        };

        try {
            let response = await makeRequest(getAccessToken());

            // If unauthorized, try to refresh the token
            if (response.status === 401) {
                const refreshed = await this.refreshToken();
                if (refreshed) {
                    response = await makeRequest(getAccessToken());
                } else {
                    throw new Error('Session expired. Please log in again.');
                }
            }

            if (!response.ok) {
                throw new Error(`Error when making request to ${endpoint}: ${await response.text()}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json() as T;
            } else {
                return {} as T; // Return empty object if no JSON content
            }
        }
        catch (error: any) {
            throw new Error(error.message);
        }
    }
}
