"use client";

import { TextButton } from "@/components/buttons";
import { cn } from "@/utils/cn";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { ClassValue } from "clsx";
import { AlertCircle, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

export type ConfirmDialogType = "warning" | "error" | "success" | "info";

export const ConfirmDialog = ({
  isOpen,
  onOpenChange,
  title = "Warning",
  content = "The shift you're attempting to set has already existed. Would you like to overwrite it?",
  type = "warning",
  onAccept,
  onCancel,
  className,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title?: string;
  content?: string;
  type?: ConfirmDialogType;
  onAccept?: () => void;
  onCancel?: () => void;
  className?: ClassValue;
}) => {
  const answerButton = type === "warning" ? "Yes" : "Ok";
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => onOpenChange(!isOpen)}
      className={cn(
        "h-fit text-primaryWord rounded-lg overflow-hidden",
        className
      )}
      size="md"
    >
      <ModalContent className="font-sans">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-row gap-2 items-center">
              {type === "warning" && (
                <AlertTriangle className="text-yellow-500" size={16} />
              )}
              {type === "error" && (
                <XCircle className="text-red-500" size={16} />
              )}
              {type === "success" && (
                <CheckCircle className="text-green-500" size={16} />
              )}
              {type === "info" && (
                <AlertCircle className="text-blue-500" size={16} />
              )}

              {title}
            </ModalHeader>
            <ModalBody>{content}</ModalBody>
            <ModalFooter className="flex flex-row justify-end gap-3">
              <TextButton
                type="button"
                onClick={onAccept}
                content={answerButton}
                className={cn(
                  "w-[100px]",
                  type === "warning" ? "bg-red-500" : "bg-gray-100"
                )}
              />
              <TextButton
                type="button"
                onClick={onCancel}
                content="Cancel"
                className="w-[100px] bg-gray-100 text-secondaryWord"
              />
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export type UseConfirmDialogType = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
  title: string;
  content: string;
  type: ConfirmDialogType;
  setConfirmDialog: (
    title: string,
    content: string,
    confirmDialog: ConfirmDialogType
  ) => void;
};

export const useConfirmDialog = (): UseConfirmDialogType => {
  const [isOpen, setIsOpen] = useState(false);
  const setOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<ConfirmDialogType>("warning");
  const setConfirmDialog = (
    title: string,
    content: string,
    confirmDialog: ConfirmDialogType
  ) => {
    setTitle(title);
    setContent(content);
    setType(confirmDialog);
  };
  return { isOpen, setOpen, title, content, type, setConfirmDialog };
};
