import { hash, compare } from 'bcryptjs';
import { User } from "./entity/User";
import { MyContext } from "./MyContext";
import { createAccessToken, createRefreshToken } from './auth';
import {Query, 
  Resolver, 
  Mutation, 
  Arg, 
  ObjectType, 
  Field, 
  Ctx,
  UseMiddleware
} from 'type-graphql'
import { isAuthorized } from './isAuthorized';

@ObjectType()
class LoginResponse {
    @Field()
    accessToken: string
}

@Resolver()
export class BodyResolver {
    @Query(() => String)
    hello() {
        return 'hi!';
    }

    @Query(() => String)
    @UseMiddleware(isAuthorized)
    bye(
      @Ctx() {payload}: MyContext
    ) {
        console.log(payload);
        return `your ID is : ${payload!.userId}`;
    }


    @Query(() => [User])
    users() {
        // .find() takes all users from database 
        return User.find();
    }
//////////////////////////////////////////////////////////
    @Mutation(() => LoginResponse)
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() {res}: MyContext
    ): Promise<LoginResponse> {// checking for existence 
        const user = await User.findOne({where: {email}});
        
        if (!user) {
            throw new Error ('no user was found, please try again')
        }

        const authenticatedUser = await compare(password, user.password)


        if (!authenticatedUser) {
            throw  Error('the password you inserted is incorrect')
        }

        // success to sign function  
        res.cookie(
         'jid', createRefreshToken(user),{ 
           httpOnly: true
        });

        return {
            accessToken: createAccessToken(user)
        };
    }


    @Mutation(() => Boolean)
    async register(
        @Arg('email') email: string,
        @Arg('password') password: string,
    ) {

        const keyJuggle = await hash(password, 15);

        try {
            await User.insert({
                email,
                password: keyJuggle 
            });
        } catch (errorSignal) {
            console.log(errorSignal)
            return false;
        }
        return true;
    }
}