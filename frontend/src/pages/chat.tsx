"use client";

import React, { useState, useEffect } from "react";
import DefaultLayout from "@/layouts/default";
import { Button, Input, Tooltip, toast, Spinner } from "@heroui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import clsx from "clsx";
import BirthDetailsModal from "@/components/BirthDetailsModal";
import NameModal from "@/components/NameModal";

import {
  createBirthProfile,
  getBirthProfile,
  updateBirthProfile
} from "@/api/birth-profile";

import { createUser } from "@/api/user";
import { sendMessage } from "@/api/chat";
import { getUserId, saveUser } from "@/utils/user";

const CompassIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={props.className}>
    <circle cx="12" cy="12" r="10" />
    <path d="m16.2 7.8-2.8 5.6-5.6 2.8 2.8-5.6 5.6-2.8z" />
  </svg>
);

const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={props.className}>
    <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const GlitterStarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" viewBox="0 0 24 24" className={props.className}>
    <path d="M12 24c0-6.627 5.373-12 12-12-6.373 0-12-5.373-12-12-0 6.627-5.373 12-12 12 6.373 0 12 5.373 12 12z" />
  </svg>
);

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// Utility function to extract flat string content out of react-markdown's node children structure
// This prevents HeroUI/React from throwing [object Object] assertion crashes.
const flattenNodeText = (children: React.ReactNode): string => {
  if (!children) return "";
  if (typeof children === "string") return children;
  if (typeof children === "number") return children.toString();
  if (Array.isArray(children)) return children.map(flattenNodeText).join("");
  if (React.isValidElement(children) && children.props && children.props.children) {
    return flattenNodeText(children.props.children);
  }
  return "";
};

