import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Card, CardContent, CardMedia, Container, Input } from '@mui/material';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useSpring, animated } from '@react-spring/web';
import { useState } from 'react';
import { useEffect } from 'react';
import { getAUser, getAllUsers } from '../api/Api';
import { useNavigate } from 'react-router-dom';
import "./Users.css"


export default function Users() {

  const [allUsers, setallUsers] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getAllUsersFetch = () => {
    getAllUsers().then((res) => {
        console.log("Users - ", res);
        setallUsers(res.data.allUsers);
    }).catch((err) => {
        console.log("Error - ", err);
    })
  }

  useEffect(() => {
    getAllUsersFetch()
  }, [])
  

  const navigate = useNavigate();
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

  return (
    <div>
        <Container>
        <h3 style={{padding: "10px", textAlign: "center", marginTop: "20px"}} className="poppinsBold">USERS</h3>
        <div class="user-list">
        <div style={{marginBottom: "20px"}}>
            <Input style={{borderRadius:"1rem", marginTop: "20px"}} type="text" placeholder="Search Orders" onChange={event => {setSearchTerm(event.target.value)}} />
          </div>
        <div class="grid-container">
       
        {isLoadingSection()}
              {allUsers && allUsers.filter((user) => {
                if (searchTerm == "") {
                  return allUsers
                } else if (user.userEmail.includes(searchTerm) ) {
                  return user
                }
              }).map((user, index) => {
        return(
          <div>
         <Card sx={{ display: 'flex' }} onClick={() => navigate(`/user/${user.userId}`)}>
         <Box sx={{ display: 'flex', flexDirection: 'column' }}>
           <CardContent style={{display: "flex", justifyContent: "center", alignItems: "flex-start", flexDirection: "column"}}>
            <img src={user.userProfilePic} style={{borderRadius: "100px"}}/>
             <Typography component="div" variant="h5">
             Name: {user.userName}
             </Typography>
             <Typography variant="subtitle1" color="text.secondary" component="div">
             Phone: {user.contactNumber}
             </Typography>
             <Typography variant="subtitle1" color="text.secondary" component="div">
             Phone: {user.userEmail}
             </Typography>
           </CardContent>
           </Box>
         
       </Card>
       </div>
       
        )
       })
       }

</div>
 
</div>
</Container>

        </div>
  );
}