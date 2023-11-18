import { useState, useEffect } from 'react';
import { FilePdfFilled, EditFilled, DeleteFilled } from '@ant-design/icons';
import { Button, Divider, Popconfirm, Table, Tooltip } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import timekeepingLogApi from 'api/timekeepingLog.api';
import Loading from 'components/Loading';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { toast } from 'react-toastify';
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

  const handleDelete = (id: number) => {
    setLoading(true);
    timekeepingLogApi
      .delete(id)
      .then((res: any) => {
        const { success, message } = res.data;
        if (success) {
          toast.success('Xóa thành công!');
          navigate(`/timekeeping_logs/list_timekeeping_logs`);
        } else {
          toast.error(message);
        }
      })
      .catch((error) => toast.error(error))
      .finally(() => setLoading(false));
  };
  return (
    <div>
      <div className="flex-between-center">
        <div className="font-medium text-lg">CHI TIẾT CHẤM CÔNG</div>
        <div className="flex flex-row gap-6">
          <Button className="button_excel ">
            <FilePdfFilled />
            <div className="font-medium text-md text-[#5B69E6]">Xuất PDF</div>
          </Button>

          <Popconfirm
            title="Bạn muốn xóa chấm công này?"
            onConfirm={() => handleDelete(timekeeping_log.id)}
            okText="Xóa"
            cancelText="Hủy"
            className="flex flex-row "
          >
            <Button className="button_excel">
              <DeleteFilled className="" />
              <div className="font-medium text-md text-[#5B69E6] ">
                Xóa chấm công
              </div>
            </Button>
          </Popconfirm>

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
