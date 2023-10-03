import axiosClient from './axiosClient';
import { CommonResponse } from 'types/common.type';

const supplyApi = {
  create(params: object): Promise<CommonResponse> {
    const url = 'supply/create';
    return axiosClient.post(url, params);
  },
  detail(id: number): Promise<CommonResponse> {
    const url = `supply/detail?id=${id}`;
    return axiosClient.get(url);
  },

  update(params: object): Promise<CommonResponse> {
    const url = 'supply/update';
    return axiosClient.patch(url, params);
  },

  delete(id: number): Promise<CommonResponse> {
    const url = 'supply/delete';
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
    const url = `supply/search?${paramString}`;
    return axiosClient.get(url);
  },

  downloadDocx(): Promise<CommonResponse> {
    const url = 'supply/download_docx';
    return axiosClient.get(url);
  },
};

export default supplyApi;
