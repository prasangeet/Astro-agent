"use client";

import React, { useState, useRef, useEffect } from "react";
import DefaultLayout from "@/layouts/default";
import {
  Button,
  Card,
  Input,
  DatePicker,
  TimeField,
  Label,
  DateField,
  Calendar,
  Badge,
  Tooltip
} from "@heroui/react";
import ReactMarkdown from "react-markdown";
import clsx from "clsx";

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

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function Chat() {
  const [hasChartData, setHasChartData] = useState(false);
  const [birthLocation, setBirthLocation] = useState("");
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-welcome",
      role: "assistant",
      content: "Pranam. I am **Aradhana**, your daily spiritual companion. Provide your birth geometry parameters above, or ask me directly to interpret current planetary configurations.",
      timestamp: "12:00 PM"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isAgentStreaming, setIsAgentStreaming] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAgentStreaming]);

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthLocation.trim()) return;

    setIsOnboardingLoading(true);
    setTimeout(() => {
      setIsOnboardingLoading(false);
      setHasChartData(true);

      setMessages((prev) => [
        ...prev,
        {
          id: `sys-onboarding-${Date.now()}`,
          role: "assistant",
          content: `Birth chart computed successfully for location **${birthLocation}**. Your natal geometry is registered.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1400);
  };

  const handleSendMessage = (textToSend?: string) => {
    const targetText = textToSend || inputValue;
    if (!targetText.trim() || isAgentStreaming) return;

    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessageId = `user-${Date.now()}`;

    setMessages((prev) => [...prev, { id: userMessageId, role: "user", content: targetText, timestamp: timestampStr }]);
    if (!textToSend) setInputValue("");
    setIsAgentStreaming(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: "### Planetary Alignment Matrix\n\nAnalyzing historical planetary indices relative to your birth positions.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsAgentStreaming(false);
    }, 2000);
  };

  const starterPrompts = [
    { label: "💼 Career Track", text: "What does my natal geometry express regarding career transitions over the next 30 days?" },
    { label: "🪐 Daily Transits", text: "Compute today's current planetary transits relative to my birth coordinates." },
    { label: "✨ Spiritual Advice", text: "Suggest an intentionally tailored meditation focus based on my current lunar alignment." }
  ];

  return (
    <DefaultLayout>
      <div className="w-full h-[calc(100vh-5rem)] max-w-5xl mx-auto flex flex-col p-4 sm:p-6 gap-4 overflow-hidden">

        {/* Onboarding Input Panel */}
        <section className="w-full flex-shrink-0">
          <Card className="p-4 bg-surface-secondary/30 border border-separator/60 rounded-[var(--field-radius)] shadow-none">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-separator/40 pb-2">
                <div className="flex items-center gap-2">
                  <CompassIcon className="w-4 h-4 text-accent" />
                  <h2 className="text-xs font-bold tracking-wider uppercase text-foreground">
                    {hasChartData ? "Natal Configuration Active" : "Initialize Computational Chart Details"}
                  </h2>
                </div>
                {hasChartData && (
                  <Badge content="Grounded" color="success" className="text-[10px]" />
                )}
              </div>

              <form onSubmit={handleOnboardingSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">

                {/* 1. DatePicker implementing correct Reference formatting + alignment */}
                <div className="flex flex-col w-full text-foreground">
                  <DatePicker
                    name="birthDate"
                    className="w-full"
                  >
                    <Label className="text-xs font-medium text-foreground/70 block mb-1">Date of Birth</Label>
                    <DateField.Group className="flex h-10 w-full items-center justify-between rounded-xl border border-separator/60 bg-surface-secondary/20 px-3 text-sm focus-within:ring-2 focus-within:ring-accent">
                      <DateField.Input className="flex gap-0.5 select-none text-foreground">
                        {(segment) => <DateField.Segment segment={segment} className="px-0.5 outline-none focus:bg-accent focus:text-accent-foreground rounded-sm" />}
                      </DateField.Input>
                      <DateField.Suffix>
                        <DatePicker.Trigger className="text-foreground/50 hover:text-foreground transition-colors">
                          <DatePicker.TriggerIndicator />
                        </DatePicker.Trigger>
                      </DateField.Suffix>
                    </DateField.Group>

                    <DatePicker.Popover className="bg-background border border-separator rounded-xl shadow-xl z-50 overflow-hidden">
                      <Calendar aria-label="Choose date" className="w-64 sm:w-72 max-w-full bg-background p-3 text-foreground">
                        <Calendar.Header className="flex items-center justify-between pb-2 mb-1 border-b border-separator/30">
                          <Calendar.YearPickerTrigger className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-foreground/80 hover:text-accent transition-colors">
                            <Calendar.YearPickerTriggerHeading />
                            <Calendar.YearPickerTriggerIndicator />
                          </Calendar.YearPickerTrigger>
                          <div className="flex gap-0.5">
                            <Calendar.NavButton slot="previous" className="p-1.5 rounded-lg hover:bg-surface-secondary text-foreground/70" />
                            <Calendar.NavButton slot="next" className="p-1.5 rounded-lg hover:bg-surface-secondary text-foreground/70" />
                          </div>
                        </Calendar.Header>
                        <Calendar.Grid className="w-full border-collapse gap-1">
                          <Calendar.GridHeader>
                            {(day) => (
                              <Calendar.HeaderCell className="text-[11px] font-medium text-muted p-1 text-center w-8 h-8">
                                {day.slice(0, 2)}
                              </Calendar.HeaderCell>
                            )}
                          </Calendar.GridHeader>
                          <Calendar.GridBody>
                            {(date) => (
                              <Calendar.Cell
                                date={date}
                                className="p-0 text-center text-xs rounded-lg hover:bg-accent/20 cursor-pointer w-8 h-8 flex items-center justify-center transition-all data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-30 data-[disabled=true]:pointer-events-none"
                              />
                            )}
                          </Calendar.GridBody>
                        </Calendar.Grid>
                        <Calendar.YearPickerGrid className="w-full gap-2 pt-2">
                          <Calendar.YearPickerGridBody>
                            {({ year }) => (
                              <Calendar.YearPickerCell
                                year={year}
                                className="p-1 text-center text-xs rounded-md hover:bg-surface-secondary cursor-pointer transition-colors"
                              />
                            )}
                          </Calendar.YearPickerGridBody>
                        </Calendar.YearPickerGrid>
                      </Calendar>
                    </DatePicker.Popover>
                  </DatePicker>
                </div>

                {/* 2. TimeField using proper composite mapping primitives */}
                <div className="flex flex-col w-full text-foreground">
                  <TimeField name="birthTime" className="w-full">
                    <Label className="text-xs font-medium text-foreground/70 block mb-1">Time of Birth</Label>
                    <TimeField.Group className="flex h-10 w-full items-center rounded-xl border border-separator/60 bg-surface-secondary/20 px-3 text-sm focus-within:ring-2 focus-within:ring-accent">
                      <TimeField.Input className="flex gap-0.5 select-none text-foreground">
                        {(segment) => <TimeField.Segment segment={segment} className="px-0.5 outline-none focus:bg-accent focus:text-accent-foreground rounded-sm" />}
                      </TimeField.Input>
                    </TimeField.Group>
                  </TimeField>
                </div>

                {/* 3. Birth Location Input */}
                <div className="flex flex-col w-full">
                  <Input
                    label="Birth Location"
                    labelPlacement="outside"
                    placeholder="City, Country..."
                    size="sm"
                    variant="bordered"
                    value={birthLocation}
                    onChange={(e) => setBirthLocation(e.target.value)}
                    className="w-full text-foreground"
                  />
                </div>

                {/* 4. Action Button */}
                <Button
                  type="submit"
                  color={hasChartData ? "default" : "primary"}
                  isLoading={isOnboardingLoading}
                  className="w-full font-medium text-xs tracking-wider uppercase h-10 rounded-xl"
                >
                  {hasChartData ? "Update Matrix" : "Compute Ephemeris"}
                </Button>
              </form>
            </div>
          </Card>
        </section>

        {/* Chat Component Stream */}
        <section className="flex-1 flex flex-col min-h-0 bg-transparent overflow-hidden justify-between">
          <div className="flex-1 overflow-y-auto flex flex-col gap-6 px-1 mb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={clsx(
                  "flex flex-col max-w-[85%] gap-1",
                  msg.role === "user" ? "self-end items-end" : "self-start items-start"
                )}
              >
                <div
                  className={clsx(
                    "px-4 py-3 rounded-[var(--field-radius)] text-sm leading-relaxed tracking-wide shadow-none",
                    msg.role === "user"
                      ? "bg-accent text-accent-foreground rounded-br-none font-medium"
                      : "bg-surface-secondary/40 border border-separator text-foreground rounded-bl-none w-full"
                  )}
                >
                  <div className="prose prose-sm dark:prose-invert max-w-none text-inherit font-sans space-y-1 block break-words [overflow-wrap:anywhere] select-text">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="m-0 leading-relaxed inline-block w-full">{children}</p>,
                        strong: ({ children }) => <strong className="font-bold text-accent px-0.5">{children}</strong>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
                <span className="text-[10px] text-muted px-2 tracking-widest mt-0.5">{msg.timestamp}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input control block */}
          <footer className="pt-3 pb-4 px-1 bg-transparent border-t border-separator/40 flex flex-col gap-3 flex-shrink-0 w-full relative z-10">
            <div className="flex flex-wrap gap-2">
              {starterPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  disabled={isAgentStreaming}
                  onClick={() => handleSendMessage(prompt.text)}
                  className="text-[11px] font-medium tracking-wide border border-separator/60 hover:border-accent bg-surface-secondary/20 hover:bg-surface-secondary/80 text-foreground/90 transition-all px-3 py-1.5 rounded-[var(--field-radius)] disabled:opacity-50 disabled:pointer-events-none"
                >
                  {prompt.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full relative mb-1">
              <Input
                aria-label="Agent Prompt Input"
                placeholder={hasChartData ? "Ask about career trajectories, daily cosmic transits..." : "Provide birth specs above or ask general inquiries..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isAgentStreaming}
                className="flex-1 text-foreground"
                size="md"
              />
              <Tooltip content="Disseminate query payload to AstroAgent Graph">
                <Button
                  isIconOnly
                  disabled={!inputValue.trim() || isAgentStreaming}
                  onPress={() => handleSendMessage()}
                  className="h-12 w-12 rounded-[var(--field-radius)] min-w-0 bg-accent text-accent-foreground flex items-center justify-center flex-shrink-0"
                >
                  <SendIcon className="w-4 h-4" />
                </Button>
              </Tooltip>
            </div>

            <div className="flex items-center justify-between text-[10px] text-muted px-0.5 mt-0.5">
              <span>Graph Framework Base: LangGraph API V1</span>
              <span className="text-right">AstroAgent Framework</span>
            </div>
          </footer>
        </section>
      </div>
    </DefaultLayout>
  );
}
