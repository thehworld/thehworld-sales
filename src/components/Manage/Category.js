import * as React from 'react';
import { useState, useEffect } from 'react';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import Typography from '@mui/joy/Typography';
import { Button, Form, FormGroup, Label, Input, FormText, Toast } from 'reactstrap';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { createCategory, deleteCategory, getAllCategory, updateCategory } from '../../api/Api';


function Category() {
  
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const [isSuccess, setIsSuccess] = useState(false)



  const [category, setCategory] = useState({
    categoryName: "",
    categoryDes: ""
  })

  const [categoryTable, setCategoryTable] = useState([]);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setCategory({...category, [name]: value})
  };

  const handleEditInputChange = (e) => {
    const {name, value} = e.target;
    setEditCategory({...editCategory, [name]: value})
  };

  const renderSuccessmsg = () => {
    if(isSuccess){
      return(
        <div>category created</div>
      )
    }
  }

  const [getAllCategories, setGetAllCategories] = useState([])

  const getAllCategoryHandler = () => {
    getAllCategory()
    .then((res) => {
      setGetAllCategories(res)
    })
  }

  useEffect(() => {
    if(isSuccess){
      setTimeout(() => {
        setIsSuccess(false)
      }, 3000);
    }
    getAllCategoryHandler()
  }, [isSuccess])
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!category.categoryName || !category.categoryDes) {
      alert("Please fill in all fields");
    }
    else{
      createCategory({
        name: category.categoryName,
        description: category.categoryDes
      })
      .then((res) => {
        if(res){
          setIsSuccess(true)
        }
        setCategory({
          categoryName:"",
          categoryDes:""
        })
        console.log("category created", res)
      })
      
      .catch((err) => {
        console.log("error creating category", err)
      })
    }
    
  };

  const onDelete = (e, data) => {
    e.preventDefault();
    console.log(data._id);
    deleteCategory(data._id)
    .then((res) => {
      console.log(res);
      setIsSuccess(true)
    }).catch((err) => {
        console.log("Error - ", err);
    })

  }


  const [editCategory, setEditCategory] = useState({
    categoryId:"",
    categoryName: "",
    categoryDes: ""
  })

  const onEdit = (e, data) => {

    e.preventDefault()

    setEditCategory({
      categoryId: data._id,
      categoryName: data.categoryName,
      categoryDes: data.categoryDescription
    })

    handleClickOpen()
    
  }

  const editCategoryHandler = (e) => {
    e.preventDefault()

    updateCategory({
      cateId: editCategory.categoryId,
      name: editCategory.categoryName,
      description: editCategory.categoryDes
    })
    .then((res) => {
      console.log("category updated", res)
      setIsSuccess(true)
      handleClose()
    })
    
    .catch((err) => {
      console.log(err)
    })
  }

  //


 
  return (
          <Tabs
          size="sm"
          aria-label="Pricing plan"
          defaultValue={0}
          sx={(theme) => ({
            width: "97%",
            minHeight: "88vh",
            marginTop: "30px",
            position: "sticky",
            top: "0",
            '--Tabs-gap': '0px',
            borderRadius: 'lg',
            boxShadow: 'sm',
            overflow: 'auto',
            border: `1px solid ${theme.vars.palette.divider}`,
          })}
        >
          <TabList
            sx={{
              '--ListItem-radius': '0px',
              borderRadius: 0,
              [`& .${tabClasses.root}`]: {
                fontWeight: 'lg',
                flex: 1,
                bgcolor: 'background.body',
                position: 'relative',
                [`&.${tabClasses.selected}`]: {
                  color: 'primary.500',
                },
                [`&.${tabClasses.selected}:before`]: {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  bottom: -1,
                  width: '100%',
                  height: 2,
                  bgcolor: 'primary.400',
                },
                [`&.${tabClasses.focusVisible}`]: {
                  outlineOffset: '-3px',
                },
              },
            }}
          >
            <Tab sx={{ py: 1.5 }} ><p className='poppinsBold'>Create Category</p></Tab>
            <Tab><p className='poppinsBold'>Manage Category</p></Tab>
          </TabList>
          <TabPanel value={0} sx={{ p: 3 }}>
            <div>
            <Form onSubmit={handleSubmit}>
              <FormGroup>   
                <Label for="exampleEmail">Category Name</Label>
                <Input type="text" name="categoryName" onChange={handleInputChange} value={category.categoryName} />
              </FormGroup>
              <FormGroup>
                <Label for="exampleText">Category description</Label>
                <Input type="textarea" name="categoryDes" onChange={handleInputChange} value={category.categoryDes} />
              </FormGroup>
              
              <Button style={{backgroundColor: "#4FB23A", border: "none", padding: "8px 40px", marginTop: "20px"}} type='submit'>Submit</Button>
              {renderSuccessmsg()}
            </Form>
            </div>
          </TabPanel>
            <TabPanel value={1} sx={{ p: 3 }}>
              <div>
                <TableContainer component={Paper} style={{marginTop: "50px"}}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Category Name</TableCell>
                      <TableCell >Category Description</TableCell>
                      
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getAllCategories.map((data, index) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {data.categoryName}
                        </TableCell>
                        <TableCell >{data.categoryDescription}</TableCell>
                        <Button color="primary" onClick={(e) => onEdit(e, data)} style={{marginTop: "8px"}}>Edit</Button>
                        <Button color="danger" onClick={(e) => onDelete(e, data)} style={{marginTop: "8px", marginLeft:5}}>Delete</Button>
                        <Dialog
                          fullScreen={fullScreen}
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="responsive-dialog-title"
                        >
                          <DialogTitle id="responsive-dialog-title">
                            {"Use Google's location service?"}
                          </DialogTitle>
                          <DialogContent>
                          <Form onSubmit={editCategoryHandler}>
                            <FormGroup>   
                              <Label for="exampleEmail">Category Name</Label>
                              <Input type="text" name="categoryName" onChange={handleEditInputChange} value={editCategory.categoryName} />
                            </FormGroup>
                            <FormGroup>
                              <Label for="exampleText">Category description</Label>
                              <Input type="textarea" name="categoryDes" onChange={handleEditInputChange} value={editCategory.categoryDes} />
                            </FormGroup>
                           
                            {renderSuccessmsg()}
                         </Form>

                          </DialogContent>
                          <DialogActions>
                            <Button autoFocus onClick={handleClose}>
                              Disagree
                            </Button>
                            <Button onClick={editCategoryHandler} autoFocus>
                              Agree
                            </Button>
                          </DialogActions>
                         
                        </Dialog>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            </TabPanel>
            </Tabs>
  )
}

export default Category
