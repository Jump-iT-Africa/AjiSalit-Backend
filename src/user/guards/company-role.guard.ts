import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError } from '@nestjs/jwt';
import { validateJwt } from '../../services/verifyJwt';

@Injectable()
export class CompanyRoleGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {
        try{
            const request = context.switchToHttp().getRequest();
            const token = request.headers['authorization']?.split(' ')[1];
            if(!token){
                throw new UnauthorizedException("Try to login again");
            }
            const infoUser = validateJwt(token);
            console.log(infoUser)

            if(infoUser.role !== 'company'){
                throw new ForbiddenException("You aren't allowed to access this route unless you have a company role");
            }
            request.user = infoUser;
            return true; 
        } catch(e){
            if(e instanceof ForbiddenException){
                throw new ForbiddenException("You aren't allowed to access this route unless you have a company role");
            }
            if(e instanceof JsonWebTokenError){
                throw new UnauthorizedException("Try to login again");
            }
            throw new UnauthorizedException("Try to login again");
        }
    }
}