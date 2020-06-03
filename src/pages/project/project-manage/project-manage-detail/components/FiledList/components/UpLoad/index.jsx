import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import Process from './Process'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let uploadFile = null
// eslint-disable-next-line prefer-const
let uploadFiles = []

const FileUpload = props => {
  const [visible, setvisible] = useState(false)
  const data = props.baseList()
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
    }
    setvisible(true)
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
          title="Basic Modal"
          visible={visible}
          onOk={() => { setvisible(false) }}
          onCancel={() => { setvisible(false) }}
        >
          <div>
            {
              uploadFiles ? uploadFiles.map((item, index) => {
                // eslint-disable-next-line react/no-array-index-key
                return <Process proList={proList} key={index} uploadFile={item} id={index} />
              }) : ''
            }
          </div>
        </Modal>
    </>
  );
}

export default FileUpload
