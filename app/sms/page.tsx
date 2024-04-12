"use client";

import Input from "@/components/input";
import Button from "@/components/button";
import { useFormState } from "react-dom";
import { smsLogIn } from "./action";

const initialState = {
  token: false,
  error: undefined,
};

export default function SMSLogIn() {
  const [state, dispatch] = useFormState(smsLogIn, initialState);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        {state.token ? (
          <Input
            name="token"
            type="number"
            placeholder="Verfication code"
            required
            minLength={100000}
            maxLength={999999}
            errors={state.error?.formErrors}
          />
        ) : (
          <Input
            name="phone"
            type="text"
            placeholder="Phone Number"
            required
            errors={state.error?.formErrors}
          />
        )}
        <Button text={state.token ? `Verify Token` : `Send Verification SMS`} />
      </form>
    </div>
  );
}
