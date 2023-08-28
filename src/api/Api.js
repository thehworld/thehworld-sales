import axios from "axios"

const API = "https://thehworld-service-commerce.onrender.com/api/web";
const API_TEST = "https://thehworld-v1.onrender.com";
const API_STAGING = "https://thehworld.loca.lt/api/web";
const API_DEV = "http://localhost:8080/api/web"

const API_USE = API;

export const apiCheck = () => {
    axios.get(`${API_TEST}/`)
        .then((res) => {
            console.log(res)
            return res
        })
        .catch((err) => {
            return err
        })
}


// ************************ Admin Panel Manage Section *************************


// * 1.  Manage Order
// ?          1.1 Get All Orders - DONE
// ?          1.2 Get A Orders - 
// * 2.  Manage Shipment
// * 3.  Manage Products / Categories
// * 4.  Manage Users
// * 5.  Manage Issues
// * 6.  Dashboard Status


export const getAllUsersOrders = () => {
    return axios.get(`${API_USE}/get/all/orders`).then((res) => {
        return res
    }).catch((error) => {
        console.log("Error - ", error)
    });
}


export const getAOrderDetails = (orderID) => {
    return axios.get(`${API_USE}/get/a/order/${orderID}`).then((res) => {
        return res;
    }).catch((err) => {
        console.log("Error - ", err);
    });
}


export const getAUsersOrders = (userID) => {
    return axios.get(`${API_USE}/get/a/user/${userID}/orders`).then((res) => {
        return res
    }).catch((err) => {
        console.log("Error - ", err);
    });
}

export const getChangeOrderStatus = (status) => {
    return axios.post(`${API_USE}/change/order/status`, {
        status: status
    }).then((res) => {
        return res
    }).catch((error) => {
        console.log("Error - ", error);
    });
}

export const changeOrderStatus = (status) => {
    console.log(status);
    return axios.post(`${API_USE}/order/change/shipment`, {
        status: status
    }).then((res) => {
        return res
    }).catch((error) => {
        console.log("Error - ", error);
    });
}


// ?? Users

export const getAllUsers = () => {
    return axios.get(`${API_USE}/users/get/all`).then((res) => {
        return res
    }).catch((err) => {
        console.log("Error - ", err);
    });
}


export const getAUser = (userId) => {
    return axios.get(`${API_USE}/get/a/user/${userId}`).then((res) => {
        return res
    }).catch((error) => {
        console.log("Error - ", error);
    });
}


export const getAllCategory = () => {
    return axios.get(`${API_USE}/get/all/categories`)
        .then((res) => {
            console.log(res)
            return res.data.category
        })
        .catch((err) => {
            return err
        })
}

export const createCategory = (cate) => {
    return axios.post(`${API_USE}/create/category`, cate)
        .then((res) => {
            return res.data.category
        })
        .catch((err) => {
            return err
        })
}

export const deleteCategory = (cate) => {
    console.log("cate - ", cate);
    return axios.post(`${API_USE}/delete/category`, {
            cate
        })
        .then((res) => {
            return res.data.category
        })
        .catch((err) => {
            return err
        });
}

export const updateCategory = (cate) => {
    return axios.put(`${API_USE}/edit/category`, cate)
        .then((res) => {
            return res.data.category
        })
        .catch((err) => {
            return err
        })
}

export const createProduct = (prod) => {
    return axios.post(`${API_USE}/create/product`, prod)
        .then((res) => {
            console.log("product", res.data)
            return res.data.product
        })
        .catch((err) => {
            return err
        })
}

export const editProduct = (prod) => {
    return axios.put(`${API_USE}/edit/product`, prod).then((res) => {
        return res
    }).catch((error) => {
        console.log("Error - ", error);
    });
}

export const deleteProduct = (prod) => {
    return axios.delete(`${API_USE}/delete/product`, prod).then((res) => {
        return res;
    }).catch((error) => {
        console.log("Error - ", error);
    });
}

export const getAllProducts = (prod) => {
    return axios.get(`${API_USE}/get/all/products`, prod)
        .then((res) => {
            return res.data.products
        })
        .catch((err) => {
            return err
        })
}

export const getAProduct = (prod) => {
    return axios.put(``, prod).then((res) => {
        return res
    }).catch((error) => {
        console.log("Error - ", error);
    });
}

//blogs api

export const getAllBlogs = () => {
    return axios.get(`${API_USE}/get/all/blogs`)
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            return err
        })
}

export const createBlog = (blog) => {
    return axios.post(`${API_USE}/create/blogs`, blog)
        .then((res) => {
            return res.data.blogs
        })
        .catch((err) => {
            return err
        })
}

// ? ----------- Order Details --------------------

export const checkOrderPayment = (orderID) => {
    return axios.post(`${API_USE}/check/a/payment`, {
        orderID
    }).then((res) => {
        return res
    }).catch((error) => {
        console.log("Error - ", error);
    });
}


export const dashboardStats = () => {
    return axios.get(`${API_USE}/get/dash/stats`)
        .then((res) => {
            return res
        })
        .catch((error) => {
            return error
        });
}


export const makeStatusUpdateView = () => {
    return axios.post(`${API_USE}/status/update`, { status: "View" })
        .then((res) => {
            return res;
        }).catch((err) => {
            console.log("Error - ", err);
        });
}


export const deleteTheBlog = (blogID) => {
    return axios.delete(`${API_USE}/blog/delete/${blogID}`)
        .then((res) => {
            return res
        }).catch((err) => {
            console.log("Error - ", err);
        });
}



// ** Offers

export const createOfferCode = (offer) => {
    return axios.post(`${API_USE}/create/offer/code`, offer)
        .then((res) => {
            return res;
        }).catch((err) => {
            console.log("Error - ", err);
        });
}

export const getAllOffers = () => {
    return axios.get(`${API_USE}/get/all/offers`)
        .then((res) => {
            return res;
        }).catch((err) => {
            console.log("Error - ", err);
        });
}

export const getAllOrderIssues = () => {
    return axios.get(`${API_USE}/get/all/order/issues`)
        .then((res) => {
            return res;
        }).catch((err) => {
            console.log("Error - ", err);
        });
}