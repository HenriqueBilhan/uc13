import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserServices";


export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Pegamos o e-mail e a senha enviados pelo body da requisição.
      const { email, password } = req.body;

      // Chamamos o método de login da camada Service.
      const result = await UserService.login({ email, password });

      // Se tudo der certo, retornamos o resultado.
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}