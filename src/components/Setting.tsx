"use client";
import {
  useLayoutEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { usePWAInstall } from "react-use-pwa-install";
import { RefreshCw, CircleHelp, MonitorDown } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSettingStore } from "@/store/setting";
import {
  TAVILY_BASE_URL,
  FIRECRAWL_BASE_URL,
  EXA_BASE_URL,
  BOCHA_BASE_URL,
  SEARXNG_BASE_URL,
} from "@/constants/urls";
import locales from "@/constants/locales";
import { researchStore } from "@/utils/storage";
import { cn } from "@/utils/style";
import { omit, capitalize } from "radash";

type SettingProps = {
  open: boolean;
  onClose: () => void;
};

const BUILD_MODE = process.env.NEXT_PUBLIC_BUILD_MODE;
const VERSION = process.env.NEXT_PUBLIC_VERSION;
const DISABLED_SEARCH_PROVIDER =
  process.env.NEXT_PUBLIC_DISABLED_SEARCH_PROVIDER || "";

const formSchema = z.object({
  enableSearch: z.string(),
  searchProvider: z.string().optional(),
  tavilyApiKey: z.string().optional(),
  tavilyApiProxy: z.string().optional(),
  tavilyScope: z.string().optional(),
  firecrawlApiKey: z.string().optional(),
  firecrawlApiProxy: z.string().optional(),
  exaApiKey: z.string().optional(),
  exaApiProxy: z.string().optional(),
  exaScope: z.string().optional(),
  bochaApiKey: z.string().optional(),
  bochaApiProxy: z.string().optional(),
  searxngApiProxy: z.string().optional(),
  searxngScope: z.string().optional(),
  parallelSearch: z.number().min(1).max(5),
  searchMaxResult: z.number().min(1).max(10),
  language: z.string().optional(),
  theme: z.string().optional(),
  debug: z.enum(["enable", "disable"]).optional(),
  references: z.enum(["enable", "disable"]).optional(),
  citationImage: z.enum(["enable", "disable"]).optional(),
  smoothTextStreamType: z.enum(["character", "word", "line"]).optional(),
  onlyUseLocalResource: z.enum(["enable", "disable"]).optional(),
});

function convertModelName(name: string) {
  return name
    .replaceAll("/", "-")
    .split("-")
    .map((word) => capitalize(word))
    .join(" ");
}

let preLoading = false;

