import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "@/styles/globals.css";
import Modal from "@/components/modal";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { LoginEP } from "@/services";
import { MdLockOutline } from "react-icons/md";
import type { AppProps } from "next/app";
import ScrollToTopButton from "@/components/scroll-to-top-button";
import { AuthProvider } from "@/context/auth-context";
import { BProgress } from "@bprogress/core";
import "@bprogress/core/css";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const router = useRouter();
  const isPublicShellRoute =
    router.pathname === "/login" ||
    router.pathname === "/spins" ||
    router.pathname === "/spins/[id]" ||
    router.pathname === "/";
  BProgress.configure({ showSpinner: false });

  useEffect(() => {
    const handleStart = () => BProgress.start();
    const handleStop = () => BProgress.done();

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  useEffect(() => {
    if (isPublicShellRoute)
      return;

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
  }, [isPublicShellRoute]);

  useEffect(() => {
    if (isIdle) {
      setIsModalOpen(false);
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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className=" font-IBM relative">
          {!isPublicShellRoute && <ScrollToTopButton />}

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
                  className="font-bold gap-[10px] px-4 py-2 text-white bg-[#e4055a] rounded-full hover:bg-[#000000] flex items-center"
                >
                  Unlock <MdLockOutline size={14} />
                </button>
              </div>
            </form>
          </Modal>
        </div>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
