import { HydratedDocument } from 'mongoose';
export type SavedPostDocument = HydratedDocument<SavedPost>;
export declare class SavedPost {
    post_id: string;
    sql_user_id: string;
}
export declare const SavedPostSchema: import("mongoose").Schema<SavedPost, import("mongoose").Model<SavedPost, any, any, any, (import("mongoose").Document<unknown, any, SavedPost, any, import("mongoose").DefaultSchemaOptions> & SavedPost & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, SavedPost, any, import("mongoose").DefaultSchemaOptions> & SavedPost & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, SavedPost>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SavedPost, import("mongoose").Document<unknown, {}, SavedPost, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<SavedPost & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    post_id?: import("mongoose").SchemaDefinitionProperty<string, SavedPost, import("mongoose").Document<unknown, {}, SavedPost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SavedPost & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sql_user_id?: import("mongoose").SchemaDefinitionProperty<string, SavedPost, import("mongoose").Document<unknown, {}, SavedPost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SavedPost & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, SavedPost>;
