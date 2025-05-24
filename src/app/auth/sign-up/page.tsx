// File: src/app/auth/sign-up/page.tsx
import { getCurrentSession, loginUser, registerUser } from "@/actions/auth";
import SignUp from "@/components/auth/SignUp";
import { redirect } from "next/navigation";
import zod from "zod";

const SignUpSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(5),
});

// ✅ Server Action defined at module level
export async function action(prevState: any, formdata: FormData) {
  "use server";
  const parsed = SignUpSchema.safeParse(Object.fromEntries(formdata));
  if (!parsed.success) {
    return {
      message: "Invalid form data",
    };
  }

  const { email, password } = parsed.data;
  const { user, error } = await registerUser(email, password);
  if (error) {
    return {
      message: error,
    };
  } else if (user) {
    await loginUser(email, password);
    return redirect("/");
  }
}

const SignUpPage = async () => {
  const { user } = await getCurrentSession();

  if (user) {
    return redirect("/");
  }

  return <SignUp action={action} />;
};

export default SignUpPage;
