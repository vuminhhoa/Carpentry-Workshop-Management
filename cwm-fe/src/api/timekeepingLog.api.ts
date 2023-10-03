import axiosClient from './axiosClient';
import { CommonResponse } from 'types/common.type';
import type { Moment } from 'moment';

const timekeepingLogApi = {
  create(params: object): Promise<CommonResponse> {
    const url = 'timekeeping_log/create';
    return axiosClient.post(url, params);
  },
  detail(date: Moment): Promise<CommonResponse> {
    const url = `timekeeping_log/detail?date=${date}`;
    return axiosClient.get(url);
  },

  update(params: object): Promise<CommonResponse> {
    const url = 'timekeeping_log/update';
    return axiosClient.patch(url, params);
  },

  delete(id: number): Promise<CommonResponse> {
    const url = 'timekeeping_log/delete';
    return axiosClient.delete(url, {
      data: { id },
    });
  },
  search(): Promise<CommonResponse> {
    const url = 'timekeeping_log/search';
    return axiosClient.get(url);
  },

  downloadDocx(): Promise<CommonResponse> {
    const url = 'timekeeping_log/download_docx';
    return axiosClient.get(url);
  },
};

export default timekeepingLogApi;
