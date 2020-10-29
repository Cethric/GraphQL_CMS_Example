import {
    AppMetadata as Auth0AppMetadata,
    ManagementClient as Auth0ManagementClient,
    ManagementClientOptions,
    User as Auth0User,
    UserMetadata as Auth0UserMetadata,
} from 'auth0';
import { IUser } from './interfaces';

interface AppMetadata extends Auth0AppMetadata {

}

interface UserMetadata extends Auth0UserMetadata {

}

type ManagementClient = Auth0ManagementClient<AppMetadata, UserMetadata>;
type User = Auth0User<AppMetadata, UserMetadata>;

export class Auth0ManagementAPI {
    private readonly client: ManagementClient;

    constructor() {
        const config: ManagementClientOptions = {
            domain: process.env.AUTH0_DOMAIN,
            clientId: process.env.AUTH0_CLIENT_ID,
            clientSecret: process.env.AUTH0_CLIENT_SECRET,
            scope: process.env.AUTH0_CLIENT_SCOPE,
        };
        this.client = new Auth0ManagementClient(config);
    }

    async getUsers(name?: string): Promise<IUser[]> {
        const query = name ? `name:${name}` : undefined;
        const users = await this.client.getUsers({ q: query });
        return users.map((user) => ({
            user_id: user.user_id,
            created_at: user.created_at,
            updated_at: user.updated_at,
            email: user.email,
            name: user.name,
            nickname: user.nickname,
            picture: user.picture,
        }));
    }

    async getUser(id: string): Promise<IUser> {
        const user = await this.client.getUser({ id });
        return {
            user_id: user.user_id,
            created_at: user.created_at,
            updated_at: user.updated_at,
            email: user.email,
            name: user.name,
            nickname: user.nickname,
            picture: user.picture,
        };
    }
}