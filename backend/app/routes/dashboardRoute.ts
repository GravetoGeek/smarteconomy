import { Router } from 'express'
import { verifyJWT } from '../controllers/authController'
import {
    dashboard_despesasPorCategorias,
    dashboard_mediasalarial_filter,
    dashboard_rendasPorCategorias,
    dashboard_transacoesPorCategorias
} from '../controllers/dashboardController'

const dashboardRoute = Router()
dashboardRoute.post(
    '/mediasalarialfilter',
    verifyJWT,
    dashboard_mediasalarial_filter
)
dashboardRoute.post(
    '/despesasporcategorias',
    verifyJWT,
    dashboard_despesasPorCategorias
)
dashboardRoute.post(
    '/rendasporcategorias',
    verifyJWT,
    dashboard_rendasPorCategorias
)
dashboardRoute.post(
    '/transacoesporcategorias',
    verifyJWT,
    dashboard_transacoesPorCategorias
)

export default dashboardRoute
