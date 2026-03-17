import { Router, type IRouter } from "express";
import healthRouter from "./health";
import servicesRouter from "./services";
import leadsRouter from "./leads";
import providersRouter from "./providers";

const router: IRouter = Router();

router.use(healthRouter);
router.use(servicesRouter);
router.use(leadsRouter);
router.use(providersRouter);

export default router;
