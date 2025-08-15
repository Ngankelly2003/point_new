import React, { useEffect, useState } from "react";
import styles from "./Organzie.module.scss";
import {
  Button,
  Form,
  Modal,
  Popconfirm,
  Table,
  TableColumnsType,
  TableProps,
  Tooltip,
} from "antd/lib";
import Search from "antd/es/input/Search";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { useTableQuery } from "@/hooks/useTableQuery";
import {
  createCompany,
  deleteCompany,
  getCompany,
  updateCompany,
} from "@/store/actions/file.action";
import { Input } from "antd";
import { errorToast, successToast } from "@/helpers/toast";

type TableChange = TableProps<any>["onChange"];
function OrganizePage() {
  const [dataSource, setDataSource] = React.useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const {
    pagination,
    sortedInfo,
    currentFilters,
    searchValue,
    onChange,
    setSearchValue,
  } = useTableQuery();

  const fetchData = (
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

      dispatch(getCompany(payload))
        .unwrap()
        .then((res: any) => {
          const items = res.result.items;

          const mapData = items.map((item: any) => ({
            ...item,
            key: item.id,
            isBaseCompany: item.isBaseCompany,
          }));

          setDataSource(mapData);
        });
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    pagination,
    sortedInfo,
    currentFilters,
    dispatch,
    searchValue,
    isModalOpen,
  ]);

  const handleEdit = (record: any) => {
    setIsModalOpen(true);
    setModalMode("edit");
    setEditId(record.id);

    form.setFieldsValue({
      name: record.name,
      description: record.description,
    });
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setIsModalOpen(true);
    form.resetFields();
  };
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("description", values.description);
      formData.append("name", values.name);
      if (modalMode === "edit") {
        await dispatch(updateCompany({ id: editId, data: formData }))
          .unwrap()
          .then(() => {
            successToast("Update Sucessfully");
          })
          .catch((err: any) => {
            errorToast(err[0]);
          });
      } else {
        await dispatch(createCompany(formData))
          .unwrap()
          .then(() => {
            successToast("Create Sucessfully");
          })
          .catch((err: any) => {
            errorToast(err[0]);
          });
      }
    } catch (error) {
      console.error("Fail:", error);
    }
    fetchData();
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteCompany(id))
        .unwrap()
        .then(() => {
          successToast("Delete Sucessfully");
          fetchData();
        })
        .catch((err: any) => {
          errorToast(err[0]);
        });
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const columns: TableColumnsType<any> = [
    {
      title: "Organization Name",
      showSorterTooltip: false,
      dataIndex: "name",
      key: "name",
      sorter: true,
      render: (name: string) => (
        <Tooltip placement="topLeft" title={name}>
          <span className={styles.largeText}>{name}</span>
        </Tooltip>
      ),
    },
    {
      title: "Explantion",
      dataIndex: "description",
      key: "description",
      sorter: true,
      render: (name: string) => (
        <Tooltip placement="topLeft" title={name}>
          <span className={styles.largeText}>{name}</span>
        </Tooltip>
      ),
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <>
          <div style={{ display: "flex", gap: "8px" }}>
            {/* {!isNormalUser && ( */}
            <>
              <Tooltip>
                <Button
                  className={styles.btnIcon}
                  onClick={() => handleEdit(record)}
                >
                  <EditOutlined />
                </Button>
              </Tooltip>
              {!record.isBaseCompany && (
                <Tooltip>
                  <Popconfirm
                    title="Do you want to delete this organization?"
                    okText="OK"
                    cancelText="Cancel"
                    onConfirm={() => handleDelete(record.id)}
                  >
                    <Button
                      style={{
                        border: "1px solid red",
                        color: "red",
                      }}
                      className={styles.btnIcon}
                      danger
                    >
                      <DeleteOutlined />
                    </Button>
                  </Popconfirm>
                </Tooltip>
              )}
            </>
            {/* )} */}
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <div className={styles.organButton}>
        <span>
          <h2>Organize</h2>
        </span>
        <Button
          type="primary"
          size={"large"}
          style={{
            padding: "12px 12px",
            height: "48px",
            fontSize: "18px",
            borderRadius: "8px",
          }}
          onClick={handleOpenCreate}
        >
          + Creating an organization
        </Button>
      </div>

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
          scroll={{ x: "max-content" }}
          columns={columns}
          dataSource={dataSource}
          onChange={onChange as TableChange}
          pagination={{
            current: pagination.pageNumber,
            pageSize: pagination.pageSize,
          }}
          size="small"
          loading={loading}
          rowKey="id"
        />
      </div>
      <div>
        <Modal
          title={
            modalMode === "create"
              ? "Creating an organization"
              : "Edit organization"
          }
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="horizontal"
            style={{ maxWidth: 600, margin: "0 auto" }}
            onFinish={handleSubmit}
          >
            <Form.Item
              label="Organization name:"
              name="name"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <Input placeholder="Organization name" />
            </Form.Item>

            <Form.Item
              label="Explanation:"
              name="description"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <Input.TextArea placeholder="Explanation" />
            </Form.Item>

            <Button
              type="primary"
              style={{
                marginTop: "16px",
                display: "flex",
                justifySelf: "center",
              }}
              htmlType="submit"
            >
              {modalMode === "create" ? "Create" : "Edit"}
            </Button>
          </Form>
        </Modal>
      </div>
    </>
  );
}

export default OrganizePage;
