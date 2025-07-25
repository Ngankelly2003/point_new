import React, { ReactNode, useState } from "react";
import { Modal, Button } from "antd";
import { useForm } from "antd/lib/form/Form";

interface ModalWrapperProps {
  buttonTitle: string;
  modalTitle?: string;
  children: any;
  handleOpen?: () => void;
  handleCancel?: () => void;
  isOpen?: any;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isOpen,
  buttonTitle,
  modalTitle,
  children,
  handleOpen,
  handleCancel,
}) => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const showModal = () => setIsModalOpen(true);
  // const handleCancel = () => setIsModalOpen(false);
  //console.log("open", isModalOpen)
  return (
    <>
      <Button
        type="primary"
        style={{
          padding: "12px 24px",
          height: "48px",
          fontSize: "18px",
          borderRadius: "8px",
        }}
        onClick={handleOpen}
      >
        {buttonTitle}
      </Button>
      <Modal
        width={900}
        title={modalTitle}
        open={isOpen}
        onCancel={handleCancel}
        footer={null}
      >
        {children}
      </Modal>
    </>
  );
};

export default ModalWrapper;
