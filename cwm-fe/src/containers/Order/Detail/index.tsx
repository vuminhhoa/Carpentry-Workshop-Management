import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Layout,
  Pagination,
  Row,
  Select,
  Space,
  Table,
  Typography,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { useEffect, useRef, useState } from 'react';
import orderApi from 'api/order.api';
import { useParams, useNavigate } from 'react-router-dom';
import numeral from 'numeral';

const mockDataSuppliers = [
  {
    key: 1,
    supplierCode: 'code',
    supplierName: 'name',
    orderQuantity: 10,
    unitPrice: 10,
    totalValue: 20000,
    description: 'note',
  },
  {
    key: 2,
    supplierCode: 'code',
    supplierName: 'name',
    orderQuantity: 10,
    unitPrice: 10,
    totalValue: 20000,
    description: 'note',
  },
  {
    key: 3,
    supplierCode: 'code',
    supplierName: 'name',
    orderQuantity: 10,
    unitPrice: 10,
    totalValue: 20000,
    description: 'note',
  },
];

const OrderDetail = () => {
  const params = useParams();
  const { id } = params;
  const [order, setOrder] = useState<any>({});
  const [products, setProducts] = useState<any>([]);
  const [supplies, setSupplies] = useState<any>([]);
  const [totalProductAmount, setTotalProductAmount] = useState(0);
  const [totalSupplyAmount, setTotalSupplyAmount] = useState(0);
  const getDetailOrder = (id: any) => {
    orderApi
      .detail(id)
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setOrder(data.order);
          setSupplies(data.order.Supply_Orders);
          setProducts(data.order.Products);
        }
      })
      .catch()
      .finally();
  };

  useEffect(() => {
    getDetailOrder(id);
    let totalProduct = 0;
    let totalSupply = 0;
    products.forEach((product: any) => {
      totalProduct += product.quantity * product.unit_price;
    });
    supplies.forEach((supply: any) => {
      totalSupply += supply.quantity * supply.Supply?.unit_price;
    });
    setTotalSupplyAmount(totalSupply);
    setTotalProductAmount(totalProduct);
  }, [id, supplies, products]);

  return (
    <div>
      <Row align="middle" justify="space-between">
        <Typography.Title level={4}>Chi tiết đơn hàng</Typography.Title>
        <Button type="primary" className="rounded-md">
          Quay lại
        </Button>
      </Row>

      <Typography.Title level={5}>Thông tin chung</Typography.Title>
      <Space>
        <Col>
          <p>Tên khách hàng: {order.customer}</p>
          <p>Địa chỉ: {order.address}</p>
          <p>Số điện thoại: {order.phone}</p>
          <p>
            <strong>
              Tổng giá trị đơn hàng:
              {numeral(totalSupplyAmount + totalProductAmount).format('0,0') +
                'đ'}
            </strong>
          </p>
          {/* Add other order information as needed */}
        </Col>
      </Space>
      <Typography.Title level={5}>Danh sách sản phẩm</Typography.Title>
      <Table
        size="large"
        dataSource={products}
        pagination={false}
        footer={() => (
          <div className="flex justify-end ">
            <strong>
              Tổng cộng: {numeral(totalProductAmount).format('0,0') + 'đ'}
            </strong>
          </div>
        )}
        className="w-full"
        // Add other table configurations as needed
      >
        {/* Define columns based on the product data structure */}
        <Table.Column title="Tên sản phẩm" dataIndex="name" key="name" />
        <Table.Column title="Kích thước" dataIndex="size" key="size" />
        <Table.Column title="Số lượng" dataIndex="quantity" key="quantity" />
        <Table.Column title="Đơn vị" dataIndex="unit" key="unit" />
        <Table.Column
          title="Đơn giá"
          key="unit_price"
          render={(text, record: any) => (
            <span>{numeral(record.unit_price).format('0,0') + 'đ'}</span>
          )}
        />
        <Table.Column
          title="Thành tiền"
          key="total"
          render={(text, record: any) => (
            <span>
              {numeral(record.quantity * record.unit_price).format('0,0') + 'đ'}
            </span>
          )}
        />
        {/* Add other columns as needed */}
      </Table>

      <Typography.Title level={5}>Danh sách vật tư</Typography.Title>
      <Table
        size="large"
        dataSource={supplies}
        pagination={false}
        className="w-full"
        footer={() => (
          <div className="flex justify-end ">
            <strong>
              Tổng cộng: {numeral(totalSupplyAmount).format('0,0') + 'đ'}
            </strong>
          </div>
        )}
        // Add other table configurations as needed
      >
        {/* Define columns based on the supply order data structure */}
        <Table.Column
          title="Tên vật tư"
          dataIndex={['Supply', 'name']}
          key="supplyName"
        />
        <Table.Column
          title="Mã vật tư"
          dataIndex={['Supply', 'code']}
          key="supplyCode"
        />
        <Table.Column
          title="Đơn vị"
          dataIndex={['Supply', 'unit']}
          key="supplyUnit"
        />
        <Table.Column
          title="Số lượng"
          dataIndex="quantity"
          key="supplyQuantity"
        />
        <Table.Column
          title="Đơn giá"
          key="supplyUnitPrice"
          render={(text, record: any) => (
            <span>
              {numeral(record.Supply?.unit_price).format('0,0') + 'đ'}
            </span>
          )}
        />
        <Table.Column
          title="Thành tiền"
          key="total"
          render={(text, record: any) => (
            <span>
              {numeral(record.quantity * record.Supply?.unit_price).format(
                '0,0'
              ) + 'đ'}
            </span>
          )}
        />
        {/* Add other columns as needed */}
      </Table>
    </div>
  );
};

export default OrderDetail;
