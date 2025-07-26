import { AppDispatch } from "@/store";
import { uploadChunkFile } from "@/store/actions/upload.action";
import { DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { RcFile } from "antd/es/upload";
import {
  Button,
  message,
  Modal,
  Popconfirm,
  Table,
  TableColumnsType,
  Upload,
  UploadFile,
  UploadProps,
} from "antd/lib";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

interface Props {
  projectId: any;
  open: boolean;
  dataUploaded: any;
  handleCancelUpload: () => void;
}
const { Dragger } = Upload;
function FormUpload({
  projectId,
  open,
  dataUploaded,
  handleCancelUpload,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const props: UploadProps = {
    multiple: true,
    beforeUpload: (file: RcFile) => {
      setFileList((prev) => [...prev, file]);
      return false;
    },
    fileList,
  };

  const uploadChunks = async (file: RcFile) => {
    const chunkSize = 5 * 1024 * 1024;
    const chunkCount = Math.ceil(file.size / chunkSize);

    for (let index = 0; index < chunkCount; index++) {
      const start = index * chunkSize;
      const end = Math.min(start + chunkSize,file.size );
      const chunk = file.slice(start, end);

      const payload = {
        projectId: projectId,
        index: index,
        chunkCount,
        cancelUpload: false,
        formFile: chunk,
      };
      console.log(payload)
      try {
       const res=  await dispatch(uploadChunkFile(payload));
       console.log("UploadREs", res)
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
  };

  const handleUpload = async () => {
    console.log("file", fileList);
    setUploading(true);
    try {
      for (const file of fileList) {
        await uploadChunks(file);
      }
      setFileList([]);
    } catch (error) {
      message.error("Upload thất bại");
    } finally {
      setUploading(false);
    }
  };

  const columns: TableColumnsType<any> = [
    {
      title: "Name",
      showSorterTooltip: false,
      dataIndex: "name",
      key: "name",
      sorter: true,
      // sortOrder: sortedInfo.columnKey === "no" ? sortedInfo.order : null,
      // render: (name: string) => (
      //   <Tooltip placement="topLeft" title={name}>
      //     <span className={styles.largeText}>{name}</span>
      //   </Tooltip>
      // ),
    },
    {
      title: "Created Date",
      dataIndex: "createdOn",
      key: "createdOn",
      sorter: true,
      // sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      // render: (name: string) => (
      //   <Tooltip placement="topLeft" title={name}>
      //     <span className={styles.largeText}>{name}</span>
      //   </Tooltip>
      // ),
    },
    {
      title: "Size",
      dataIndex: "sizeWithUnit",
      key: "size",
      sorter: true,
      // sortOrder:
      //   sortedInfo.columnKey === "description" ? sortedInfo.order : null,
      // render: (name: string) => (
      //   <Tooltip placement="topLeft" title={name}>
      //     <span className={styles.largeText}>{name}</span>
      //   </Tooltip>
      // ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      // sorter: true,
      // sortOrder: sortedInfo.columnKey === "client" ? sortedInfo.order : null,
      // render: (name: string) => (
      //   <Tooltip placement="topLeft" title={name}>
      //     <span className={styles.largeText}>{name}</span>
      //   </Tooltip>
      // ),
    },
    {
      title: "Type",
      dataIndex: "typeLabel",
      key: "type",
      // sorter: true,
      // sortOrder: sortedInfo.columnKey === "team" ? sortedInfo.order : null,
      // render: (name: string) => (
      //   <Tooltip placement="topLeft" title={name}>
      //     <span className={styles.largeText}>{name}</span>
      //   </Tooltip>
      // ),
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <>
          <div style={{ display: "flex", gap: "8px" }}>
            <Popconfirm
              title="Do you want to delete this project?"
              okText="OK"
              cancelText="Cancel"
              // onConfirm={() => handleDelete(record.id)}
            >
              <Button
                //   className={styles.btnIcon}
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
    <Modal open={open} width={1000} onCancel={handleCancelUpload}>
      <div>
        <h3>Upload folder</h3>
        <hr></hr>
      </div>
      <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Search />
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
          >
            + Upload
          </Button>
        </div>
        <div>
          <Dragger {...props} accept=".ifc, .e57, .laz, .las">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag your file here to upload it
            </p>
            <p className="ant-upload-hint">
              Supports single or bulk file uploads. Uploading organizational
              data or prohibited files is prohibited.
            </p>
          </Dragger>
        </div>
        <div>
          <Table rowKey={"id"} columns={columns} dataSource={dataUploaded} />
        </div>
      </div>
    </Modal>
  );
}

export default FormUpload;
