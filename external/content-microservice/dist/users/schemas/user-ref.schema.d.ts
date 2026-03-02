import { HydratedDocument } from 'mongoose';
export type UserRefDocument = HydratedDocument<UserRef>;
export declare class UserRef {
    user_id: string;
    name?: string;
    email?: string;
    googleId?: string;
    picture?: string;
    role?: string;
    token?: string;
}
export declare const UserRefSchema: import("mongoose").Schema<UserRef, import("mongoose").Model<UserRef, any, any, any, (import("mongoose").Document<unknown, any, UserRef, any, import("mongoose").DefaultSchemaOptions> & UserRef & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, UserRef, any, import("mongoose").DefaultSchemaOptions> & UserRef & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, UserRef>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserRef, import("mongoose").Document<unknown, {}, UserRef, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<UserRef & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    user_id?: import("mongoose").SchemaDefinitionProperty<string, UserRef, import("mongoose").Document<unknown, {}, UserRef, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserRef & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string | undefined, UserRef, import("mongoose").Document<unknown, {}, UserRef, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserRef & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    email?: import("mongoose").SchemaDefinitionProperty<string | undefined, UserRef, import("mongoose").Document<unknown, {}, UserRef, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserRef & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    googleId?: import("mongoose").SchemaDefinitionProperty<string | undefined, UserRef, import("mongoose").Document<unknown, {}, UserRef, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserRef & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    picture?: import("mongoose").SchemaDefinitionProperty<string | undefined, UserRef, import("mongoose").Document<unknown, {}, UserRef, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserRef & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    role?: import("mongoose").SchemaDefinitionProperty<string | undefined, UserRef, import("mongoose").Document<unknown, {}, UserRef, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserRef & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    token?: import("mongoose").SchemaDefinitionProperty<string | undefined, UserRef, import("mongoose").Document<unknown, {}, UserRef, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserRef & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, UserRef>;
