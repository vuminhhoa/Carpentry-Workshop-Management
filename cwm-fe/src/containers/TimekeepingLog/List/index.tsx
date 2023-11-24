import { useEffect, useState } from 'react';
import { Divider } from 'antd';
import './index.css';
import { Link } from 'react-router-dom';
import timekeepingLogApi from 'api/timekeepingLog.api';
import type { Moment } from 'moment';
import { Calendar } from 'antd';

const ListTimekeepingLog = () => {
  const [timekeeping_logs, setTimekeepingLogs] = useState<any>([]);

  const dateCellRender = (value: Moment) => {
    const date = value.format('YYYY-MM-DD');
    const dateData = timekeeping_logs.find((log: any) => log.date === date);
    if (dateData !== undefined) {
      const total_carpenter = dateData.Carpenter_Timekeeping_Logs.length;
      let total_timekeeping = 0;
      for (const item of dateData.Carpenter_Timekeeping_Logs) {
        total_timekeeping += Number(item.work_number);
      }
      return (
        <Link to={`/timekeeping_logs/detail/${date}`}>
          <div>
            {total_carpenter} thợ, {total_timekeeping} công
            <br />
            {dateData?.note ? 'Ghi chú: ' + dateData?.note : ''}
          </div>
        </Link>
      );
    } else {
      return (
        <Link to={`/timekeeping_logs/create/${date}`}>
          <div className="text-slate-300">Chưa chấm công</div>
        </Link>
      );
    }
  };

  const search = () => {
    timekeepingLogApi
      .search()
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setTimekeepingLogs(data.timekeeping_logs);
        }
      })
      .catch();
  };
  useEffect(() => {
    search();
  }, []);
  return (
    <div>
      <div className="flex-between-center">
        <div className="title">CHẤM CÔNG NGÀY</div>
      </div>
      <Divider />
      <Calendar dateCellRender={dateCellRender} />
    </div>
  );
};

export default ListTimekeepingLog;
