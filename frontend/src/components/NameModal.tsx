"use client";

import React from "react";
import {
  Modal,
  Button,
  Input
} from "@heroui/react";

interface NameModalProps {
  isOpen: boolean;
  name: string;
  setName: (value: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
}

export default function NameModal({
  isOpen,
  name,
  setName,
  isLoading,
  onSubmit,
}: NameModalProps) {
  return (
    <Modal>
      <Modal.Backdrop
        isOpen={isOpen}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        variant="transparent"
        className="bg-black/50"
      >
        <Modal.Container placement="center" size="sm">
          {/* Removed padding (p-6) from here so the background box snaps tightly to the content limits */}
          <Modal.Dialog className="w-full bg-background border border-separator/60 rounded-[var(--field-radius)] shadow-2xl text-foreground">

            {/* Added clean, standardized horizontal and vertical padding here */}
            <Modal.Header className="pt-6 px-6 pb-3 border-b border-separator/30">
              <Modal.Heading className="text-sm font-bold uppercase tracking-wider text-foreground">
                Welcome to Aradhana
              </Modal.Heading>
            </Modal.Header>

            {/* Added comfortable padding here so the input's focus rings never get clipped */}
            <Modal.Body className="py-4 px-6">
              <Input
                label="Your Name"
                labelPlacement="outside"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full text-foreground"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    onSubmit();
                  }
                }}
              />
            </Modal.Body>

            {/* Added padding here to align the continue button seamlessly */}
            <Modal.Footer className="pb-6 px-6 pt-2 flex items-center justify-end w-full">
              <Button
                isLoading={isLoading}
                onPress={onSubmit}
                className="w-full font-medium text-xs tracking-wider uppercase h-10 rounded-[var(--radius)] bg-accent text-accent-foreground"
              >
                Continue
              </Button>
            </Modal.Footer>

          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
