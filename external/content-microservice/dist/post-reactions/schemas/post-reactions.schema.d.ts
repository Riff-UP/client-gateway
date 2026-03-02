import { HydratedDocument } from 'mongoose';
export type PostReactionDocument = HydratedDocument<PostReaction>;
export declare class PostReaction {
    sql_user_id: string;
    post_id: string;
    type: string;
}
export declare const PostReactionSchema: import("mongoose").Schema<PostReaction, import("mongoose").Model<PostReaction, any, any, any, (import("mongoose").Document<unknown, any, PostReaction, any, import("mongoose").DefaultSchemaOptions> & PostReaction & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, PostReaction, any, import("mongoose").DefaultSchemaOptions> & PostReaction & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, PostReaction>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PostReaction, import("mongoose").Document<unknown, {}, PostReaction, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<PostReaction & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    sql_user_id?: import("mongoose").SchemaDefinitionProperty<string, PostReaction, import("mongoose").Document<unknown, {}, PostReaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PostReaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    post_id?: import("mongoose").SchemaDefinitionProperty<string, PostReaction, import("mongoose").Document<unknown, {}, PostReaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PostReaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<string, PostReaction, import("mongoose").Document<unknown, {}, PostReaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PostReaction & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, PostReaction>;
