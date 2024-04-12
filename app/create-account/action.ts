"use server";
import { z } from "zod";
import {
  CHECK_PASSWORD_ERROR,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
const checkUsername = (username: string) => !username.includes("서울");

const checkPassword = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "유저 이름은 문자열이여야해요",
        required_error: "유저 이름은 필수 입니다.",
      })
      .toLowerCase()
      .trim()
      .refine(checkUsername, '유저 이름에 "서울" 은 포함될 수 없어요'),
    email: z
      .string({
        invalid_type_error: "이메일은 문자열이여야해요",
        required_error: "이메일은 필수 입니다.",
      })
      .email()
      .toLowerCase(),
    password: z
      .string({
        invalid_type_error: "비밀번호는 문자열이여야해요",
        required_error: "비밀번호는 필수 입니다.",
      })
      .min(4, "너무 짧아요")
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z
      .string({
        invalid_type_error: "비밀번호 확인은 문자열이여야해요",
        required_error: "비밀번호 확인은 필수 입니다.",
      })
      .min(4, "너무 짧아요")
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
  })
  .refine(checkPassword, {
    message: CHECK_PASSWORD_ERROR,
    path: ["confirm_password"],
  });

export async function createAccount(_: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };
  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  }
}
