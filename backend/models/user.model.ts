import { Document, Model, model, Types, Schema, Query } from "mongoose";
import { ROLE } from "../enums/role";
import mongoosePaginate from "mongoose-paginate-v2";


const UserSchema: Schema = new Schema({
    _id: {
       type: Types.ObjectId,
       required: true
    },
    githubId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String,
        required: false
    },
    admin: {
        type: Boolean,
        required: false,
        default: false
    },
    ROLE: {
        type: String,
        required: true
    }
    // The collection in which users will be saved
}, { collection: "users" }); 

// To Use: userSchema.asString()
UserSchema.virtual("asString")
    .get( function(this: 
        { 
            _id: Types.ObjectId,
            githubId: String, 
            email: string, 
            username: string,
            name: string,
            avatarUrl: string,
            admin: Boolean,
            ROLE: ROLE
        }) {
        return `User _id: ${this._id} \n
                User githubId: ${this.githubId} \n 
                User email: ${this.email} \n 
                User username: ${this.username} \n
                User ROLE: ${this.ROLE}`;
});
UserSchema.plugin(mongoosePaginate);
const UserModel = model("User", UserSchema);

// export values
export { UserSchema, UserModel }