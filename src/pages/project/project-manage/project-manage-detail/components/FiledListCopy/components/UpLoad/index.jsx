import React, { useState } from 'react';
import { Button, Modal, Empty } from 'antd';
import Process from './Process'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let uploadFile = null
// eslint-disable-next-line prefer-const
let uploadFiles = []
let ids = []
let newArr = []

/**
 * 文件批量上传组件
 * 批量上传文件
 * @author xiaqingping
 * @version v0.1 2020-06-08
 * @since 文件批量上传组件
 */
const FileUpload = props => {
  const data = props.baseList()

  /** 状态 */
  // model状态
  const [visible, setvisible] = useState(false)
  // uploadFiles状态
  const [typeuploadFiles, setTypeuploadFiles] = useState(true)

  // 参数
  const proList = {
    sourceType: 'project', // 来源类型
    sourceCode: props.source ? props.source.code : '', // 来源编号
    sourceId: '', // 来源ID
    logicDirectoryId: '', // 逻辑目录ID
    spaceType: 'project', // 空间类型
    spaceCode: '', // 空间编号
    userName: '',
    userCode: '',
    businessName: '',
    businessCode: '',
    dirctoryPath: '',
    describe: '描述',
    isPublic: 2,
    type: 4,
    size: '',
    md5: '',
    mediaType: '',
    extendName: '',
    name: '',
    ...data
  }

  /** 上传改变 */
  const handleChange = (e) => {
    const [file] = e.target.files
    uploadFile = file
    for (let i = 0; i < e.target.files.length; i++) {
      uploadFiles.push(e.target.files[i])
      newArr = [...uploadFiles]
    }
    setTypeuploadFiles(uploadFiles)
    setvisible(true)
  }

  /** 移除文件 */
  const removeuploadFile = id => {
    ids.push(id);
    uploadFiles = newArr.filter((item, index) => {
      return !ids.includes(index)
    })

    if (uploadFiles.length <= 0) {
      setTypeuploadFiles(false)
      ids = []
    }
  }

  return (
    <>
      <input
        id='file'
        style={{ display: 'none' }}
        onChange={handleChange}
        type="file" multiple="multiple"
      />

      <Button
        type="primary"
        onClick={() => { document.getElementById('file').click() }}
      >
        上传
        </Button>
      <span
        style={{ color: '#1890ff', marginLeft: '10px' }}
        onClick={() => { setvisible(true) }}
      >
        查看
				</span>  <br />
      <Modal
        title="上传"
        visible={visible}
        centered
        onOk={() => { setvisible(false) }}
        onCancel={() => { setvisible(false) }}
      >
        <div>
          {
            typeuploadFiles && uploadFiles && uploadFiles.length > 0 ?
              uploadFiles.map((item, index) => {
                // eslint-disable-next-line react/no-array-index-key
                return <Process
                  removeuploadFile={removeuploadFile}
                  proList={proList}
                  key={`${index + 0}`}
                  uploadFile={item}
                  id={index}
                />
              }) : <Empty description='暂无任务' image={Empty.PRESENTED_IMAGE_SIMPLE} />
          }
        </div>
      </Modal>
    </>
  );
}

export default FileUpload
