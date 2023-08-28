import { getAllOrderIssues } from "../api/Api";
import { useEffect, useState } from 'react'


const Support = () => {

    const [activeTab, setActiveTab] = useState('New'); // Default active tab is 'New'

    const handleTabClick = (tabTitle) => {
        setActiveTab(tabTitle);
    };

    const tabTitles = ['New', 'Reported', 'Solving', 'Solved', 'Closed'];

    const gridStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
      };
      
      const itemStyle = {
        width: '300px',
        height: '200px',
        margin: '10px',
        textAlign: 'center',
        color: '#fff',
        padding: '20px',
      };

      const [allIssues, setallIssues] = useState([]);
      

      const getAllIssues =  () => {
            getAllOrderIssues().then((res) => {
                console.log("Issues Orders - ", res);
                setallIssues(res.data.issues);
            }).catch((err) => {
                console.log("Error - ", err);
            })
      }

      useEffect(() => {
        getAllIssues(); 
      
      }, [])
      

    return(
        <div>
            <div className="tab-container" style={{
                textAlign: 'center',
                marginTop: 50,
                marginBottom: 50
            }}>
      <div className="tab">
        {tabTitles.map((title) => (
          <button
            key={title}
            className={`tab-button ${activeTab === title ? 'active' : ''}`}
            onClick={() => handleTabClick(title)}
            style={{
                margin:5,
                color:'#0A0A0A',
                backgroundColor: '#FFFFFF',
                borderRadius:5
            }}
          >
            {title}
          </button>
        ))}
      </div>
      {/* Content for each tab */}
      <div className="tabcontent" style={{
        textAlign: 'center'
      }}>
        {activeTab === 'New' && <div>
            <p style={{
                color:'green',
                fontSize:20,
                fontWeight: 700
            }}>
              
            New Issue  </p>
        <div style={gridStyle}>
            {allIssues && allIssues.map((iss, index) => {
                return(
                    <div style={{ ...itemStyle, backgroundColor: '#002B0E' }}>
                        <div>
                            <p>
                                {iss.status}
                            </p>
                            <p>
                                {iss.order.orderId}
                            </p>
                            <p>
                                {iss.order.shipmentStatus}
                            </p>
                            <p style={{
                                fontSize:20
                            }}>
                                {iss.order.orderStatus}
                            </p>
                            <div>
                                {iss.order.orderProduct.length && iss.order.orderProduct.map((product, index) => {
                                  return(
                                    <div key={index} style={{
                                        backgroundColor: '#00270C',
                                        padding:8,
                                        borderRadius:8,
                                        textAlign: 'start',
                                    }}>
                                        {console.log("Here - ", product.product.productName)}
                                        <p style={{
                                            backgroundColor: 'white',
                                            borderRadius:100,
                                            color: 'black',
                                            alignSelf: 'center',
                                            margin: 8,
                                            padding: 8
                                        }}>
                                            {index + 1}
                                        </p>
                                        <br></br>
                                        <p style={{

                                        }}>
                                           Product Name:  {product.product.productName}
                                        </p>
                                        <p>
                                           Product Qty: {product.qty}
                                        </p>
                                    </div>
                                  )  
                                })}
                            </div>
                        </div>
                    </div>
                )
            })

            }
      
    </div>
            </div>}
        {activeTab === 'Reported' && <div>Reported Content</div>}
        {activeTab === 'Solving' && <div>Solving Content</div>}
        {activeTab === 'Solved' && <div>Solved Content</div>}
        {activeTab === 'Closed' && <div>Closed Content</div>}
      </div>
    </div>
        
        </div>
    )
}


export default Support;