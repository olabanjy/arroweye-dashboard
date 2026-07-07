import React, { useEffect } from "react";
import Login from "../payments/component/Login";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "@/context/auth-context";

const LoginPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/campaigns");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || isAuthenticated) {
    return "";
  }

  return (
    <>
      <Head>
        <title>Login - Arroweye</title>
      </Head>
      <div>
        <Login />
      </div>
    </>
  );
};

export default LoginPage;
