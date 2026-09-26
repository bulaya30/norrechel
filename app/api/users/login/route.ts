import { userService } from "@/lib/container/user.container";
import { success, failure, } from "@/lib/api/response";

type Params = {
  email: string;
  password: string;
};

export async function POST(req: Request) {
  const { email, password } = (await req.json()) as Params;
  const { user, token } = await userService.login({email, password});
  return success({ user, token });
}