/**
 * 文件(测试)接口
 */
import request from '@/utils/request';

const http = 'http://192.168.20.14:8150/';
export default {
  getFiles(params) {
    return request(
      `${http}disk/v2/${params.spaceType}/${params.spaceCode}/files`,
      {
        params,
      },
    );
  },

  deleteFiles(data) {
    return request(
      `${http}disk/v1/${data.spaceType}/${data.spaceCode}/files/fileRecycle`,
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

  // 解析EXCEL数据返回页面
  //   getFileList(data) {
  //     return request(`/disk/v2/project/${data}/files`);

  //   }
  //   getFileProcessExcels(data) {
  //     return request('/fileProcess/v1/excels', {
  //       method: 'POST',
  //       data,
  //     });
  //   },

  //   // 解析csv数据返回页面
  //   getFileProcessCsvs(data) {
  //     return request('/fileProcess/v1/csvs', {
  //       method: 'POST',
  //       data,
  //     });
  //   },
};
