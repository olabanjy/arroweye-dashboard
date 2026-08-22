import type { Metadata } from "next";

import CreateContent from "./create-content";

export const metadata: Metadata = {
  title: "Create Campaign - Arroweye",
};

export default function CreatePage() {
  return <CreateContent />;
}
