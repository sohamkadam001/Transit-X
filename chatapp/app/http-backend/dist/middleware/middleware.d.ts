import type { NextFunction, Request, Response } from "express";
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}
export declare function Middleware(req: Request, res: Response, next: NextFunction): null | undefined;
//# sourceMappingURL=middleware.d.ts.map