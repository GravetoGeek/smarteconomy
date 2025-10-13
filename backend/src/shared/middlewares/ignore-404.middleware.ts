import {Injectable,NestMiddleware} from '@nestjs/common'
import {NextFunction,Request,Response} from 'express'

@Injectable()
export class Ignore404Middleware implements NestMiddleware {
    use(req: Request,res: Response,next: NextFunction) {
        // Se for uma rota de reset-password que não existe no backend, retornar 404 sem quebrar
        if(req.path.includes('/reset-password')) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Esta é uma rota do frontend, não do backend',
                error: 'Not Found'
            })
        }

        next()
    }
}
