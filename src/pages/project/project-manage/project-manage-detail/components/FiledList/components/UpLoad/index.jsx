import React, { useState } from 'react';
import { Button, Modal, Empty } from 'antd';
import Process from './Process'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let uploadFile = null
// eslint-disable-next-line prefer-const
let uploadFiles = []
let ids = []
let newArr = []

const FileUpload = props => {
  const data = props.baseList()

  /** 状态 */
  // model状态
  const [visible, setvisible] = useState(false)
  // uploadFiles状态
  const [typeuploadFiles, setTypeuploadFiles] = useState(true)


  // 参数
  const proList = {
    sourceType: 'project',
    sourceCode: props.source ? props.source.code : '',
    sourceId: '',
    logicDirectoryId: '',
    spaceType: 'project',
    spaceCode: '',
    userName: '',
    userCode: '',
    businessName: '',
    businessCode: '',
    dirctoryPath: '',
    describe: '这是描述',
    isPublic: 2,
    type: 4,
    size: '',
    md5: '',
    mediaType: '',
    extendName: '',
    name: '',
    ...data
  }
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

  const removeuploadFile = id => {
    ids.push(id);
    uploadFiles = newArr.filter((item, index) => {
      return !ids.includes(index)
    })

    console.log(id, uploadFiles)
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
