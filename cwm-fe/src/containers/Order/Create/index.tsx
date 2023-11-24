import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Layout,
  Row,
  Select,
  Space,
  Table,
  Typography,
} from 'antd';
import orderApi from 'api/order.api';
import supplyApi from 'api/supply.api';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { options } from 'utils/globalFunc.util';
import numeral from 'numeral';

const CreateOrder = () => {
  const [totalProductAmount, setTotalProductAmount] = useState(0);
  const [totalSupplyAmount, setTotalSupplyAmount] = useState(0);
  const suppliesCount = useRef(1);
  const [supplyData, setSuppliesData] = useState<any>([
    {
      key: suppliesCount.current,
      supplyId: '',
      supplyName: '',
      supplyCode: '',
      supplyQuantity: 1,
      supplyUnitPrice: 0,
      supplyTotal: 0,
    },
  ]);
  const [selectedSupplies, setSelectedSupplies] = useState<number[]>([]);
  const [supplyPageSize, setSupplyPageSize] = useState<number>(10);
  const [currentSupplyPage, setCurrentSupplyPage] = useState<number>(1);
  const getSupplies = () => {
    supplyApi
      .search({})
      .then((res: any) => {
        const { success, data } = res.data;
        if (success) {
          setSupplies(data.supplies);
        }
      })
      .catch();
  };

  const addSupplyRow = () => {
    suppliesCount.current++;
    const defaultValue = {
      key: suppliesCount.current,
      supplyName: '',
      supplyCode: '',
      supplyQuantity: 1,
      supplyUnitPrice: 0,
      supplyTotal: 0,
    };
    setSuppliesData([...supplyData, defaultValue]);
  };
  const handleSupplyDelete = () => {
    if (supplyData?.length > 0 && selectedSupplies?.length > 0) {
      let copyData = supplyData;
      setSuppliesData(
        copyData.filter(
          (item: any) => !selectedSupplies.includes(item?.key as number)
        )
      );
      setCurrentSupplyPage(1);
      setSelectedSupplies([]);
    }
  };

  const dataSourceBySupplyPage = (dataSourceInput: any) => {
    if (dataSourceInput && dataSourceInput?.length > 0) {
      const startIndex = (currentSupplyPage - 1) * supplyPageSize;
      const endIndex = startIndex + supplyPageSize;
      return dataSourceInput.slice(startIndex, endIndex);
    } else {
      return [];
    }
  };
  const handleSelectSupply = (value: string, index: number, record: any) => {
    // Tìm vật tư tương ứng trong mảng supplies dựa trên giá trị đã chọn
    console.log(value, index, record);
    const selectedSupply = supplies.find((supply: any) => supply.id === value);
    console.log(selectedSupply);
    // Cập nhật giá trị các trường khác trong bảng
    const newData = [...supplyData];
    console.log(newData);
    newData[index] = {
      ...newData[index],
      supplyId: selectedSupply.id,
      supplyCode: selectedSupply.code,
      supplyName: selectedSupply.name,
      supplyUnit: selectedSupply.unit,
      supplyUnitPrice: selectedSupply.unit_price,
      supplyTotal: selectedSupply.unit_price * newData[index].supplyQuantity,
    };

    setSuppliesData(newData);
  };

  const handleSupplyChange = (index: any, field: any, value: any) => {
    const updatedSupplies = [...supplyData];

    const numericValue = numeral(value).value();

    updatedSupplies[index][field] = numericValue;

    updatedSupplies[index].supplyTotal =
      updatedSupplies[index].supplyQuantity *
      updatedSupplies[index].supplyUnitPrice;

    setSuppliesData(updatedSupplies);
  };

  const productsCount = useRef(1);
  const [form] = Form.useForm();
  const { Column } = Table;
  const [productData, setProductsData] = useState<any>([
    {
      key: productsCount.current,
      productName: '',
      productSize: '',
      productUnit: '',
      productQuantity: 1,
      productUnitPrice: 0,
      productTotal: 0,
    },
  ]);

  const [selectedProducts, setSelectedProducts] = useState<number[]>([]); // chỉ key
  const navigate = useNavigate();
  const [currentProductPage, setCurrentProductPage] = useState<number>(1);
  const [productPageSize, setProductPageSize] = useState<number>(10);
  const [supplies, setSupplies] = useState<any>([]);
  const addProductRow = () => {
    productsCount.current++;
    const defaultValue = {
      key: productsCount.current,
      productName: '',
      productSize: '',
      productQuantity: 1,
      productUnit: '',
      productUnitPrice: 0,
      productTotal: 0,
    };
    setProductsData([...productData, defaultValue]);
  };

  const handleProductDelete = () => {
    if (productData?.length > 0 && selectedProducts?.length > 0) {
      let copyData = productData;
      setProductsData(
        copyData.filter(
          (item: any) => !selectedProducts.includes(item?.key as number)
        )
      );
      setCurrentProductPage(1);
      setSelectedProducts([]);
    }
  };

  const dataSourceByProductPage = (dataSourceInput: any) => {
    if (dataSourceInput && dataSourceInput?.length > 0) {
      const startIndex = (currentProductPage - 1) * productPageSize;
      const endIndex = startIndex + productPageSize;
      return dataSourceInput.slice(startIndex, endIndex);
    } else {
      return [];
    }
  };

  const handleProductChange = (index: any, field: any, value: any) => {
    console.log('handleProductChange đã được kích hoạt:', index, field, value);
    const updatedProducts = [...productData];

    const numericValue = numeral(value).value();
    if (field === 'productQuantity' || field === 'productUnitPrice') {
      updatedProducts[index][field] = numericValue;
    } else {
      updatedProducts[index][field] = value;
    }

    updatedProducts[index].productTotal =
      updatedProducts[index].productQuantity *
      updatedProducts[index].productUnitPrice;

    setProductsData(updatedProducts);
  };
  const onFormSubmit = async (data: any) => {
    if (data) {
      orderApi
        .create({
          data: {
            customer: data?.customer,
            address: data?.address,
            phone: data?.phone,
          },
          supplies: supplyData?.map((item: any) => ({
            supply_id: item.supplyId,
            quantity: item.supplyQuantity,
          })),
          products: productData?.map((item: any) => ({
            name: item?.productName,
            size: item?.productSize,
            unit: item?.productUnit,
            quantity: item.productQuantity,
            unit_price: item.productUnitPrice,
            price: item?.productUnitPrice,
          })),
        })
        .then(() => {
          navigate('/orders/list');
          toast.success('Tạo đơn nhập thành công');
        })
        .catch(() => {
          toast.error('Tạo đơn nhập thất bại!');
        });
    }
  };
  useEffect(() => {
    getSupplies();
    let totalProduct = 0;
    let totalSupply = 0;
    productData.forEach((product: any) => {
      totalProduct += product.productQuantity * product.productUnitPrice;
    });
    supplyData.forEach((supply: any) => {
      totalSupply += supply.supplyQuantity * supply.supplyUnitPrice;
    });
    setTotalSupplyAmount(totalSupply);
    setTotalProductAmount(totalProduct);
  }, [supplyData, productData]);
  return (
    <Form size="middle" layout="vertical" autoComplete="off" form={form}>
      <Row align="middle" justify="space-between">
        <Typography.Title level={4}>Tạo đơn hàng</Typography.Title>
        <Space>
          <Button type="primary" className="rounded-md" htmlType="submit">
            Đóng
          </Button>
          <Button
            className="button-primary"
            htmlType="submit"
            onClick={() => {
              onFormSubmit(form.getFieldsValue());
            }}
          >
            Tạo
          </Button>
        </Space>
      </Row>
      <Row justify="space-between">
        <Col>
          <Row>
            <Typography.Title level={5}>Thông tin chung</Typography.Title>
          </Row>
          <Row justify="space-between" className="w-[100%]">
            <Col>
              <Form.Item
                label="Tên khách hàng"
                name="customer"
                required
                rules={[
                  { required: true, message: 'Hãy điền tên khách hàng!' },
                ]}
              >
                <Input className="input" />
              </Form.Item>
              <Form.Item
                label="Địa chỉ công trình"
                name="address"
                required
                rules={[
                  {
                    required: true,
                    message: 'Hãy điền địa chỉ công trình!',
                  },
                ]}
              >
                <Input className="input" />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                required
                rules={[
                  {
                    required: true,
                    message: 'Hãy điền số điện thoại liên hệ!',
                  },
                ]}
              >
                <Input className="input" />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row justify="space-between" className="mb-5">
        <Typography.Title level={5}>Danh sách sản phẩm</Typography.Title>
        <Space>
          {selectedProducts?.length > 0 && (
            <Button className="rounded-md" danger onClick={handleProductDelete}>
              Xóa
            </Button>
          )}

          <Button className="button-primary" onClick={addProductRow}>
            Thêm
          </Button>
        </Space>
      </Row>
      <Row>
        <Table
          size="large"
          className="w-full"
          dataSource={dataSourceByProductPage(productData)}
          pagination={{
            current: currentProductPage,
            pageSize: productPageSize,
            total: productData.length, // Tổng số sản phẩm
            onChange: (page) => setCurrentProductPage(page),
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} sản phẩm`,
            showSizeChanger: true,
            onShowSizeChange: (current, size) => {
              setProductPageSize(size);
              setCurrentProductPage(1); // Reset trang về 1 khi thay đổi kích thước trang
            },
          }}
          rowSelection={{
            selectedRowKeys: selectedProducts,
            hideSelectAll: true,
            onSelect: (record, selected) => {
              if (selected) {
                setSelectedProducts([
                  ...selectedProducts,
                  record?.key as number,
                ]);
              } else {
                const newData = selectedProducts.filter(
                  (item: number) => item !== record?.key
                );
                setSelectedProducts([...newData]);
              }
            },
          }}
          footer={() => (
            <div className="flex justify-end ">
              <strong>
                Tổng cộng: {numeral(totalProductAmount).format('0,0') + 'đ'}
              </strong>
            </div>
          )}
        >
          <Column
            title="Tên sản phẩm"
            dataIndex={'productName'}
            key={'productName'}
            width={'300px'}
            render={(value, record: any, index) => {
              return (
                <Input
                  value={value}
                  className="w-full"
                  placeholder="Nhập tên sản phẩm..."
                  onChange={(e) =>
                    handleProductChange(index, 'productName', e.target.value)
                  }
                ></Input>
              );
            }}
          />
          <Column
            title="Kích thước"
            dataIndex={'productSize'}
            key={'productSize'}
            width={'200px'}
            render={(value, record: any, index) => {
              return (
                <Input
                  value={value}
                  className="w-full"
                  placeholder="Nhập kích thước..."
                  onChange={(e) =>
                    handleProductChange(index, 'productSize', e.target.value)
                  }
                ></Input>
              );
            }}
          />
          <Column
            title="Đơn vị tính"
            dataIndex={'productUnit'}
            key={'productUnit'}
            width={'200px'}
            render={(value, record: any, index) => {
              return (
                <Input
                  value={value}
                  className="w-full"
                  placeholder="Nhập đơn vị tính..."
                  onChange={(e) =>
                    handleProductChange(index, 'productUnit', e.target.value)
                  }
                ></Input>
              );
            }}
          />
          <Column
            title="Số lượng"
            dataIndex={'productQuantity'}
            key={'productQuantity'}
            width={'150px'}
            render={(value, record: any, index) => {
              return (
                <InputNumber
                  min={1} // Giới hạn giá trị tối thiểu
                  value={value}
                  className="w-full"
                  onChange={(newValue) => {
                    handleProductChange(index, 'productQuantity', newValue);
                  }}
                />
              );
            }}
          />
          <Column
            title="Đơn giá"
            dataIndex={'productUnitPrice'}
            key={'productUnitPrice'}
            width={'200px'}
            render={(value, record: any, index) => {
              const formattedValue =
                value !== 0 ? numeral(value).format('0,0') : '';
              return (
                <Input
                  value={formattedValue}
                  className="w-full"
                  placeholder="Nhập đơn giá..."
                  onChange={(e) =>
                    handleProductChange(
                      index,
                      'productUnitPrice',
                      e.target.value
                    )
                  }
                ></Input>
              );
            }}
          />
          <Column
            title="Tổng giá trị"
            dataIndex="productTotal"
            key="productTotal"
            render={(value) => (
              <span>
                {' '}
                {value !== 0 ? numeral(value).format('0,0') + 'đ' : ''}
              </span>
            )}
          />
        </Table>
      </Row>
      <Row justify="space-between" className="mb-5">
        <Typography.Title level={5}>Danh sách vật tư</Typography.Title>
        <Space>
          {selectedSupplies?.length > 0 && (
            <Button className="rounded-md" danger onClick={handleSupplyDelete}>
              Xóa
            </Button>
          )}

          <Button className="button-primary" onClick={addSupplyRow}>
            Thêm
          </Button>
        </Space>
      </Row>
      <Row>
        <Table
          size="large"
          className="w-full"
          dataSource={dataSourceBySupplyPage(supplyData)}
          rowSelection={{
            selectedRowKeys: selectedSupplies,
            hideSelectAll: true,
            onSelect: (record, selected) => {
              if (selected) {
                setSelectedSupplies([
                  ...selectedSupplies,
                  record?.key as number,
                ]);
              } else {
                const newData = selectedSupplies.filter(
                  (item: number) => item !== record?.key
                );
                setSelectedSupplies([...newData]);
              }
            },
          }}
          pagination={{
            current: currentSupplyPage,
            pageSize: supplyPageSize,
            total: supplyData.length, // Tổng số sản phẩm
            onChange: (page) => setCurrentSupplyPage(page),
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} sản phẩm`,
            showSizeChanger: true,
            onShowSizeChange: (current, size) => {
              setSupplyPageSize(size);
              setCurrentSupplyPage(1); // Reset trang về 1 khi thay đổi kích thước trang
            },
          }}
          footer={() => (
            <div className="flex justify-end ">
              <strong>
                Tổng cộng: {numeral(totalSupplyAmount).format('0,0') + 'đ'}
              </strong>
            </div>
          )}
        >
          <Column
            title="Tên vật tư"
            dataIndex={'supplyName'}
            key={'supplyName'}
            width={'300px'}
            render={(_item, record: any, index) => {
              return (
                <Select
                  showSearch
                  placeholder="Chọn vật tư..."
                  value={record.supplyName || undefined}
                  className="w-full"
                  options={options(supplies)}
                  onChange={(value) => {
                    handleSelectSupply(value, index, record);
                  }}
                />
              );
            }}
          />
          <Column
            title="Mã vật tư"
            dataIndex={'supplyCode'}
            width={'200px'}
            key={'supplyCode'}
          />
          <Column
            title="Đơn vị"
            width={'200px'}
            dataIndex={'supplyUnit'}
            key={'supplyUnit'}
          />
          <Column
            title="Số lượng"
            dataIndex={'supplyQuantity'}
            key={'supplyQuantity'}
            width={'150px'}
            render={(value, record: any, index) => {
              return (
                <InputNumber
                  min={1} // Giới hạn giá trị tối thiểu
                  value={value}
                  className="w-full"
                  onChange={(newValue) => {
                    handleSupplyChange(index, 'supplyQuantity', newValue);
                  }}
                />
              );
            }}
          />
          <Column
            title="Đơn giá"
            dataIndex="supplyUnitPrice"
            key="supplyUnitPrice"
            render={(value) => (
              <span>
                {value !== 0 ? numeral(value).format('0,0') + 'đ' : ''}
              </span>
            )}
          />
          <Column
            title="Tổng giá trị"
            dataIndex="supplyTotal"
            key="supplyTotal"
            render={(value) => (
              <span>
                {value !== 0 ? numeral(value).format('0,0') + 'đ' : ''}
              </span>
            )}
          />
        </Table>
      </Row>
    </Form>
  );
};

export default CreateOrder;
