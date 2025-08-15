import { errorToast, successToast } from "@/helpers/toast";
import { AppDispatch } from "@/store";
import { createUser, updateUser } from "@/store/actions/user.action";
import { Button, Form, Input, Modal, Select } from "antd/lib";
import { useForm } from "antd/lib/form/Form";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { mod } from "three/src/nodes/TSL.js";

interface Prop {
  open: boolean;
  cancel: () => void;
  organizes: any;
  fetchUser: any;
  setIsModalOpen: any;
  modalMode: any;
  setModalMode: any;
  editId?: any;
  setEditId?: any;
  form?: any;
}

function FormUser({
  open,
  cancel,
  organizes,
  fetchUser,
  setIsModalOpen,
  modalMode,
  setModalMode,
  editId,
  form,
}: Prop) {
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

  const handleSubmit = async () => {
    type PayloadType = {
      fullName: any;
      email: any;
      companyId: any;
      password?: any;
      confirmPassword?: any;
    };
    try {
      const values = await form.validateFields();
      let payload: PayloadType = {
        fullName: values.fullName,
        email: values.email,
        companyId: values.name,
      };
      if (modalMode === "create") {
        payload = {
          ...payload,
          password: values.password,
          confirmPassword: values.password,
        };
        await dispatch(createUser(payload))
          .unwrap()
          .then(() => {
            successToast("Create User Sucessfully");
          })
          .catch((err: any) => {
            errorToast(err[0]);
          });
      } else {
        await dispatch(updateUser({ id: editId.id, data: payload }))
          .unwrap()
          .then(() => {
            successToast("Update User Sucessfully");
          })
          .catch((err: any) => {
            errorToast(err[0]);
          });
      }
      // form.resetFields();
    } catch (error) {
      console.error("Fail: ", error);
    }
    fetchUser();
    setIsModalOpen(false);
  };
  return (
    <div>
      <Modal
        open={open}
        onCancel={cancel}
        title={modalMode === "create" ? "User Creation" : "Edit user"}
        footer={null}
      >
        <Form
          {...formItemLayout}
          form={form}
          layout="horizontal"
          style={{ maxWidth: 600, margin: "0 auto" }}
          initialValues={{ variant: "filled" }}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Name"
            name="fullName"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email address"
            name="email"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Organize"
            name="name"
            rules={[{ required: true, message: "Please select!" }]}
          >
            <Select placeholder="Select organize">
              {organizes.map((organize: any) => (
                <Select.Option key={organize.id} value={organize.id}>
                  {organize.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {modalMode === "create" && (
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit">
              {modalMode === "create" ? "Create User" : "Edit User"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default FormUser;
