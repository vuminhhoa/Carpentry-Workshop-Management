import { useEffect, useState } from 'react';
import { Divider, Row, Pagination } from 'antd';
import './index.css';
import { Link, useNavigate } from 'react-router-dom';
import timekeepingLogApi from 'api/timekeepingLog.api';
import useQuery from 'hooks/useQuery';
import type { Moment } from 'moment';
import type { BadgeProps } from 'antd';
import { Badge, Calendar } from 'antd';
import { CalendarMode } from 'antd/lib/calendar/generateCalendar';

const ListTimekeepingLog = () => {
  const navigate = useNavigate();
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
            {total_carpenter} thợ
            <br />
            {total_timekeeping} công
            <br />
            {dateData?.note ? 'Ghi chú: ' + dateData?.note : ''}
          </div>
        </Link>
      );
    } else {
      return (
        <Link to={`/timekeeping_logs/detail/${date}`}>
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
