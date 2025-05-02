import React from "react";
import Login from "../payments/component/Login";
import Head from "next/head";

const LoginPage = () => {
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
