import { errorToast } from "@/helpers/toast";
import { AppDispatch } from "@/store";
import { uploadChunkFile } from "@/store/actions/upload.action";
import { DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { RcFile } from "antd/es/upload";
import {
  Button,
  message,
  Modal,
  notification,
  Popconfirm,
  Progress,
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
  setIsOpenFolder: any;
}
const { Dragger } = Upload;
function FormUpload({
  projectId,
  open,
  dataUploaded,
  handleCancelUpload,
  setIsOpenFolder,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const dispatch = useDispatch<AppDispatch>();
    const props: UploadProps = {
    multiple: true,
    fileList,
    beforeUpload: (file: RcFile) => {
  const allowedTypes = [".ifc", ".e57", ".laz", ".las"];
  const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

  if (!allowedTypes.includes(fileExt)) {
    errorToast("Only ifc, e57, laz or las files can be uploaded");
    return Upload.LIST_IGNORE;
  }

  const uploadFile: UploadFile = {
    uid: file.uid,
    name: file.name,
    status: "done",
    originFileObj: file,
  };
  setFileList((prev) => [...prev, uploadFile]);
  return false;
},

    onRemove: (file) => {
      setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
    },
  };

  const uploadChunks = async (file: RcFile) => {
    const chunkSize = 5 * 1024 * 1024;
    const chunkCount = Math.ceil(file.size / chunkSize);
    const RETRY_LIMIT = 3;

    for (let index = 0; index < chunkCount; index++) {
      const start = index * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      let retryCount = 0;
      let success = false;

      while (retryCount < RETRY_LIMIT && !success) {
        const payload = {
          projectId: projectId,
          index: index,
          chunkCount,
          cancelUpload: false,
          formFile: chunk,
          filename: file.name,
        };

        try {
          await dispatch(uploadChunkFile(payload)).unwrap();
          success = true;

          const percent = Math.round(((index + 1) / chunkCount) * 100);
          setUploadProgress((prev) => ({
            ...prev,
            [file.uid]: percent,
          }));
        } catch (err) {
          retryCount++;
          console.error(
            `Chunk ${index} failed. Retry ${retryCount}/${RETRY_LIMIT}`
          );
          if (retryCount >= RETRY_LIMIT) {
            throw new Error(
              `Chunk ${index} failed after ${RETRY_LIMIT} retries.`
            );
          }
        }
      }
    }
  };

  const handleUpload = async () => {
    console.log("file", fileList);
    setUploading(true);
    setIsOpenFolder(false);
    try {
      for (const file of fileList) {
        const rawFile = file.originFileObj as RcFile;
        await uploadChunks(rawFile);
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
      render: (status: string) => {
        let color = "#d9d9d9";
        let textColor = "#333";
        let bgColor = "#fafafa";
        switch (status?.toLowerCase()) {
          case "success":
            color = "green";
            textColor = "green";
            bgColor = "#f6ffed";
            break;
          case "failure":
            color = "red";
            textColor = "red";
            bgColor = "#fff1f0";
            break;
          case "processing":
            color = "#1890ff";
            textColor = "#1890ff";
            bgColor = "#e6f7ff";
            break;
          // case "pending":
          //   color = "#faad14";
          //   textColor = "#faad14";
          //   bgColor = "#fffbe6";
          //   break;
        }
        return (
          <span
            style={{
              padding: "2px 10px",
              border: `1px solid ${color}`,
              borderRadius: "10px",
              color: textColor,
              backgroundColor: bgColor,
            }}
          >
            {status}
          </span>
        );
      },
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
    <Modal open={open} width={1000} onCancel={handleCancelUpload} footer={null}>
      <div>
        <h3>Upload folder</h3>
        <hr></hr>
      </div>
      <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
  }}
>
  <Search
    placeholder="Tìm kiếm"
    style={{
      flexGrow: 1,
      flexShrink: 1,
      minWidth: 150,
      maxWidth: 500,
    }}
  />
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
          {fileList.map((file) => (
            <div key={file.uid} style={{ marginBottom: 8 }}>
              <span style={{ marginRight: 10 }}>{file.name}</span>
              <Progress
                size={30}
                type="circle"
                percent={uploadProgress[file.uid] || 0}
                status={uploadProgress[file.uid] === 100 ? "success" : "active"}
              />
            </div>
          ))}
        </div>
        <div>
          <Dragger {...props} 
          // accept=".ifc, .e57, .laz, .las"
          >
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
          <Table rowKey={"id"} columns={columns} dataSource={dataUploaded} scroll={{ x: "max-content" }}/>
        </div>
      </div>
    </Modal>
  );
}

export default FormUpload;
