import React, { useState, useContext } from 'react';
import { Modal, Button, Input, Row, Col, Form, InputNumber, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import ProductInfo from '../../models/ProductInfo';
import deepClone from "lodash.clonedeep";
import Order from '../../models/Order';
import cloneDeep from 'lodash.clonedeep';
import axios from "axios";
import { LayerContext } from '../../context/LayerContext';
import { LatLngTuple } from 'leaflet';
import useAddMarker from '../Map/hooks/useAddMarker';

interface OrderFormProps {
  showOrderForm: boolean;
  setShowOrderForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const OrderForm:React.FC<OrderFormProps> = (props: OrderFormProps) => {
  const { point, setPoint, stateToken, orderMarkers, setOrderMarkers } = useContext(LayerContext);

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
        });

        const clonedMarkers: LatLngTuple[] = cloneDeep(orderMarkers);
        clonedMarkers.push(point);
        setOrderMarkers(clonedMarkers);
        setPoint([0,0]);

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
      newTotal += p.Price * p.Quantity;
    });
    clonedOrder.totalPrice = newTotal;
  }
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
      product.Name = event.target.value;
    } else if (event.target.name.startsWith("Quantity") && +event.target.value >=0 ) {
      product.Quantity = +event.target.value;
      calculateNewTotal(order, clonedOrder);
    } else if(event.target.name.startsWith("Price") && +event.target.value >=0) {
      product.Price = +event.target.value;
      calculateNewTotal(order, clonedOrder);
    }
    let productIndex = clonedOrder.products.findIndex(p => p.Id === product.Id)
    clonedOrder.products.splice(productIndex, 1, product); 
    setOrder(clonedOrder);
  }

  const removeProduct = (productId: number) => {
    const clonedOrder = cloneDeep(order);
    const productsIndex = clonedOrder.products.map(p => p.Id).indexOf(productId);
    clonedOrder.products.splice(productsIndex, 1);
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
              <div className="product-info">
                <Row>
                  <Col span={13}>
                    { order.products.length > 1
                      ? <DeleteOutlined className="deleteIcon"  onClick={() => removeProduct(product.Id)}/>
                      : null
                    }
                    <Form.Item
                      name={`Name-${product.Id}`}
                      rules={[{ required: true, message: 'Please type in product name' }]}
                    >
                      <Input
                      name={`Name-${product.Id}`}
                      placeholder="Product" 
                      value={product.Name} 
                      onChange={(value) => handleProductInfoChange(value, product)}
                    />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item
                      name={`Quantity-${product.Id}`}
                      rules={[{ pattern:new RegExp(/([0-9]*[.])?[0-9]+/), required:true, message: 'Invalid number' }]}
                    >
                      <Input
                        min={1}
                        max={999} 
                        name={`Quantity-${product.Id}`}
                        type="number" 
                        suffix="Qty." 
                        value={product.Quantity} 
                        onChange={(value) => handleProductInfoChange(value, product)}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      name={`Price-${product.Id}`}
                      rules={[{ pattern:new RegExp(/([0-9]*[.])?[0-9]+/), required: true, message: 'Invalid number' }]}
                    >
                      <Input
                        min={1} max={999}
                        placeholder="Price"
                        name={`Price-${product.Id}`}
                        type="number"
                        suffix="BGN"
                        value={product.Price} onChange={(value) => handleProductInfoChange(value, product)}
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
