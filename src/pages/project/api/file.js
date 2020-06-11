/**
 * 文件(测试)接口
 */
import request from '@/utils/request';

let http = '';
// http = 'http://192.168.20.6:8150';
// http = 'http://192.168.20.27:8150';
http = 'http://192.168.20.14:8150';
if (process.env.NODE_ENV !== 'development') {
  http = '';
}
export default {
  // 查询文件列表
  getFiles(param) {
    const { spaceType, spaceCode, directoryId, searchName, sortType, sortWay } = param
    const params = { directoryId, name: searchName, sortType, sortWay }
    return request(
      `${http}/disk/v2/${spaceType}/${spaceCode}/files`,
      {
        params
      },
    )
  },

  // 创建目录
  createDirctory(params) {
    return request(
      `${http}/disk/v1/${params.spaceType}/${params.spaceCode}/dirctory`,
      {
        method: 'POST',
        data: params,
      },
    );
  },

  // 单个下载文件
  downloadFiles(params) {
    return request(
      `${http}/disk/v1/${params.spaceType}/${params.spaceCode}/files/download/${params.id}`,
      {
        params,
      },
    );
  },

  // 批量下载
  downloadFilesBatch(infor, data) {
    return request(
      // eslint-disable-next-line max-len
      `${http}/disk/v1/${infor.spaceType}/${infor.spaceCode}/files/batchDownload?isDown=${infor.isDown}`,
      {
        method: 'POST',
        data,
      },
    );
  },

  deleteFiles(data, spaceType, spaceCode) {
    return request(
      `${http}/disk/v1/${spaceType}/${spaceCode}/files/fileRecycle`,
      {
        method: 'DELETE',
        data,
      },
    );
  },

  EditFile(data) {
    const { spaceType, spaceCode, id, fileType, name, describe } = data
    return request(
      `${http}/disk/v1/${spaceType}/${spaceCode}/files/${data.id}`,
      {
        method: 'PUT',
        data: { id, fileType, name, describe },
      },
    );
  },

  // 查询目录列表
  getDirctory(params) {
    return request(
      `${http}/disk/v1/${params.spaceType}/${params.spaceCode}/dirctory`,
      {
        params,
      },
    );
  },

  // 复制文件或目录 （单个）
  fileCopy(data) {
    return request(
      `${http}/disk/v1/${data.spaceType}/${data.spaceCode}/fileCopy`,
      {
        method: 'POST',
        data,
      },
    );
  },

  // 移动文件或目录 （单个）
  fileMovement(data) {
    return request(
      `${http}/disk/v1/${data.spaceType}/${data.spaceCode}/fileMovement`,
      {
        method: 'POST',
        data,
      },
    );
  },
  // 复制文件或目录 （批量）
  fileBatchCopy(data) {
    return request(
      `${http}/disk/v1/${data.spaceType}/${data.spaceCode}/fileBatchCopy`,
      {
        method: 'PUT',
        data,
      },
    );
  },

  // 移动文件或目录 （批量）
  fileBatchMovement(data) {
    return request(
      `${http}/disk/v1/${data.spaceType}/${data.spaceCode}/fileBatchMovement`,
      {
        method: 'PUT',
        data,
      },
    );
  },
  // 批量上传第一接口
  uploadMoreFiles1(params) {
    return request(
      `${http}/disk/v1/${params.spaceType}/${params.spaceCode}/files/multiPart`,
      {
        method: 'POST',
        data: params,
      },
    );
  },
  // 批量上传第二接口
  uploadMoreFiles2(params, formData) {
    return request(
      `${http}/disk/v1/${params.spaceType}/${params.spaceCode}/files/multiPartUpload`,
      {
        method: 'POST',
        dataType: 'JSON',
        data: formData,
      },
    );
  },
  // 批量上传第二接口
  uploadMoreFiles3(params, data) {
    return request(
      `${http}/disk/v1/${params.spaceType}/${params.spaceCode}/files/mergeMultiPartUpload`,
      {
        method: 'POST',
        data,
      },
    );
  },
  // 批量下载
  bulkDownload(params, files) {
    return request(
      `${http}/disk/v1/${params.spaceType}/${params.spaceCode}/files/batchDownload?isDown=1`,
      {
        method: 'POST',
        data: files,
      },
    );
  },
};
