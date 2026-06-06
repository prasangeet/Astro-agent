"use client";

import React from "react";
import {
  Button,
  Input,
  Modal
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
      {/* Locked dismiss flags ensure structural compliance during initial verification */}
      <Modal.Backdrop isOpen={isOpen} isDismissable={false} isKeyboardDismissDisabled={true}>
        <Modal.Container placement="center">
          <Modal.Dialog className="w-full max-w-sm bg-background border border-separator/60 rounded-[var(--field-radius)] shadow-2xl p-6 text-foreground">

            <Modal.Header className="pb-3 mb-4 border-b border-separator/30 p-0">
              <Modal.Heading className="text-sm font-bold uppercase tracking-wider text-foreground">
                Welcome to Aradhana
              </Modal.Heading>
            </Modal.Header>

            <Modal.Body className="p-0 mb-6">
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

            <Modal.Footer className="p-0 flex items-center justify-end w-full">
              <Button
                variant="primary"
                isLoading={isLoading}
                onPress={onSubmit}
                className="w-full font-medium text-xs tracking-wider uppercase h-10 rounded-xl bg-accent text-accent-foreground"
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
