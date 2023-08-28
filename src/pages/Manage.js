import * as React from 'react';
import { useState } from 'react';
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
import { Save } from '@mui/icons-material';
import data from '../data/category.json'
import { nanoid } from 'nanoid';

import Products from '../components/Manage/Products';
import Category from '../components/Manage/Category';

export default function Manage() {


  //image upload

  const crop = {
    unit: "%",
    aspect: 4 / 3,
    width: "100"
  };
  const [images, setImages] = useState({});



  


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
        <Tab sx={{ py: 1.5 }} ><p className='poppinsBold'>Category</p></Tab>
        <Tab><p className='poppinsBold'>Product</p></Tab>
      </TabList>
      <TabPanel value={0} sx={{ p: 3 }}>
        <Category />
      </TabPanel>
      <TabPanel value={1} sx={{ p: 3 }}>
        <Products />
      </TabPanel>
      <TabPanel value={2} sx={{ p: 3 }}>
        
      </TabPanel>
    </Tabs>
            
    </div>
  );
}