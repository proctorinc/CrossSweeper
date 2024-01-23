import { NextFunction, Request, Response, Router } from "express";

const router = Router();

router.get(
  "/user/",
  async (req: Request, res: Response, next: NextFunction) => {
    res.json({ userId: "banana-rama-rama-banana" });
  }
);

export default router;
