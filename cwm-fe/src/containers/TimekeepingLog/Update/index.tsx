import { Button, Divider, Form, Input, Table, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import timekeepingLogApi from 'api/timekeepingLog.api';
import Loading from 'components/Loading';
import carpenterApi from 'api/carpenter.api';
import { toast } from 'react-toastify';
import { DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

interface Attendance {
  key: string;
  carpenter_id: number | string;
  work_number: string;
  note: string;
}

const UpdateTimekeepingLog = () => {
  const params: any = useParams();
  const { date } = params;
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataChange, setDataChange] = useState<any>({});
  const [timekeeping_log, setTimekeepingLog] = useState<any>({});
  const [carpenters, setCarpenters] = useState<any>([]);
  const [note, setNote] = useState<string>('');
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  const [keyCounter, setKeyCounter] = useState<number>(0);
  const [selectedCarpenters, setSelectedCarpenters] = useState<any>([]); // Danh sách các thợ đã được chọn
  const navigate = useNavigate();

  const getDetailTimekeepingLog = (date: any) => {
    setLoading(true);
    timekeepingLogApi
      .detail(date)
      .then((res: any) => {
        const { success, data } = res.data;
        let timekeeping_log = data.timekeeping_log;
        if (success) {
          setSelectedCarpenters(
            timekeeping_log.Carpenter_Timekeeping_Logs.map(
              (item: any) => item.Carpenter.name
            )
          );
          setAttendanceData(
            timekeeping_log.Carpenter_Timekeeping_Logs.map((item: any) => ({
              ...item,
              key: item.id,
            }))
          );
          setNote(timekeeping_log.note);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };
  const getCarpenters = () => {
    setLoading(true);
    carpenterApi
      .search({})
      .then((res: any) => {
        const { success, data } = res.data;
        let carpenters = data.carpenters;
        if (success) {
          setCarpenters(carpenters);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    getDetailTimekeepingLog(date);
    getCarpenters();
  }, [date]);
  console.log(carpenters);

  const columns = [
    {
      title: 'Tên thợ',
      dataIndex: 'carpenter_id',
      key: 'carpenter_id',
      render: (text: number | string, record: Attendance, index: number) => (
        <Select
          style={{ width: '100%' }}
          value={text}
          onChange={(value: number | string) =>
            handleCarpenterChange(value, index)
          }
        >
          {carpenters
            .filter((carpenter: any) => {
              console.log('carpen trong filter: ' + carpenter);
              return !selectedCarpenters.includes(carpenter.id);
            })
            .map((carpenter: any) => {
              console.log(carpenter.name);
              return (
                <Option key={carpenter.id} value={carpenter.id}>
                  {carpenter.name}
                </Option>
              );
            })}
        </Select>
      ),
    },
    {
      title: 'Số công',
      dataIndex: 'work_number',
      key: 'work_number',
      render: (text: string, record: Attendance, index: number) => (
        <Input
          value={text}
          onChange={(e) => handleWorkNumberChange(e, index)}
        />
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      render: (text: string, record: Attendance, index: number) => (
        <Input value={text} onChange={(e) => handleNoteChange(e, index)} />
      ),
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render: (text: string, record: Attendance) => (
        <DeleteOutlined onClick={() => handleDeleteRow(record.key)} />
      ),
    },
  ];

  const handleAddRow = () => {
    setKeyCounter(keyCounter + 1);
    const newAttendance: Attendance = {
      key: keyCounter.toString(),
      carpenter_id: '',
      work_number: '',
      note: '',
    };
    setAttendanceData([...attendanceData, newAttendance]);
  };
  const handleNoteChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedAttendanceData = [...attendanceData];
    updatedAttendanceData[index].note = e.target.value;
    setAttendanceData(updatedAttendanceData);
  };

  const handleWorkNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updatedAttendanceData = [...attendanceData];
    updatedAttendanceData[index].work_number = e.target.value;
    setAttendanceData(updatedAttendanceData);
  };

  const handleCarpenterChange = (value: number | string, index: number) => {
    const updatedAttendanceData = [...attendanceData];
    updatedAttendanceData[index].carpenter_id = value;
    setAttendanceData(updatedAttendanceData);
    // Cập nhật danh sách các thợ đã được chọn
    const selectedIds = updatedAttendanceData.map((item) => item.carpenter_id);
    setSelectedCarpenters(selectedIds);
  };

  const handleDeleteRow = (key: string) => {
    const updatedAttendanceData = attendanceData.filter(
      (item) => item.key !== key
    );
    setAttendanceData(updatedAttendanceData);
  };

  const handleUpdate = () => {
    // Gửi dữ liệu cập nhật lên server
    const data = {
      data: {
        date: date,
        note: note,
      },
      carpenters: attendanceData,
    };
    setLoadingUpdate(true);
    timekeepingLogApi
      .update(data)
      .then((res: any) => {
        const { success } = res.data;
        if (success) {
          toast.success('Chấm công thành công');
          navigate(`/timekeeping_logs/detail/${date}`);
        } else {
          toast.error('Chấm công thất bại');
        }
      })
      .catch()
      .finally(() => setLoadingUpdate(false));
  };
  console.log(attendanceData);
  return (
    <div>
      <div className="flex-between-center">
        <div className="title">CẬP NHẬT CHẤM CÔNG NGÀY {date}</div>
      </div>

      <Divider />
      {loading ? (
        <Loading />
      ) : (
        // <div className="flex-between mt-10">
        <div className="flex flex-row gap-6 my-8">
          <div className="w-[100%]">
            Ghi chú:
            <Input
              placeholder="Ghi chú"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            Công thợ:
            <br></br>
            <Button onClick={handleAddRow}>Thêm thợ</Button>
            <Table
              columns={columns}
              dataSource={attendanceData}
              pagination={false}
            />
            <Button onClick={handleUpdate}>Cập nhật</Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default UpdateTimekeepingLog;
