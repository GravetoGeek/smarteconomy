import { Router } from "express";
import { verifyJWT } from "../controllers/authController";
import { dashboard_mediasalarial_filter,dashboard_despesasPorCategorias } from "../controllers/dashboardController";

const dashboardRoute = Router();
dashboardRoute.post("/mediasalarialfilter", verifyJWT, dashboard_mediasalarial_filter);
dashboardRoute.post('/despesasporcategorias', verifyJWT,dashboard_despesasPorCategorias )
export default dashboardRoute;