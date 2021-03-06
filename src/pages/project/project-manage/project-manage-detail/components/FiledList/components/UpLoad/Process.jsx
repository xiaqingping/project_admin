import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import BMF from 'browser-md5-file'
import { Button, Progress, Modal, Radio, message } from 'antd'

// 自定义
import api from '@/pages/project/api/file'

let arr = []

const Process = props => {
  const { uploadFile: upfiles, proList, removeuploadFile, id } = props
  const uploadFile = upfiles
  const { name, size, type } = uploadFile
  let cur = 0
  let index = 0
  const SIZE = 1024 * 1024
  let fileOperationId = ''
  let fileOperationLogicId = ''

  // 进度
  const [progress, setProgress] = useState(0)
  // 暂停/上传状态
  const [isStart, setIsStart] = useState(true)
  // model
  const [visible, setVisible] = useState(false)
  // 单选值
  const [radioValue, setRadioValue] = useState(1)
  // 组件显示状态
  const [isshow, setIsshow] = useState('block')
  // 是否暂停状态
  const [isButtonshow, setIsButtonshow] = useState(false)
  // 按钮下文字状态
  const [isButtontxt, setIsButtontxt] = useState('准备中。。。')

  // 上传参数
  let data = {
    ...proList,
    size,
    md5: '',
    mediaType: !type ? 'application/octet-stream' : type,
    extendName: name ? name.split('.')[1] : '',
    name,
  }

  const uploadfile = fn => {
    const formData = new FormData()
    let end = cur + SIZE
    if (uploadFile.size - cur < SIZE) end = uploadFile.size
    formData.append('file', uploadFile.slice(cur, end))
    formData.append('fileOperationId', fileOperationId)
    formData.append('fileOperationLogicId', fileOperationLogicId)
    formData.append('partNumber', index)
    const params = {
      spaceType: data.spaceType,
      spaceCode: data.spaceCode,
    }
    api.uploadMoreFiles2(params, formData).then(res => {
      const { status, fileOperationId: id1, fileOperationLogicId: id2 } = res
      setProgress(Math.ceil(end / uploadFile.size * 100))
      if (status === 1 || status === 3) {
        fileOperationId = id1
        fileOperationLogicId = id2
        index = res.partNumber
        cur = res.partNumber - 1
        fn()
      } else if (status === 4) {
        const dataParams = {
          fileOperationId: id1,
          fileOperationLogicId: id2,
        }
        api.uploadMoreFiles3(params, dataParams).then(reData => {
          console.log(reData)
        })
      } else if (status === 2) {
        message.success('已覆盖')
        setIsshow('none')
        removeuploadFile(id)
      }
    }).catch(secondERR => {
      console.log('第二接口error', secondERR)
    })
  }

  /** 文件上传入口 */
  const fun = () => {
    if (arr[props.id].flag && cur < uploadFile.size) {
      cur = SIZE * (index - 1)
      uploadfile(fun)
    }
  }

  /** MD5验证 */
  const res = () => {
    const bmf = new BMF()
    return new Promise(() => {
      bmf.md5(uploadFile, (err, md5) => {
        data = {
          ...data,
          md5,
        }
        api.uploadMoreFiles1(data).then(result => {
          setIsButtonshow(true)
          const {
            status,
            repeatFlag,
            partNumber,
            fileOperationId: id1,
            fileOperationLogicId: id2,
          } = result
          if (repeatFlag === 2) {
            if (status === 1 || status === 3) {
              fileOperationId = id1
              fileOperationLogicId = id2
              index = partNumber
              cur = partNumber - 1
              fun()
            } else if (status === 4) {
              const dataParams = {
                fileOperationId: id1,
                fileOperationLogicId: id2,
              }
              const params = {
                spaceType: data.spaceType,
                spaceCode: data.spaceCode,
              }
              api.uploadMoreFiles3(params, dataParams).then(reData => {
                console.log(reData)
              }).catch(thirdERR => {
                console.log('第三接口error', thirdERR)
              })
            } else if (status === 2) {
              setProgress(100)
            }
          } else {
            setVisible(true)
          }
        }).catch(() => {
          setIsButtontxt('上传失败！')
        })
      })
    })
  }




  const start = () => res()

  const stop = () => {
    setIsStart(!arr[props.id].flag)
    arr[props.id].flag = !arr[props.id].flag
    if(arr[props.id].flag)start()

  }

  const handleOk = () => {
    const bmf = new BMF()
    bmf.md5(uploadFile, (err, md5) => {
      data = {
        ...data,
        md5,
        type: radioValue
      }
      api.uploadMoreFiles1(data).then(result => {
        const {
          status,
          repeatFlag,
          partNumber,
          fileOperationId: id1,
          fileOperationLogicId: id2,
        } = result
        if (repeatFlag === 2) {
          if (status === 1 || status === 3) {
            fileOperationId = id1
            fileOperationLogicId = id2
            index = partNumber
            cur = partNumber - 1
            fun()
          } else if (status === 4) {
            const dataParams = {
              fileOperationId: id1,
              fileOperationLogicId: id2,
            }
            const params = {
              spaceType: data.spaceType,
              spaceCode: data.spaceCode,
            }
            api.uploadMoreFiles3(params, dataParams).catch(thirdERR => {
              console.log('第三接口error', thirdERR)
            })
          } else if (status === 2) {
            message.success('已覆盖')
            setIsshow('none')
            removeuploadFile(id)
          }
        } else {
          setVisible(true)
        }
      }).catch(firstERR => {
        console.log('第一接口error', firstERR)
      })
    })
    setVisible(false)
  }

  const handleCancel = () => {
    setVisible(false)
    setIsshow('none')
    removeuploadFile(id)
  }

  const onchangeRadio = e => {
    const { value } = e.target
    setRadioValue(value)
  }

  useEffect(() => {
    arr = [...arr, { id: props.id, flag: true }]
    start()
  }, [])

  return (
    <>
      <div style={{ marginBottom: '10px', display: isshow }}>
        <div>{uploadFile.name}</div>
        <Progress percent={progress} style={{ width: '80%', marginLeft: '10px' }} />
        {
        // eslint-disable-next-line no-nested-ternary
        progress >= 100 ? (
          '上传完成'
        ) : isButtonshow ?
            (<Button onClick={stop} style={{ marginLeft: '10px' }}>
              {isStart ? '暂停' : '开始'}
            </Button>) :
            isButtontxt
        }
      </div>
      < Modal
        title="确认上传"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        mask={false}
      >
        <div>当前目录下文件{uploadFile.name}以存在</div>
        <Radio.Group onChange={onchangeRadio} value={radioValue}>
          <Radio value={1}>覆盖</Radio>
          <Radio value={3}>后台重命名</Radio>
        </Radio.Group>
      </Modal >
    </>
  )
}

export default connect(({ projectManageDetail }) => ({
  projectManageDetail,
}))(Process)
