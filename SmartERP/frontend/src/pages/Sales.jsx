import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";


const API="http://127.0.0.1:8000/sales/";


export default function Sales(){


const initialForm={

customerName:"",
productName:"",
quantity:"",
invoiceNo:"",
invoiceDate:"",
sellingPrice:"",
gst:"18",
discount:"0",
paymentType:"CASH",
paidAmount:""

};



const [sales,setSales]=useState([]);

const [form,setForm]=useState(initialForm);

const [search,setSearch]=useState("");

const [selectedId,setSelectedId]=useState(null);

const [editingId,setEditingId]=useState(null);



useEffect(()=>{


loadSales();



const shortcut=(e)=>{


if(e.key==="F1"){

e.preventDefault();

saveSale();

}



if(e.key==="F2"){

e.preventDefault();

clearForm();

}



if(e.key==="F3"){

e.preventDefault();


if(editingId){

saveSale();

}
else{

alert("Select Sale First");

}

}




if(e.key==="F4"){

e.preventDefault();


if(selectedId){

deleteSale(selectedId);

}
else{

alert("Select Sale First");

}


}


};


window.addEventListener(
"keydown",
shortcut
);



return()=>{

window.removeEventListener(
"keydown",
shortcut
);

};


},[form,editingId,selectedId]);







const loadSales=async()=>{


try{


const res=await axios.get(API);

setSales(res.data);


}
catch(err){

console.log(err);

}


};








const handleChange=(e)=>{


const {name,value}=e.target;


setForm(prev=>({

...prev,

[name]:value


}));


};






const clearForm=()=>{


setForm(initialForm);

setEditingId(null);

setSelectedId(null);


};







const saveSale=async()=>{


if(

!form.customerName ||

!form.productName ||

!form.quantity ||

!form.invoiceNo ||

!form.invoiceDate ||

!form.sellingPrice ||

!form.paidAmount

){


alert("Please fill all fields");

return;

}



try{


const data={


customer_name:form.customerName,

product_name:form.productName,

quantity:Number(form.quantity),

invoice_no:form.invoiceNo,

invoice_date:form.invoiceDate,

selling_price:Number(form.sellingPrice),

gst:Number(form.gst),

discount:Number(form.discount),

payment_type:form.paymentType,

paid_amount:Number(form.paidAmount)


};




if(editingId){


await axios.put(

`${API}${editingId}`,

data

);


alert("Sale Updated Successfully");


}
else{


await axios.post(

API,

data

);


alert("Sale Added Successfully");


}



clearForm();

loadSales();


}

catch(err){

console.log(err.response);

alert(
err.response?.data?.detail ||
"Server Error"
);


}


};








const editSale=(sale)=>{


setEditingId(sale.id);

setSelectedId(sale.id);



setForm({

customerName:sale.customer_name || "",

productName:sale.product_name || "",

quantity:sale.quantity || "",

invoiceNo:sale.invoice_no || "",

invoiceDate:sale.invoice_date || "",

sellingPrice:sale.selling_price || "",

gst:sale.gst || 18,

discount:sale.discount || 0,

paymentType:sale.payment_type || "CASH",

paidAmount:sale.paid_amount || ""


});


window.scrollTo({

top:0,

behavior:"smooth"

});


};







const deleteSale=async(id)=>{


if(!window.confirm("Delete this Sale?"))

return;



try{


await axios.delete(

`${API}${id}`

);


loadSales();


}

catch(err){

console.log(err);

}


};









return(


<Layout title="Sales">


<div style={page}>


<div style={card}>


<h1>Sales Master</h1>



<div style={shortcutBar}>


<span>F1 Save Sale</span>

<span>F2 New</span>

<span>F3 Update Sale</span>

<span>F4 Delete</span>


</div>





<div style={grid}>


<input

placeholder="Customer Name"

name="customerName"

value={form.customerName}

onChange={handleChange}

style={inputStyle}

/>



<input

placeholder="Product Name"

name="productName"

value={form.productName}

onChange={handleChange}

style={inputStyle}

/>



<input

type="number"

placeholder="Quantity"

name="quantity"

value={form.quantity}

onChange={handleChange}

style={inputStyle}

/>



<input

placeholder="Invoice Number"

name="invoiceNo"

value={form.invoiceNo}

onChange={handleChange}

style={inputStyle}

/>



<input

type="date"

name="invoiceDate"

value={form.invoiceDate}

onChange={handleChange}

style={inputStyle}

/>



<input

type="number"

placeholder="Selling Price"

name="sellingPrice"

value={form.sellingPrice}

onChange={handleChange}

style={inputStyle}

/>



<input

type="number"

placeholder="GST %"

name="gst"

value={form.gst}

onChange={handleChange}

style={inputStyle}

/>



<input

type="number"

placeholder="Discount"

name="discount"

value={form.discount}

onChange={handleChange}

style={inputStyle}

/>



<select

name="paymentType"

value={form.paymentType}

onChange={handleChange}

style={inputStyle}

>

<option>CASH</option>

<option>CREDIT</option>

</select>




<input

type="number"

placeholder="Paid Amount"

name="paidAmount"

value={form.paidAmount}

onChange={handleChange}

style={inputStyle}

/>



</div>






<button

onClick={saveSale}

style={saveBtn}

>

{editingId?"Update Sale":"Save Sale"}

</button>




<button

onClick={clearForm}

style={newBtn}

>

New

</button>






<h2>Sales List</h2>




<input

placeholder="Search Customer/Product"

value={search}

onChange={(e)=>setSearch(e.target.value)}

style={searchBox}

/>





<table style={table}>


<thead>

<tr>

<th>ID</th>

<th>Customer</th>

<th>Product</th>

<th>Qty</th>

<th>Amount</th>

<th>Paid</th>

<th>Action</th>

</tr>

</thead>



<tbody>


{

sales

.filter(s=>

s.customer_name?.toLowerCase()

.includes(search.toLowerCase())

||

s.product_name?.toLowerCase()

.includes(search.toLowerCase())

)

.map(s=>(


<tr

key={s.id}

onClick={()=>setSelectedId(s.id)}

style={{

textAlign:"center",

background:selectedId===s.id?"#dbeafe":"white"

}}

>


<td>{s.id}</td>

<td>{s.customer_name}</td>

<td>{s.product_name}</td>

<td>{s.quantity}</td>

<td>₹ {s.total_amount}</td>

<td>₹ {s.paid_amount}</td>



<td>


<button

onClick={()=>editSale(s)}

style={editBtn}

>

Edit

</button>



<button

onClick={()=>deleteSale(s.id)}

style={deleteBtn}

>

Delete

</button>



</td>



</tr>


))


}


</tbody>


</table>



</div>

</div>


</Layout>


)

}






const page={

background:"#f8fafc",

padding:30,

minHeight:"100vh"

};



const card={

background:"#fff",

padding:30,

borderRadius:15,

boxShadow:"0 5px 20px rgba(0,0,0,.08)"

};



const shortcutBar={

background:"#0f172a",

color:"#fff",

padding:15,

borderRadius:10,

display:"flex",

gap:30,

fontWeight:"bold"

};



const grid={

display:"grid",

gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",

gap:15,

marginTop:25

};



const inputStyle={

padding:12,

border:"1px solid #cbd5e1",

borderRadius:8

};


const searchBox={

...inputStyle,

width:250,

marginTop:20

};


const saveBtn={

background:"#16a34a",

color:"#fff",

border:0,

padding:"12px 25px",

borderRadius:8,

marginTop:25

};


const newBtn={

background:"#2563eb",

color:"#fff",

border:0,

padding:"12px 25px",

borderRadius:8,

marginLeft:10

};


const editBtn={

background:"#f59e0b",

color:"#fff",

border:0,

padding:"7px 15px"

};


const deleteBtn={

background:"#dc2626",

color:"#fff",

border:0,

padding:"7px 15px",

marginLeft:8

};


const table={

width:"100%",

marginTop:20,

borderCollapse:"collapse"

};