import { useEffect, useState } from "react"
import { createOfferCode, getAllOffers } from "../../api/Api";
import { v4 as uuidv4 } from 'uuid';
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
import { realDB } from '../../components/Manage/lib/initFirebase';
import 'firebase/database';
import 'firebase/storage';

const Payment = () => {


    
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [list, setList] = useState([]);
    
    const handleInputChange1 = (e) => {
      setInput1(e.target.value);
    };
  
    const handleInputChange2 = (e) => {
      setInput2(e.target.value);
    };

  const [fetchOffers, setfetchOffers] = useState(false);
  const [allOfferCodes, setallOfferCodes] = useState([]);

    
  const handleAddToList = (e) => {
        e.preventDefault();
        createOfferCode({input1, input2}).then((res) => {
            console.log("Offer Res - ",res);
            setfetchOffers(!fetchOffers);
            setInput1("");
            setInput2("");
        }).catch((err) => {
            console.log("Error - ", err);
        })
  };


  const getAllOffersList = () => {
        getAllOffers().then((res) => {
            console.log("All Offers - ", res);
            setallOfferCodes(res.data.offers);
        }).catch((err) => {
            console.log("Error - ", err);
        });
  }

  useEffect(() => {
    getAllOffersList()
 
  }, [fetchOffers])
  

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


  const submitImage = (e) => {
    e.preventDefault();
    let file = fileHere;
    setisLoading(true)
    const storage = getStorage();
    const storageRef = sRef(storage, `offers/banners/${uuidv4()}` + file.name)
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


    return(
       <>
        <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '10px',
          backgroundColor: '#FFFFFF',
        }}
      >
        <div
          style={{
            flex: '1',
            maxWidth: '500px',
            padding: '20px',
            backgroundColor: '#005713',
            margin: '10px',
            borderRadius: '10px',
          }}
        >
          <h2 style={{ color: 'white' }}>Coupons / Offers</h2>
          <input
            type="text"
            placeholder="Coupon Code"
            value={input1}
            onChange={handleInputChange1}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <input
            type="text"
            placeholder="Offer"
            value={input2}
            onChange={handleInputChange2}
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <button
            onClick={handleAddToList}
            style={{ width: '100%', backgroundColor: 'white', color: 'green' }}
          >
            Create
          </button>
        </div>
        <div
          style={{
            flex: '1',
            maxWidth: '500px',
            padding: '20px',
            backgroundColor: 'green',
            margin: '10px',
            borderRadius: '10px',
            overflowY: 'auto',
          }}
        >
          <h2 style={{ color: 'white' }}>List</h2>
          <ul style={{ listStyle: 'none', padding: '0', color: 'white' }}>
            {allOfferCodes && allOfferCodes.map((item, index) => (
            <div>
                {console.log('item', item)}
              <li key={index}>{`Code: ${item.code}, Value: ${item.value}`}</li>
              <button style={{
                width:150,
                height:32,
                backgroundColor: '#FFFFFF',
                borderRadius:5,
                marginRight:5
              }}>
                Disable
              </button>
              <button style={{
                width:150,
                height:32,
                backgroundColor: '#FFFFFF',
                borderRadius:5,
              }}>
                Delete
              </button>
              </div>
            ))}
          </ul>
        </div>



      </div>
            <div style={{
                marginTop:50,
                textAlign:'center'
            }}>
            Banners and Offers Creatives

            <div>

            <div style={{
                marginRight:35,
                marginLeft: 35
            }}>
  <label for="formFileLg" class="form-label">Large file input example</label>
  <input class="form-control form-control-lg" id="formFileLg" type="file"/>
  <button style={{
        height:62,
        width:130,
        backgroundColor: '#007C1F',
        borderRadius:8,
        marginTop:25,
        color: '#FFFFFF'
  }}>
        Upload
   </button> 
</div>
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
            
            </div>  
        </div>
        </>
    )

}


export default Payment;