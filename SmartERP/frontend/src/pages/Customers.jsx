import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";


const API="https://smarterp-1-6rfs.onrender.com/customers/";



export default function Customers(){


const initialForm={

customer_name:"",
phone:"",
email:"",
address:""

};



const [customers,setCustomers]=useState([]);

const [form,setForm]=useState(initialForm);

const [search,setSearch]=useState("");

const [selectedId,setSelectedId]=useState(null);

const [editingId,setEditingId]=useState(null);





useEffect(()=>{


loadCustomers();



const shortcut=(e)=>{


if(e.key==="F1"){

e.preventDefault();

saveCustomer();

}



if(e.key==="F2"){

e.preventDefault();

clearForm();

}




if(e.key==="F4"){

e.preventDefault();


if(selectedId){

deleteCustomer(selectedId);

}

else{

alert("Select Customer First");

}

}




if(e.key==="Enter"){

e.preventDefault();

saveCustomer();

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


},[form,selectedId,editingId]);







const loadCustomers=async()=>{


try{


const token=localStorage.getItem("token");


const res=await axios.get(

API,

{

headers:{

Authorization:`Bearer ${token}`

}

}

);


setCustomers(

res.data.sort((a,b)=>b.id-a.id)

);


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









const saveCustomer=async()=>{


if(!form.customer_name){

alert("Enter Customer Name");

return;

}



try{


const token=localStorage.getItem("token");



if(editingId){


await axios.put(

`${API}${editingId}`,

form,

{

headers:{

Authorization:`Bearer ${token}`

}

}

);


alert("Customer Updated Successfully");


}

else{


await axios.post(

API,

form,

{

headers:{

Authorization:`Bearer ${token}`

}

}

);


alert("Customer Added Successfully");


}




clearForm();

loadCustomers();


}



catch(err){

console.log(err);

}



};









const editCustomer=(customer)=>{


setEditingId(customer.id);

setSelectedId(customer.id);



setForm({

customer_name:customer.customer_name || "",

phone:customer.phone || "",

email:customer.email || "",

address:customer.address || ""

});


window.scrollTo({

top:0,

behavior:"smooth"

});


};









const deleteCustomer=async(id)=>{


if(!window.confirm("Delete Customer?"))

return;



try{


const token=localStorage.getItem("token");


await axios.delete(

`${API}${id}`,

{

headers:{

Authorization:`Bearer ${token}`

}

}

);



loadCustomers();


}


catch(err){

console.log(err);

}


};








return(


<Layout title="Customers">


<div style={page}>


<div style={card}>


<h1>Customer Master</h1>




<div style={shortcut}>


<span>F1 Save Customer</span>

<span>F2 New</span>

<span>F4 Delete</span>

<span>Enter Save</span>


</div>







<div style={grid}>


<input

name="customer_name"

placeholder="Enter Customer Name"

value={form.customer_name}

onChange={handleChange}

style={input}


/>



<input

name="phone"

placeholder="Enter Phone Number"

value={form.phone}

onChange={handleChange}

style={input}


/>



<input

name="email"

placeholder="Enter Email Address"

value={form.email}

onChange={handleChange}

style={input}


/>



<input

name="address"

placeholder="Enter Customer Address"

value={form.address}

onChange={handleChange}

style={input}


/>


</div>





<button

onClick={saveCustomer}

style={saveBtn}

>

{editingId?"Update Customer":"Save Customer"}

</button>



<button

onClick={clearForm}

style={newBtn}

>

New

</button>








<h2>Customer List</h2>




<input

placeholder="Search Customer"

value={search}

onChange={(e)=>setSearch(e.target.value)}

style={searchBox}


/>







<table style={table}>


<thead>

<tr>

<th style={th}>ID</th>

<th style={th}>Customer</th>

<th style={th}>Phone</th>

<th style={th}>Email</th>

<th style={th}>Address</th>

<th style={th}>Action</th>

</tr>


</thead>





<tbody>


{

customers

.filter(c=>

c.customer_name

.toLowerCase()

.includes(search.toLowerCase())

)


.map(c=>(


<tr

key={c.id}

onClick={()=>setSelectedId(c.id)}

style={

selectedId===c.id

?

selectedRow

:

row

}


>


<td style={td}>{c.id}</td>

<td style={td}>{c.customer_name}</td>

<td style={td}>{c.phone}</td>

<td style={td}>{c.email}</td>

<td style={td}>{c.address}</td>



<td style={td}>


<button

onClick={()=>editCustomer(c)}

style={editBtn}

>

Edit

</button>



<button

onClick={()=>deleteCustomer(c.id)}

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

background:"#f1f5f9",

padding:30,

minHeight:"100vh"

};



const card={

background:"#fff",

padding:30,

borderRadius:15,

boxShadow:"0 5px 20px rgba(0,0,0,.1)"

};



const shortcut={

background:"#111827",

color:"#fff",

padding:15,

borderRadius:10,

display:"flex",

gap:30,

marginBottom:25,

fontWeight:"bold"

};



const grid={

display:"grid",

gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",

gap:15

};



const input={

padding:12,

border:"1px solid #cbd5e1",

borderRadius:8

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



const searchBox={

padding:12,

width:250,

borderRadius:8,

border:"1px solid #ccc"

};



const table={

width:"100%",

marginTop:20,

borderCollapse:"collapse"

};



const th={

padding:15,

background:"#0f172a",

color:"#fff"

};



const td={

padding:14,

textAlign:"center",

borderBottom:"1px solid #ddd"

};



const row={

cursor:"pointer"

};



const selectedRow={

background:"#dbeafe",

cursor:"pointer"

};



const editBtn={

background:"#f59e0b",

color:"#fff",

border:0,

padding:"7px 15px",

borderRadius:6,

marginRight:8

};



const deleteBtn={

background:"#dc2626",

color:"#fff",

border:0,

padding:"7px 15px",

borderRadius:6

};