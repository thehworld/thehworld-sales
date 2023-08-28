import React, { useEffect, useState } from "react";
import { Box, Input, Tab, Tabs, Typography } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { changeOrderStatus, getAllUsersOrders, getChangeOrderStatus } from "../api/Api";
import { useNavigate } from "react-router-dom";
import { Button, Table } from "reactstrap";
import moment from "moment/moment";


const options = [
  'Open'
];

const ITEM_HEIGHT = 48;

const LongMenu = ({navigate, id}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };



  

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem  key={option} selected={option === 'Pyxis'} onClick={handleClose}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}


function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



function Orders() {
  const [value, setValue] = React.useState(0);
  const [allOrders, setallOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const navigate= useNavigate();
  const [isLoading, setisLoading] = useState(false);


  const getAllOrders = () => {
      getAllUsersOrders().then((res) => {
          console.log("All Orders", res.data);
          setallOrders(res.data.orders);
      }).catch((err) => {
        console.log("Error - ", err);
      })
  }
  

  useEffect(() => {
    // setTimeout(() => {
    //   getAllOrders()      
    // }, 3000);
    setInterval(() => {
      getAllOrders()      
    }, 3000);
  }, [])
  


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const isLoadingSection = () => {
    if(isLoading){
      return(
        <div className="loading">
          <div></div>
          <div></div>
        </div> 
      )
    }
  }


  const [orderStatusChecker, setorderStatusChecker] = useState(false)

  const [orderGetStatus, setOrderGetStatus] = useState("NEW");

  const orderStatus = (e, status) => {
    e.preventDefault();
    getChangeOrderStatus({status}).then((res) => {
      console.log("Order Status - ", res);
      if(res.data.order[0].orderUpdateWAPhone){
        // Regex expression to remove all characters which are NOT alphanumeric 
      let number = res.data.order[0].orderUpdateWAPhone.replace(/[^\w\s]/gi, "").replace(/ /g, "");

      // Appending the phone number to the URL
  
      // Appending the message to the URL by encoding it
        let message = `Your Order Status ${res.data.order[0].orderUpdateWAPhone.orderId}`
        let url = `https://web.whatsapp.com/send?phone=${number}&text=${encodeURI(message)}`;
        window.open(url); 
      }
    }).catch((err) => {
      console.log("Error - ", err);
    });

  }


  const orderStatusChange = (e, status, id) => {
    e.preventDefault();
    changeOrderStatus({status, id}).then((res) => {
      console.log(res);
      if(res.data.order){
        setorderStatusChecker(!orderStatusChecker);
        sendUserWhatAppOrderStatusAuto(res.data.order);
      }
    }).catch((err) => {
      console.log("Error - ", err);
    })
  }


  useEffect(() => {
    getAllOrders();
}, [orderStatusChecker]);



  const sendUserWhatAppOrderStatusAuto = (orderDetails) => {
      console.log("Order Status - ", orderDetails);
      let message = `\t\t\t\t THE H WORLD 🌿 \n\n Your Order Status ${orderDetails.orderId} has been updated 😊`;
      let productString = [];
      orderDetails.orderProduct.map((ord, index) => {
          productString += `\n\n *SNo:* ${index + 1}\n *Product No:* ${ord.product.productId}\n *Product Name:* ${ord.product.productName} \n *Product Qty:* ${ord.qty}`
      })
      message+=productString;
      let orderStatus = `\n\n\n - *Order Status - ${orderDetails.orderStatus}*`
      message+=orderStatus;
      let url = `https://web.whatsapp.com/send?phone=+91${orderDetails.orderUpdateWAPhone}&text=${encodeURI(message)}`;
      window.open(url); 
  }


  const sendUserWhatAppOrderStatus = (e, status, orderDetails) => {
      e.preventDefault();
      console.log("Order Status - ", orderDetails);
      let message = `\t\t\t\t THE H WORLD 🌿 \n\n Your Order Status ${orderDetails.orderId} has been updated 😊`;
      let productString = [];
      orderDetails.orderProduct.map((ord, index) => {
          productString += `\n\n *SNo:* ${index + 1}\n *Product No:* ${ord.product.productId}\n *Product Name:* ${ord.product.productName} \n *Product Qty:* ${ord.qty}`
      })
      message+=productString;
      let orderStatus = `\n\n\n - *Order Status - ${orderDetails.orderStatus}*`
      message+=orderStatus;
      let url = `https://web.whatsapp.com/send?phone=${orderDetails.orderUpdateWAPhone}&text=${encodeURI(message)}`;
      window.open(url); 
  }




  return(
    <div style={{padding: "0 40px"}}>
     <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="NEW" {...a11yProps(1)} />
          <Tab label="ACCEPTED" {...a11yProps(2)} />
          <Tab label="DISPATCHED" {...a11yProps(3)} />
          <Tab label="SHIPPED" {...a11yProps(4)}/>
          <Tab label="OUT FOR DELIVERY" {...a11yProps(5)}/>
          <Tab label="DELIVERED" {...a11yProps(6)}/>
          <Tab label="ALL" {...a11yProps(7)}/>
          <Tab label="RETURN INIT" {...a11yProps(8)}/>
          <Tab label="RETURN DONE" {...a11yProps(9)}/>
          <Tab label="REFUND INIT" {...a11yProps(10)}/>
          <Tab label="REFUNDED" {...a11yProps(11)}/>
          <Tab label="CALCELLED" {...a11yProps(12)}/>
        </Tabs>
      </Box>
      <div>
            <Input style={{borderRadius:"1rem", marginTop: "20px"}} type="text" placeholder="Search Orders" onChange={event => {setSearchTerm(event.target.value)}} />
          </div>
      <CustomTabPanel  value={value} index={0}>
        
          <Table striped style={{overflow: "hidden"}} bordered>
          <thead style={{backgroundColor: "#9BA4B5"}}>
            <tr>
              <th>
                #
              </th>
              <th>
                Order id
              </th>
              <th>
                Order Status
              </th>
              <th>
               Rec date&time
              </th>
              <th>
                Pincode
              </th>
              <th>
                Order
              </th>
              <th>
                Order Total
              </th>
              <th>
                Payment
              </th>
              <th>
                WA Automation no.
              </th>
              <th>
                Change Status
              </th>
              <th>
                more details
              </th>
            </tr>
          </thead>
          </Table>
          
          {isLoadingSection()}
              {allOrders && allOrders.filter((order) => {
                if (searchTerm == "" && order.orderStatus === "NEW") {
                  return allOrders
                } else if (order._id.includes(searchTerm) && order.orderStatus === "NEW") {
                  return order
                }
              }).map((order, index) => {
  
            return(
              <tr >
              <div onClick={() => navigate(`/order/${order._id}`)}>
              <th scope="row">
              {index + 1}
              </th>
              <td style={{
                fontSize:12
              }}> 
              {order._id}
              </td>
              <td>
              {order.paymentStatus}
              </td>
              <td>
              {moment(order.createdAt).format("MMMM Do YYYY, h:mm a")}
              </td>
              <td>
              {order.shipmentPincode}
              </td>
              <td>
              {order.orderProduct.length && order.orderProduct.map((prod, index) => {
                  return(
                    <>
                              <p>item name: {prod.product.productName}</p>
                              <p>item qty: {prod.qty}</p>
                              <p>item price: {prod.product.productPrice}</p>
                              <p>item discount price: {prod.product.productDiscountPrice}</p>
                    </>
                  )
                })
                }
              </td>
              <td>
              {order.orderTotal}
              </td>
              <td>
              {order.paymentResponse ? (
                  <div 
              style={(order.paymentResponse.code === "PAYMENT_SUCCESS" || order.paymentResponse.code === "COD_SUCCESS") ? {backgroundColor:"green" }:{backgroundColor: "red" }}
              >
                  {order.paymentResponse.code === undefined ? (
                    <p>
                      Payment is not processed
                    </p>
                  ) : (
                      null
                    )
  
                  }
                  <div style={{borderRadius: "5px", padding: "10px", color: "#ffffff"}}>
                    <p>
                      Payment Status - {order.paymentResponse.code}
                     </p> 
                    <p>
                      Payment Data - {order.paymentResponse.data.amount / 100}
                     </p> 
                     {order.paymentResponse.data.paymentInstrument ? (
                      <div>
                      <p>
                      Payment Type - {order.paymentResponse.data.paymentInstrument.cardType}
                     </p> 
                      </div>
                     ) : (
                      null
                     )

                     }
                    
                     </div>
                   </div> 
                ) : (<p style={{
                  color:"red"
                }}>
                  Payment is not processed
                </p>)
  
                }
              </td>
              <td>
                {order.orderUpdateWAPhone}
              </td>
              </div>
              <td>
              <Button onClick={(e) => orderStatusChange(e, "ACCEPTED", order._id)} style={{
                  margin:5
                }}>
                  Accept
                </Button>
              <Button onClick={(e) => sendUserWhatAppOrderStatus(e, "UPDATE WA", order)} style={{
                  margin:5,
                  backgroundColor:'#3407F8'
                }}>
                  UPDATE
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "DISPATCHED", order._id)} style={{
                  margin:5
                }}>
                Dispatched
                </Button>
                
                <Button onClick={(e) => orderStatusChange(e, "SHIPPED", order._id)} style={{
                  margin:5
                }}>
                Shipped
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "OUTFORDELIVERY", order._id)} style={{
                  margin:5
                }}>
                Out For Delivery
                </Button>
                
                <Button onClick={(e) => orderStatusChange(e, "OUTFORDELIVERY", order._id)} style={{
                  margin:5
                }}>
                Return Init
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "OUTFORDELIVERY", order._id)} style={{
                  margin:5
                }}>
                Returned
                </Button>
                
                <Button onClick={(e) => orderStatusChange(e, "DELIVERED", order._id)} style={{
                  margin:5
                }}>
                  Delivered
                </Button>
                </td>
            </tr>                
           
            )
          })
          }
        </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
      <Table striped style={{overflow: "hidden"}} bordered>
          <thead style={{backgroundColor: "#9BA4B5"}}>
            <tr>
              <th>
                #
              </th>
              <th>
                Order id
              </th>
              <th>
                Order Status
              </th>
              <th>
               Rec date&time
              </th>
              <th>
                Pincode
              </th>
              <th>
                Order
              </th>
              <th>
                Order Total
              </th>
              <th>
                Payment
              </th>
              <th>
                WA Automation no.
              </th>
              <th>
                Change Status
              </th>
              <th>
                more details
              </th>
            </tr>
          </thead>
      </Table>
          {isLoadingSection()}
              {allOrders && allOrders.filter((order) => {
                if (searchTerm == "") {
                  return allOrders
                } else if (order._id.includes(searchTerm) ) {
                  return order
                }
              }).map((order, index) => {
            if(order.orderStatus === "ACCEPTED")
            return(
              <>  
              <tr>
              <div onClick={() => navigate(`/order/${order._id}`)}>
              <th scope="row">
              {index + 1}
              </th>
              <td style={{
                fontSize:12
              }}> 
              {order._id}
              </td>
              <td style={{
                fontSize:20,
                margin:10
              }}>
              {order.paymentStatus}
              </td>
              <td style={{
                fontSize:12,
                marginRight:10,
                marginLeft:10
              }}>
              {moment(order.createdAt).format("MMMM Do YYYY, h:mm a")}

              </td>
              <td>
              {order.shipmentPincode}
              </td>
              <td>
              {order.orderProduct.length && order.orderProduct.map((prod, index) => {
                  return(
                    <div style={{
                      margin:15
                    }}>
                              <p>Item name: <b style={{
                                color:'#0000007E',
                                fontSize: 18
                              }}>{prod.product.productName}</b></p>
                              <hr></hr>
                              <p>Item qty: <b style={{
                                color:'#0000007E',
                                fontSize: 18
                              }}>{prod.qty}</b></p>
                              <hr></hr>
                              <p>Item price: <b style={{
                                color:'#0000007E',
                                fontSize: 18
                              }}>{prod.product.productPrice}</b></p>
                              <hr></hr>
                              <p>Item discount price: <b style={{
                                color:'#0000007E',
                                fontSize: 18
                              }}>{prod.product.productDiscountPrice}</b> </p>
                    </div>
                  )
                })
                }
              </td>
              <td style={{
                margin:15
              }}>
              {order.orderTotal}
              </td>
              <td style={{
                marginLeft:5,
                marginRight:5
              }}>
              {order.paymentResponse ? (
                  <div 
                  style={(order.paymentResponse.code === "PAYMENT_SUCCESS" || order.paymentResponse.code === "COD_SUCCESS") ? {backgroundColor:"green",
                  marginRight:8,
                  marginLeft:8,
                  borderRadius:8 }:{backgroundColor: "red" }}

              >
                  {order.paymentResponse.code === undefined ? (
                    <p style={{
                      fontSize:18
                    }}>
                      <b>Payment is not processed</b>
                    </p>
                  ) : (
                      null
                    )
  
                  }
                  <div style={{borderRadius: "5px", padding: "10px", color: "#ffffff"}}>
                    <p>
                      Payment Status - {order.paymentResponse.code}
                     </p> 
                    <p>
                      Payment Data - {order.paymentResponse.data.amount / 100}
                     </p> 
                     {order.paymentResponse.data.paymentInstrument ? (
                      <div>
                      <p>
                      Payment Type - {order.paymentResponse.data.paymentInstrument.cardType}
                     </p> 
                      </div>
                     ) : (
                      null
                     )

                     }
                     </div>
                   </div> 
                ) : (<p style={{
                  color:"red"
                }}>
                  Payment is not processed
                </p>)
  
                }
              </td>
              <td style={{
                fontSize:20,
                color: 'green'
              }}>
                <b>
                {order.orderUpdateWAPhone}
                </b>
              </td>
              </div>
              <td>
              <Button onClick={(e) => orderStatusChange(e, "ACCEPTED", order._id)} style={{
                  margin:5
                }}>
                  Accept
                </Button>
                <br></br>
                <Button onClick={(e) => orderStatusChange(e, "DISPATCHED", order._id)} style={{
                  margin:5
                }}>
                Dispatched
                </Button>
                <br></br>
                
                <Button onClick={(e) => orderStatusChange(e, "SHIPPED", order._id)} style={{
                  margin:5
                }}>
                Shipped
                </Button>
                <br></br>
                
                <Button onClick={(e) => orderStatusChange(e, "OUTFORDELIVERY", order._id)} style={{
                  margin:5
                }}>
                Out For Delivery
                </Button>
                <br></br>
                
                <Button onClick={(e) => orderStatusChange(e, "RETURN INIT", order._id)} style={{
                  margin:5
                }}>
                Return Init
                </Button>
                <br></br>

                <Button onClick={(e) => orderStatusChange(e, "RETURN DONE", order._id)} style={{
                  margin:5
                }}>
                Returned
                </Button>
                <br></br>

                <Button onClick={(e) => orderStatusChange(e, "REFUND INIT", order._id)} style={{
                  margin:5
                }}>
                Refund Init
                </Button>
                <br></br>

                <Button onClick={(e) => orderStatusChange(e, "REFUNDED", order._id)} style={{
                  margin:5
                }}>
                Refundded
                </Button>
                <br></br>
          
                <Button onClick={(e) => orderStatusChange(e, "DELIVERED", order._id)} style={{
                  margin:5
                }}>
                  Delivered
                </Button>
                <br></br>

                <Button onClick={(e) => orderStatusChange(e, "CANCELLED", order._id)} style={{
                  margin:5
                }}>
                  Cancelled
                </Button>
                <br></br>

                <Button onClick={(e) => sendUserWhatAppOrderStatus(e, "UPDATE WA", order)} style={{
                  margin:5,
                  backgroundColor:'#3407F8'
                }}>
                  UPDATE
                </Button>
              </td>
              </tr>
              <hr style={{
                height:5,
                background: 'lime'
              }}></hr>
              </>
            )
          })
          }
         
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
      <Table striped style={{overflow: "hidden"}} bordered>
          <thead style={{backgroundColor: "#9BA4B5"}}>
            <tr>
              <th>
                #
              </th>
              <th>
                Order id
              </th>
              <th>
                Order Status
              </th>
              <th>
               Rec date&time
              </th>
              <th>
                Pincode
              </th>
              <th>
                Order
              </th>
              <th>
                Order Total
              </th>
              <th>
                Payment
              </th>
              <th>
                WA Automation no.
              </th>
              <th>
                Change Status
              </th>
              <th>
                more details
              </th>
            </tr>
          </thead>
         </Table> 
          {isLoadingSection()}
              {allOrders && allOrders.filter((order) => {
                if (searchTerm == "") {
                  return allOrders
                } else if (order._id.includes(searchTerm) ) {
                  return order
                }
              }).map((order, index) => {
            if(order.orderStatus === "DISPATCHED")
            return(
              <tr>
                <div onClick={() => navigate(`/order/${order._id}`)}>
              <th scope="row">
              {index + 1}
              </th>
              <td>
              {order._id}
              </td>
              <td>
              {order.paymentStatus}
              </td>
              <td>
              {order.createdAt}
              </td>
              <td>
              {order.shipmentPincode}
              </td>
              <td>
              {order.orderProduct.length && order.orderProduct.map((prod, index) => {
                  return(
                    <>
                              <p>item name: {prod.product.productName}</p>
                              <p>item qty: {prod.qty}</p>
                              <p>item price: {prod.product.productPrice}</p>
                              <p>item discount price: {prod.product.productDiscountPrice}</p>
                    </>
                  )
                })
                }
              </td>
              <td>
              {order.orderTotal}
              </td>
              <td>
              {order.paymentResponse ? (
                  <div 
                  style={(order.paymentResponse.code === "PAYMENT_SUCCESS" || order.paymentResponse.code === "COD_SUCCESS") ? {backgroundColor:"green" }:{backgroundColor: "red" }}

              >
                  {order.paymentResponse.code === undefined ? (
                    <p>
                      Payment is not processed
                    </p>
                  ) : (
                      null
                    )
  
                  }
                  <div style={{borderRadius: "5px", padding: "10px", color: "#ffffff"}}>
                    <p>
                      Payment Status - {order.paymentResponse.code}
                     </p> 
                    <p>
                      Payment Data - {order.paymentResponse.data.amount / 100}
                     </p> 
                     {order.paymentResponse.data.paymentInstrument ? (
                      <div>
                      <p>
                      Payment Type - {order.paymentResponse.data.paymentInstrument.cardType}
                     </p> 
                      </div>
                     ) : (
                      null
                     )

                     }
                     </div>
                   </div> 
                ) : (<p style={{
                  color:"red"
                }}>
                  Payment is not processed
                </p>)
  
                }
              </td>
              <td>
                {order.orderUpdateWAPhone}
              </td>
              </div>
              <td>
              <Button onClick={(e) => orderStatusChange(e, "ACCEPTED", order._id)} style={{
                  margin:5
                }}>
                  Accept
                </Button>
            
                <Button onClick={(e) => orderStatusChange(e, "DISPATCHED", order._id)} style={{
                  margin:5
                }}>
                Dispatched
                </Button>
                
                <Button onClick={(e) => orderStatusChange(e, "SHIPPED", order._id)} style={{
                  margin:5
                }}>
                Shipped
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "OUTFORDELIVERY", order._id)} style={{
                  margin:5
                }}>
                Out For Delivery
                </Button>
                
                <Button onClick={(e) => orderStatusChange(e, "RETURN INIT", order._id)} style={{
                  margin:5
                }}>
                Return Init
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "RETURN DONE", order._id)} style={{
                  margin:5
                }}>
                Returned
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "REFUND INIT", order._id)} style={{
                  margin:5
                }}>
                Refund Init
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "REFUNDED", order._id)} style={{
                  margin:5
                }}>
                Refundded
                </Button>
          
                <Button onClick={(e) => orderStatusChange(e, "DELIVERED", order._id)} style={{
                  margin:5
                }}>
                  Delivered
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "CANCELLED", order._id)} style={{
                  margin:5
                }}>
                  Cancelled
                </Button>
                <Button onClick={(e) => sendUserWhatAppOrderStatus(e, "UPDATE WA", order)} style={{
                  margin:5,
                  backgroundColor:'#3407F8'
                }}>
                  UPDATE
                </Button>
              </td>
             </tr>
           
            )
          })
          }
          
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
      <Table striped style={{overflow: "hidden"}} bordered>
          <thead style={{backgroundColor: "#9BA4B5"}}>
            <tr>
              <th>
                #
              </th>
              <th>
                Order id
              </th>
              <th>
                Order Status
              </th>
              <th>
               Rec date&time
              </th>
              <th>
                Pincode
              </th>
              <th>
                Order
              </th>
              <th>
                Order Total
              </th>
              <th>
                Payment
              </th>
              <th>
                WA Automation no.
              </th>
              <th>
                Change Status
              </th>
              <th>
                more details
              </th>
            </tr>
          </thead>
      </Table>
          {isLoadingSection()}
              {allOrders && allOrders.filter((order) => {
                if (searchTerm == "") {
                  return allOrders
                } else if (order._id.includes(searchTerm) ) {
                  return order
                }
              }).map((order, index) => {
            if(order.orderStatus === "SHIPPED")
            return(
              <tr>
                <div onClick={() => navigate(`/order/${order._id}`)}> 
              <th scope="row">
              {index + 1}
              </th>
              <td>
              {order._id}
              </td>
              <td>
              {order.paymentStatus}
              </td>
              <td>
              {order.createdAt}
              </td>
              <td>
              {order.shipmentPincode}
              </td>
              <td>
              {order.orderProduct.length && order.orderProduct.map((prod, index) => {
                  return(
                    <>
                              <p>item name: {prod.product.productName}</p>
                              <p>item qty: {prod.qty}</p>
                              <p>item price: {prod.product.productPrice}</p>
                              <p>item discount price: {prod.product.productDiscountPrice}</p>
                    </>
                  )
                })
                }
              </td>
              <td>
              {order.orderTotal}
              </td>
              <td>
              {order.paymentResponse ? (
                  <div 
                  style={(order.paymentResponse.code === "PAYMENT_SUCCESS" || order.paymentResponse.code === "COD_SUCCESS") ? {backgroundColor:"green" }:{backgroundColor: "red" }}

              >
                  {order.paymentResponse.code === undefined ? (
                    <p>
                      Payment is not processed
                    </p>
                  ) : (
                      null
                    )
  
                  }
                  <div style={{borderRadius: "5px", padding: "10px", color: "#ffffff"}}>
                    <p>
                      Payment Status - {order.paymentResponse.code}
                     </p> 
                    <p>
                      Payment Data - {order.paymentResponse.data.amount / 100}
                     </p> 
                     {order.paymentResponse.data.paymentInstrument ? (
                      <div>
                      <p>
                      Payment Type - {order.paymentResponse.data.paymentInstrument.cardType}
                     </p> 
                      </div>
                     ) : (
                      null
                     )

                     }
                     </div>
                   </div> 
                ) : (<p style={{
                  color:"red"
                }}>
                  Payment is not processed
                </p>)
  
                }
              </td>
              <td>
                {order.orderUpdateWAPhone}
              </td>
              </div>
              <td>
              <Button onClick={(e) => orderStatusChange(e, "ACCEPTED", order._id)} style={{
                  margin:5
                }}>
                  Accept
                </Button>
            
                <Button onClick={(e) => orderStatusChange(e, "DISPATCHED", order._id)} style={{
                  margin:5
                }}>
                Dispatched
                </Button>
                
                <Button onClick={(e) => orderStatusChange(e, "SHIPPED", order._id)} style={{
                  margin:5
                }}>
                Shipped
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "OUTFORDELIVERY", order._id)} style={{
                  margin:5
                }}>
                Out For Delivery
                </Button>
                
                <Button onClick={(e) => orderStatusChange(e, "RETURN INIT", order._id)} style={{
                  margin:5
                }}>
                Return Init
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "RETURN DONE", order._id)} style={{
                  margin:5
                }}>
                Returned
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "REFUND INIT", order._id)} style={{
                  margin:5
                }}>
                Refund Init
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "REFUNDED", order._id)} style={{
                  margin:5
                }}>
                Refundded
                </Button>
          
                <Button onClick={(e) => orderStatusChange(e, "DELIVERED", order._id)} style={{
                  margin:5
                }}>
                  Delivered
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "CANCELLED", order._id)} style={{
                  margin:5
                }}>
                  Cancelled
                </Button>
                <Button onClick={(e) => sendUserWhatAppOrderStatus(e, "UPDATE WA", order)} style={{
                  margin:5,
                  backgroundColor:'#3407F8'
                }}>
                  UPDATE
                </Button>
              </td>
              </tr>
           
            )
          })
          }
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <Table striped style={{overflow: "hidden"}} bordered>
          <thead style={{backgroundColor: "#9BA4B5"}}>
            <tr>
              <th>
                #
              </th>
              <th>
                Order id
              </th>
              <th>
                Order Status
              </th>
              <th>
               Rec date&time
              </th>
              <th>
                Pincode
              </th>
              <th>
                Order
              </th>
              <th>
                Order Total
              </th>
              <th>
                Payment
              </th>
              <th>
                WA Automation no.
              </th>
              <th>
                Change Status
              </th>
              <th>
                more details
              </th>
            </tr>
          </thead>
        </Table>          
          {isLoadingSection()}
              {allOrders && allOrders.filter((order) => {
                if (searchTerm == "") {
                  return allOrders
                } else if (order._id.includes(searchTerm) ) {
                  return order
                }
              }).map((order, index) => {
            if(order.orderStatus === "OUTFORDELIVERY")
            return(
              <tr>
                <div onClick={() => navigate(`/order/${order._id}`)}>
              <th scope="row">
              {index + 1}
              </th>
              <td>
              {order._id}
              </td>
              <td>
              {order.paymentStatus}
              </td>
              <td>
              {order.createdAt}
              </td>
              <td>
              {order.shipmentPincode}
              </td>
              <td>
              {order.orderProduct.length && order.orderProduct.map((prod, index) => {
                  return(
                    <>
                              <p>item name: {prod.product.productName}</p>
                              <p>item qty: {prod.qty}</p>
                              <p>item price: {prod.product.productPrice}</p>
                              <p>item discount price: {prod.product.productDiscountPrice}</p>
                    </>
                  )
                })
                }
              </td>
              <td>
              {order.orderTotal}
              </td>
              <td>
              {order.paymentResponse ? (
                  <div 
                  style={(order.paymentResponse.code === "PAYMENT_SUCCESS" || order.paymentResponse.code === "COD_SUCCESS") ? {backgroundColor:"green" }:{backgroundColor: "red" }}

              >
                  {order.paymentResponse.code === undefined ? (
                    <p>
                      Payment is not processed
                    </p>
                  ) : (
                      null
                    )
  
                  }
                  <div style={{borderRadius: "5px", padding: "10px", color: "#ffffff"}}>
                    <p>
                      Payment Status - {order.paymentResponse.code}
                     </p> 
                    <p>
                      Payment Data - {order.paymentResponse.data.amount / 100}
                     </p> 
                     {order.paymentResponse.data.paymentInstrument ? (
                      <div>
                      <p>
                      Payment Type - {order.paymentResponse.data.paymentInstrument.cardType}
                     </p> 
                      </div>
                     ) : (
                      null
                     )

                     }
                     </div>
                   </div> 
                ) : (<p style={{
                  color:"red"
                }}>
                  Payment is not processed
                </p>)
  
                }
              </td>
              <td>
                {order.orderUpdateWAPhone}
              </td>
              </div>
              <td>
              <Button onClick={(e) => orderStatusChange(e, "ACCEPTED", order._id)} style={{
                  margin:5
                }}>
                  Accept
                </Button>
            
                <Button onClick={(e) => orderStatusChange(e, "DISPATCHED", order._id)} style={{
                  margin:5
                }}>
                Dispatched
                </Button>
                
                <Button onClick={(e) => orderStatusChange(e, "SHIPPED", order._id)} style={{
                  margin:5
                }}>
                Shipped
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "OUTFORDELIVERY", order._id)} style={{
                  margin:5
                }}>
                Out For Delivery
                </Button>
                
                <Button onClick={(e) => orderStatusChange(e, "RETURN INIT", order._id)} style={{
                  margin:5
                }}>
                Return Init
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "RETURN DONE", order._id)} style={{
                  margin:5
                }}>
                Returned
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "REFUND INIT", order._id)} style={{
                  margin:5
                }}>
                Refund Init
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "REFUNDED", order._id)} style={{
                  margin:5
                }}>
                Refundded
                </Button>
          
                <Button onClick={(e) => orderStatusChange(e, "DELIVERED", order._id)} style={{
                  margin:5
                }}>
                  Delivered
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "CANCELLED", order._id)} style={{
                  margin:5
                }}>
                  Cancelled
                </Button>
                <Button onClick={(e) => sendUserWhatAppOrderStatus(e, "UPDATE WA", order)} style={{
                  margin:5,
                  backgroundColor:'#3407F8'
                }}>
                  UPDATE
                </Button>
              </td>
              </tr>
           
            )
          })
          }
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
      <Table striped style={{overflow: "hidden"}} bordered>
          <thead style={{backgroundColor: "#9BA4B5"}}>
            <tr>
              <th>
                #
              </th>
              <th>
                Order id
              </th>
              <th>
                Order Status
              </th>
              <th>
               Rec date&time
              </th>
              <th>
                Pincode
              </th>
              <th>
                Order
              </th>
              <th>
                Order Total
              </th>
              <th>
                Payment
              </th>
              <th>
                WA Automation no.
              </th>
              <th>
                Change Status
              </th>
              <th>
                more details
              </th>
            </tr>
          </thead>
      </Table>          
      {isLoadingSection()}
              {allOrders && allOrders.filter((order) => {
                if (searchTerm == "") {
                  return allOrders
                } else if (order._id.includes(searchTerm) ) {
                  return order
                }
              }).map((order, index) => {
                console.log("5")
            if(order.orderStatus === "DELIVERED")
            return(
              <tr>
                <div onClick={() => navigate(`/order/${order._id}`)}>
              <th scope="row">
              {index + 1}
              </th>
              <td>
              {order._id}
              </td>
              <td>
              {order.paymentStatus}
              </td>
              <td>
              {order.createdAt}
              </td>
              <td>
              {order.shipmentPincode}
              </td>
              <td>
              {order.orderProduct.length && order.orderProduct.map((prod, index) => {
                  return(
                    <>
                              <p>item name: {prod.product.productName}</p>
                              <p>item qty: {prod.qty}</p>
                              <p>item price: {prod.product.productPrice}</p>
                              <p>item discount price: {prod.product.productDiscountPrice}</p>
                    </>
                  )
                })
                }
              </td>
              <td>
              {order.orderTotal}
              </td>
              <td>
              {order.paymentResponse ? (
                  <div 
                  style={(order.paymentResponse.code === "PAYMENT_SUCCESS" || order.paymentResponse.code === "COD_SUCCESS") ? {backgroundColor:"green" }:{backgroundColor: "red" }}

              >
                  {order.paymentResponse.code === undefined ? (
                    <p>
                      Payment is not processed
                    </p>
                  ) : (
                      null
                    )
  
                  }
                  <div style={{borderRadius: "5px", padding: "10px", color: "#ffffff"}}>
                    <p>
                      Payment Status - {order.paymentResponse.code}
                     </p> 
                    <p>
                      Payment Data - {order.paymentResponse.data.amount / 100}
                     </p> 
                     {order.paymentResponse.data.paymentInstrument ? (
                      <div>
                      <p>
                      Payment Type - {order.paymentResponse.data.paymentInstrument.cardType}
                     </p> 
                      </div>
                     ) : (
                      null
                     )

                     }
                     </div>
                   </div> 
                ) : (<p style={{
                  color:"red"
                }}>
                  Payment is not processed
                </p>)
  
                }
              </td>
              <td>
                {order.orderUpdateWAPhone}
              </td>
              </div>
              <td>
              <Button onClick={(e) => orderStatusChange(e, "ACCEPTED", order._id)} style={{
                  margin:5
                }}>
                  Accept
                </Button>
            
                <Button onClick={(e) => orderStatusChange(e, "DISPATCHED", order._id)} style={{
                  margin:5
                }}>
                Dispatched
                </Button>
                
                <Button onClick={(e) => orderStatusChange(e, "SHIPPED", order._id)} style={{
                  margin:5
                }}>
                Shipped
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "OUTFORDELIVERY", order._id)} style={{
                  margin:5
                }}>
                Out For Delivery
                </Button>
                
                <Button onClick={(e) => orderStatusChange(e, "RETURN INIT", order._id)} style={{
                  margin:5
                }}>
                Return Init
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "RETURN DONE", order._id)} style={{
                  margin:5
                }}>
                Returned
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "REFUND INIT", order._id)} style={{
                  margin:5
                }}>
                Refund Init
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "REFUNDED", order._id)} style={{
                  margin:5
                }}>
                Refundded
                </Button>
          
                <Button onClick={(e) => orderStatusChange(e, "DELIVERED", order._id)} style={{
                  margin:5
                }}>
                  Delivered
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "CANCELLED", order._id)} style={{
                  margin:5
                }}>
                  Cancelled
                </Button>
                <Button onClick={(e) => sendUserWhatAppOrderStatus(e, "UPDATE WA", order)} style={{
                  margin:5,
                  backgroundColor:'#3407F8'
                }}>
                  UPDATE
                </Button>
              </td>
              </tr>
           
            )
          })
          }
          
      </CustomTabPanel>
      <CustomTabPanel value={value} index={6}>
      <Table striped style={{overflow: "hidden"}} bordered>
          <thead style={{backgroundColor: "#9BA4B5"}}>
            <tr>
              <th>
                #
              </th>
              <th>
                Order id
              </th>
              <th>
                Order Status
              </th>
              <th>
               Rec date&time
              </th>
              <th>
                Pincode
              </th>
              <th>
                Order
              </th>
              <th>
                Order Total
              </th>
              <th>
                Payment
              </th>
              <th>
                WA Automation no.
              </th>
              <th>
                Change Status
              </th>
              <th>
                more details
              </th>
            </tr>
          </thead>
      </Table>
          {isLoadingSection()}
              {allOrders && allOrders.filter((order) => {
                if (searchTerm == "") {
                  return allOrders
                } else if (order._id.includes(searchTerm) ) {
                  return order
                }
              }).map((order, index) => {
            
            return(
              <tr>
              <div onClick={() => navigate(`/order/${order._id}`)}>
              <th scope="row">
                {index + 1}
              </th>
              <td>
              {order._id}
              </td>
              <td>
              {order.paymentStatus}
              </td>
              <td>
              {order.createdAt}
              </td>
              <td>
              {order.shipmentPincode}
              </td>
              <td>
              {order.orderProduct.length && order.orderProduct.map((prod, index) => {
                  return(
                    <>
                              <p>item name: {prod.product.productName}</p>
                              <p>item qty: {prod.qty}</p>
                              <p>item price: {prod.product.productPrice}</p>
                              <p>item discount price: {prod.product.productDiscountPrice}</p>
                    </>
                  )
                })
                }
              </td>
              <td>
              {order.orderTotal}
              </td>
              <td>
              {order.paymentResponse ? (
                  <div 
                  style={(order.paymentResponse.code === "PAYMENT_SUCCESS" || order.paymentResponse.code === "COD_SUCCESS") ? {backgroundColor:"green" }:{backgroundColor: "red" }}

              >
                  {order.paymentResponse.code === undefined ? (
                    <p>
                      Payment is not processed
                    </p>
                  ) : (
                      null
                    )
  
                  }
                  <div style={{borderRadius: "5px", padding: "10px", color: "#ffffff"}}>
                    <p>
                      Payment Status - {order.paymentResponse.code}
                     </p> 
                    <p>
                      Payment Data - {order.paymentResponse.data.amount / 100}
                     </p> 
                     {order.paymentResponse.data.paymentInstrument ? (
                      <div>
                      <p>
                      Payment Type - {order.paymentResponse.data.paymentInstrument.cardType}
                     </p> 
                      </div>
                     ) : (
                      null
                     )

                     }
                     </div>
                   </div> 
                ) : (<p style={{
                  color:"red"
                }}>
                  Payment is not processed
                </p>)
  
                }
              </td>
              <td>
                {order.orderUpdateWAPhone}
              </td>
                </div>
                <td>
              <Button onClick={(e) => orderStatusChange(e, "ACCEPTED", order._id)} style={{
                  margin:5
                }}>
                  Accept
                </Button>
            
                <Button onClick={(e) => orderStatusChange(e, "DISPATCHED", order._id)} style={{
                  margin:5
                }}>
                Dispatched
                </Button>
                
                <Button onClick={(e) => orderStatusChange(e, "SHIPPED", order._id)} style={{
                  margin:5
                }}>
                Shipped
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "OUTFORDELIVERY", order._id)} style={{
                  margin:5
                }}>
                Out For Delivery
                </Button>
                
                <Button onClick={(e) => orderStatusChange(e, "RETURN INIT", order._id)} style={{
                  margin:5
                }}>
                Return Init
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "RETURN DONE", order._id)} style={{
                  margin:5
                }}>
                Returned
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "REFUND INIT", order._id)} style={{
                  margin:5
                }}>
                Refund Init
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "REFUNDED", order._id)} style={{
                  margin:5
                }}>
                Refundded
                </Button>
          
                <Button onClick={(e) => orderStatusChange(e, "DELIVERED", order._id)} style={{
                  margin:5
                }}>
                  Delivered
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "CANCELLED", order._id)} style={{
                  margin:5
                }}>
                  Cancelled
                </Button>
                <Button onClick={(e) => sendUserWhatAppOrderStatus(e, "UPDATE WA", order)} style={{
                  margin:5,
                  backgroundColor:'#3407F8'
                }}>
                  UPDATE
                </Button>
              </td>
              <td>
                <p onClick={() => navigate(`/order/${order._id}`)} style={{textDecoration: "underline", cursor: "pointer"}} >
                  more
                </p>
              </td>
            </tr>
            )
          })
          }
      </CustomTabPanel>
      <CustomTabPanel value={value} index={7}>
      <Table striped style={{overflow: "hidden"}} bordered>
          <thead style={{backgroundColor: "#9BA4B5"}}>
            <tr>
              <th>
                #
              </th>
              <th>
                Order id
              </th>
              <th>
                Order Status
              </th>
              <th>
               Rec date&time
              </th>
              <th>
                Pincode
              </th>
              <th>
                Order
              </th>
              <th>
                Order Total
              </th>
              <th>
                Payment
              </th>
              <th>
                WA Automation no.
              </th>
              <th>
                Change Status
              </th>
              <th>
                more details
              </th>
            </tr>
          </thead>
        </Table>
          {isLoadingSection()}
              {allOrders && allOrders.filter((order) => {
                if (searchTerm == "") {
                  return allOrders
                } else if (order._id.includes(searchTerm) ) {
                  return order
                }
              }).map((order, index) => {
            if(order.orderStatus === "RETURN INIT")
            return(
              <tr>
              <div onClick={() => navigate(`/order/${order._id}`)}>
              <th scope="row">
              {index + 1}
              </th>
              <td>
              {order._id}
              </td>
              <td>
              {order.paymentStatus}
              </td>
              <td>
              {order.createdAt}
              </td>
              <td>
              {order.shipmentPincode}
              </td>
              <td>
              {order.orderProduct.length && order.orderProduct.map((prod, index) => {
                  return(
                    <>
                              <p>item name: {prod.product.productName}</p>
                              <p>item qty: {prod.qty}</p>
                              <p>item price: {prod.product.productPrice}</p>
                              <p>item discount price: {prod.product.productDiscountPrice}</p>
                    </>
                  )
                })
                }
              </td>
              <td>
              {order.orderTotal}
              </td>
              <td>
              {order.paymentResponse ? (
                  <div 
                  style={(order.paymentResponse.code === "PAYMENT_SUCCESS" || order.paymentResponse.code === "COD_SUCCESS") ? {backgroundColor:"green" }:{backgroundColor: "red" }}

              >
                  {order.paymentResponse.code === undefined ? (
                    <p>
                      Payment is not processed
                    </p>
                  ) : (
                      null
                    )
  
                  }
                  <div style={{borderRadius: "5px", padding: "10px", color: "#ffffff"}}>
                    <p>
                      Payment Status - {order.paymentResponse.code}
                     </p> 
                    <p>
                      Payment Data - {order.paymentResponse.data.amount / 100}
                     </p> 
                     {order.paymentResponse.data.paymentInstrument ? (
                      <div>
                      <p>
                      Payment Type - {order.paymentResponse.data.paymentInstrument.cardType}
                     </p> 
                      </div>
                     ) : (
                      null
                     )

                     }
                     </div>
                   </div> 
                ) : (<p style={{
                  color:"red"
                }}>
                  Payment is not processed
                </p>)
  
                }
              </td>
              <td>
                {order.orderUpdateWAPhone}
              </td>
              </div>
              <td>
              <Button onClick={(e) => orderStatusChange(e, "ACCEPTED", order._id)} style={{
                  margin:5
                }}>
                  Accept
                </Button>
            
                <Button onClick={(e) => orderStatusChange(e, "DISPATCHED", order._id)} style={{
                  margin:5
                }}>
                Dispatched
                </Button>
                
                <Button onClick={(e) => orderStatusChange(e, "SHIPPED", order._id)} style={{
                  margin:5
                }}>
                Shipped
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "OUTFORDELIVERY", order._id)} style={{
                  margin:5
                }}>
                Out For Delivery
                </Button>
                
                <Button onClick={(e) => orderStatusChange(e, "RETURN INIT", order._id)} style={{
                  margin:5
                }}>
                Return Init
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "RETURN DONE", order._id)} style={{
                  margin:5
                }}>
                Returned
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "REFUND INIT", order._id)} style={{
                  margin:5
                }}>
                Refund Init
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "REFUNDED", order._id)} style={{
                  margin:5
                }}>
                Refundded
                </Button>
          
                <Button onClick={(e) => orderStatusChange(e, "DELIVERED", order._id)} style={{
                  margin:5
                }}>
                  Delivered
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "CANCELLED", order._id)} style={{
                  margin:5
                }}>
                  Cancelled
                </Button>
                <Button onClick={(e) => sendUserWhatAppOrderStatus(e, "UPDATE WA", order)} style={{
                  margin:5,
                  backgroundColor:'#3407F8'
                }}>
                  UPDATE
                </Button>
              </td>
              </tr>
            )
          })
          }
          
      </CustomTabPanel>
      <CustomTabPanel value={value} index={8}>
      <Table striped style={{overflow: "hidden"}} bordered>
          <thead style={{backgroundColor: "#9BA4B5"}}>
            <tr>
              <th>
                #
              </th>
              <th>
                Order id
              </th>
              <th>
                Order Status
              </th>
              <th>
               Rec date&time
              </th>
              <th>
                Pincode
              </th>
              <th>
                Order
              </th>
              <th>
                Order Total
              </th>
              <th>
                Payment
              </th>
              <th>
                WA Automation no.
              </th>
              <th>
                Change Status
              </th>
              <th>
                more details
              </th>
            </tr>
          </thead>
        </Table>
          {isLoadingSection()}
              {allOrders && allOrders.filter((order) => {
                if (searchTerm == "") {
                  return allOrders
                } else if (order._id.includes(searchTerm) ) {
                  return order
                }
              }).map((order, index) => {
            if(order.orderStatus === "RETURN DONE")
            return(
              <tr>
              <div onClick={() => navigate(`/order/${order._id}`)}>
              <th scope="row">
              {index + 1}
              </th>
              <td>
              {order._id}
              </td>
              <td>
              {order.paymentStatus}
              </td>
              <td>
              {order.createdAt}
              </td>
              <td>
              {order.shipmentPincode}
              </td>
              <td>
              {order.orderProduct.length && order.orderProduct.map((prod, index) => {
                  return(
                    <>
                              <p>item name: {prod.product.productName}</p>
                              <p>item qty: {prod.qty}</p>
                              <p>item price: {prod.product.productPrice}</p>
                              <p>item discount price: {prod.product.productDiscountPrice}</p>
                    </>
                  )
                })
                }
              </td>
              <td>
              {order.orderTotal}
              </td>
              <td>
              {order.paymentResponse ? (
                  <div 
                  style={(order.paymentResponse.code === "PAYMENT_SUCCESS" || order.paymentResponse.code === "COD_SUCCESS") ? {backgroundColor:"green" }:{backgroundColor: "red" }}

              >
                  {order.paymentResponse.code === undefined ? (
                    <p>
                      Payment is not processed
                    </p>
                  ) : (
                      null
                    )
  
                  }
                  <div style={{borderRadius: "5px", padding: "10px", color: "#ffffff"}}>
                    <p>
                      Payment Status - {order.paymentResponse.code}
                     </p> 
                    <p>
                      Payment Data - {order.paymentResponse.data.amount / 100}
                     </p> 
                     {order.paymentResponse.data.paymentInstrument ? (
                      <div>
                      <p>
                      Payment Type - {order.paymentResponse.data.paymentInstrument.cardType}
                     </p> 
                      </div>
                     ) : (
                      null
                     )

                     }
                     </div>
                   </div> 
                ) : (<p style={{
                  color:"red"
                }}>
                  Payment is not processed
                </p>)
  
                }
              </td>
              <td>
                {order.orderUpdateWAPhone}
              </td>
              </div>
              <td>
              <Button onClick={(e) => orderStatusChange(e, "ACCEPTED", order._id)} style={{
                  margin:5
                }}>
                  Accept
                </Button>
            
                <Button onClick={(e) => orderStatusChange(e, "DISPATCHED", order._id)} style={{
                  margin:5
                }}>
                Dispatched
                </Button>
                
                <Button onClick={(e) => orderStatusChange(e, "SHIPPED", order._id)} style={{
                  margin:5
                }}>
                Shipped
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "OUTFORDELIVERY", order._id)} style={{
                  margin:5
                }}>
                Out For Delivery
                </Button>
                
                <Button onClick={(e) => orderStatusChange(e, "RETURN INIT", order._id)} style={{
                  margin:5
                }}>
                Return Init
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "RETURN DONE", order._id)} style={{
                  margin:5
                }}>
                Returned
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "REFUND INIT", order._id)} style={{
                  margin:5
                }}>
                Refund Init
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "REFUNDED", order._id)} style={{
                  margin:5
                }}>
                Refundded
                </Button>
          
                <Button onClick={(e) => orderStatusChange(e, "DELIVERED", order._id)} style={{
                  margin:5
                }}>
                  Delivered
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "CANCELLED", order._id)} style={{
                  margin:5
                }}>
                  Cancelled
                </Button>
                <Button onClick={(e) => sendUserWhatAppOrderStatus(e, "UPDATE WA", order)} style={{
                  margin:5,
                  backgroundColor:'#3407F8'
                }}>
                  UPDATE
                </Button>
              </td>
              </tr>
            )
          })
          }
          
      </CustomTabPanel>
      <CustomTabPanel value={value} index={9}>
      <Table striped style={{overflow: "hidden"}} bordered>
          <thead style={{backgroundColor: "#9BA4B5"}}>
            <tr>
              <th>
                #
              </th>
              <th>
                Order id
              </th>
              <th>
                Order Status
              </th>
              <th>
               Rec date&time
              </th>
              <th>
                Pincode
              </th>
              <th>
                Order
              </th>
              <th>
                Order Total
              </th>
              <th>
                Payment
              </th>
              <th>
                WA Automation no.
              </th>
              <th>
                Change Status
              </th>
              <th>
                more details
              </th>
            </tr>
          </thead>
        </Table>
          {isLoadingSection()}
              {allOrders && allOrders.filter((order) => {
                if (searchTerm == "") {
                  return allOrders
                } else if (order._id.includes(searchTerm) ) {
                  return order
                }
              }).map((order, index) => {
            if(order.orderStatus === "REFUND INIT")
            return(
              <tr>
              <div onClick={() => navigate(`/order/${order._id}`)}>
              <th scope="row">
              {index + 1}
              </th>
              <td>
              {order._id}
              </td>
              <td>
              {order.paymentStatus}
              </td>
              <td>
              {order.createdAt}
              </td>
              <td>
              {order.shipmentPincode}
              </td>
              <td>
              {order.orderProduct.length && order.orderProduct.map((prod, index) => {
                  return(
                    <>
                              <p>item name: {prod.product.productName}</p>
                              <p>item qty: {prod.qty}</p>
                              <p>item price: {prod.product.productPrice}</p>
                              <p>item discount price: {prod.product.productDiscountPrice}</p>
                    </>
                  )
                })
                }
              </td>
              <td>
              {order.orderTotal}
              </td>
              <td>
              {order.paymentResponse ? (
                  <div 
                  style={(order.paymentResponse.code === "PAYMENT_SUCCESS" || order.paymentResponse.code === "COD_SUCCESS") ? {backgroundColor:"green" }:{backgroundColor: "red" }}

              >
                  {order.paymentResponse.code === undefined ? (
                    <p>
                      Payment is not processed
                    </p>
                  ) : (
                      null
                    )
  
                  }
                  <div style={{borderRadius: "5px", padding: "10px", color: "#ffffff"}}>
                    <p>
                      Payment Status - {order.paymentResponse.code}
                     </p> 
                    <p>
                      Payment Data - {order.paymentResponse.data.amount / 100}
                     </p> 
                     {order.paymentResponse.data.paymentInstrument ? (
                      <div>
                      <p>
                      Payment Type - {order.paymentResponse.data.paymentInstrument.cardType}
                     </p> 
                      </div>
                     ) : (
                      null
                     )

                     }
                     </div>
                   </div> 
                ) : (<p style={{
                  color:"red"
                }}>
                  Payment is not processed
                </p>)
  
                }
              </td>
              <td>
                {order.orderUpdateWAPhone}
              </td>
              </div>
              <td>
              <Button onClick={(e) => orderStatusChange(e, "ACCEPTED", order._id)} style={{
                  margin:5
                }}>
                  Accept
                </Button>
            
                <Button onClick={(e) => orderStatusChange(e, "DISPATCHED", order._id)} style={{
                  margin:5
                }}>
                Dispatched
                </Button>
                
                <Button onClick={(e) => orderStatusChange(e, "SHIPPED", order._id)} style={{
                  margin:5
                }}>
                Shipped
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "OUTFORDELIVERY", order._id)} style={{
                  margin:5
                }}>
                Out For Delivery
                </Button>
                
                <Button onClick={(e) => orderStatusChange(e, "RETURN INIT", order._id)} style={{
                  margin:5
                }}>
                Return Init
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "RETURN DONE", order._id)} style={{
                  margin:5
                }}>
                Returned
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "REFUND INIT", order._id)} style={{
                  margin:5
                }}>
                Refund Init
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "REFUNDED", order._id)} style={{
                  margin:5
                }}>
                Refundded
                </Button>
          
                <Button onClick={(e) => orderStatusChange(e, "DELIVERED", order._id)} style={{
                  margin:5
                }}>
                  Delivered
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "CANCELLED", order._id)} style={{
                  margin:5
                }}>
                  Cancelled
                </Button>
                <Button onClick={(e) => sendUserWhatAppOrderStatus(e, "UPDATE WA", order)} style={{
                  margin:5,
                  backgroundColor:'#3407F8'
                }}>
                  UPDATE
                </Button>
              </td>
              </tr>
            )
          })
          }
          
      </CustomTabPanel>
      <CustomTabPanel value={value} index={10}>
      <Table striped style={{overflow: "hidden"}} bordered>
          <thead style={{backgroundColor: "#9BA4B5"}}>
            <tr>
              <th>
                #
              </th>
              <th>
                Order id
              </th>
              <th>
                Order Status
              </th>
              <th>
               Rec date&time
              </th>
              <th>
                Pincode
              </th>
              <th>
                Order
              </th>
              <th>
                Order Total
              </th>
              <th>
                Payment
              </th>
              <th>
                WA Automation no.
              </th>
              <th>
                Change Status
              </th>
              <th>
                more details
              </th>
            </tr>
          </thead>
        </Table>
          {isLoadingSection()}
              {allOrders && allOrders.filter((order) => {
                if (searchTerm == "") {
                  return allOrders
                } else if (order._id.includes(searchTerm) ) {
                  return order
                }
              }).map((order, index) => {
            if(order.orderStatus === "REFUNDED")
            return(
              <tr>
              <div onClick={() => navigate(`/order/${order._id}`)}>
              <th scope="row">
              {index + 1}
              </th>
              <td>
              {order._id}
              </td>
              <td>
              {order.paymentStatus}
              </td>
              <td>
              {order.createdAt}
              </td>
              <td>
              {order.shipmentPincode}
              </td>
              <td>
              {order.orderProduct.length && order.orderProduct.map((prod, index) => {
                  return(
                    <>
                              <p>item name: {prod.product.productName}</p>
                              <p>item qty: {prod.qty}</p>
                              <p>item price: {prod.product.productPrice}</p>
                              <p>item discount price: {prod.product.productDiscountPrice}</p>
                    </>
                  )
                })
                }
              </td>
              <td>
              {order.orderTotal}
              </td>
              <td>
              {order.paymentResponse ? (
                  <div 
                  style={(order.paymentResponse.code === "PAYMENT_SUCCESS" || order.paymentResponse.code === "COD_SUCCESS") ? {backgroundColor:"green" }:{backgroundColor: "red" }}

              >
                  {order.paymentResponse.code === undefined ? (
                    <p>
                      Payment is not processed
                    </p>
                  ) : (
                      null
                    )
  
                  }
                  <div style={{borderRadius: "5px", padding: "10px", color: "#ffffff"}}>
                    <p>
                      Payment Status - {order.paymentResponse.code}
                     </p> 
                    <p>
                      Payment Data - {order.paymentResponse.data.amount / 100}
                     </p> 
                     {order.paymentResponse.data.paymentInstrument ? (
                      <div>
                      <p>
                      Payment Type - {order.paymentResponse.data.paymentInstrument.cardType}
                     </p> 
                      </div>
                     ) : (
                      null
                     )

                     }
                     </div>
                   </div> 
                ) : (<p style={{
                  color:"red"
                }}>
                  Payment is not processed
                </p>)
  
                }
              </td>
              <td>
                {order.orderUpdateWAPhone}
              </td>
              </div>
              <td>
              <Button onClick={(e) => orderStatusChange(e, "ACCEPTED", order._id)} style={{
                  margin:5
                }}>
                  Accept
                </Button>
            
                <Button onClick={(e) => orderStatusChange(e, "DISPATCHED", order._id)} style={{
                  margin:5
                }}>
                Dispatched
                </Button>
                
                <Button onClick={(e) => orderStatusChange(e, "SHIPPED", order._id)} style={{
                  margin:5
                }}>
                Shipped
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "OUTFORDELIVERY", order._id)} style={{
                  margin:5
                }}>
                Out For Delivery
                </Button>
                
                <Button onClick={(e) => orderStatusChange(e, "RETURN INIT", order._id)} style={{
                  margin:5
                }}>
                Return Init
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "RETURN DONE", order._id)} style={{
                  margin:5
                }}>
                Returned
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "REFUND INIT", order._id)} style={{
                  margin:5
                }}>
                Refund Init
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "REFUNDED", order._id)} style={{
                  margin:5
                }}>
                Refundded
                </Button>
          
                <Button onClick={(e) => orderStatusChange(e, "DELIVERED", order._id)} style={{
                  margin:5
                }}>
                  Delivered
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "CANCELLED", order._id)} style={{
                  margin:5
                }}>
                  Cancelled
                </Button>
                <Button onClick={(e) => sendUserWhatAppOrderStatus(e, "UPDATE WA", order)} style={{
                  margin:5,
                  backgroundColor:'#3407F8'
                }}>
                  UPDATE
                </Button>
              </td>
              </tr>
            )
          })
          }
          
      </CustomTabPanel>
      <CustomTabPanel value={value} index={11}>
      <Table striped style={{overflow: "hidden"}} bordered>
          <thead style={{backgroundColor: "#9BA4B5"}}>
            <tr>
              <th>
                #
              </th>
              <th>
                Order id
              </th>
              <th>
                Order Status
              </th>
              <th>
               Rec date&time
              </th>
              <th>
                Pincode
              </th>
              <th>
                Order
              </th>
              <th>
                Order Total
              </th>
              <th>
                Payment
              </th>
              <th>
                WA Automation no.
              </th>
              <th>
                Change Status
              </th>
              <th>
                more details
              </th>
            </tr>
          </thead>
        </Table>
          {isLoadingSection()}
              {allOrders && allOrders.filter((order) => {
                if (searchTerm == "") {
                  return allOrders
                } else if (order._id.includes(searchTerm) ) {
                  return order
                }
              }).map((order, index) => {
            if(order.orderStatus === "CANCELLED")
            return(
              <tr>
              <div onClick={() => navigate(`/order/${order._id}`)}>
              <th scope="row">
              {index + 1}
              </th>
              <td>
              {order._id}
              </td>
              <td>
              {order.paymentStatus}
              </td>
              <td>
              {order.createdAt}
              </td>
              <td>
              {order.shipmentPincode}
              </td>
              <td>
              {order.orderProduct.length && order.orderProduct.map((prod, index) => {
                  return(
                    <>
                              <p>item name: {prod.product.productName}</p>
                              <p>item qty: {prod.qty}</p>
                              <p>item price: {prod.product.productPrice}</p>
                              <p>item discount price: {prod.product.productDiscountPrice}</p>
                    </>
                  )
                })
                }
              </td>
              <td>
              {order.orderTotal}
              </td>
              <td>
              {order.paymentResponse ? (
                  <div 
                  style={(order.paymentResponse.code === "PAYMENT_SUCCESS" || order.paymentResponse.code === "COD_SUCCESS") ? {backgroundColor:"green" }:{backgroundColor: "red" }}

              >
                  {order.paymentResponse.code === undefined ? (
                    <p>
                      Payment is not processed
                    </p>
                  ) : (
                      null
                    )
  
                  }
                  <div style={{borderRadius: "5px", padding: "10px", color: "#ffffff"}}>
                    <p>
                      Payment Status - {order.paymentResponse.code}
                     </p> 
                    <p>
                      Payment Data - {order.paymentResponse.data.amount / 100}
                     </p> 
                     {order.paymentResponse.data.paymentInstrument ? (
                      <div>
                      <p>
                      Payment Type - {order.paymentResponse.data.paymentInstrument.cardType}
                     </p> 
                      </div>
                     ) : (
                      null
                     )

                     }
                     </div>
                   </div> 
                ) : (<p style={{
                  color:"red"
                }}>
                  Payment is not processed
                </p>)
  
                }
              </td>
              <td>
                {order.orderUpdateWAPhone}
              </td>
              </div>
              <td>
              <Button onClick={(e) => orderStatusChange(e, "ACCEPTED", order._id)} style={{
                  margin:5
                }}>
                  Accept
                </Button>
            
                <Button onClick={(e) => orderStatusChange(e, "DISPATCHED", order._id)} style={{
                  margin:5
                }}>
                Dispatched
                </Button>
                
                <Button onClick={(e) => orderStatusChange(e, "SHIPPED", order._id)} style={{
                  margin:5
                }}>
                Shipped
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "OUTFORDELIVERY", order._id)} style={{
                  margin:5
                }}>
                Out For Delivery
                </Button>
                
                <Button onClick={(e) => orderStatusChange(e, "RETURN INIT", order._id)} style={{
                  margin:5
                }}>
                Return Init
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "RETURN DONE", order._id)} style={{
                  margin:5
                }}>
                Returned
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "REFUND INIT", order._id)} style={{
                  margin:5
                }}>
                Refund Init
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "REFUNDED", order._id)} style={{
                  margin:5
                }}>
                Refundded
                </Button>
          
                <Button onClick={(e) => orderStatusChange(e, "DELIVERED", order._id)} style={{
                  margin:5
                }}>
                  Delivered
                </Button>
                <Button onClick={(e) => orderStatusChange(e, "CANCELLED", order._id)} style={{
                  margin:5
                }}>
                  Cancelled
                </Button>
                <Button onClick={(e) => sendUserWhatAppOrderStatus(e, "UPDATE WA", order)} style={{
                  margin:5,
                  backgroundColor:'#3407F8'
                }}>
                  UPDATE
                </Button>
              </td>
              </tr>
            )
          })
          }
          
      </CustomTabPanel>

     
    </div>
  )
}

export default Orders;

