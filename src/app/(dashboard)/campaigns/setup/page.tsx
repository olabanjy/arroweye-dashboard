import { Suspense } from "react";
import type { Metadata } from "next";
import SetupContent from "./setup-content";

export const metadata: Metadata = {
  title: "Setup Campaigns - Arroweye",
};

const Setup = () => {
  return (
    <Suspense fallback={null}>
      <SetupContent />
    </Suspense>
  );
};

export default Setup;
