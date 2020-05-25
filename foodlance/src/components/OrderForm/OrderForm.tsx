import React, { useState, useContext } from 'react';
import { Modal, Button, Input, Row, Col, Form, message, Select } from 'antd';
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import ProductInfo from '../../models/ProductInfo';
import deepClone from "lodash.clonedeep";
import Order from '../../models/Order';
import cloneDeep from 'lodash.clonedeep';
import axios from "axios";
import { LayerContext } from '../../context/LayerContext';
import { IMapOrder } from '../../models/IMapOrder';
import { OrderHelpers } from '../../helpers/OrderHelper';

interface OrderFormProps {
  showOrderForm: boolean;
  setShowOrderForm: React.Dispatch<React.SetStateAction<boolean>>;
}
const { Option } = Select;

const tipOptions = [
  { value: 0.10, label: "10%"},
  { value: 0.15, label: "15%"},
  { value: 0.20, label: "20%"},
  { value: 0.25, label: "25%"},
  { value: 0.30, label: "30%"},
  { value: 0.35, label: "35%"},
  { value: 0.40, label: "40%"},
  { value: 0.45, label: "45%"},
  { value: 0.50, label: "50%"},
  { value: "custom", label: "Custom"},
]
const OrderForm: React.FC<OrderFormProps> = (props: OrderFormProps) => {
  const { point, setPoint, stateToken, allOrders, setAllOrders } = useContext(LayerContext);
  const [order, setOrder] = useState<Order>(new Order());
  const [form] = Form.useForm();

  const handleSubmit = async() => {
    message.info("Submitting order...");
    try{
      const token = localStorage.getItem("token");
      if (token || stateToken) {
        await axios({
          method: 'POST',
          url: 'http://localhost:5000/api/order/create',
          headers: {
            "X-Auth-Token": token || stateToken
          },
          data: {
            order: order,
            markerPosition: point.props.position
          },
        }).then((response) => {
          if (response.data.success) {
            const clonedMarkers: IMapOrder[] = cloneDeep(allOrders);
            clonedMarkers.push(OrderHelpers.mapDbToClientModel(response.data.newOrder));
            setAllOrders(clonedMarkers);
            setPoint([0,0]);
            props.setShowOrderForm(false);
          }
        });

        message.success({content: "Successfully created order! You will be notified when someone accepts it.", duration: 2});
      } else {
        message.error("Missing authentication token. Strange....");
      }
    } catch(error) {
      console.log(error.message);
      message.error("Unexpected server error occurred. Please try again later.");

    }
  }

  const calculateNewTotal = (order: Order, clonedOrder: Order) => {
    let newTotal = 0;
    order.products.forEach(p => {
      newTotal += p.price * p.quantity;
    });
    clonedOrder.productsPrice = newTotal;
    calculateNewTip(clonedOrder);
  }

  const calculateNewTip = (clonedOrder: Order) => {
    if (order.tipPercentage !== "custom") {
      clonedOrder.tip = +(clonedOrder.productsPrice * +clonedOrder.tipPercentage).toFixed(2);
    } else {
      let newMinTip = +(clonedOrder.productsPrice * +tipOptions[0].value).toFixed(2);
      if (newMinTip > clonedOrder.tip) {
        clonedOrder.tip = newMinTip;
      }
    }
    clonedOrder.totalPrice = +(clonedOrder.tip + clonedOrder.productsPrice).toFixed(2);
  };

  const cancelOrder = () => {
    props.setShowOrderForm(false);
  }
  const addNewProduct = () => {
    let clonedOrder = deepClone(order);
    clonedOrder.addNewProduct();
    setOrder(clonedOrder);
  }

  const handleProductInfoChange = ( event: React.ChangeEvent<HTMLInputElement>, product: ProductInfo) => {
    let clonedOrder = deepClone(order);
    if(event.target.name.indexOf("Name") >=0) {
      product.name = event.target.value;
    } else if (event.target.name.startsWith("Quantity") && +event.target.value >=0 ) {
      product.quantity = +event.target.value;
      calculateNewTotal(order, clonedOrder);
    } else if(event.target.name.startsWith("Price") && +event.target.value >=0) {
      product.price = +event.target.value;
      calculateNewTotal(order, clonedOrder);
    }
    let productIndex = clonedOrder.products.findIndex(p => p.id === product.id)
    clonedOrder.products.splice(productIndex, 1, product); 
    setOrder(clonedOrder);
  }

  const removeProduct = (productId: number) => {
    const clonedOrder = cloneDeep(order);
    const productsIndex = clonedOrder.products.map(p => p.id).indexOf(productId);
    clonedOrder.products.splice(productsIndex, 1);
    setOrder(clonedOrder);
  }
  const handleTipSelectChange = (value: any) =>{
    console.log(value);
    let clonedOrder = cloneDeep(order);
    if (value !== "custom") {
      clonedOrder.tipPercentage = value;
      clonedOrder.tip = +(clonedOrder.productsPrice * +clonedOrder.tipPercentage).toFixed(2);
      calculateNewTotal(order, clonedOrder);
    } else {
      clonedOrder.tipPercentage = value;
    }
    setOrder(clonedOrder);
  }
  if (props.showOrderForm) {
    return (
      <div>
        <Modal
            title="Order form"
            visible={props.showOrderForm}
            onOk={() => {
              form
                .validateFields()
                .then(values => {
                  form.resetFields();
                  handleSubmit();
                })
                .catch(info => {
                  console.log('Validate Failed:', info);
                });
            }}
            onCancel={cancelOrder}
          >
            <Form 
              form={form}
            >
            {order.products.map((product) => (
              <div key={product.id} className="product-info">
                <Row>
                  <Col span={13}>
                    { order.products.length > 1
                      ? <DeleteOutlined className="deleteIcon"  onClick={() => removeProduct(product.id)}/>
                      : null
                    }
                    <Form.Item
                      name={`Name-${product.id}`}
                      rules={[{ required: true, message: 'Please type in product name' }]}
                    >
                      <Input
                      name={`Name-${product.id}`}
                      placeholder="Product" 
                      value={product.name} 
                      onChange={(value) => handleProductInfoChange(value, product)}
                    />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item
                      name={`Quantity-${product.id}`}
                      rules={[{ pattern:new RegExp(/([0-9]*[.])?[0-9]+/), required:true, message: 'Invalid number' }]}
                    >
                      <Input
                        min={1}
                        max={999} 
                        name={`Quantity-${product.id}`}
                        type="number" 
                        suffix="Qty." 
                        value={product.quantity} 
                        onChange={(value) => handleProductInfoChange(value, product)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name={`Price-${product.id}`}
                      rules={[{ pattern:new RegExp(/([0-9]*[.])?[0-9]+/), required: true, message: 'Invalid number' }]}
                    >
                      <Input
                        min={1} max={999}
                        placeholder="Price"
                        name={`Price-${product.id}`}
                        type="number"
                        suffix="BGN"
                        value={product.price}
                        onChange={(value) => handleProductInfoChange(value, product)}
                        onKeyPress={(event: any) => {
                          const value = event.target.value;
                          if ((event.which !== 46 || value.indexOf('.') !== -1) && (event.which < 48 || event.which > 57)) {
                            event.preventDefault();
                          }
                          if (value.indexOf(".") >-1 && (value.split('.')[1].length > 1))		{
                              event.preventDefault();
                          }
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            ))}
            <Row className="buttonsRow">
              <Col span={2}>
                <Button className="new-product-button" onClick={() => addNewProduct()}>
                  <PlusOutlined size={15}/>
                </Button>
              </Col>
            </Row>
            <Row className="">
              <Col span={3} offset={15}>
                <div className="tip-row"><span className="tip-label">Products:</span></div>
              </Col>
              <Col span={6}>
              <Input
                disabled={true}
                suffix="BGN"
                value={order.productsPrice}
              />
              </Col>
            </Row>
            <Row className="">
              <Col span={2} offset={10}>
                <div className="tip-row"><span className="tip-label">Tip:</span></div>
              </Col>
              <Col span={6} >
                <Select className="select-tip" defaultValue={0.15}  onChange={handleTipSelectChange}>
                  {tipOptions.map(tip => (
                    <Option value={tip.value}>{tip.label}</Option>
                  ))}
                </Select>
              </Col>
              <Col span={6}>
                  <Input
                    disabled={order.tipPercentage !== "custom"}
                    min={order.tipPercentage === "custom" ? order.productsPrice * +tipOptions[0].value : undefined}
                    type="number"
                    suffix="BGN"
                    value={order.tip}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      let clonedOrder = cloneDeep(order);
                      clonedOrder.tip = +(+event.target.value).toFixed(2);
                      setOrder(clonedOrder);
                    }}
                  />
              </Col>
            </Row>
            <Row className="">
              <Col span={2} offset={16}>
                <div className="total-row"><span className="total-label">Total:</span></div>
              </Col>
              <Col span={6}>
              <Input
                disabled={true}
                suffix="BGN"
                value={order.totalPrice}
              />
              </Col>
            </Row>
            </Form>
          </Modal>
      </div>
    )
  } else {
    return null;
  }
}

export default OrderForm
