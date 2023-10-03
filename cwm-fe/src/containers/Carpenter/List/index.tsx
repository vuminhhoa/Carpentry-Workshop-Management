import { useContext, useEffect, useState } from 'react';
import {
  DeleteFilled,
  EditFilled,
  EyeFilled,
  FilterFilled,
  SelectOutlined,
  ImportOutlined,
} from '@ant-design/icons';
import {
  Button,
  Divider,
  Input,
  Select,
  Table,
  Menu,
  Row,
  Pagination,
  Popconfirm,
  Tooltip,
  Checkbox,
  Space,
} from 'antd';
import useDebounce from 'hooks/useDebounce';
import './index.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import carpenterApi from 'api/carpenter.api';
import useQuery from 'hooks/useQuery';
import { toast } from 'react-toastify';
import { FilterContext } from 'contexts/filter.context';
import {
  getCurrentUser,
  onChangeCheckbox,
  options,
  resolveDataExcel,
} from 'utils/globalFunc.util';
import useSearchName from 'hooks/useSearchName';
import ExportToExcel from 'components/Excel';
import type { PaginationProps } from 'antd';
import { formatCurrency } from 'utils/globalFunc.util';

const TableFooter = ({ paginationProps }: any) => {
  return (
    <Row justify="space-between">
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  );
};

