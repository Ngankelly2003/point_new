
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import { Button, Modal, Table } from 'antd/lib';
import React, { useState } from 'react';
import styles from './FormUserProjPage.module.scss';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { addUserToProj, removeUserToProj } from '@/store/actions/user.action';

interface Prop {
  isModalOpenUserPage: boolean;
  setIsModalOpenUserPage: any;
  isCancel: any;
  dataTableRight: any ; 
  projectId:any;
  fetchUserOutSide: any;
  dataTableLeft:any
}

function FormUserProjPage({dataTableLeft,fetchUserOutSide,projectId,dataTableRight, isCancel, setIsModalOpenUserPage, isModalOpenUserPage }: Prop) {
  const [selectedRowKeysIn, setSelectedRowKeysIn] = useState<React.Key[]>([]);
  const [selectedRowKeysOut, setSelectedRowKeysOut] = useState<React.Key[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  // const [dataTableRight,setDataTableRight] = useState([]); 


  const rowSelectionIn = {
    selectedRowKeys: selectedRowKeysIn,
    onChange: (selectedKeys: React.Key[]) => setSelectedRowKeysIn(selectedKeys),
  };

  const rowSelectionOut = {
    selectedRowKeys: selectedRowKeysOut,
    onChange: (selectedKeys: React.Key[]) => setSelectedRowKeysOut(selectedKeys),
  };

   const columnsRight = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'name',
    },
    {
      title: 'Email address',
      dataIndex: 'email',
      key: 'email',
    },
  ];

  const columnsLeft = [
    ...columnsRight,
    {
      title: 'Added date',
      dataIndex: 'date',
      key: 'date',
    },
  ];


   const handleAddToProj = async () => {
    try {
      if (selectedRowKeysOut.length === 0) return;
      await dispatch(addUserToProj({
      projectId,
      userIds: selectedRowKeysOut as string[]
    })).unwrap();
      fetchUserOutSide(projectId);
       setSelectedRowKeysOut([]);
    } catch (err) {
      console.error('Failed to add users to project:', err);
    }
  };

   const handleRemoveToProj = async () => {
    try {
      if (selectedRowKeysIn.length === 0) return;
      await dispatch(removeUserToProj({
      projectId,
      userIds: selectedRowKeysIn as string[]
    })).unwrap();
      fetchUserOutSide(projectId);
      setSelectedRowKeysIn([]);
    } catch (err) {
      console.error('Failed to add users to project:', err);
    }
  };
  
  return (
    <div>
      <Modal
        open={isModalOpenUserPage}
        title="hello"
        onCancel={isCancel}
        footer={null}
        width={1500}
      >
        <div className={styles.containerTable}>
          <div className={styles.tableWrapper}>
            <h3>Users in the project</h3>
            <Table 
              rowKey="userId"
              dataSource={dataTableLeft}
              columns={columnsLeft}
              rowSelection={rowSelectionIn}
              />
          </div>

          <div className={styles.buttonGroup}>
            <Button icon={<CaretLeftOutlined />} 
              onClick={handleAddToProj}
              className={selectedRowKeysOut.length > 0 ? styles.active : ''}
            />
            <Button icon={<CaretRightOutlined />} 
            onClick={handleRemoveToProj}
            className={selectedRowKeysIn.length > 0 ? styles.active : ''}/>
          </div>

          <div className={styles.tableWrapper}>
            <h3>Users outside the project</h3>
            <Table 
                rowKey="userId"
                dataSource={dataTableRight}
                columns={columnsRight} 
                rowSelection={rowSelectionOut}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default FormUserProjPage;
