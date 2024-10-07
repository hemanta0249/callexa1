import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {

    const [data, setData] = useState({name:"", email:"", password:"", cpassword:""});
    let navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("token")){
            navigate('/home');
        }
    }, [navigate])
 
    const onchange = (e)=>{
        setData({...data, [e.target.name]:e.target.value})
    }
    
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const response = await fetch("/api/auth/createusers",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name:data.name, email:data.email, password: data.password})
        })
        const json = await response.json();
        console.log(json);
        if(json.success){
            localStorage.setItem('token', json.authToken);
            navigate('/home');
        }
        else{
            alert("invalid");
        }
    }

  return (
    <div>
      <form onSubmit={handleSubmit}>
            <div className="mb-3 my-5">
                    <input type="text" className="form-control" placeholder='Name' value={data.name} id="name" name='name' aria-describedby="emailHelp" onChange={onchange}/>
                </div>
                <div className="mb-3">
                    <input type="email" className="form-control" placeholder='Email address' value={data.email} id="email" name='email' aria-describedby="emailHelp" onChange={onchange}/>
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control" placeholder='Password' value={data.password} id="password" name='password' onChange={onchange} minLength={5} required/>
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control" placeholder='Confirm password' value={data.cpassword} id="cpassword" name='cpassword' onChange={onchange} minLength={5} required/>
                </div>
                <button type="submit" className=" btn btn-success">Sign up</button>
            </form>
    </div>
  )
}

export default Signup