const ListCarpenters = () => {
  const { onChangeSearch } = useSearchName();
  const navigate = useNavigate();
  const { carpenter_statuses } = useContext(FilterContext);
  const [carpenters, setCarpenters] = useState<any>([]);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState<any>({});
  let searchQueryString: string;
  const pathName: any = location?.pathname;
  const query = useQuery();
  const currentPage = query?.page;
  const currentName = query?.name;
  const currentStatus = query?.status_id;
  const currentDepartment = query?.department_id;
  const currentType = query?.type_id;
  const currentRiskLevel = query?.risk_level;
  const [page, setPage] = useState<number>(currentPage || 1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false);
  const [name, setName] = useState<string>(currentName);
  const nameSearch = useDebounce(name, 500);
  const [status, setStatus] = useState<any>(currentStatus);
  const [department, setDepartment] = useState<any>(currentDepartment);
  const [type, setType] = useState<any>(currentType);
  const [level, setLevel] = useState<any>(currentRiskLevel);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
    current,
    pageSize
  ) => {
    setLimit(pageSize);
  };

  const columns: any = [
    {
      title: 'Tên thợ',
      dataIndex: 'name',
      key: 'name',
      show: true,
      widthExcel: 30,
    },

    {
      title: 'Địa chỉ',
      key: 'address',
      show: true,
      dataIndex: 'address',
      widthExcel: 30,
    },

    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      show: true,
      widthExcel: 30,
    },

    {
      title: 'Giới tính',
      key: 'gender',
      show: true,
      dataIndex: 'gender',
      widthExcel: 30,
    },
    {
      title: 'Trạng thái',
      key: 'status_id',
      show: true,
      render: (item: any) => <div>{item?.Carpenter_Status?.name}</div>,
      widthExcel: 30,
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////

    {
      title: 'Tác vụ',
      key: 'action',
      show: true,
      render: (item: any) => (
        <Menu className="flex flex-row items-center place-content-center">
          <Space>
            <Menu.Item key="detail">
              <Tooltip title="Hồ sơ thợ">
                <Link to={`/carpenters/detail_carpenter/${item.id}`}>
                  <EyeFilled />
                </Link>
              </Tooltip>
            </Menu.Item>
            <Menu.Item key="update_carpenter">
              <Tooltip title="Cập nhật thợ">
                <Link to={`/carpenters/update_carpenter/${item.id}`}>
                  <EditFilled />
                </Link>
              </Tooltip>
            </Menu.Item>

            {item?.Carpenter_Status?.id === 2 && (
              <Menu.Item key="delete">
                <Tooltip title="Xóa thợ">
                  <Popconfirm
                    title="Bạn muốn xóa thợ này?"
                    onConfirm={() => handleDelete(item.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                  >
                    <DeleteFilled />
                  </Popconfirm>
                </Tooltip>
              </Menu.Item>
            )}
          </Space>
        </Menu>
      ),
    },
  ];

  const [columnTable, setColumnTable] = useState<any>(columns);
  const current_user: any = getCurrentUser();

  const onPaginationChange = (page: number) => {
    setPage(page);
    searchQuery.page = page;
    setSearchQuery(searchQuery);
    searchQueryString = new URLSearchParams(searchQuery).toString();
    navigate(`${pathName}?${searchQueryString}`);
  };

  const pagination = {
    current: page,
    total: total,
    pageSize: limit,
    showTotal: (total: number) => `Tổng cộng: ${total} thợ`,
    onChange: onPaginationChange,
    onShowSizeChange: onShowSizeChange,
  };

  const handleDelete = (id: number) => {
    carpenterApi
      .delete(id)
      .then((res: any) => {
        const { success, message } = res.data;
        if (success) {
          search();
          toast.success('Xóa thành công!');
        } else {
          toast.error(message);
        }
      })
      .catch((error) => toast.error(error));
  };

  const search = () => {
    setLoading(true);
    carpenterApi
      .search({
        name: nameSearch,
        status_id: status,
        page,
        limit,
      })
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setCarpenters(data.carpenters.rows);
          setTotal(data.carpenters.count);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    search();
  }, [nameSearch, status]);

  const onChangeSelect = (key: string, value: any) => {
    setPage(1);
    if (key === 'status_id') {
      setStatus(value);
    }
    if (key === 'type_id') {
      setType(value);
    }
    if (key === 'department_id') {
      setDepartment(value);
    }
    if (key === 'risk_level') {
      setLevel(value);
    }
    delete searchQuery.page;
    let newSearchQuery: any = { ...searchQuery, [`${key}`]: value };
    setSearchQuery(newSearchQuery);
    if (newSearchQuery[`${key}`] === undefined) {
      delete newSearchQuery[`${key}`];
    }
    searchQueryString = new URLSearchParams(newSearchQuery).toString();
    if (Object.keys(newSearchQuery)?.length !== 0) {
      navigate(`${pathName}?page=1&${searchQueryString}`);
    } else {
      setPage(1);
      navigate(`${pathName}?page=1`);
    }
  };

  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  const downloadCarpenterList = async () => {
    setLoadingDownload(true);
    const res = await carpenterApi.search({
      name: nameSearch,
      status_id: status,
      type_id: type,
      department_id: department,
      risk_level: level,
    });
    const carpenter = res?.data?.data?.carpenters;
    const data = carpenter.map((x: any) => ({
      name: x.name,
      address: x.address,
      phone: x.phone,
      gender: x.gender,
      status_id: x.Carpenter_Status.name,
    }));
    resolveDataExcel(data, 'Danh sách thợ', columnTable);
    setLoadingDownload(false);
  };

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">DANH SÁCH THIẾT BỊ</div>
        <div className="flex flex-row gap-6">
          <ExportToExcel
            callback={downloadCarpenterList}
            loading={loadingDownload}
          />
          <Button
            className="button_excel"
            onClick={() => navigate('/carpenter/import_excel_eq')}
          >
            <ImportOutlined />
            <div className="font-medium text-md text-[#5B69E6]">
              Nhập thợ từ Excel
            </div>
          </Button>
        </div>
      </div>
      <Divider />
      <div className="flex justify-between flex-col">
        <div
          className="flex flex-row gap-4 items-center mb-4"
          onClick={() => setIsShowCustomTable(!isShowCustomTable)}
        >
          <SelectOutlined />
          <div className="font-medium text-center cursor-pointer text-base">
            Tùy chọn trường hiển thị
          </div>
        </div>
        {isShowCustomTable && (
          <div className="flex flex-row gap-4">
            {columnTable.length > 0 &&
              columnTable.map((item: any) => (
                <div>
                  <Checkbox
                    defaultChecked={item?.show}
                    onChange={(e: any) =>
                      onChangeCheckbox(item, e, columnTable, setColumnTable)
                    }
                  />
                  <div>{item?.title}</div>
                </div>
              ))}
          </div>
        )}
        <div className="flex-between-center gap-4 p-4">
          <Select
            showSearch
            placeholder="Tất cả Trạng thái"
            optionFilterProp="children"
            onChange={(value: any) => onChangeSelect('status_id', value)}
            onSearch={onSearch}
            allowClear
            filterOption={(input, option) =>
              (option!.label as unknown as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            className="select-custom"
            options={options(carpenter_statuses)}
            value={status}
          />

          <Input
            placeholder="Tìm kiếm theo tên, địa chỉ, số điện thoại,..."
            allowClear
            value={name}
            className="input"
            onChange={(e) =>
              onChangeSearch(
                e,
                setName,
                searchQuery,
                setSearchQuery,
                searchQueryString
              )
            }
          />
          <div>
            <FilterFilled />
          </div>
        </div>
      </div>
      <Table
        columns={columnTable.filter((item: any) => item.show)}
        dataSource={carpenters}
        className="mt-6 shadow-md"
        footer={() => <TableFooter paginationProps={pagination} />}
        pagination={false}
        loading={loading}
      />
    </div>
  );
};

export default ListCarpenters;
