"use server";
import { z } from "zod";
import {
  CHECK_PASSWORD_ERROR,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";
const checkUsername = (username: string) => !username.includes("서울");

const checkPassword = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  return !Boolean(user);
};

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "유저 이름은 문자열이여야해요",
        required_error: "유저 이름은 필수 입니다.",
      })
      .toLowerCase()
      .trim()
      .refine(checkUsername, '유저 이름에 "서울" 은 포함될 수 없어요')
      .refine(checkUniqueUsername, "해당 유저의 이름은 이미 있습니다."),
    email: z
      .string({
        invalid_type_error: "이메일은 문자열이여야해요",
        required_error: "이메일은 필수 입니다.",
      })
      .email()
      .toLowerCase()
      .refine(checkUniqueEmail, "해당 이메일은 이미 있습니다."),
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
  const result = await formSchema.safeParseAsync(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const hashedPassword = await bcrypt.hash(result.data.password, 12);

    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
    const session = await getSession();
    session.id = user.id;
    await session.save();

    redirect("/profile");
  }
}
