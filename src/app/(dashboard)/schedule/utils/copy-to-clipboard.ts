import { toast } from "sonner";

export const copyToClipboard = (text: string, label: string) =>
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success(`${label} copied.`))
    .catch((error) => {
      console.error(`Copying ${label.toLowerCase()} failed:`, error);
      toast.error(`${label} could not be copied.`);
    });
