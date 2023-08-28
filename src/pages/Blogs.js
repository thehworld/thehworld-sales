import * as React from 'react';
import { useState, useEffect } from 'react';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import Typography from '@mui/joy/Typography';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import IconButton from '@mui/joy/IconButton';
import MultiImageInput from "react-multiple-image-input";
import BookmarkAdd from '@mui/icons-material/BookmarkAddOutlined';
import EasyEdit, { Types } from "react-easy-edit";
import { Delete, Save } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { createBlog, getAllBlogs } from '../api/Api';
import firebase from 'firebase/compat/app';
import {
    getStorage,
    ref as sRef,
    uploadBytesResumable,
    uploadBytes,
    getDownloadURL 
} from "firebase/storage";
import { ref, runTransaction, getDatabase, set , onValue , get, onChildAdded, onChildChanged, onChildRemoved  } from 'firebase/database';
import { doc, onSnapshot, collection, query, where } from "firebase/firestore";
import 'firebase/database';
import 'firebase/storage';

export default function Blogs() {

  const [isSuccess, setIsSuccess] = useState(false);

  const [blogCategory, setBlogCategory] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSubTitle, setblogSubTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [subContentTitle, setSubContentTitle] = useState("");
  const [subContentDes, setSubContentDes] = useState("");
  const [subContentArray, setsubContentArray] = useState([]);
  const [images, setImages] = useState({});

  const [blogTable, setBlogTable] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    createBlog({
      blogsCategory: blogCategory,
      blogTitle: blogTitle,
      blogSubTitle: blogSubTitle,
      blogDescription: blogContent,
      subContentArray: subContentArray,
      blogImages: [fileUploadURL, fileUploadURL2]
    })
    .then((res) => {
      if(res) {
        setIsSuccess(true)
      }
      setBlogCategory("")
      setBlogTitle("")
      setBlogContent("")
      setsubContentArray([])
      setImages({})

      console.log("blog created -", res)
    })
    .catch((err) => {
      console.log("error creating blog -", err)
    })
  }

  
  //sub content


  const addSubContent = (e) => {
    e.preventDefault()
    let tempSubContentArray = [...subContentArray]
    const subContentObject = {
      title: subContentTitle,
      description: subContentDes,
      id: uuidv4()
    }
    console.log("object - ", subContentObject)
    console.log("list - ", tempSubContentArray)
    tempSubContentArray.push(subContentObject)
    setsubContentArray(tempSubContentArray)
  }


  const deleteSubContent = (e, id) => {
    e.preventDefault();
    let tempSubContentArray = [...subContentArray];
    let tempSub = tempSubContentArray.find(sub => sub.id === id);
    let tempSubIndex = tempSubContentArray.findIndex(sub => sub.id === id);
    console.log("tempSub - ", tempSub, tempSubIndex)
    tempSubContentArray.splice(tempSubIndex,1);
    setsubContentArray(tempSubContentArray);
  }


  
  const crop = {
    unit: "%",
    aspect: 4 / 3,
    width: "100"
  };

  
  // Image Uploads Here

  const [fileHere, setfileHere] = useState('');
  const [fileHere2, setfileHere2] = useState('');
  const [fileUploadURL, setfileUploadURL] = useState([]);
  const [fileUploadURL2, setfileUploadURL2] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const loadingHere = () => {
    if(isLoading){
      return(
        <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
      </div>
      )
    }
  }

  const onFileInputChange = (event) => {
    const { files } = event.target;
    setfileHere(event.target.files[0])
  }

  const onFileInputChange2 = (event) => {
    const { files } = event.target;
    setfileHere2(event.target.files[0])
  }

  const submitImage = (e) => {
    e.preventDefault();
    let file = fileHere;
    setisLoading(true)
    const storage = getStorage();
    const storageRef = sRef(storage, "blogs/" + file.name)
    const uploadTask = uploadBytesResumable(storageRef, file);



    uploadTask.on('state_changed', 
      (snapshot) => {

        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
      }, 
      () => {

        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
    
            setfileUploadURL(downloadURL);
          setisLoading(false)
        });
      }
    )

}

