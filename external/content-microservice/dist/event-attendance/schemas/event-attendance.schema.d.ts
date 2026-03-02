import { HydratedDocument } from 'mongoose';
export type EventAttendanceDocument = HydratedDocument<EventAttendance>;
export declare class EventAttendance {
    event_id: string;
    sql_user_id: string;
    status: string;
}
export declare const EventAttendanceSchema: import("mongoose").Schema<EventAttendance, import("mongoose").Model<EventAttendance, any, any, any, (import("mongoose").Document<unknown, any, EventAttendance, any, import("mongoose").DefaultSchemaOptions> & EventAttendance & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (import("mongoose").Document<unknown, any, EventAttendance, any, import("mongoose").DefaultSchemaOptions> & EventAttendance & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, EventAttendance>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, EventAttendance, import("mongoose").Document<unknown, {}, EventAttendance, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<EventAttendance & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    event_id?: import("mongoose").SchemaDefinitionProperty<string, EventAttendance, import("mongoose").Document<unknown, {}, EventAttendance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventAttendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    sql_user_id?: import("mongoose").SchemaDefinitionProperty<string, EventAttendance, import("mongoose").Document<unknown, {}, EventAttendance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventAttendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, EventAttendance, import("mongoose").Document<unknown, {}, EventAttendance, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<EventAttendance & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, EventAttendance>;
