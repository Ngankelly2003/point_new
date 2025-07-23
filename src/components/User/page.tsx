"use client"
import Content from '@/components/shared/Content'
import { AppDispatch } from '@/store';
import { Table, TableColumnsType } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { deleteProjects, getProject } from '@/store/actions/file.action';
import { Button, TableProps, Tooltip } from 'antd/lib';
import { DeleteOutlined, EditOutlined, EyeOutlined, FolderOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import styles from './User.module.scss';
import { SorterResult } from 'antd/es/table/interface';
import FormProject from '../ModalForm/FormProject/FormProject';
import { errorToast, successToast } from '@/helpers/toast';
import { getSelectUsers, getUser } from '@/store/actions/user.action';
import FormUser from '../ModalForm/FormUser/page';
function UserPage() {
   const [dataProject, setDataProject] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [organizes , setOrganizes] = useState<any[]>([]) ; 
  
const showModal = () => {
  setIsModalOpen(true); 
};

useEffect(() => {
  if (isModalOpen) {
    dispatch(getSelectUsers({}))
      .unwrap()
      .then((res) => {
        console.log("res", res)
        setOrganizes(res.result);
      })
      .catch((err) => console.error('Lỗi khi gọi API:', err));
  }
}, [isModalOpen]);

  const handleCancel = () => setIsModalOpen(false);

  const fetchUser = async() =>{
    const payload = {
      search: '',
      pageNumber: 1,
      pageSize: 10,
      // sorts: sorter?.columnKey ? [
      //   {key: sorter.columnKey,
      //     sort: sorter.order === 'ascend' ? 1: -1
      //   }
      // ]: [],
      // filters:filters || [],
      sorts: [],
       filters: [],
    }  
    const res:any = await dispatch(getUser(payload)).unwrap();
    // console.log("items user" , res)
    const items = res.result.items;
    const mapData = items.map((item: any) => ({
      ...item,
     key: item.id,
      // createdOn: formatDate(item.createdOn),
    }));
    setDataProject(mapData);
   }

   useEffect ( () =>{
    fetchUser() ;
   },[dispatch])
   

   const columns: TableColumnsType<any> = [
      {
        title: 'Name',
        showSorterTooltip: false,
        dataIndex: 'fullName',
        key: 'fullName',
        sorter: true,
        // sortOrder: sortedInfo.columnKey === 'no' ? sortedInfo.order : null,
        render: (name: string) => (
          <Tooltip placement='topLeft' title={name}>
            <span
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'block',
              }}
            >
              {name}
            </span>
          </Tooltip>
        ),
      }
      ,
    { title: 'Email address', dataIndex: 'email' , key: 'email',
      sorter: true,
      // sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
       render: (name: string) => (
          <Tooltip placement='topLeft' title={name}>
            <span
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'block',
              }}
            >
              {name}
            </span>
          </Tooltip>
        ),
     },
    { title: 'Organize', dataIndex: 'companyName', key: 'companyName', 
      sorter: true,
      // sortOrder: sortedInfo.columnKey === 'description' ? sortedInfo.order : null,
        render: (name: string) => (
          <Tooltip placement='topLeft' title={name}>
            <span
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'block',
              }}
            >
              {name}
            </span>
          </Tooltip>
        ), },
    { title: 'action', dataIndex: 'action', key: 'action',sorter: true,
        // sortOrder: sortedInfo.columnKey === 'client' ? sortedInfo.order : null,
        render: (name: string) => (
          <Tooltip placement='topLeft' title={name}>
            <span
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: 'block',
              }}
            >
              {name}
            </span>
          </Tooltip>
        ), },
    // { title: 'Team', dataIndex: 'team', key: 'team',
    //     sorter: true,
    //     // sortOrder: sortedInfo.columnKey === 'team' ? sortedInfo.order : null,
    //     render: (name: string) => (
    //       <Tooltip placement='topLeft' title={name}>
    //         <span
    //           style={{
    //             whiteSpace: 'nowrap',
    //             overflow: 'hidden',
    //             textOverflow: 'ellipsis',
    //             display: 'block',
    //           }}
    //         >
    //           {name}
    //         </span>
    //       </Tooltip>
    //     ),},
    // { title: 'Manager', dataIndex: 'manager', key: 'manager' ,
    //     sorter: true,
    //     sortOrder: sortedInfo.columnKey === 'manager' ? sortedInfo.order : null,
    //     render: (name: string) => (
    //       <Tooltip placement='topLeft' title={name}>
    //         <span
    //           style={{
    //             whiteSpace: 'nowrap',
    //             overflow: 'hidden',
    //             textOverflow: 'ellipsis',
    //             display: 'block',
    //           }}
    //         >
    //           {name}
    //         </span>
    //       </Tooltip>
    //     ),},
    // { title: 'Created date', dataIndex: 'createdOn', key: 'createdOn',
    //   sorter: true,
    //     filters: filterOptions.createdOn,
    //     sortOrder: sortedInfo.columnKey === 'createdOn' ? sortedInfo.order : null,
    //     render: (name: string) => (
    //       <Tooltip placement='topLeft' title={name}>
    //         <span
    //           style={{
    //             whiteSpace: 'nowrap',
    //             overflow: 'hidden',
    //             textOverflow: 'ellipsis',
    //             display: 'block',
    //           }}
    //         >
    //           {name}
    //         </span>
    //       </Tooltip>
    //     ), },
    // { title: 'Author', dataIndex: 'createdBy' , key: 'createdById',
    //     sorter: true,
    //       filters: filterOptions.createdBy,
    //     sortOrder: sortedInfo.columnKey === 'createdBy' ? sortedInfo.order : null,
    //     render: (name: string) => (
    //       <Tooltip placement='topLeft' title={name}>
    //         <span
    //           style={{
    //             whiteSpace: 'nowrap',
    //             overflow: 'hidden',
    //             textOverflow: 'ellipsis',
    //             display: 'block',
    //           }}
    //         >
    //           {name}
    //         </span>
    //       </Tooltip>
    //     ),},
    // { title: 'Size', dataIndex: 'totalUsed', key: 'totalUsed' ,
    //     sorter: true,
    //     sortOrder: sortedInfo.columnKey === 'totalUsed' ? sortedInfo.order : null,
    //     render: (name: string) => (
    //       <Tooltip placement='topLeft' title={name}>
    //         <span
    //           style={{
    //             whiteSpace: 'nowrap',
    //             overflow: 'hidden',
    //             textOverflow: 'ellipsis',
    //             display: 'block',
    //           }}
    //         >
    //           {name}
    //         </span>
    //       </Tooltip>
    //     ),},
    {
      title: 'Action',
      render:(_: any, record: any) => (
        <>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button className={styles.btnIcon}>
              <UsergroupAddOutlined />
            </Button>
            <Button className={styles.btnIcon}> 
              <EyeOutlined />
            </Button>
            <Button className={styles.btnIcon}>
              <FolderOutlined />
            </Button>
            <Button className={styles.btnIcon}>
              <EditOutlined />
            </Button>
           <Button
              className={styles.btnIcon}
              style={{
                border: '1px solid red',
                color: 'red',          
              }}
              // onClick={() => handleDelete(record.id)}
            >
              <DeleteOutlined  />
            </Button>
          </div>
        </>
      )
    }
  ];

  return (
    <div>
      <Button type='primary' onClick={showModal}>
         + User Creation
      </Button>
      <FormUser 
        open = {isModalOpen} 
        cancel = {handleCancel} 
        organizes = {organizes} 
        fetchUser ={fetchUser}
        setIsModalOpen = {setIsModalOpen}
        /> 
       <Table
        columns={columns}
        dataSource={dataProject}
        // onChange={onChange}
        size='small'
      />
    </div>
  )
}

export default UserPage