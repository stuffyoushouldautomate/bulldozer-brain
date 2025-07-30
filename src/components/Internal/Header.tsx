"use client";
import { useTranslation } from "react-i18next";
import { Settings, History, BookText } from "lucide-react";
import { Button } from "@/components/Internal/Button";
import { useGlobalStore } from "@/store/global";
import Image from "next/image";

const VERSION = process.env.NEXT_PUBLIC_VERSION;

function Header() {
  const { t } = useTranslation();
  const { setOpenSetting, setOpenHistory, setOpenKnowledge } = useGlobalStore();

  return (
    <>
      <header className="flex justify-between items-center my-6 max-sm:my-4 print:hidden">
        <div className="flex items-center">
          <Image
            src="/825-logo.png"
            alt="Local 825 Logo"
            width={32}
            height={32}
            className="mr-2"
          />
          <h1 className="text-left text-xl font-semibold">
            {t("title")}
            <small className="ml-2 font-normal text-base">v{VERSION}</small>
          </h1>
        </div>
        <div className="flex">
          <Button
            className="h-8 w-8"
            title="Local 825 - International Union of Operating Engineers"
            variant="ghost"
            size="icon"
          >
            <Image
              src="/825-logo.png"
              alt="Local 825"
              width={20}
              height={20}
            />
          </Button>
          <Button
            className="h-8 w-8"
            variant="ghost"
            size="icon"
            title={t("history.title")}
            onClick={() => setOpenHistory(true)}
          >
            <History className="h-5 w-5" />
          </Button>
          <Button
            className="h-8 w-8"
            variant="ghost"
            size="icon"
            title={t("knowledge.title")}
            onClick={() => setOpenKnowledge(true)}
          >
            <BookText />
          </Button>
          <Button
            className="h-8 w-8"
            title={t("setting.title")}
            variant="ghost"
            size="icon"
            onClick={() => setOpenSetting(true)}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>
    </>
  );
}

export default Header;
