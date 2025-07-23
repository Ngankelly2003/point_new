import { AppDispatch } from '@/store';
import { createUser } from '@/store/actions/user.action';
import { Button, Form, Input, Modal, Select } from 'antd/lib'
import { useForm } from 'antd/lib/form/Form';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';

interface Prop  {
    open: boolean ; 
    cancel: () => void;
    organizes: any ; 
    fetchUser:any ; 
    setIsModalOpen:any; 
}

function FormUser({open, cancel,organizes,fetchUser,setIsModalOpen}:Prop) {

const [form] = useForm() ;
 const dispatch = useDispatch<AppDispatch>();
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
}; 

const handleCreateUser = async () =>{
    try {
        const values = await form.validateFields(); 
    
        const formData = new FormData();
        formData.append('fullName', values.fullName);
        formData.append('email', values.email);
        formData.append('companyId', values.name);
        formData.append('password', values.password);
        formData.append('confirmPassword', values.password);
    
        const result = await dispatch(createUser(formData)).unwrap();
        fetchUser();
        console.log("Tạo thành công:", result);
        setIsModalOpen(false)
        form.resetFields();
        
      } catch (error) {
        console.error('Lỗi tạo project:', error);
      }
}
  return (
    <div>
    <Modal open = {open} onCancel={cancel} title="User Creation" footer={null}>
        <Form
        {...formItemLayout}
        form={form}
        layout="horizontal"
        style={{ maxWidth: 600, margin: '0 auto' }} 
        initialValues={{ variant: 'filled' }}
        
        >
        <Form.Item label="Name" name="fullName" rules={[{ required: true, message: 'Please input!' }]}>
            <Input />
        </Form.Item> 

    <     Form.Item label="Email address" name="email" rules={[{ required: true, message: 'Please input!' }]}>
            <Input />
        </Form.Item>

        <Form.Item
            label="Organize"
            name="name"
            rules={[{ required: true, message: 'Please select!' }]}
        >
            <Select>
            {organizes.map((organize:any) => (
                <Select.Option key={organize.id} value={organize.id}>
                {organize.name}
                </Select.Option>
            ))}
            </Select>  
        </Form.Item>

        <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input!' }]}
        >
            <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit"
             onClick={handleCreateUser}
             >
                Create User
            </Button>
        </Form.Item>
        </Form>
    </Modal>
    </div>
  )
}

export default FormUser