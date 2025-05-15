import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JsonWebTokenError } from '@nestjs/jwt';
import { validateJwt } from '../../services/verifyJwt';

@Injectable()
export class ClientRoleGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean {
        try{
            const request = context.switchToHttp().getRequest();
            const token = request.headers['authorization']?.split(' ')[1];
            if(!token){
                throw new UnauthorizedException('kindly try to login again');
            }
            const infoUser = validateJwt(token);
            console.log(infoUser)

            if(infoUser.role !== 'client'){
                throw new ForbiddenException('Osp only clients can access to this route');
            }
            request.user = infoUser;
            return true; 
        } catch(e){
            if(e instanceof ForbiddenException){
                throw new ForbiddenException('Ops only clients can access to this route');
            }
            if(e instanceof JsonWebTokenError){
                throw new UnauthorizedException('kindly try to login again');
            }
            throw new UnauthorizedException('kindly try to login again');
        }
    }
}