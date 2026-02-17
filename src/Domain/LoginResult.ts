class LoginResult {
    public success: boolean;
    public errorMessage?: string;
    public roles: string[];

    constructor(success: boolean, roles: string[] = []) {
        this.success = success;
        this.roles = roles;
    }

}
export default LoginResult;
