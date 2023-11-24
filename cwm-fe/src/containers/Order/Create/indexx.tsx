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
import orderApi from 'api/order.api';
import supplyApi from 'api/supply.api';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { options } from 'utils/globalFunc.util';

const InboundOrderCreate = () => {
  const countSupplies = useRef(1);
  const countProducts = useRef(1);
  const [form] = Form.useForm();
  const { Column } = Table;
  const [dataSupply, setDataSupplies] = useState<any>([
    {
      key: countSupplies.current,
      supplyName: '',
      supplyCode: '',
      supplyQuantity: 0,
      supplyUnitPrice: 0,
      supplyTotal: 0,
    },
  ]);
  const [dataProduct, setDataProducts] = useState<any>([]);
  const [newProduct, setNewProduct] = useState<any>({
    key: countProducts.current,
    productName: '',
    productSize: '',
    productQuantity: 0,
    productUnit: '',
    productUnitrice: 0,
    productTotal: 0,
  });

  const handleAddProduct = () => {
    if (
      newProduct.productName &&
      newProduct.size &&
      newProduct.unit &&
      newProduct.quantity > 0 &&
      newProduct.price > 0
    ) {
      const newProductData = [
        ...dataProduct,
        { ...newProduct, total: newProduct.quantity * newProduct.price },
      ];
      setDataProducts(newProductData);
      setNewProduct({
        productName: '',
        productSize: '',
        productQuantity: 0,
        productUnit: '',
        productUnitrice: 0,
        productTotal: 0,
      });
    } else {
      alert('Vui lòng điền đầy đủ thông tin sản phẩm.');
    }
  };

  const [selectedSupplies, setSelectedSupplies] = useState<number[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]); // chỉ key
  const navigate = useNavigate();
  const [currentSupplyPage, setCurrentSupplyPage] = useState<number>(1);
  const [currentProductPage, setCurrentProductPage] = useState<number>(1);
  const [supplyPageSize, setSupplyPageSize] = useState<number>(10);
  const [productPageSize, setProductPageSize] = useState<number>(10);
  const [supplies, setSupplies] = useState<any>([]);

  const getSuppliesList = () => {
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
  useEffect(() => {
    getSuppliesList();
  }, []);

  const addSupplyRow = () => {
    countSupplies.current++;
    const defaultValue = {
      key: countSupplies.current,
      supplyName: '',
      supplyCode: '',
      supplyQuantity: 0,
      supplyUnitPrice: 0,
      supplyTotal: 0,
    };
    setDataSupplies([...dataSupply, defaultValue]);
  };
  const addProductRow = () => {
    countProducts.current++;
    const defaultValue = {
      key: countProducts.current,
      productName: '',
      productSize: '',
      productQuantity: 0,
      productUnit: '',
      productUnitPrice: 0,
      productTotal: 0,
    };
    setDataProducts([...dataProduct, defaultValue]);
  };

  const handleProductChange = (index: number, key: number, value: string) => {
    const updatedProducts = [...dataProduct];
    updatedProducts[index][key] = value;
    setDataProducts([...dataProduct, updatedProducts]);
  };

  const handleSupplyDelete = () => {
    if (dataSupply?.length > 0 && selectedSupplies?.length > 0) {
      let copyData = dataSupply;
      setDataSupplies(
        copyData.filter(
          (item: any) => !selectedSupplies.includes(item?.key as number)
        )
      );
      setCurrentSupplyPage(1);
      setSelectedSupplies([]);
    }
  };
  const handleProductDelete = () => {
    if (dataProduct?.length > 0 && selectedProducts?.length > 0) {
      let copyData = dataProduct;
      setDataProducts(
        copyData.filter(
          (item: any) => !selectedProducts.includes(item?.key as number)
        )
      );
      setCurrentProductPage(1);
      setSelectedProducts([]);
    }
  };
  const handleChangeSupplyPage = (page: number, size: number) => {
    setCurrentSupplyPage(page);
    setSupplyPageSize(size);
  };
  const handleChangeProductPage = (page: number, size: number) => {
    setCurrentProductPage(page);
    setProductPageSize(size);
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
  const dataSourceByProductPage = (dataSourceInput: any) => {
    if (dataSourceInput && dataSourceInput?.length > 0) {
      const startIndex = (currentProductPage - 1) * productPageSize;
      const endIndex = startIndex + productPageSize;
      return dataSourceInput.slice(startIndex, endIndex);
    } else {
      return [];
    }
  };
  const handleSelectSupply = (value: string, index: number, record: any) => {
    if (supplies && supplies?.length > 0) {
      const actualIndex = (currentSupplyPage - 1) * supplyPageSize + index;
      let listData = [...dataSupply];
      const selectedItem = supplies?.find((item: any) => item?.id === value);
      listData.splice(actualIndex, 1, {
        ...record,
        supplyId: selectedItem?.id,
        supplyCode: selectedItem?.code,
        supplyName: selectedItem?.name,
        supplyUnitPrice: selectedItem?.unit_price,
        supplyUnit: selectedItem?.unit,
      });

      setDataSupplies(listData);
    }
  };

  const handleChangeSupplyQuantity = (
    value: number,
    index: number,
    record: any
  ) => {
    const actualIndex = (currentSupplyPage - 1) * supplyPageSize + index;
    const listData = [...dataSupply];
    console.log('listData');
    console.log(listData);
    const supplyQuantity = value || 0;
    const unitValue = listData[actualIndex]?.supplyUnitPrice as number;
    const supplyTotal = supplyQuantity * unitValue || 0;
    listData[actualIndex] = {
      ...listData[actualIndex],
      supplyQuantity,
      supplyTotal: supplyTotal || 0,
    };
    setDataSupplies(listData);
  };
  const handleChangeProductQuantity = (
    value: number,
    index: number,
    record: any
  ) => {
    const actualIndex = (currentSupplyPage - 1) * productPageSize + index;
    const listData = [...dataProduct];
    const productQuantity = value || 0;
    const unitValue = listData[actualIndex]?.productUnitPrice as number;
    const productTotal = productQuantity * unitValue || 0;
    listData[actualIndex] = {
      ...listData[actualIndex],
      productQuantity,
      productTotal: productTotal || 0,
    };
    setDataProducts(listData);
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
          supplies: dataSupply?.map((item: any) => ({
            supply_id: item?.id,
            quantity: parseInt(item?.quantity) || 0,
          })),
          products: dataProduct?.map((item: any) => ({
            name: item?.name,
            size: item?.name,
            unit: item?.name,
            quantity: parseInt(item?.quantity) || 0,
            price: item?.price,
          })),
        })
        .then(() => {
          navigate('/order/inbound_order');
          toast.success('Tạo đơn nhập thành công');
        })
        .catch(() => {
          toast.error('Tạo đơn nhập thất bại!');
        });
    }
  };

  console.log('countSupplies');
  console.log(countSupplies);
  console.log('countProducts');
  console.log(countProducts);
  console.log('dataSupply');
  console.log(dataSupply);
  console.log('dataProduct');
  console.log(dataProduct);
  console.log('selectedSupplies');
  console.log(selectedSupplies);
  console.log('selectedProducts');
  console.log(selectedProducts);
  console.log('currentSupplyPage');
  console.log(currentSupplyPage);
  console.log('currentProductPage');
  console.log(currentProductPage);
  console.log('supplyPageSize');
  console.log(supplyPageSize);
  console.log('productPageSize');
  console.log(productPageSize);
  console.log('supplies');
  console.log(supplies);
  return (
    <Layout>
      <Form size="middle" layout="vertical" autoComplete="off" form={form}>
        <Layout>
          <Row align="middle" justify="space-between">
            <Typography.Title level={4}>Tạo đơn hàng</Typography.Title>
            <Row>
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
                  Lưu
                </Button>
              </Space>
            </Row>
          </Row>
          <Layout>
            <Row justify="space-between">
              <Col span={15}>
                <Row>
                  <Typography.Title level={5}>Thông tin chung</Typography.Title>
                </Row>
                <Row justify="space-between">
                  <Col span={12}>
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
                  <Col span={11}>
                    <Form.Item label="Ghi chú" name="note">
                      <TextArea rows={9} className="textarea" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Layout>
              <Row justify="space-between" className="mb-5">
                <Typography.Title level={5}>
                  Danh sách sản phẩm
                </Typography.Title>
                <Space>
                  {selectedProducts?.length > 0 && (
                    <Button
                      className="rounded-md"
                      danger
                      onClick={handleProductDelete}
                    >
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
                  dataSource={dataSourceByProductPage(dataProduct)}
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
                  pagination={false}
                >
                  <Column
                    title="Tên sản phẩm"
                    dataIndex={'productName'}
                    key={'productName'}
                    render={(item, record: any, index) => {
                      return (
                        <Form.Item
                          style={{
                            width: '200px',
                          }}
                        >
                          <Input
                            value={record.productName}
                            onChange={(e: any) =>
                              handleProductChange(
                                index,
                                record.key,
                                e.target.value
                              )
                            }
                          ></Input>
                        </Form.Item>
                      );
                    }}
                  />
                  <Column
                    title="Kích thước"
                    dataIndex={'productSize'}
                    key={'productSize'}
                    render={(item, record: any, index) => {
                      return (
                        <Form.Item
                          style={{
                            width: '100px',
                          }}
                        >
                          <Input
                            value={record.productSize}
                            onChange={(e: any) =>
                              handleProductChange(
                                index,
                                record.key,
                                e.target.value
                              )
                            }
                          ></Input>
                        </Form.Item>
                      );
                    }}
                  />
                  <Column
                    title="Đơn vị tính"
                    dataIndex={'productUnit'}
                    key={'productUnit'}
                    render={(_item, record: any, index) => {
                      return (
                        <Form.Item
                          style={{
                            width: '100px',
                          }}
                        >
                          <Input></Input>
                        </Form.Item>
                      );
                    }}
                  />
                  <Column
                    title="Số lượng"
                    dataIndex={'productQuantity'}
                    key={'productQuantity'}
                    render={(value, record, index) => (
                      <InputNumber
                        style={{
                          width: '100px',
                        }}
                        onBlur={(e) => {
                          handleChangeProductQuantity(
                            Math.round(
                              parseFloat(e.target.value.replaceAll(',', ''))
                            ) as unknown as number,
                            index,
                            record
                          );
                        }}
                        formatter={(value) => {
                          return `${value}`.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ','
                          );
                        }}
                        value={value}
                        precision={0}
                      />
                    )}
                  />
                  <Column
                    title="Đơn giá"
                    dataIndex="productUnitPrice"
                    key="productUnitPrice"
                    render={(value, _record, index) => {
                      return (
                        <InputNumber
                          value={parseFloat(value?.toFixed(1))}
                          onChange={(value) => {}}
                          formatter={(value) =>
                            ` ${value}`
                              .replace(/\./, '.')
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          }
                          precision={1}
                        />
                      );
                    }}
                  />
                  <Column
                    title="Tổng giá trị"
                    dataIndex={'productTotal'}
                    key={'productTotal'}
                    render={(value) => (
                      <InputNumber
                        value={parseFloat(value?.toFixed(1))}
                        formatter={(value) =>
                          ` ${value}`
                            .replace(/\./, '.')
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                        precision={1}
                        disabled
                      />
                    )}
                  />
                  <Column
                    title="Ghi chú"
                    dataIndex={'description'}
                    key={'description'}
                  />
                </Table>
                <Row className="w-full mt-5" justify={'end'}>
                  {dataProduct && (
                    <Pagination
                      current={currentSupplyPage}
                      pageSize={supplyPageSize}
                      total={dataProduct.length}
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]}  ${total} items`
                      }
                      onChange={handleChangeSupplyPage}
                      onShowSizeChange={handleChangeSupplyPage}
                      showSizeChanger={true}
                    />
                  )}
                </Row>
              </Row>
              <Row justify="space-between" className="mb-5">
                <Typography.Title level={5}>Danh sách vật tư</Typography.Title>
                <Space>
                  {selectedSupplies?.length > 0 && (
                    <Button
                      className="rounded-md"
                      danger
                      onClick={handleSupplyDelete}
                    >
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
                  dataSource={dataSourceBySupplyPage(dataSupply)}
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
                  pagination={false}
                >
                  <Column
                    title="Mã vật tư"
                    dataIndex={'supplyCode'}
                    key={'supplyCode'}
                  />
                  <Column
                    title="Tên vật tư"
                    dataIndex={'supplyName'}
                    key={'supplyName'}
                    render={(_item, record: any, index) => {
                      return (
                        <Form.Item
                          style={{
                            margin: 'auto',
                          }}
                        >
                          <Select
                            showSearch
                            filterOption={(input, option) =>
                              ((option?.label ?? '') as string)
                                .toLowerCase()
                                .includes(input.trim().toLowerCase())
                            }
                            style={{ width: '100%' }}
                            options={options(supplies)}
                            onChange={(value) => {
                              handleSelectSupply(value, index, record);
                            }}
                          />
                        </Form.Item>
                      );
                    }}
                  />
                  <Column
                    title="Đơn vị"
                    dataIndex={'supplyUnit'}
                    key={'supplyUnit'}
                  />
                  <Column
                    title="Số lượng đặt hàng"
                    dataIndex={'supplyQuantity'}
                    key={'supplyQuantity'}
                    width="20%"
                    render={(value, record, index) => (
                      <InputNumber
                        style={{
                          width: '100px',
                        }}
                        onBlur={(e) => {
                          handleChangeSupplyQuantity(
                            Math.round(
                              parseFloat(e.target.value.replaceAll(',', ''))
                            ) as unknown as number,
                            index,
                            record
                          );
                        }}
                        formatter={(value) => {
                          return `${value}`.replace(
                            /\B(?=(\d{3})+(?!\d))/g,
                            ','
                          );
                        }}
                        value={value}
                        precision={0}
                      />
                    )}
                  />
                  <Column
                    title="Đơn giá"
                    dataIndex="supplyUnitPrice"
                    key="supplyUnitPrice"
                    render={(value, _record, index) => {
                      return (
                        <InputNumber
                          value={parseFloat(value?.toFixed(1))}
                          onChange={(value) => {}}
                          formatter={(value) =>
                            ` ${value}`
                              .replace(/\./, '.')
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                          }
                          precision={1}
                        />
                      );
                    }}
                  />
                  <Column
                    title="Tổng giá trị"
                    dataIndex={'supplyTotal'}
                    key={'supplyTotal'}
                    render={(value) => (
                      <InputNumber
                        value={parseFloat(value?.toFixed(1))}
                        formatter={(value) =>
                          ` ${value}`
                            .replace(/\./, '.')
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                        precision={1}
                        disabled
                      />
                    )}
                  />
                  <Column
                    title="Ghi chú"
                    dataIndex={'description'}
                    key={'description'}
                  />
                </Table>
                <Row className="w-full mt-5" justify={'end'}>
                  {dataSupply && (
                    <Pagination
                      current={currentSupplyPage}
                      pageSize={supplyPageSize}
                      total={dataSupply.length}
                      showTotal={(total, range) =>
                        `${range[0]}-${range[1]}  ${total} items`
                      }
                      onChange={handleChangeSupplyPage}
                      onShowSizeChange={handleChangeSupplyPage}
                      showSizeChanger={true}
                    />
                  )}
                </Row>
              </Row>
            </Layout>
          </Layout>
        </Layout>
      </Form>
    </Layout>
  );
};

export default InboundOrderCreate;
