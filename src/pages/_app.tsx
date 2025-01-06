import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "@/styles/globals.css";
import Modal from "./component/Modal";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { LoginEP } from "@/services/api";
import { MdLockOutline } from "react-icons/md";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.pathname === "/login" || router.pathname === "/") return;

    let timeout: NodeJS.Timeout;

    const resetIdleTimer = () => {
      setIsIdle(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsIdle(true);
      }, 300000);
    };

    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("keydown", resetIdleTimer);
    window.addEventListener("click", resetIdleTimer);

    timeout = setTimeout(() => {
      setIsIdle(true);
    }, 300000);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("keydown", resetIdleTimer);
      window.removeEventListener("click", resetIdleTimer);
    };
  }, [router.pathname]);

  useEffect(() => {
    if (isIdle) {
      setIsModalOpen(true);
    }
  }, [isIdle]);

  const [formData, setFormData] = useState({
    email: "",
    projectName: "",
    otp: "",
    pin: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.email ||
      !formData.projectName ||
      !formData.otp ||
      !formData.pin
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    LoginEP(formData);
  };

  return (
    <>
      <Component {...pageProps} />
      <ToastContainer />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="max-w-[500px]"
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-center flex-col justify-center space-y-4">
            <div className="">
              <Image
                src="/arroweyeLogo.svg"
                alt="Logo"
                height={50}
                width={50}
              />
            </div>
            <div className="max-w-[400px] mx-auto w-full space-y-4">
              <Input
                type="text"
                name="email"
                placeholder="Email"
                className="w-full rounded-[8px]"
                value={formData.email}
                onChange={handleInputChange}
              />
              <Input
                type="text"
                name="projectName"
                placeholder="Project Name"
                className="w-full rounded-[8px]"
                value={formData.projectName}
                onChange={handleInputChange}
              />
              <Input
                type="password"
                name="pin"
                placeholder="Pin"
                className="w-full rounded-[8px]"
                value={formData.pin}
                onChange={handleInputChange}
              />
              <Input
                type="text"
                name="otp"
                placeholder="OTP"
                className="w-full rounded-[8px]"
                value={formData.otp}
                onChange={handleInputChange}
              />
            </div>

            <button
              type="submit"
              className="font-bold gap-[10px] px-4 py-2 text-white bg-[#e4055a] rounded-[8px] hover:bg-[#000000] flex items-center"
            >
              Unlock <MdLockOutline size={14} />
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
