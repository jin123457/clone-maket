"use server";

export async function handleLogin(prevAction: any, formData: FormData) {
  return {
    errors: ["worng password"],
  };
}
