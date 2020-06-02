/**
 * 文件(测试)接口
 */
import request from '@/utils/request';

const http = 'http://192.168.20.6:8150';
export default {
  // 查询文件列表
  getFiles(params) {
    return request(
      `${http}/disk/v2/${params.spaceType}/${params.spaceCode}/files`,
      {
        params,
      },
    );
  },

  deleteFiles(data, spaceType, spaceCode) {
    return request(
      `${http}/disk/v1/${spaceType}/${spaceCode}/files/fileRecycle`,
      {
        method: 'PUT',
        data,
      },
    );
  },

  EditFile(data) {
    return request(
      `${http}/disk/v1/${data.spaceType}/${data.spaceCode}/files/${data.id}
`,
      {
        method: 'PUT',
        data,
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
};
