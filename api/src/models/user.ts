import mongoose, { Document, Schema, Types } from "mongoose";
import * as bcrypt from "bcryptjs";

export const USER_DOCUMENT_NAME: string = "User";
export const USER_COLLECTION_NAME: string = "users";

export interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    password: string;
    ComparePassword(candidate: string): Promise<boolean>;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
    {
        email: {
            type: Schema.Types.String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: Schema.Types.String,
            required: true,
            minLength: 0,
        },
    },

    { timestamps: true },
);

userSchema.pre("save", async function(this: IUser) {
    const user = this;
    if (!user.isModified("password")) return new Error("");
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    return;
});

userSchema.methods.ComparePassword = async function(candidate: string) {
    return bcrypt.compare(candidate, this.password);
};

userSchema.index({ _id: 1 });

export const User = mongoose.model<IUser>(
    USER_DOCUMENT_NAME,
    userSchema,
    USER_COLLECTION_NAME,
);
