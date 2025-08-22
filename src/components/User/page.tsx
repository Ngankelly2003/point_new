"use client";
import Content from "@/components/shared/Content";
import { AppDispatch } from "@/store";
import { Table, TableColumnsType } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Search from "antd/es/input/Search";
import { Button, Popconfirm, TableProps, Tooltip } from "antd/lib";
import {
  DeleteOutlined,
  EditOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import styles from "./User.module.scss";
import { errorToast, successToast } from "@/helpers/toast";
import {
  deleteUser,
  getSelectUsers,
  getUser,
} from "@/store/actions/user.action";
import FormUser from "../ModalForm/FormUser/page";
import { useTableQuery } from "@/hooks/useTableQuery";
import { useForm } from "antd/es/form/Form";
type TableChange = TableProps<any>["onChange"];
function UserPage() {
  const [dataProject, setDataProject] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [organizes, setOrganizes] = useState<any[]>([]);
  const [editId, setEditId] = useState<any>(null);
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const {
    pagination,
    sortedInfo,
    currentFilters,
    searchValue,
    setSearchValue,
    onChange,
  } = useTableQuery();

  useEffect(() => {
    if (isModalOpen) {
      dispatch(getSelectUsers({}))
        .unwrap()
        .then((res) => {
          setOrganizes(res.result);
          console.log("resOri", res.result);
          console.log("editId", editId);
          if (modalMode === "edit" && editId) {
            const matchedOrigan = res.result.find(
              (m: any) => m.name === editId.companyName
            );
            console.log("matchedOrigan", matchedOrigan);

            form.setFieldsValue({
              fullName: editId.fullName,
              email: editId.email,
              name: matchedOrigan?.id,
              password: editId.password,
              confirmPassword: editId.confirmPassword,
            });
          } else {
            form.resetFields();
          }
        });
    }
  }, [isModalOpen, modalMode, editId, dispatch]);

  useEffect(() => {
    fetchUser();
  }, [
    pagination,
    sortedInfo,
    currentFilters,
    dispatch,
    searchValue,
    isModalOpen,
  ]);

  const fetchUser = async (
    sorter: any = sortedInfo,
    filters = currentFilters,
    page = pagination
  ) => {
    setLoading(true);
    try {
      const payload = {
        search: searchValue,
        pageNumber: page.pageNumber,
        pageSize: page.pageSize,
        sorts: sorter?.columnKey
          ? [
              {
                key: sorter.columnKey,
                sort: sorter.order === "ascend" ? 1 : -1,
              },
            ]
          : [],
        filters: filters || [],
      };

      const res = await dispatch(getUser(payload)).unwrap();
      const items = res.result.items;
      const mapData = items.map((item: any) => ({
        ...item,
        key: item.id,
      }));
      setDataProject(mapData);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const handleCancel = () => setIsModalOpen(false);

  const handleDeleteUser = async (id: string) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      successToast("Delete user successfully");
      fetchUser();
    } catch (error: any) {
      errorToast(error?.message || "Failed to delete user");
    }
  };

  const handleOpenEdit = (record: any) => {
    setModalMode("edit");
    setIsModalOpen(true);
    setEditId(record);
  };

  const handleOpenCreate = () => {
    setIsModalOpen(true);
    setModalMode("create");
    form.resetFields();
  };
  const columns: TableColumnsType<any> = [
    {
      title: "Name",
      showSorterTooltip: false,
      dataIndex: "fullName",
      key: "fullName",
      sorter: true,

      render: (name: string) => (
        <Tooltip placement="topLeft" title={name}>
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
            }}
          >
            {name}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Email address",
      dataIndex: "email",
      key: "email",
      sorter: true,

      render: (name: string) => (
        <Tooltip placement="topLeft" title={name}>
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
            }}
          >
            {name}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Organize",
      dataIndex: "companyName",
      key: "companyName",
      sorter: true,
      render: (name: string) => (
        <Tooltip placement="topLeft" title={name}>
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "block",
            }}
          >
            {name}
          </span>
        </Tooltip>
      ),
    },

    {
      title: "Action",
      render: (_: any, record: any) => (
        <>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button
              className={styles.btnIcon}
              onClick={() => {
                handleOpenEdit(record);
              }}
            >
              <EditOutlined />
            </Button>
            <Popconfirm
              title="Do you want to delete this user?"
              okText="OK"
              cancelText="Cancel"
              onConfirm={() => handleDeleteUser(record.id)}
            >
              <Button
                className={styles.btnIcon}
                style={{
                  border: "1px solid red",
                  color: "red",
                }}
                danger
              >
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "7px",
          alignItems: "center",
        }}
      >
        <span>
          <h2>Users</h2>
        </span>
        <Button
          type="primary"
          onClick={handleOpenCreate}
          style={{
            padding: "12px 12px",
            height: "48px",
            fontSize: "18px",
            borderRadius: "8px",
          }}
        >
          + User Creation
        </Button>
      </div>
      <FormUser
        open={isModalOpen}
        cancel={handleCancel}
        organizes={organizes}
        fetchUser={fetchUser}
        setIsModalOpen={setIsModalOpen}
        modalMode={modalMode}
        setModalMode={setModalMode}
        editId={editId}
        setEditId={setEditId}
        form={form}
      />

      <div style={{ marginBottom: "20px" }}>
        <Search
          placeholder="Search"
          allowClear
          size="middle"
          style={{ width: 350 }}
          onSearch={(value) => {
            setSearchValue(value);
          }}
        />
      </div>
      <div>
        <Table
          onChange={onChange as TableChange}
          columns={columns}
          dataSource={dataProject}
          scroll={{ x: "max-content" }}
          size="small"
          loading={loading}
        />
      </div>
    </>
  );
}

export default UserPage;
