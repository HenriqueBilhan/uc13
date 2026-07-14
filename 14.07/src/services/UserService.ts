import { UserRepository } from "../repositories/UserRepository";
import bcrypt from 'bcrypt' 
import { omitPassword } from "../utils/omitPassword";
import { generateToken } from "../utils/jwt";

// A camadsa Servises é responsabevel por chamara os meotdod de Repositoryu e cuaidar
//validações das nossas regras de negocios (ex: um usuario presisas ter )

// Aqui estamos criando uma classe de erro que extenda uma classe de erro
// Isso é para permitir que, mais tarde, o controller identifica o tipo de erro de uma forma mais clara

export class NotFoundError extends Error {}
 // errro lançado quando não esta autorizado a acessar atl rota
export class UnauthorizedError extends Error {}

export const UserService = {
  //como para listar não precisa validar nada, aqui so chamamos os metodos de respository msm, posi o controle naão pode se counicar diretamente com
  async listAll() {
    return UserRepository.findAll();
  },

  async getById(id: number) {
    const user = await UserRepository.findById(id);

    if (!user) {
      throw new NotFoundError("Usuario não encontrado!");
    }
    return user;
  },

  ////////
  async login(data: { email: string; password: string }) {
    const user = await UserRepository.findByEmail(data.email);

    const passwordIsValida = await bcrypt.compare(
      data.password,
      user!.password
    );

    if (!user || !passwordIsValida)
      throw new NotFoundError("Informação errada");

    const token = generateToken({
      id: user.id,
      email: user.email,
    });
    console.log(token);
    return {
      user: omitPassword(user),
      token,
    };
  },

  ///////////////////

  async create(data: { name: string; email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await UserRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return omitPassword(user);
  },

  async update(
    id: number,
    data: { name: string; email: string; password: string },
  ) {
    // Vai encontrar o usuario pela id
    const user = await UserRepository.findById(id);

    if (!user) {
      throw new NotFoundError("Usuario não encontrado!");
    }

    //
    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email;

    if (data.password) user.password = await bcrypt.hash(data.password, 10);

    //depois de tudo isso acima, chamamos o medtodos create do respository (ele salva o banco)
    const updatedUser = await UserRepository.create(user);

    //Retorna  o usuario sem a senha (por causa do imitPassword) para que não mostre a asenha na resposta do servidor
    return omitPassword(updatedUser);
  },

  async delete(id: number) {
    const result = await UserRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundError("Post não encontrado.");
    }
  },
};