const submitImage2 = (e) => {
  e.preventDefault();
  let file = fileHere2;
  setisLoading(true)
  const storage = getStorage();
  const storageRef = sRef(storage, "blogs/" + file.name)
  const uploadTask = uploadBytesResumable(storageRef, file);



  uploadTask.on('state_changed', 
    (snapshot) => {

      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    }, 
    (error) => {
    }, 
    () => {

      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
  
          setfileUploadURL2(downloadURL);
        setisLoading(false)
      });
    }
  )

}



  const [allBlogsHere, setallBlogsHere] = useState([]);
  const [editBlogsId, seteditBlogsId] = useState("");

  const editBlogSubmit = () => {

  }

  const getAllBlogsHere = () => {
    getAllBlogs().then((res) => {
      console.log("All Blogs - ", res.blog);
      setallBlogsHere(res.blog);  
    }).catch((err) => {
      console.log("Error - ", err);
    })
  }

  useEffect(() => {
    getAllBlogsHere()
  }, [])
  


  const deleteThisBlog = (e) => {
    e.preventDefault();
    

  }


  return (
    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
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
        <Tab><p className='poppinsBold' style={{marginTop: "10px"}}>Create Blogs</p></Tab>
        <Tab><p className='poppinsBold' style={{marginTop: "10px"}}>Edit Blogs</p></Tab>
      </TabList>
      <TabPanel value={0} sx={{ p: 3 }}>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="exampleEmail">Blog Title</Label>
          <Input type="text" name="blogName" id="exampleEmail" value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail">Blog Sub Title</Label>
          <Input type="text" name="blogName" id="exampleEmail" value={blogSubTitle} onChange={(e) => setblogSubTitle(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label for="exampleText">Blog Main Content</Label>
          <Input type="textarea" name="text" id="exampleText" value={blogContent} onChange={(e) => setBlogContent(e.target.value)} />
        </FormGroup>
        <div className='form-card'>
          <FormGroup>
            <Label for="exampleEmail">Blog sub-heading</Label>
            <Input type="text" name="email" value={subContentTitle} onChange={(e) => setSubContentTitle(e.target.value)}  id="exampleEmail" />
          </FormGroup>
          <FormGroup>
            <Label for="exampleText">Blog sub-content</Label>
            <Input type="textarea" name="text"  value={subContentDes} onChange={(e) => setSubContentDes(e.target.value)} id="exampleText" />
          </FormGroup>
          <Button color='primary' onClick={(e) => addSubContent(e)}>add sub heading and content</Button>
          {subContentArray.map((cont) => {
            return(
              <div style={{padding: "5px", border: "1px solid #131313", borderRadius: "5px", marginTop: "20px"}}>
              <p className='poppinsRegular'><span className='poppinsBold'>Sub Heading - </span>{cont.title}</p>
              <p className='poppinsRegular'><span className='poppinsBold'>Sub Content - </span>{cont.description}</p>
              <Button color='danger' style={{marginLeft: "15px"}} onClick={(e) => deleteSubContent(e, cont.id)}>delete</Button>
              
              </div>
            )
          })}
        </div>
        <br />
        <Label for="exampleEmail">Blog Images</Label>
        {loadingHere()}
            <FormGroup>
              <Label for="exampleText">images</Label>
              <Input className="form-control form-control-lg" id="formFileLg" type="file" onChange={onFileInputChange} />
              <Button onClick={(e) => submitImage(e)}>
          images upload
        </Button>
            </FormGroup>
            <FormGroup>
              <Label for="exampleText">images 2</Label>
              <Input className="form-control form-control-lg" id="formFileLg" type="file" onChange={onFileInputChange2} />
              <button type="button" class="btn btn-primary" onClick={(e) => submitImage2(e)}>Upload</button>
            </FormGroup>

            {/* Image previews */}
            <div>
                <h3>Image Previews:</h3>
                {/* {fileUploadURL.length > 0 && fileUploadURL.map((imageUrl, index) => ( */}
                  <img
                    src={fileUploadURL}
                    width="100"
                    height="100"
                  />
                
              </div>
              <div>
                <h3>Image Previews 2:</h3>
                {/* {fileUploadURL.length > 0 && fileUploadURL.map((imageUrl, index) => ( */}
                  <img
                    src={fileUploadURL2}
                    width="100"
                    height="100"
                  />
                
              </div>
        <FormGroup check>
          <Label check>
            <Input type="checkbox" />{' '}
            confirm to upload
          </Label>
        </FormGroup>
        <Button style={{backgroundColor: "#4FB23A", border: "none", padding: "8px 40px", marginTop: "20px"}} type='submit'>Submit</Button>
      </Form>
      </TabPanel>
      <TabPanel value={1} sx={{ p: 3 }}>
        <div className='cards-grid'>
            
           {allBlogsHere && allBlogsHere.map((blog, index) => {
            return(
              <Card className="card-p" variant="outlined" sx={{ width: "auto" }}>
              <Typography level="body3">Blog Title - {blog.blogTitle}</Typography>
              <Typography level="h2" fontSize="md" sx={{ mb: 0.5 }}>
                  <EasyEdit
                      type={Types.TEXT}
                      value={blog.blogTitle}
                      onSave={val => console.log(val)}
                      allowEdit={true}
                  />
              </Typography>
              
              <IconButton
                  aria-label="bookmark Bahamas Islands"
                  variant="plain"
                  color="neutral"
                  size="sm"
                  onClick={deleteThisBlog}
                  sx={{ position: 'absolute', top: '0.5rem', right: '3rem' }}
              >

                  <Delete />
              </IconButton>
              <IconButton
                  aria-label="bookmark Bahamas Islands"
                  variant="plain"
                  color="neutral"
                  size="sm"
                  sx={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
              >
                
                  <Save />
              </IconButton>
              <h3>
                Blog Images
              </h3>
              <div>
                {blog.blogImages && blog.blogImages.map((blog, index) => {
                  return(
                    <img src={blog} height={150} width={150}/>
                  )
                })
                }
              </div>
                  <MultiImageInput
                    images={images}
                    setImages={setImages}
                    allowCrop={true}
                    theme={"light"}
                    max={4}
                    cropConfig={{ crop, ruleOfThirds: true }}
                  />              
              <Box sx={{ display: 'flex' }}>
                  <div>
                  <Typography level="body3">Description</Typography>
                  <Typography level="h2" fontSize="md" sx={{ mb: 0.5 }}>
                      <EasyEdit
                          type={Types.TEXT}
                          value={blog.blogDescription}
                          onSave={val => console.log(val)}
                          allowEdit={true}
                      />
                  </Typography>
                  <Typography level="body3">Blog Sub - Title</Typography>
                  <p>
                    {blog.blogSubTitle}
                  </p>
                  <Typography level="body3">Blog Sub - Title</Typography>
                  <p>
                    {blog.blogDescription}
                  </p>
                  <Typography level="h2" fontSize="md" sx={{ mb: 0.5 }}>
                      <EasyEdit
                          type={Types.TEXT}
                          value="Product name"
                          onSave={val => console.log(val)}
                          allowEdit={true}
                      />
                  </Typography>
                  <Typography level="body3">Total price:</Typography>
                  <Typography fontSize="lg" fontWeight="lg">
                  <EasyEdit
                      type={Types.NUMBER}
                      value="5000"
                      onSave={val => console.log(val)}
                      allowEdit={true}
                  />
                  </Typography>
                  <Typography level="body3">Discount price:</Typography>
                  <Typography fontSize="lg" fontWeight="lg">
                  <EasyEdit
                      type={Types.NUMBER}
                      value="5000"
                      onSave={val => console.log(val)}
                      allowEdit={true}
                  />
                  </Typography>
                  </div>
                  {/* <Button
                  variant="solid"
                  size="sm"
                  color="primary"
                  aria-label="Explore Bahamas Islands"
                  sx={{ ml: 'auto', fontWeight: 600 }}
                  >
                  Explore
                  </Button> */}
              </Box>
              </Card>
            )
           })
           }
            </div>
      </TabPanel>
    </Tabs>
            
    </div>
  );
}