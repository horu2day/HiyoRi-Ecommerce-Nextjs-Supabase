"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase/client";
import { authSchema } from "../validations";
import { PasswordInput } from "./PasswordInput";

type FormData = z.infer<typeof authSchema>;

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const supabase = createClient();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  React.useEffect(() => {
    const error = searchParams.get("error");
    if (error) toast({ title: "Error", description: error });
  }, [searchParams]);

  async function onSubmit({ email, password }: FormData) {
    startTransition(async () => {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        toast({ title: "Error", description: authError.message });
        return;
      }

      if (!authData.user) {
        toast({ title: "Error", description: "User data not found" });
        return;
      }

      // RPC를 통해 is_super_admin 상태 확인
      const { data: isAdmin, error: adminError } = await supabase.rpc(
        "get_user_admin_status",
      );

      if (adminError) {
        console.error("Failed to fetch admin status:", adminError);
        toast({ title: "Error", description: "Failed to fetch user data" });
        return;
      }

      if (isAdmin) {
        toast({ title: "Admin Login Success" });
        router.push("/admin/dashboard");
      } else {
        toast({ title: "Login Success" });
        router.push(searchParams?.get("from") || "/");
      }
    });
  }
  // function onSubmit({ email, password }: FormData) {
  //   startTransition(async () => {
  //     const { data, error } = await supabase.auth.signInWithPassword({
  //       email,
  //       password,
  //     });
  //     console.log("data", data);

  //     if (error) {
  //       toast({ title: "Error", description: error.message });
  //     } else {
  //       toast({ title: "Login Sucess" });
  //       router.push(searchParams?.get("from") || "/");
  //     }
  //   });
  // }

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@domain.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="**********"
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending}>
          {isPending && (
            <Spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          Sign in
          <span className="sr-only">Sign in</span>
        </Button>
      </form>
    </Form>
  );
}

export default SignInForm;
