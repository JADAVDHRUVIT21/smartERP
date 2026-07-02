import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import API from "../api/axios";


export default function Stock() {


const [stocks,setStocks]=useState([]);

const [search,setSearch]=useState("");

const searchRef=useRef(null);



useEffect(()=>{


loadStock();



const shortcut=(e)=>{


if(e.key==="F1"){

e.preventDefault();

loadStock();

}



if(e.key==="F2"){

e.preventDefault();

searchRef.current.focus();

}




if(e.key==="F3"){

e.preventDefault();

setSearch("");

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



},[]);






const loadStock=async()=>{


try{


const res=await API.get("/stock/");


setStocks(res.data);



}

catch(err){

console.log(err);

}


};







return(


<Layout title="Stock">


<div style={page}>


<div style={card}>


<h1>Stock Master</h1>



<div style={shortcutBar}>


<span>F1 Refresh Stock</span>

<span>F2 Search</span>

<span>F3 Clear Search</span>


</div>







<div style={header}>


<input


ref={searchRef}

type="text"

placeholder="Search Product..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

style={searchBox}

/>





<button

onClick={loadStock}

style={refreshBtn}

>

Refresh Stock

</button>



</div>







<table style={table}>


<thead>


<tr>


<th style={th}>ID</th>

<th style={th}>Product</th>

<th style={th}>Purchase Qty</th>

<th style={th}>Sale Qty</th>

<th style={th}>Available Qty</th>

<th style={th}>Status</th>



</tr>


</thead>




<tbody>


{


stocks

.filter(item=>

item.product_name

?.toLowerCase()

.includes(search.toLowerCase())

)

.map(item=>(


<tr

key={item.id}

style={row}

>



<td style={td}>{item.id}</td>


<td style={td}>{item.product_name}</td>


<td style={td}>{item.purchase_qty}</td>


<td style={td}>{item.sale_qty}</td>



<td

style={{

...td,

fontWeight:"bold",

color:

item.available_qty>10

?

"green"

:

item.available_qty>0

?

"orange"

:

"red"

}}

>


{item.available_qty}


</td>




<td style={td}>


{

item.available_qty>10

?

<span style={green}>In Stock</span>


:

item.available_qty>0


?

<span style={orange}>Low Stock</span>


:

<span style={red}>Out of Stock</span>


}



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



const header={

display:"flex",

justifyContent:"space-between",

marginTop:25,

marginBottom:20,

gap:10

};



const searchBox={

padding:12,

width:300,

borderRadius:8,

border:"1px solid #ccc"

};



const refreshBtn={

background:"#2563eb",

color:"#fff",

border:0,

padding:"12px 20px",

borderRadius:8,

cursor:"pointer"

};



const table={

width:"100%",

borderCollapse:"collapse"

};



const th={

padding:12,

background:"#1e293b",

color:"#fff"

};



const td={

padding:12,

textAlign:"center",

borderBottom:"1px solid #ddd"

};



const row={

textAlign:"center"

};



const green={

background:"#16a34a",

color:"#fff",

padding:"5px 10px",

borderRadius:20

};


const orange={

background:"#f59e0b",

color:"#fff",

padding:"5px 10px",

borderRadius:20

};


const red={

background:"#dc2626",

color:"#fff",

padding:"5px 10px",

borderRadius:20

};