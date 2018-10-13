import { Schema, Model, model, Document } from 'mongoose';
import * as beautifyUnique from 'mongoose-beautiful-unique-validation';

export interface IUserModel extends Document {
    _id: string;
    name?: string;
    events: Array<IUserEvent>;
};

export interface IUserEvent {
    time?: Date;
    url: string;
    device: {
        model: string;
        form: string;
        browser: string;
        version: string;
        os: string;
        source: string;
        platform: string;
    };
    location: IUserEventLocation;
    ip: string;
    port: number;
}

export interface IUserEventLocation {
    lat?: number;
    long?: number;
    city?: string;
    country?: string;
    region?: string;
}

export const UserSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            default: 'unknown',
            unique: true
        },
        events: {
            type: [
                {
                    time: {
                        type: Date,
                        default: Date.now
                    },
                    url: String,
                    device: {
                        model: String,
                        form: String,
                        browser: String,
                        os: String,
                        version: String,
                        source: String,
                        platform: String
                    },
                    location: {
                        lat: {
                            type: Number
                        },
                        long: {
                            type: Number
                        },
                        country: {
                            type: String
                        },
                        region: {
                            type: String
                        },
                        city: {
                            type: String
                        }
                    },
                    ip: String,
                    port: Number,
                    agent: {
                        family: String,
                        version: Number
                    }
                }
            ],
            default: []
        }
    },
    {
        timestamps: true
    }
);

// UserSchema.plugin(<any>beautifyUnique);

export const User: Model<IUserModel> = model('User', UserSchema);