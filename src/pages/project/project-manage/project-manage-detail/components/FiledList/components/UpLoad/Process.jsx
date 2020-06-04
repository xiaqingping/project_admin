import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
// import axios from 'axios';
import BMF from 'browser-md5-file';
import { Button, Progress } from 'antd';

// 自定义
import api from '@/pages/project/api/disk';

let arr = [];

const Process = props => {
  const { uploadFile: upfiles, proList } = props;
  const uploadFile = upfiles;
  const { name, size, type } = uploadFile;
  console.log(props);
  let cur = 0;
  let index = 0;
  const SIZE = 1024 * 1024;
  let fileOperationId = '';
  let fileOperationLogicId = '';

  // let md5Value = ''
  // 进度
  const [progress, setProgress] = useState(0);
  // 暂停/上传状态
  const [isStart, setIsStart] = useState(true);

  // 上传参数
  let data = {
    ...proList,
    size,
    md5: '',
    mediaType: type,
    extendName: name ? name.split('.')[1] : '',
    name,
  };

  const uploadfile = fn => {
    const formData = new FormData();
    let end = cur + SIZE
    if(uploadFile.size - cur < SIZE) end = uploadFile.size
    console.log(cur, end)
    formData.append('file', uploadFile.slice(cur, end));
    formData.append('fileOperationId', fileOperationId);
    formData.append('fileOperationLogicId', fileOperationLogicId);
    formData.append('partNumber', index);
    const params = {
      spaceType: data.spaceType,
      spaceCode: data.spaceCode,
    };
    api.uploadMoreFiles2(params, formData).then(res => {
      console.log(res);
      // const { status, fileOperationId: id1, fileOperationLogicId: id2 } = res
      // if (status === 1 || status === 3) {
      //   fileOperationId = id1
      //   fileOperationLogicId = id2
      //   index = res.partNumber
      //   cur = res.partNumber - 1
      //   setProgress(Math.ceil(cur / uploadFile.size * 100))
      //   fn()
      // }
    });
  };

  /** 文件上传入口 */
  const fun = () => {
    if (arr[props.id].flag && cur < uploadFile.size) {
      cur = SIZE * (index -1)
      uploadfile(fun);
      console.log('cur', cur)
    }
  };

  /** MD5验证 */
  const res = () => {
    const bmf = new BMF();
    return new Promise(() => {
      bmf.md5(uploadFile, (err, md5) => {
        data = {
          ...data,
          md5,
        };
        api.uploadMoreFiles1(data).then(result => {
          const {
            status,
            repeatFlag,
            partNumber,
            fileOperationId: id1,
            fileOperationLogicId: id2,
          } = result;

          if ((status === 1 || status === 3) && repeatFlag) {
            fileOperationId = id1;
            fileOperationLogicId = id2;
            index = partNumber;
            cur = partNumber - 1;
            fun();
          }
        });
      });
    });
  };

  const start = () => res();

  const stop = () => {
    setIsStart(!arr[props.id].flag);
    arr[props.id].flag = !arr[props.id].flag;
    fun();
  };

  useEffect(() => {
    arr = [...arr, { id: props.id, flag: true }];
    start();
  }, []);

  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <Progress percent={progress} style={{ width: '80%' }} />
        {progress >= 100 ? (
          '上传完成'
        ) : (
          <Button onClick={stop} style={{ marginLeft: '10px' }}>
            {isStart ? '暂停' : '开始'}
          </Button>
        )}
      </div>
    </>
  );
};

export default connect(({ projectManageDetail }) => ({
  projectManageDetail,
}))(Process);
