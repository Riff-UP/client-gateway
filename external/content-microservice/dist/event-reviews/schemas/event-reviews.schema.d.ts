import { HydratedDocument } from 'mongoose';
export type EventReviewDocument = HydratedDocument<EventReview>;
export declare class EventReview {
    event_id: string;
    sql_user_id: string;
    rating: number;
}
export declare const EventReviewSchema: import("mongoose").Schema<EventReview, import("mongoose").Model<EventReview, any, any, any, (import("mongoose").Document<unknown, any, EventReview, any, import("mongoose").DefaultSchemaOptions> & EventReview & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, EventReview, any, import("mongoose").DefaultSchemaOptions> & EventReview & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, EventReview>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, EventReview, import("mongoose").Document<unknown, {}, EventReview, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<EventReview & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    event_id?: import("mongoose").SchemaDefinitionProperty<string, EventReview, import("mongoose").Document<unknown, {}, EventReview, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventReview & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sql_user_id?: import("mongoose").SchemaDefinitionProperty<string, EventReview, import("mongoose").Document<unknown, {}, EventReview, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventReview & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    rating?: import("mongoose").SchemaDefinitionProperty<number, EventReview, import("mongoose").Document<unknown, {}, EventReview, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventReview & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, EventReview>;