export default function Chat() {
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  const [hasChartData, setHasChartData] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(false);

  const [birthDate, setBirthDate] = useState<any>(null);
  const [birthTime, setBirthTime] = useState<any>(null);
  const [birthLocation, setBirthLocation] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-welcome",
      role: "assistant",
      content: "Pranam. I am **Aradhana**, your daily spiritual companion. Provide your birth geometry parameters above, or ask me directly to interpret current planetary configurations.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isAgentStreaming, setIsAgentStreaming] = useState(false);
  const [thinkingStatus, setThinkingStatus] = useState("Aligning planetary lenses...");

  useEffect(() => {
    if (!isAgentStreaming) return;
    const statusPhases = [
      "Aligning planetary lenses...",
      "Querying LangGraph cosmic state registry...",
      "Intersecting current ephemeris with natal house systems...",
      "Synthesizing aspect geometric angles...",
      "Finalizing intuitive interpretive summary..."
    ];
    let currentPhase = 0;
    const interval = setInterval(() => {
      if (currentPhase < statusPhases.length - 1) {
        currentPhase++;
        setThinkingStatus(statusPhases[currentPhase]);
      }
    }, 3200);
    return () => clearInterval(interval);
  }, [isAgentStreaming]);

  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, isAgentStreaming]);

  useEffect(() => {
    const existingUserId = getUserId();
    const savedName = localStorage.getItem("user_name");
    if (savedName) {
      setUserName(savedName);
    }

    if (!existingUserId) {
      setIsNameModalOpen(true);
      return;
    }
    setUserId(existingUserId);
    handleLoadBirthProfile(existingUserId);
  }, []);

  const handleLoadBirthProfile = async (targetId: number) => {
    try {
      const profile = await getBirthProfile(targetId);
      if (profile) {
        setBirthLocation(profile.place);
        setHasChartData(true);
        toast.success("Welcome back! Stored natal chart loaded.");
        return profile;
      }
      return null;
    } catch (error) {
      toast.info("Session verified. Please configure your birth profile details.");
      return null;
    }
  };

  const handleCreateUser = async () => {
    if (!userName.trim()) {
      toast.warning("Please enter a valid identity descriptor label.");
      return;
    }
    try {
      setIsCreatingUser(true);
      const user = await createUser({ name: userName.trim() });
      saveUser(user.id, user.name);
      localStorage.setItem("user_name", user.name);
      setUserId(user.id);
      setIsNameModalOpen(false);
      toast.success(`Identity established. Welcome, ${user.name}!`);
      setIsDialogOpen(true);
    } catch (error) {
      console.error(error);
      toast.danger("Failed to initialize user session registry.");
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleCreateBirthProfile = async (e: React.FormEvent) => {
    try {
      setIsOnboardingLoading(true);
      await createBirthProfile({
        user_id: userId!,
        date: birthDate.toString(),
        time: birthTime.toString(),
        place: birthLocation,
      });
      setHasChartData(true);
      setIsDialogOpen(false);
      toast.success("Birth matrix configuration saved successfully!");
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Birth chart computed successfully for **${birthLocation}**. You may now prompt the computational AstroAgent freely.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (error) {
      console.error(error);
      toast.danger("Could not compute profile geometry.");
    } finally {
      setIsOnboardingLoading(false);
    }
  };

  const handleUpdateBirthProfile = async (e: React.FormEvent) => {
    try {
      setIsOnboardingLoading(true);
      await updateBirthProfile(userId!, {
        user_id: userId!,
        date: birthDate.toString(),
        time: birthTime.toString(),
        place: birthLocation,
      });
      setIsDialogOpen(false);
      toast.success("Profile chart matrix updated successfully!");
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Birth profile updated successfully. Natal chart regenerated.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (error) {
      console.error(error);
      toast.danger("Failed to update profile geometric specifications.");
    } finally {
      setIsOnboardingLoading(false);
    }
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate || !birthTime || !birthLocation.trim()) {
      toast.warning("Please fill in all mandatory calculation components.");
      return;
    }
    if (hasChartData) {
      await handleUpdateBirthProfile(e);
      return;
    }
    await handleCreateBirthProfile(e);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const targetText = textToSend || inputValue;
    if (!targetText.trim()) return;

    if (!hasChartData) {
      toast.warning("AstroAgent requires coordinates. Please set your birth details first.");
      setIsDialogOpen(true);
      return;
    }
    if (isAgentStreaming) {
      toast.warning("System stream active. Please wait for the current alignment output cycle to complete.");
      return;
    }

    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessageId = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      { id: userMessageId, role: "user", content: targetText, timestamp: timestampStr }
    ]);

    if (!textToSend) setInputValue("");
    setThinkingStatus("Aligning planetary lenses...");
    setIsAgentStreaming(true);

    try {
      const result = await sendMessage({ user_id: userId!, message: targetText });
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: result.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (error) {
      console.error(error);
      toast.danger("System failure communication node trace broken.");
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "System communication link failure. Unable to parse coordinates context parameters with AstroAgent pipeline graph.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsAgentStreaming(false);
    }
  };

  const starterPrompts = [
    { label: "💼 Career Track", text: "What does my natal geometry express regarding career transitions over the next 30 days?" },
    { label: "🪐 Daily Transits", text: "Compute today's current planetary transits relative to my birth coordinates." },
    { label: "✨ Spiritual Advice", text: "Suggest an intentionally tailored meditation focus based on my current lunar alignment." }
  ];

  const userInitial = userName.trim() ? userName.trim()[0].toUpperCase() : "U";

  return (
    <DefaultLayout>
      <div className="w-full min-h-screen bg-background relative flex flex-col overflow-visible">

        {/* Header Section */}
        <section className="sticky top-0 w-full h-14 border-b border-separator/40 px-6 flex items-center justify-between bg-background/80 backdrop-blur-md z-30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <CompassIcon className="w-4 h-4 text-accent" />
            <h2 className="text-xs font-bold tracking-wider uppercase text-foreground">
              {hasChartData ? "Natal Configuration Active" : "Computational AstroAgent Graph"}
            </h2>
            {hasChartData && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide bg-success/10 text-success border border-success/20">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Grounded
              </span>
            )}
          </div>
          <Button
            variant={hasChartData ? "bordered" : "solid"}
            color={hasChartData ? "default" : "primary"}
            onPress={() => setIsDialogOpen(true)}
            className="text-xs font-semibold uppercase tracking-wider h-8 px-4 rounded-lg border-separator/60"
            disabled={isNameModalOpen}
          >
            {hasChartData ? "Update Birth Details" : "Set Birth Details"}
          </Button>
        </section>

        {/* Message Thread Workspace */}
        <div className="w-full flex-1 overflow-visible px-4 pt-6 pb-52">
          <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={clsx(
                  "flex items-start gap-4 w-full",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {msg.role === "user" ? (
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-accent text-white font-bold text-xs shadow-md border border-accent/20 select-none">
                    {userInitial}
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-surface-secondary text-accent shadow-md border border-separator/60 select-none">
                    <GlitterStarIcon className="w-4 h-4" />
                  </div>
                )}

                <div className={clsx("flex flex-col gap-1.5 max-w-[85%]", msg.role === "user" ? "items-end" : "items-start")}>
                  <div className="text-[10px] text-muted tracking-widest uppercase font-mono px-0.5">
                    {msg.role === "user" ? (userName || "User") : "Aradhana"}
                  </div>

                  <div
                    className={clsx(
                      "px-4 py-3 rounded-2xl text-sm leading-relaxed tracking-wide shadow-none border",
                      msg.role === "user"
                        ? "bg-accent/10 border-accent/30 text-foreground rounded-tr-none"
                        : "bg-surface-secondary/30 border-separator text-foreground rounded-tl-none w-full"
                    )}
                  >
                    <div className="prose prose-sm dark:prose-invert max-w-none text-inherit font-sans block break-words [overflow-wrap:anywhere] select-text">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          table: ({ children }) => (
                            <div className="w-full my-4 overflow-x-auto border border-separator/40 rounded-xl bg-surface-secondary/10">
                              <table className="w-full text-left border-collapse m-0 p-0">{children}</table>
                            </div>
                          ),
                          thead: ({ children }) => <thead className="bg-surface-secondary/30 border-b border-separator/40">{children}</thead>,
                          tbody: ({ children }) => <tbody>{children}</tbody>,
                          tr: ({ children }) => (
                            <tr className="border-b border-separator/20 last:border-0 hover:bg-surface-secondary/10 transition-colors">
                              {children}
                            </tr>
                          ),
                          th: ({ children }) => (
                            <th className="p-3 text-xs font-bold uppercase tracking-wider text-accent">
                              {flattenNodeText(children)}
                            </th>
                          ),
                          td: ({ children }) => (
                            <td className="p-3 text-sm text-foreground/80 leading-relaxed [overflow-wrap:anywhere]">
                              {/* Using simple text flattening to safely output data inside cells */}
                              {flattenNodeText(children)}
                            </td>
                          ),
                          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed text-foreground/90">{children}</p>,
                          strong: ({ children }) => <strong className="font-bold text-accent px-0.5">{children}</strong>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                  <span className="text-[9px] text-muted-foreground/60 px-1 font-mono tracking-wider mt-0.5">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {/* Agent Streaming View Container */}
            {isAgentStreaming && (
              <div className="flex items-start gap-4 w-full animate-pulse">
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-surface-secondary text-accent border border-separator/60">
                  <GlitterStarIcon className="w-4 h-4" />
                </div>
                <div className="flex flex-col gap-1.5 w-full max-w-[85%]">
                  <div className="text-[10px] text-muted tracking-widest uppercase font-mono px-0.5">Computing Matrix</div>
                  <div className="px-5 py-3.5 rounded-2xl rounded-tl-none bg-surface-secondary/20 border border-separator/60 text-foreground flex items-center gap-3">
                    <Spinner size="sm" color="current" className="text-accent" />
                    <span className="text-xs font-mono tracking-wide text-muted-foreground">
                      {thinkingStatus}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Layout Footer */}
        <footer className="fixed bottom-0 left-0 right-0 max-w-[calc(100%-16px)] sm:max-w-3xl mx-auto border border-separator/20 rounded-t-2xl bg-background/80 backdrop-blur-md pt-4 pb-6 px-4 z-20 pointer-events-none">
          <div className="w-full flex flex-col gap-3 pointer-events-auto">
            <div className="flex flex-wrap gap-2">
              {starterPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  disabled={isAgentStreaming || isNameModalOpen}
                  onClick={() => handleSendMessage(prompt.text)}
                  className="text-[11px] font-medium tracking-wide border border-separator/60 hover:border-accent bg-surface-secondary/40 hover:bg-surface-secondary/80 text-foreground/90 transition-all px-3 py-1.5 rounded-[var(--field-radius)] disabled:opacity-50 disabled:pointer-events-none"
                >
                  {prompt.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full relative mb-1">
              <Input
                aria-label="Agent Prompt Input"
                placeholder={hasChartData ? "Ask about career trajectories, daily cosmic transits..." : "Provide birth specs above to begin planetary calculations..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isAgentStreaming || isNameModalOpen}
                className="flex-1 text-foreground"
                size="md"
              />
              <Tooltip content="Disseminate query payload to AstroAgent Graph">
                <Button
                  isIconOnly
                  disabled={!inputValue.trim() || isAgentStreaming || isNameModalOpen}
                  onPress={() => handleSendMessage()}
                  className="h-12 w-12 rounded-[var(--field-radius)] min-w-0 bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0"
                >
                  <SendIcon className="w-4 h-4" />
                </Button>
              </Tooltip>
            </div>

            <div className="flex items-center justify-between text-[10px] text-muted/80 px-0.5 mt-0.5 font-mono">
              <span>Graph Framework Base: LangGraph API V1</span>
              <span className="text-right">AstroAgent Framework</span>
            </div>
          </div>
        </footer>

        {/* Modal Interfaces */}
        <NameModal isOpen={isNameModalOpen} name={userName} setName={setUserName} isLoading={isCreatingUser} onSubmit={handleCreateUser} />
        <BirthDetailsModal isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} birthDate={birthDate} setBirthDate={setBirthDate} birthTime={birthTime} setBirthTime={setBirthTime} birthLocation={birthLocation} setBirthLocation={setBirthLocation} isLoading={isOnboardingLoading} onSubmit={handleOnboardingSubmit} />
      </div>
    </DefaultLayout>
  );
}
