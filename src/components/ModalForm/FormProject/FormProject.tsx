
import { AppDispatch } from '@/store';
import { createProject } from '@/store/actions/file.action';
import { getManagers } from '@/store/actions/user.action';
import { Button, Form, Input, Select } from 'antd/lib';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';

interface FormProjectProps {
   isOpen: boolean;
   fetchData: any;
   setIsModalOpen: any
}

function FormProject({ isOpen,fetchData,setIsModalOpen }: FormProjectProps) {
  const [form] = Form.useForm();
  const [managers, setManagers] = useState<any[]>([]);
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

  useEffect(() => {
    if (isOpen) {
      dispatch(getManagers({}))
        .unwrap()
        .then((res) => {
          setManagers(res.result);
        })
        .catch((err) => {
          console.error('Lỗi khi lấy managers:', err);
        });
    } else {
      setManagers([]);
      form.resetFields(); 
    }
}, [isOpen]);


const handleCreate = async () => {
  try {
    const values = await form.validateFields(); 

    const formData = new FormData();
    formData.append('no', values.no);
    formData.append('name', values.name);
    formData.append('client', values.client);
    formData.append('team', values.team);
    formData.append('description', values.explanation);
    formData.append('manager', values.manager);
    // formData.append('setting', ''); 

    const result = await dispatch(createProject(formData)).unwrap();
    fetchData();
    console.log("Tạo thành công:", result);
    setIsModalOpen(false)
    form.resetFields();
    
  } catch (error) {
    console.error('Lỗi tạo project:', error);
  }
};

  return (
   <Form
    {...formItemLayout}
      form={form}
      layout="horizontal"
      style={{ maxWidth: 600, margin: '0 auto' }} 
      initialValues={{ variant: 'filled' }}
      
    >
      <Form.Item label="Project No." name="no" rules={[{ required: true, message: 'Please input!' }]}>
        <Input />
      </Form.Item> 

<     Form.Item label="Project name" name="name" rules={[{ required: true, message: 'Please input!' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Client" name="client" rules={[{ required: true, message: 'Please input!' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Team" name="team" rules={[{ required: true, message: 'Please input!' }]}>
        <Input />
      </Form.Item>

      <Form.Item
        label="Manager"
        name="manager"
        rules={[{ required: true, message: 'Please select!' }]}
      >
        <Select>
          {managers.map((manager:any) => (
            <Select.Option key={manager.id} value={manager.id}>
              {manager.fullName}
            </Select.Option>
          ))}
        </Select>  
      </Form.Item>

      <Form.Item
        label="Explanation"
        name="explanation"
        rules={[{ required: true, message: 'Please input!' }]}
      >
        <Input.TextArea />
      </Form.Item>

     <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: 'center' }}>
        <Button type="primary" htmlType="submit" onClick={handleCreate}>
          Create
        </Button>
      </Form.Item>
    </Form>
  )
}

export default FormProject