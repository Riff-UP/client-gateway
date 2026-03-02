import { Model } from 'mongoose';
import { UserRef, UserRefDocument } from './schemas/user-ref.schema';
import { UserDto } from '../posts/dto/user.dto';
export declare class UsersService {
    private readonly userRefModel;
    private readonly logger;
    constructor(userRefModel: Model<UserRefDocument>);
    upsert(user: UserDto, token?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, UserRef, {}, import("mongoose").DefaultSchemaOptions> & UserRef & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, UserRef, {}, import("mongoose").DefaultSchemaOptions> & UserRef & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    get(userId: string): Promise<UserRefDocument | null>;
}
