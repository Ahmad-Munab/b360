"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Github, Mail } from "lucide-react";
import Image from "next/image";

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-primary">
        <div className="text-center text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary">
      <div className="w-full max-w-md p-8 space-y-8 bg-background-secondary rounded-lg border border-border-primary">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign in to BetterFAQ AI</h1>
          <p className="text-text-secondary mt-2">
            Use your Google or GitHub account to sign in
          </p>
        </div>
        <div className="space-y-4">
          <button
            className="w-full flex items-center justify-center space-x-2 bg-background-primary border border-border-primary rounded-lg px-4 py-2 hover:bg-background-tertiary transition-colors"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <Image src={"/icons/google.svg"} alt="" width={20} height={20} />
            <span>Sign in with Google</span>
          </button>
          <button
            className="w-full flex items-center justify-center space-x-2 bg-background-primary border border-border-primary rounded-lg px-4 py-2 hover:bg-background-tertiary transition-colors"
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
          >
            <Github className="w-5 h-5" />
            <span>Sign in with GitHub</span>
          </button>
        </div>
      </div>
    </div>
  );
}
