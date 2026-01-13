import React from "react";
import Head from "next/head";
import SpinsTableComponent from "../payments/component/SpinsTableComponent";

const SpinsChart = () => {
  return (
    <>
      <Head>
        <title>Spins - Arroweye</title>
      </Head>
      <div>
        <SpinsTableComponent />
      </div>
    </>
  );
};

export default SpinsChart;
// comment
