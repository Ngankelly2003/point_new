'use client'
import React from 'react'

import Search from 'antd/lib/input/Search';
import ModalWrapper from './ModalWrapper';


interface ContentProps {
    onClick?: () => void;
    handleOpen?: () => void;
    handleCancel?: () => void;
    isOpen:any
    titleForm?: string;
    title: string;
    buttonTitle: string;
    children : any
    onSearchChange?: (value: string) => void; 
}

function Content({title,buttonTitle,children,onSearchChange,titleForm,isOpen,handleOpen,handleCancel}: ContentProps) {
  const [inputValue, setInputValue] = React.useState<string>('');
  
  return (
    <div style={{marginBottom:'20px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1>{title}</h1>
          <ModalWrapper 
            buttonTitle={buttonTitle}
            modalTitle={titleForm}
            children={children} 
            handleOpen = {handleOpen}
            handleCancel={handleCancel}
            isOpen= {isOpen}
          />
      </div>
      <div>
         <Search 
          placeholder="search" 
          allowClear 
          style={{ width: 300 }} 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          onSearch={(val) => onSearchChange?.(val)}
        />
      </div>
    </div>
  )
}

export default Content