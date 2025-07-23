import { Button, Modal } from 'antd/lib';
import React, { useState } from 'react'

interface ModalWrapperProps {
  buttonTitle: string;
  modalTitle?: string;
  children: any ; 
}

function LayoutChilren({buttonTitle,modalTitle,children}:ModalWrapperProps) {
     const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);
      console.log("open", isModalOpen)
  return (
   <>
    <Button type='primary'  
        style={{
            padding: '12px 24px',
            height: '48px',
            fontSize: '18px',
            borderRadius: '8px',
        }}
            onClick={showModal}
        >{buttonTitle}
        </Button>
      <Modal
        width={900}
        title={modalTitle}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        
      >
        {children}
      </Modal>
   </>
  )
}

export default LayoutChilren