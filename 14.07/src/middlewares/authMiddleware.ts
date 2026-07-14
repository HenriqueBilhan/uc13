import { Request, Response, NextFunction } from "express";
import { verify } from "node:crypto";
import { verifyToken } from "../utils/jwt";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // no objeto da requisição ele vai ate os heders e verifica se tem algo dentro de authorization
  // se tiver armazena aqui dentro, se mão, estão é null
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      // 401 é Unathorized (não autorizado)
      mensagem: "Sem autorização: token não fornecido",
    });
  }

  //Se tiver o token, presisasmos extrair ele
  // O Split() pega uma string e divide ela pelos caracteres que colarem nos parênteces

  const token = authorization.split(" ")[1];
  const baerer = authorization.split(" ")[0];

  if (baerer !== "Baerer") {
    return res.status(401).json({
      // 401 é Unathorized (não autorizado)
      mensagem: "Sem autorização: token mal formado",
    });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      // 401 é Unathorized (não autorizado)
      mensagem: "Token invalido",
    });
  }

  // a requisição ainda não tem um user dentro dela
  // requeste não tem um atributo user
  // eu estou tenatando criar ele para aramazenar as informações de um usuarios dentro de requisição 
  //mas o type não deixa 
  //para bular isso, transformações temporariamente do req de tipo 'any' para aceitara qualquer coisa 
  (req as any).user = decoded

  next() 
}