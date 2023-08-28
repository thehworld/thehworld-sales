import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAUser } from "../../api/Api";
import { Button, Container } from "@mui/material";


const UserDetails = () => {

    const { userId } = useParams();


    const [aUserDetails, setaUserDetails] = useState("");
    const [userOrdersList, setuserOrdersList] = useState([]);
    const [userOrderDetails, setuserOrderDetails] = useState([])
    const getaUserDetails = () => {
        getAUser(userId).then((res) => {
            console.log("User Info - ", res)
            setaUserDetails(res.data.user);
            setuserOrdersList(res.data.user.userOrders);
            if(res.data.orders){
                    setuserOrderDetails(res.data.orders);
            }
        }).catch((err) => {
            console.log("Error - ", err);
        })  
    }

    

    useEffect(() => {
        getaUserDetails()
    },[])

    

    const copy = async (text) => {
        await navigator.clipboard.writeText(text);
        alert('Text copied');
      }



    return(
        <Container>
            <p style={{
                textAlign: 'center',
                marginTop:50,
                fontSize:35,
                fontWeight:700
            }}>
                User Details
            </p>
            <div class="user-preview" style={{
                minHeight: '100vh',
                backgroundColor: '#FFFFFF',
                marginTop: "20px",
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
            }}>
  <div class="user-info" style={{
    textAlign: 'center',
    padding: "20px"
  }}>
    <img src={aUserDetails.userProfilePic} style={{borderRadius: "100px"}} alt="User Photo"/>
    <h2>User Name {aUserDetails.userGoogleName}</h2>
    <p>Address: {aUserDetails.userEmail}</p>
    <p style={{
        fontSize:18,
        
    }}>Phone: <b>{aUserDetails.contactNumber}</b></p>
    <p style={{
        fontSize:18,
        
    }}>WA Phone: <b>{aUserDetails.contactWAForAuto}</b></p>
  </div>
  <div class="user-orders" style={{
    textAlign: 'center'
  }}>
    <h3>Orders:</h3>
   <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", padding: "20px"}}>
    {userOrderDetails && userOrderDetails.map((order, index) => {
        return( 
        <div style={{boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", padding: "20px", textAlign: "left"}}>
            <h4  onClick={() => copy(order._id)}>Order ID: {order._id}</h4>
            <h5>Payment Method: {order.paymentMethod}</h5>
            <h5>Order Total: {order.orderTotal}</h5>
            {order.paymentResponse ? (
                <div>
                    <h5>
                        {order.paymentResponse.code}
                    </h5>
                </div>   
            ) : (
                null
            )

            }
        </div>
        )
    })
    }
    </div>
 
    
  </div>
  <div class="user-orders" style={{
    textAlign: 'center'
  }}>
    <h3>In Cart:</h3>
    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", padding: "20px"}}>
    {aUserDetails.userCart && aUserDetails.userCart.map((user, index) => {
        return(
        <div style={{boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", padding: "20px", textAlign: "left"}}>
            <p>Product Name: {user.product.productName}</p>
            <p>Product Price: {user.product.productPrice}</p>
            <p>Product Dis Price: {user.product.productDiscountPrice}</p>
        </div>
        )
    })
    }
    </div>
    
  </div>
    
</div>
        </Container>
    )    
}


export default UserDetails;