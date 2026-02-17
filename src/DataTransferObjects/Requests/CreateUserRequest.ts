export default interface CreateUserRequest {
    email: string;
    password: string;
    roles?: string[];
}
