import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";


const API="http://127.0.0.1:8000/suppliers/";



export default function Suppliers(){


const initialForm={

name:"",
phone:"",
email:"",
address:""

};



const [suppliers,setSuppliers]=useState([]);

const [form,setForm]=useState(initialForm);

const [search,setSearch]=useState("");

const [selectedId,setSelectedId]=useState(null);

const [editingId,setEditingId]=useState(null);







useEffect(()=>{


loadSuppliers();



const shortcut=(e)=>{


if(e.key==="F1"){

e.preventDefault();

saveSupplier();

}



if(e.key==="F2"){

e.preventDefault();

clearForm();

}




if(e.key==="F4"){

e.preventDefault();


if(selectedId){

deleteSupplier(selectedId);

}

else{

alert("Select Supplier First");

}

}



if(e.key==="Enter"){

e.preventDefault();

saveSupplier();

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









const loadSuppliers=async()=>{


try{


const res=await axios.get(API);


setSuppliers(

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









const saveSupplier=async()=>{


if(!form.name || !form.phone){


alert("Supplier Name and Phone required");

return;


}



try{


if(editingId){


await axios.put(

`${API}${editingId}`,

form

);


alert("Supplier Updated Successfully");


}

else{


await axios.post(

API,

form

);


alert("Supplier Added Successfully");


}




clearForm();

loadSuppliers();


}


catch(err){

console.log(err);

}


};











const editSupplier=(supplier)=>{


setEditingId(supplier.id);

setSelectedId(supplier.id);



setForm({

name:supplier.name || "",

phone:supplier.phone || "",

email:supplier.email || "",

address:supplier.address || ""

});


window.scrollTo({

top:0,

behavior:"smooth"

});


};









const deleteSupplier=async(id)=>{


if(!window.confirm("Delete Supplier?"))

return;



try{


await axios.delete(

`${API}${id}`

);


loadSuppliers();


}


catch(err){

console.log(err);

}


};









return(


<Layout title="Suppliers">



<div style={page}>


<div style={card}>


<h1>Supplier Master</h1>





<div style={shortcut}>


<span>F1 Save Supplier</span>

<span>F2 New</span>

<span>F4 Delete</span>

<span>Enter Save</span>


</div>









<div style={grid}>


<input

name="name"

placeholder="Enter Supplier Name"

value={form.name}

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

placeholder="Enter Email"

value={form.email}

onChange={handleChange}

style={input}

/>




<input

name="address"

placeholder="Enter Address"

value={form.address}

onChange={handleChange}

style={input}

/>



</div>









<button

onClick={saveSupplier}

style={saveBtn}

>

{editingId?"Update Supplier":"Save Supplier"}

</button>




<button

onClick={clearForm}

style={newBtn}

>

New

</button>










<h2>Supplier List</h2>





<input

placeholder="Search Supplier"

value={search}

onChange={(e)=>setSearch(e.target.value)}

style={searchBox}

/>








<table style={table}>


<thead>

<tr>

<th style={th}>ID</th>

<th style={th}>Name</th>

<th style={th}>Phone</th>

<th style={th}>Email</th>

<th style={th}>Address</th>

<th style={th}>Action</th>

</tr>


</thead>






<tbody>


{


suppliers

.filter(s=>

s.name

.toLowerCase()

.includes(search.toLowerCase())

)


.map(supplier=>(



<tr

key={supplier.id}

onClick={()=>setSelectedId(supplier.id)}

style={

selectedId===supplier.id

?

selectedRow

:

row

}


>


<td style={td}>{supplier.id}</td>

<td style={td}>{supplier.name}</td>

<td style={td}>{supplier.phone}</td>

<td style={td}>{supplier.email}</td>

<td style={td}>{supplier.address}</td>



<td style={td}>


<button

onClick={()=>editSupplier(supplier)}

style={editBtn}

>

Edit

</button>




<button

onClick={()=>deleteSupplier(supplier.id)}

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

border:"1px solid #ccc",

borderRadius:8

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