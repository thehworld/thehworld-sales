import React, {useEffect, useState} from 'react'
import { Container } from '@mui/material'
import { FaUsers } from 'react-icons/fa'
import { AiFillMessage } from 'react-icons/ai'
import { RiNumbersFill } from 'react-icons/ri'
import { FaMoneyCheckAlt } from 'react-icons/fa'
import { FaUsersSlash } from 'react-icons/fa'
import {MdProductionQuantityLimits} from 'react-icons/md'
import { Bar } from 'react-chartjs-2';
import { apiCheck, dashboardStats, makeStatusUpdateView } from '../api/Api'
import { Chart, LinearScale } from 'chart.js'

export default function Home() {




    const [totalUsers, settotalUsers] = useState(0);
    const [totalOrders, settotalOrders] = useState(0);
    const [totalOrderValue, settotalOrderValue] = useState(0);
    const [totalOrderProduct, settotalOrderProduct] = useState(0);
    const [viewsWebsite, setviewsWebsite] = useState(0);
    const [viewsProductView, setviewsProductView] = useState(0);

    const getStats = () => {
        dashboardStats().then((res) => {
            console.log("Res Stats - ", res.data);
            settotalUsers(res.data.totalUsersCount);
            settotalOrders(res.data.totalOrderCount);
            settotalOrderValue(res.data.totalOrderValue);
            settotalOrderProduct(res.data.totalOrderProducts);
            setviewsWebsite(res.data.views[0].totalWebsiteViews);
            setviewsProductView(res.data.views[0].totalProductViews);
        }).catch((err) => {
            console.log("Error - ", err);
        })
    }

    const makeStatsUpdate = () => {
        makeStatusUpdateView().then((res) => {
            console.log("E-Commerce Views - ", res);
        }).catch((error) => {
            console.log("Error - ", error);
        })
      }


    useEffect(() => {
        apiCheck()
        getStats()
        // makeStatsUpdate()
    }, [])
    
    const data = [
        "No. View", "Total Sales"
    ]

    const chartData = {
        labels: ["Views", "Sales"], // Array of labels for the bars
        datasets: [
          {
            label: 'Bar Chart Example', // Label for the dataset
            backgroundColor: 'rgba(75, 192, 192, 0.6)', // Bar color
            borderColor: 'rgba(75, 192, 192, 1)', // Border color
            borderWidth: 1, // Border width
            data: [totalUsers, totalOrders], // Array of data points
          },
        ],
      };
    
      // Define chart options
      const chartOptions = {
        scales: {
          y: {
            beginAtZero: true, // Start the y-axis at 0
          },
        },
      };

      const containerStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between', // Adjust as needed
      };
    
      const columnStyle = {
        flexBasis: 'calc(20% - 20px)', // Adjust the percentage and margin as needed
        margin: '10px',
        padding: '20px',
        backgroundColor: '#f4f4f4', // Add your desired background color
        border: '1px solid #ccc', // Add a border if desired
        boxSizing: 'border-box',
        textAlign: 'center',
      };
      

  return (
    <div>
        <Container style={{display: "flex", justifyContent: "center", alignItems: "center", flexFlow: "column"}}>
        <h2>Bar Chart</h2>
      {/* <Bar data={chartData} options={chartOptions} /> */}
        <h3 style={{padding: "10px", marginTop: "20px"}} className="poppinsBold">STATISTICS</h3>
            <div className="dashboard-grid">
                <div className='db-comp'>
                    <div className='db-card-stats'>
                        <p>No. of Registered Users</p>
                        <div className='db-card-grid'>
                            <FaUsers size="80" color='#4FB23A' className="flex-cc" />
                            <h1 className="flex-cc">{totalUsers}</h1>
                        </div>
                    </div>
                </div>
                <div className='db-comp'>
                    <div className='db-card-stats'>
                        <p>All Earnings</p>
                        <div className='db-card-grid'>
                            <FaMoneyCheckAlt size="80" color='#4FB23A' className="flex-cc" />
                            <h1 className="flex-cc">{totalOrderValue.toFixed(2)}</h1>
                        </div>
                    </div>
                </div>
                <div className='db-comp'>
                    <div className='db-card-stats'>
                        <p>Total Order Sold</p>
                        <div className='db-card-grid'>
                            <RiNumbersFill size="80" color='#4FB23A' className="flex-cc" />
                            <h1 className="flex-cc">{totalOrders}</h1>
                        </div>
                    </div>
                </div>
                <div className='db-comp'>
                    <div className='db-card-stats'>
                        <p>Ecommerce Vists</p>
                        <div className='db-card-grid'>
                            <AiFillMessage size="80" color='#4FB23A' className="flex-cc" />
                            <h1 className="flex-cc">{viewsWebsite}</h1>
                        </div>
                    </div>
                </div>
                <div className='db-comp'>
                    <div className='db-card-stats'>
                        <p>Ecommerce Product Views</p>
                        <div className='db-card-grid'>
                            <FaUsersSlash size="80" color='#4FB23A' className="flex-cc" />
                            <h1 className="flex-cc">{viewsProductView}</h1>
                        </div>
                    </div>
                </div>
                <div className='db-comp'>
                    <div className='db-card-stats'>
                        <p>Total Products Sold</p>
                        <div className='db-card-grid'>
                            <MdProductionQuantityLimits size="80" color='#4FB23A' className="flex-cc" />
                            <h1 className="flex-cc">{totalOrderProduct}</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div style={containerStyle}>
      <div style={columnStyle}>
        <h2>Awareness</h2>
        {/* Add content for the Awareness column */}
      </div>
      <div style={columnStyle}>
        <h2>Interest</h2>
        {/* Add content for the Interest column */}
      </div>
      <div style={columnStyle}>
        <h2>Intent</h2>
        {/* Add content for the Intent column */}
      </div>
      <div style={columnStyle}>
        <h2>Consideration</h2>
        {/* Add content for the Consideration column */}
      </div>
      <div style={columnStyle}>
        <h2>Decision</h2>
        {/* Add content for the Decision column */}
      </div>
    </div>
        </Container>
    </div>
  )
}
