/*
 * 文件服务
 * https://devapi.sangon.com:8443/api/disk/swagger-ui.html
 */

import request from '@/utils/request';

// const http = 'http://192.168.20.6:8150/';
let http = '';
http = 'http://192.168.20.14:8150/';

export default {
  // 项目列表查询
  getFiles(params) {
    return request(
      `${http}disk/v2/${params.spaceType}/${params.spaceCode}/files`,
      { params },
    );
  },

  // 回收站列表查询
  // getRecycleFiles(params) {
  //   return request(
  //     `${http}disk/v1/${params.spaceType}/${params.spaceCode}/recycleBin/files`,
  //     { params },
  //   );
  // },
  getRecycleFiles(c, data) {
    return request(
      `${http}disk/v1/${c.spaceType}/${c.spaceCode}/recycleBin/files`,
      { params: data },
    );
  },

  // 回收站批量还原文件或目录
  getRecycleRestore(b, data) {
    return request(
      `${http}disk/v1/${b.spaceType}/${b.spaceCode}/recycleBin/fileRestoration`,
      { method: 'PUT', data },
    );
  },

  // 回收站删除文件或目录
  deleteRecycleRestore(a, data) {
    console.log(data);
    return request(
      `${http}disk/v1/${a.spaceType}/${a.spaceCode}/recycleBin/files`,
      { method: 'DELETE', data },
    );
  },

  // 清空回收站
  emptyRecycle(data) {
    return request(
      `${http}disk/v1/${data.spaceType}/${data.spaceCode}/recycleBin/clearance`,
      { method: 'DELETE', data },
    );
  },
};
