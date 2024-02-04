import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Schema } from "@nestjs/mongoose";

@Schema({
    timestamps:true,
})

export class User{
    @Prop()
    name:string;

    @Prop({unique:[true,'Duplicate email address']})
    email:string;

    @Prop()
    password:string;
}

export const UserSchema  = SchemaFactory.createForClass(User);