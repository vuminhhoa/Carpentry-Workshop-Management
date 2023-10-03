import axiosClient from './axiosClient';
import { CommonResponse } from 'types/common.type';

const carpenterApi = {
  create(params: object): Promise<CommonResponse> {
    const url = 'carpenter/create';
    return axiosClient.post(url, params);
  },
  detail(id: number): Promise<CommonResponse> {
    const url = `carpenter/detail?id=${id}`;
    return axiosClient.get(url);
  },

  update(params: object): Promise<CommonResponse> {
    const url = 'carpenter/update';
    return axiosClient.patch(url, params);
  },
  delete(id: number): Promise<CommonResponse> {
    const url = 'carpenter/delete';
    return axiosClient.delete(url, {
      data: { id },
    });
  },
  search(params: any): Promise<CommonResponse> {
    for (let i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    const paramString = new URLSearchParams(params).toString();
    const url = `carpenter/search?${paramString}`;
    return axiosClient.get(url);
  },
};

export default carpenterApi;
