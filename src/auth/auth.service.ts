import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as  bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { signUpDto } from './dto/signup.dto';
import { loginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) 
        private userModel:Model<User>,
        private jwtService:JwtService
        ){}

    async signUp(signUpDto:signUpDto):Promise<{token:string}>{
        const {name,email,password} = signUpDto

        const hash = await bcrypt.hash(password,10)

        const user = await this.userModel.create({
            name,
            email,
            password:hash,
        })

        const token = this.jwtService.sign({id:user._id})
        return {token}
    }

    async login(loginDto:loginDto):Promise<{ token:string} >{
        const {email,password} = loginDto;
        const user = await this.userModel.findOne({email})
        if(!user){
            throw new UnauthorizedException('Invalid email or password')
        }

        const PassMatched = await bcrypt.compare(password,user.password);

        if(!PassMatched){
            throw new UnauthorizedException('Invalid password')
        }
        const token = this.jwtService.sign({id:user._id})
        return {token}
    }
}
