import { useState, useEffect } from 'react';
import { FilePdfFilled, EditFilled } from '@ant-design/icons';
import { Button, Divider, Table } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import timekeepingLogApi from 'api/timekeepingLog.api';
import Loading from 'components/Loading';
import type { ColumnsType, TableProps } from 'antd/es/table';
interface DataType {
  name: string;
  work_number: number;
  note: string;
}
const DetailTimekeepingLog = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { date } = params;
  const [timekeeping_log, setTimekeepingLog] = useState<any>([]);
  const [carpenters, setCarpenter] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<string>('');

  const columns: ColumnsType<DataType> = [
    {
      title: 'Tên thợ',
      render: (item: any) => <div>{item?.Carpenter?.name}</div>,
    },
    {
      title: 'Số công',
      dataIndex: 'work_number',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.work_number - b.work_number,
    },
    {
      title: 'Ghi chú',
      render: (item: any) => <div>{item?.note}</div>,
    },
  ];

  const onChange: TableProps<DataType>['onChange'] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  const getDetailTimekeepingLog = (date: any) => {
    setLoading(true);
    timekeepingLogApi
      .detail(date)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setTimekeepingLog(data.timekeeping_log);
          setCarpenter(data.timekeeping_log?.Carpenter_Timekeeping_Logs);
          setNote(data.timekeeping_log?.note);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getDetailTimekeepingLog(date);
  }, [date]);

  return (
    <div>
      <div className="flex-between-center">
        <div className="font-medium text-lg">CHI TIẾT CHẤM CÔNG</div>
        <div className="flex flex-row gap-6">
          <Button className="button_excel ">
            <FilePdfFilled />
            <div className="font-medium text-md text-[#5B69E6]">Xuất PDF</div>
          </Button>
          <Button
            className="button_excel"
            onClick={() =>
              navigate(`/timekeeping_logs/update/${timekeeping_log.date}`)
            }
          >
            <EditFilled />
            <div className="font-medium text-md text-[#5B69E6]">
              Cập nhật chấm công
            </div>
          </Button>
        </div>
      </div>
      <Divider />
      {loading ? (
        <Loading />
      ) : (
        <div id="detail" className="">
          <div className="font-bold text-2xl">{date}</div>
          {note ? <div>Ghi chú: {note}</div> : ''}
          <Table
            columns={columns}
            dataSource={carpenters}
            onChange={onChange}
            pagination={false}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default DetailTimekeepingLog;
