import {Query, Resolver, Mutation, Arg, ObjectType, Field} from 'type-graphql'
import { hash, compare } from 'bcryptjs';
import {sign} from 'jsonwebtoken';
import { User } from "./entity/User";

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
        return {
            
            accessToken: sign({userId: user.id, userEmail: user.email}, 'faiafj23ljlakw', {
                expiresIn: "10m"
            })
        };
    }
//////////////////////////////////////////////////////////
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