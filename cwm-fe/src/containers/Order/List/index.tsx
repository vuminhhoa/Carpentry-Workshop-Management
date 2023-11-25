import { useEffect, useState } from 'react';
import {
  DeleteFilled,
  EditFilled,
  SelectOutlined,
  PlusCircleFilled,
} from '@ant-design/icons';
import {
  Button,
  Divider,
  Table,
  Menu,
  Row,
  Pagination,
  Popconfirm,
  Tooltip,
  Checkbox,
} from 'antd';
import useDebounce from 'hooks/useDebounce';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useQuery from 'hooks/useQuery';
import { toast } from 'react-toastify';
import { onChangeCheckbox } from 'utils/globalFunc.util';
import type { PaginationProps } from 'antd';
import orderApi from 'api/order.api';
import moment from 'moment';

const TableFooter = ({ paginationProps }: any) => {
  return (
    <Row justify="space-between">
      <div></div>
      <Pagination {...paginationProps} />
    </Row>
  );
};

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any>([]);
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState<any>({});
  let searchQueryString: string;
  const pathName: any = location?.pathname;
  const query = useQuery();
  const currentPage = query?.page;
  const currentName = query?.name;
  const [page, setPage] = useState<number>(currentPage || 1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>(currentName);
  const nameSearch = useDebounce(name, 500);
  const [isShowCustomTable, setIsShowCustomTable] = useState<boolean>(false);

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (
    current,
    pageSize
  ) => {
    setLimit(pageSize);
  };

  const columns: any = [
    {
      title: 'Mã đơn',
      render: (item: any) => (
        <Link to={`/orders/detail/${item.id}`}>{'DONHANG' + item?.id}</Link>
      ),
      key: 'id',
      show: true,
      widthExcel: 30,
    },

    {
      title: 'Trạng thái',
      key: 'status',
      show: true,
      widthExcel: 30,
      render: (item: any) => item?.Order_Status?.name,
    },
    {
      title: 'Ngày tạo',
      key: 'order_date',
      show: true,
      render: (item: any) =>
        moment(item?.createdAt).format('HH:mm:ss DD/MM/YYYY'),
      widthExcel: 30,
    },

    {
      title: 'Khách hàng',
      key: 'customer',
      show: true,
      dataIndex: 'customer',
      widthExcel: 30,
    },
    {
      title: 'Số điện thoại',
      key: 'phone',
      show: true,
      dataIndex: 'phone',
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
      title: 'Tác vụ',
      key: 'action',
      show: true,
      widthExcel: 15,
      render: (item: any) => (
        <Menu className="flex flex-row items-center">
          {item?.Order_Status?.id !== 3 && (
            <Menu.Item
              key="update"
              // className={`${
              //   checkPermission(permissions.EQUIPMENT_UPDATE) ? '' : 'hidden'
              // }`}
            >
              <Tooltip title="Cập nhật đơn">
                <Link to={`/orders/update/${item.id}`}>
                  <EditFilled />
                </Link>
              </Tooltip>
            </Menu.Item>
          )}
          <Menu.Item
            key="delete"
            // className={`${
            //   checkPermission(permissions.EQUIPMENT_DELETE) ? '' : 'hidden'
            // }`}
          >
            <Tooltip title="Xóa đơn hàng">
              <Popconfirm
                title="Bạn muốn xóa đơn hàng này?"
                onConfirm={() => handleDelete(item.id)}
                okText="Xóa"
                cancelText="Hủy"
              >
                <DeleteFilled />
              </Popconfirm>
            </Tooltip>
          </Menu.Item>
        </Menu>
      ),
    },
  ];

  const [columnTable, setColumnTable] = useState<any>(columns);

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
    showTotal: (total: number) => `Tổng cộng: ${total} đơn hàng`,
    onChange: onPaginationChange,
    onShowSizeChange: onShowSizeChange,
  };

  const handleDelete = (id: number) => {
    orderApi
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
    orderApi
      .search({
        name: nameSearch,
        page,
        limit,
      })
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setOrders(data.orders.rows);
          setTotal(data.orders.count);
        }
      })
      .catch()
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    search();
  }, [nameSearch, page, limit]);

  return (
    <div>
      <div className="flex-between-center">
        <div className="title">DANH SÁCH ĐƠN HÀNG</div>
      </div>
      <Divider />
      <div className="flex justify-between">
        <div
          className="flex flex-row gap-4 items-center mb-4"
          onClick={() => setIsShowCustomTable(!isShowCustomTable)}
        >
          <SelectOutlined />
          <div className="font-medium text-center cursor-pointer text-base">
            Tùy chọn trường hiển thị
          </div>
        </div>
        <Button
          className="button_excel"
          onClick={() => {
            navigate('/orders/create');
          }}
        >
          <PlusCircleFilled />
          <div className="font-medium text-md text-[#5B69E6]">
            Tạo đơn hàng mới
          </div>
        </Button>
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
      <Table
        columns={columnTable.filter((item: any) => item.show)}
        dataSource={orders}
        className="mt-6 shadow-md"
        footer={() => <TableFooter paginationProps={pagination} />}
        pagination={false}
        loading={loading}
      />
    </div>
  );
};

export default OrderList;
