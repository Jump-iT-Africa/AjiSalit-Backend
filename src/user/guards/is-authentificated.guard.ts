import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError } from '@nestjs/jwt';
import { validateJwt } from '../../services/verifyJwt';

@Injectable()
export class IsAuthenticated implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {
        try{
            console.log("I m heeeeeere", {tag:"NOTFICATION DE LA VIE"})
            const request = context.switchToHttp().getRequest();
            const token = request.headers['authorization']?.split(' ')[1];
            if(!token){
                throw new UnauthorizedException("Try to login again");
            }
            const infoUser = validateJwt(token);
            console.log("I m heeeeeere", {tag:"NOTFICATION DE LA VIE"},infoUser)

            // console.log(infoUser)
            request.user = infoUser;
            return true; 
        } catch(e){
            if(e instanceof JsonWebTokenError){
                throw new UnauthorizedException("Try to login again");
            }
            throw new UnauthorizedException("Try to login again");
        }
    }
}