function HelpTip({ children, tip }: { children: ReactNode; tip: string }) {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 2000);
  };

  return (
    <div className="flex items-center">
      <span className="flex-1">{children}</span>
      <TooltipProvider delayDuration={100}>
        <Tooltip open={open} onOpenChange={(opened) => setOpen(opened)}>
          <TooltipTrigger asChild>
            <CircleHelp
              className="cursor-help w-4 h-4 ml-1 opacity-50 max-sm:ml-0"
              onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                handleOpen();
              }}
            />
          </TooltipTrigger>
          <TooltipContent className="max-w-52">
            <p>{tip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

function Setting({ open, onClose }: SettingProps) {
  const { t } = useTranslation();
  const { searchProvider, update } = useSettingStore();
  const pwaInstall = usePWAInstall();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: async () => {
      return new Promise((resolve) => {
        const state = useSettingStore.getState();
        resolve({ ...omit(state, ["update"]) });
      });
    },
  });

  const isDisabledSearchProvider = useCallback(
    (provider: string) => {
      const disabledSearchProviders =
        DISABLED_SEARCH_PROVIDER.length > 0
          ? DISABLED_SEARCH_PROVIDER.split(",")
          : [];
      return disabledSearchProviders.includes(provider);
    },
    []
  );

  const installPWA = async () => {
    if ("serviceWorker" in navigator) {
      await window.serwist?.register();
    }
    if (pwaInstall) await pwaInstall();
  };

  function handleClose(open: boolean) {
    if (!open) onClose();
  }

  function handleSubmit(values: z.infer<typeof formSchema>) {
    update(values);
    onClose();
  }

  async function updateSetting(key: string, value?: string | number) {
    update({ [key]: value });
  }

  function handleReset() {
    toast.warning(t("setting.resetSetting"), {
      description: t("setting.resetSettingWarning"),
      duration: 5000,
      action: {
        label: t("setting.confirm"),
        onClick: async () => {
          const { reset } = useSettingStore.getState();
          reset();
          await researchStore.clear();
        },
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-lg:max-w-md print:hidden">
        <DialogHeader>
          <DialogTitle>{t("setting.title")}</DialogTitle>
          <DialogDescription>{t("setting.description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4">
            <Tabs defaultValue="search">
              <TabsList className="w-full mb-2">
                <TabsTrigger className="flex-1" value="search">
                  {t("setting.search")}
                </TabsTrigger>
                <TabsTrigger className="flex-1" value="general">
                  {t("setting.general")}
                </TabsTrigger>
                <TabsTrigger className="flex-1" value="experimental">
                  {t("setting.experimental")}
                </TabsTrigger>
              </TabsList>
              <TabsContent className="space-y-4 min-h-[250px]" value="search">
                <FormField
                  control={form.control}
                  name="enableSearch"
                  render={({ field }) => (
                    <FormItem className="from-item">
                      <FormLabel className="from-label">
                        <HelpTip tip={t("setting.enableSearchTip")}>
                          {t("setting.enableSearch")}
                        </HelpTip>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            updateSetting("enableSearch", value);
                          }}
                        >
                          <SelectTrigger className="form-field">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="enable">
                              {t("setting.enable")}
                            </SelectItem>
                            <SelectItem value="disable">
                              {t("setting.disable")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="searchProvider"
                  render={({ field }) => (
                    <FormItem className="from-item">
                      <FormLabel className="from-label">
                        <HelpTip tip={t("setting.searchProviderTip")}>
                          {t("setting.searchProvider")}
                        </HelpTip>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            updateSetting("searchProvider", value);
                          }}
                        >
                          <SelectTrigger className="form-field">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="max-sm:max-h-72">
                            {!isDisabledSearchProvider("tavily") ? (
                              <SelectItem value="tavily">Tavily</SelectItem>
                            ) : null}
                            {!isDisabledSearchProvider("firecrawl") ? (
                              <SelectItem value="firecrawl">
                                Firecrawl
                              </SelectItem>
                            ) : null}
                            {!isDisabledSearchProvider("exa") ? (
                              <SelectItem value="exa">Exa</SelectItem>
                            ) : null}
                            {!isDisabledSearchProvider("bocha") ? (
                              <SelectItem value="bocha">Bocha</SelectItem>
                            ) : null}
                            {!isDisabledSearchProvider("searxng") ? (
                              <SelectItem value="searxng">SearXNG</SelectItem>
                            ) : null}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div
                  className={cn("space-y-4", {
                    hidden: searchProvider !== "tavily",
                  })}
                >
                  <FormField
                    control={form.control}
                    name="tavilyApiKey"
                    render={({ field }) => (
                      <FormItem className="from-item">
                        <FormLabel className="from-label">
                          {t("setting.apiKeyLabel")}
                        </FormLabel>
                        <FormControl className="form-field">
                          <Input
                            type="password"
                            placeholder={t("setting.apiKeyPlaceholder")}
                            {...field}
                            onBlur={() =>
                              updateSetting(
                                "tavilyApiKey",
                                form.getValues("tavilyApiKey")
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tavilyApiProxy"
                    render={({ field }) => (
                      <FormItem className="from-item">
                        <FormLabel className="from-label">
                          {t("setting.apiUrlLabel")}
                        </FormLabel>
                        <FormControl className="form-field">
                          <Input
                            placeholder={TAVILY_BASE_URL}
                            {...field}
                            onBlur={() =>
                              updateSetting(
                                "tavilyApiProxy",
                                form.getValues("tavilyApiProxy")
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tavilyScope"
                    render={({ field }) => (
                      <FormItem className="from-item">
                        <FormLabel className="from-label">
                          {t("setting.scopeLabel")}
                        </FormLabel>
                        <FormControl className="form-field">
                          <Input
                            placeholder={t("setting.scopePlaceholder")}
                            {...field}
                            onBlur={() =>
                              updateSetting(
                                "tavilyScope",
                                form.getValues("tavilyScope")
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div
                  className={cn("space-y-4", {
                    hidden: searchProvider !== "firecrawl",
                  })}
                >
                  <FormField
                    control={form.control}
                    name="firecrawlApiKey"
                    render={({ field }) => (
                      <FormItem className="from-item">
                        <FormLabel className="from-label">
                          {t("setting.apiKeyLabel")}
                        </FormLabel>
                        <FormControl className="form-field">
                          <Input
                            type="password"
                            placeholder={t("setting.apiKeyPlaceholder")}
                            {...field}
                            onBlur={() =>
                              updateSetting(
                                "firecrawlApiKey",
                                form.getValues("firecrawlApiKey")
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="firecrawlApiProxy"
                    render={({ field }) => (
                      <FormItem className="from-item">
                        <FormLabel className="from-label">
                          {t("setting.apiUrlLabel")}
                        </FormLabel>
                        <FormControl className="form-field">
                          <Input
                            placeholder={FIRECRAWL_BASE_URL}
                            {...field}
                            onBlur={() =>
                              updateSetting(
                                "firecrawlApiProxy",
                                form.getValues("firecrawlApiProxy")
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div
                  className={cn("space-y-4", {
                    hidden: searchProvider !== "exa",
                  })}
                >
                  <FormField
                    control={form.control}
                    name="exaApiKey"
                    render={({ field }) => (
                      <FormItem className="from-item">
                        <FormLabel className="from-label">
                          {t("setting.apiKeyLabel")}
                        </FormLabel>
                        <FormControl className="form-field">
                          <Input
                            type="password"
                            placeholder={t("setting.apiKeyPlaceholder")}
                            {...field}
                            onBlur={() =>
                              updateSetting(
                                "exaApiKey",
                                form.getValues("exaApiKey")
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="exaApiProxy"
                    render={({ field }) => (
                      <FormItem className="from-item">
                        <FormLabel className="from-label">
                          {t("setting.apiUrlLabel")}
                        </FormLabel>
                        <FormControl className="form-field">
                          <Input
                            placeholder={EXA_BASE_URL}
                            {...field}
                            onBlur={() =>
                              updateSetting(
                                "exaApiProxy",
                                form.getValues("exaApiProxy")
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="exaScope"
                    render={({ field }) => (
                      <FormItem className="from-item">
                        <FormLabel className="from-label">
                          {t("setting.scopeLabel")}
                        </FormLabel>
                        <FormControl className="form-field">
                          <Input
                            placeholder={t("setting.scopePlaceholder")}
                            {...field}
                            onBlur={() =>
                              updateSetting(
                                "exaScope",
                                form.getValues("exaScope")
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div
                  className={cn("space-y-4", {
                    hidden: searchProvider !== "bocha",
                  })}
                >
                  <FormField
                    control={form.control}
                    name="bochaApiKey"
                    render={({ field }) => (
                      <FormItem className="from-item">
                        <FormLabel className="from-label">
                          {t("setting.apiKeyLabel")}
                        </FormLabel>
                        <FormControl className="form-field">
                          <Input
                            type="password"
                            placeholder={t("setting.apiKeyPlaceholder")}
                            {...field}
                            onBlur={() =>
                              updateSetting(
                                "bochaApiKey",
                                form.getValues("bochaApiKey")
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bochaApiProxy"
                    render={({ field }) => (
                      <FormItem className="from-item">
                        <FormLabel className="from-label">
                          {t("setting.apiUrlLabel")}
                        </FormLabel>
                        <FormControl className="form-field">
                          <Input
                            placeholder={BOCHA_BASE_URL}
                            {...field}
                            onBlur={() =>
                              updateSetting(
                                "bochaApiProxy",
                                form.getValues("bochaApiProxy")
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div
                  className={cn("space-y-4", {
                    hidden: searchProvider !== "searxng",
                  })}
                >
                  <FormField
                    control={form.control}
                    name="searxngApiProxy"
                    render={({ field }) => (
                      <FormItem className="from-item">
                        <FormLabel className="from-label">
                          {t("setting.apiUrlLabel")}
                        </FormLabel>
                        <FormControl className="form-field">
                          <Input
                            placeholder={SEARXNG_BASE_URL}
                            {...field}
                            onBlur={() =>
                              updateSetting(
                                "searxngApiProxy",
                                form.getValues("searxngApiProxy")
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="searxngScope"
                    render={({ field }) => (
                      <FormItem className="from-item">
                        <FormLabel className="from-label">
                          {t("setting.scopeLabel")}
                        </FormLabel>
                        <FormControl className="form-field">
                          <Input
                            placeholder={t("setting.scopePlaceholder")}
                            {...field}
                            onBlur={() =>
                              updateSetting(
                                "searxngScope",
                                form.getValues("searxngScope")
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="parallelSearch"
                  render={({ field }) => (
                    <FormItem className="from-item">
                      <FormLabel className="from-label">
                        <HelpTip tip={t("setting.parallelSearchTip")}>
                          {t("setting.parallelSearch")}
                        </HelpTip>
                      </FormLabel>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          onValueChange={(value) => {
                            field.onChange(value[0]);
                            updateSetting("parallelSearch", value[0]);
                          }}
                          max={5}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="searchMaxResult"
                  render={({ field }) => (
                    <FormItem className="from-item">
                      <FormLabel className="from-label">
                        <HelpTip tip={t("setting.searchMaxResultTip")}>
                          {t("setting.searchMaxResult")}
                        </HelpTip>
                      </FormLabel>
                      <FormControl>
                        <Slider
                          value={[field.value]}
                          onValueChange={(value) => {
                            field.onChange(value[0]);
                            updateSetting("searchMaxResult", value[0]);
                          }}
                          max={10}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent className="space-y-4 min-h-[250px]" value="general">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem className="from-item">
                      <FormLabel className="from-label">
                        <HelpTip tip={t("setting.languageTip")}>
                          {t("setting.language")}
                        </HelpTip>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            updateSetting("language", value);
                          }}
                        >
                          <SelectTrigger className="form-field">
                            <SelectValue />
                          </SelectTrigger>
                                                      <SelectContent>
                              {Object.entries(locales).map(([code, name]) => (
                                <SelectItem key={code} value={code}>
                                  {name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem className="from-item">
                      <FormLabel className="from-label">
                        <HelpTip tip={t("setting.themeTip")}>
                          {t("setting.theme")}
                        </HelpTip>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            updateSetting("theme", value);
                          }}
                        >
                          <SelectTrigger className="form-field">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="system">
                              {t("setting.system")}
                            </SelectItem>
                            <SelectItem value="light">
                              {t("setting.light")}
                            </SelectItem>
                            <SelectItem value="dark">
                              {t("setting.dark")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">
                      {t("setting.installPWA")}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("setting.installPWADescription")}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={installPWA}
                    className="shrink-0"
                  >
                    <MonitorDown className="w-4 h-4 mr-2" />
                    {t("setting.install")}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">
                      {t("setting.resetSetting")}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("setting.resetSettingDescription")}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="shrink-0"
                  >
                    {t("setting.reset")}
                  </Button>
                </div>
                {VERSION && (
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        {t("setting.version")}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t("setting.versionDescription")}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                        {VERSION}
                      </code>
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent className="space-y-4 min-h-[250px]" value="experimental">
                <FormField
                  control={form.control}
                  name="debug"
                  render={({ field }) => (
                    <FormItem className="from-item">
                      <FormLabel className="from-label">
                        <HelpTip tip={t("setting.debugTip")}>
                          {t("setting.debug")}
                        </HelpTip>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            updateSetting("debug", value);
                          }}
                        >
                          <SelectTrigger className="form-field">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="enable">
                              {t("setting.enable")}
                            </SelectItem>
                            <SelectItem value="disable">
                              {t("setting.disable")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="references"
                  render={({ field }) => (
                    <FormItem className="from-item">
                      <FormLabel className="from-label">
                        <HelpTip tip={t("setting.referencesTip")}>
                          {t("setting.references")}
                        </HelpTip>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            updateSetting("references", value);
                          }}
                        >
                          <SelectTrigger className="form-field">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="enable">
                              {t("setting.enable")}
                            </SelectItem>
                            <SelectItem value="disable">
                              {t("setting.disable")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="citationImage"
                  render={({ field }) => (
                    <FormItem className="from-item">
                      <FormLabel className="from-label">
                        <HelpTip tip={t("setting.citationImageTip")}>
                          {t("setting.citationImage")}
                        </HelpTip>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            updateSetting("citationImage", value);
                          }}
                        >
                          <SelectTrigger className="form-field">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="enable">
                              {t("setting.enable")}
                            </SelectItem>
                            <SelectItem value="disable">
                              {t("setting.disable")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="smoothTextStreamType"
                  render={({ field }) => (
                    <FormItem className="from-item">
                      <FormLabel className="from-label">
                        <HelpTip tip={t("setting.smoothTextStreamTypeTip")}>
                          {t("setting.smoothTextStreamType")}
                        </HelpTip>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            updateSetting("smoothTextStreamType", value);
                          }}
                        >
                          <SelectTrigger className="form-field">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="character">
                              {t("setting.character")}
                            </SelectItem>
                            <SelectItem value="word">
                              {t("setting.word")}
                            </SelectItem>
                            <SelectItem value="line">
                              {t("setting.line")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="onlyUseLocalResource"
                  render={({ field }) => (
                    <FormItem className="from-item">
                      <FormLabel className="from-label">
                        <HelpTip tip={t("setting.onlyUseLocalResourceTip")}>
                          {t("setting.onlyUseLocalResource")}
                        </HelpTip>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            updateSetting("onlyUseLocalResource", value);
                          }}
                        >
                          <SelectTrigger className="form-field">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="enable">
                              {t("setting.enable")}
                            </SelectItem>
                            <SelectItem value="disable">
                              {t("setting.disable")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                {t("setting.cancel")}
              </Button>
              <Button type="submit" onClick={form.handleSubmit(handleSubmit)}>
                {t("setting.save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default Setting;
