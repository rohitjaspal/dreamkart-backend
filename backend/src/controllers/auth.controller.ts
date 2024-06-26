import { Request, Response, NextFunction } from 'express'
import { UserModel } from '../models/user.model'
import { generateToken } from '../services/token.service'
const bcrypt =  require("bcryptjs");

interface RegisterUserPayload { firstName: string, lastName: string, email: string, password: string }

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, password }: RegisterUserPayload = req.body

        const user = await UserModel.findOne({ email })

        if (user) {
            return res.status(409).json({
                message: 'Account already exists',
                success: false
            })
        }

        //TODO: Implement hashing of password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password , saltRounds);


        const newUser = new UserModel({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        await newUser.save()

        const token = await generateToken(newUser)

        return res.status(201).json({
            message: 'Account created successfully',
            success: true,
            data: { token }
        })

    }
    catch (err) {
        next(err)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { email, password }: { email: string, password: string } = req.body

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(404).json({
                message: 'Account not exists',
                success: false
            })
        }

        //TODO: check hash password comparison
        const validate = bcrypt.compare(password , user.password );

        if(!validate){
            return res.status(403)
            .json({
                message: "wrong password! try again.."
            })
        }

        const token = await generateToken(user)

        return res.status(200).json({
            message: 'LoggedIn successfully',
            success: true,
            data: { token }
        })

    }
    catch (err) {
        next(err)
    }
}