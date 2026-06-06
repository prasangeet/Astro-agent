"use client";

import React from "react";
import {
  Button,
  Input,
  DatePicker,
  TimeField,
  Label,
  DateField,
  Calendar,
  Modal
} from "@heroui/react";

const CompassIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className={props.className}>
    <circle cx="12" cy="12" r="10" />
    <path d="m16.2 7.8-2.8 5.6-5.6 2.8 2.8-5.6 5.6-2.8z" />
  </svg>
);

interface BirthDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  birthDate: any;
  setBirthDate: (value: any) => void;
  birthTime: any;
  setBirthTime: (value: any) => void;
  birthLocation: string;
  setBirthLocation: (value: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function BirthDetailsModal({
  isOpen,
  onClose,
  birthDate,
  setBirthDate,
  birthTime,
  setBirthTime,
  birthLocation,
  setBirthLocation,
  isLoading,
  onSubmit,
}: BirthDetailsModalProps) {
  return (
    <Modal>
      {/* Backdrop captures the controlled toggle state hooks directly */}
      <Modal.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
        <Modal.Container placement="center">
          <Modal.Dialog className="w-full max-w-md bg-background border border-separator/60 rounded-[var(--field-radius)] shadow-2xl overflow-hidden p-6 text-foreground relative">

            <Modal.CloseTrigger
              onClick={onClose}
              className="absolute top-4 right-4 text-foreground/40 hover:text-foreground cursor-pointer bg-transparent border-none p-0"
            />

            <Modal.Header className="flex items-center gap-2 border-b border-separator/30 pb-3 mb-4 p-0">
              <CompassIcon className="w-4 h-4 text-accent" />
              <Modal.Heading className="text-sm font-bold uppercase tracking-wider text-foreground">
                Initialize Geometry Matrix
              </Modal.Heading>
            </Modal.Header>

            <form onSubmit={onSubmit}>
              <Modal.Body className="flex flex-col gap-4 p-0 mb-6 overflow-visible">

                {/* 1. Date Selection Mapping */}
                <div className="flex flex-col w-full text-foreground">
                  <DatePicker
                    name="birthDate"
                    value={birthDate}
                    onChange={setBirthDate}
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

                    <DatePicker.Popover className="bg-background border border-separator rounded-xl shadow-xl z-[60] overflow-hidden">
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
                      </Calendar>
                    </DatePicker.Popover>
                  </DatePicker>
                </div>

                {/* 2. Temporal Specs Mapping */}
                <div className="flex flex-col w-full text-foreground">
                  <TimeField
                    name="birthTime"
                    value={birthTime}
                    onChange={setBirthTime}
                    className="w-full"
                  >
                    <Label className="text-xs font-medium text-foreground/70 block mb-1">Time of Birth</Label>
                    <TimeField.Group className="flex h-10 w-full items-center rounded-xl border border-separator/60 bg-surface-secondary/20 px-3 text-sm focus-within:ring-2 focus-within:ring-accent">
                      <TimeField.Input className="flex gap-0.5 select-none text-foreground">
                        {(segment) => <TimeField.Segment segment={segment} className="px-0.5 outline-none focus:bg-accent focus:text-accent-foreground rounded-sm" />}
                      </TimeField.Input>
                    </TimeField.Group>
                  </TimeField>
                </div>

                {/* 3. Location Coordinate Targets */}
                <div className="flex flex-col w-full">
                  <Input
                    label="Birth Location"
                    labelPlacement="outside"
                    placeholder="City, Country..."
                    value={birthLocation}
                    onChange={(e) => setBirthLocation(e.target.value)}
                    className="w-full text-foreground"
                  />
                </div>
              </Modal.Body>

              {/* 4. Submission Triggers */}
              <Modal.Footer className="flex items-center justify-end gap-2 pt-3 border-t border-separator/30 p-0">
                <Button
                  variant="outline"
                  onPress={onClose}
                  className="text-xs font-medium uppercase tracking-wider h-10 px-4 rounded-xl border-separator/60 text-foreground bg-transparent"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  className="font-medium text-xs tracking-wider uppercase h-10 px-6 rounded-xl bg-accent text-accent-foreground"
                >
                  Compute Matrix
                </Button>
              </Modal.Footer>
            </form>

          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
