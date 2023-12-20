import React, { useEffect, useState, useContext } from "react";
import profile from "../assets/PPE01611.jpg"
import { UserContext } from "../App";
const Profile=()=>{
    const [myPics,setMyPics] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image, setImage]=useState("")
    useEffect(()=>{
        fetch('/myposts',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setMyPics(result.myposts)
        })
     },[])
     useEffect(()=>{
        if(image){
            const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","cnq")
        fetch("https://api.cloudinary.com/v1_1/dgxb0yzug/image/upload",{
            method:"post",
            body:data
        })
        .then((res)=>res.json())
        .then(data=>{
            // console.log(data)
           
            fetch('/updatepic',{
                method: "put",
                Authorization: "Bearer "+localStorage.getItem("jwt"),
                body: JSON.stringify({pic:data.url})
            }).then(res=>res.json())
            .then(result=>{
                console.log(result)
                 localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                dispatch({type:"UPDATEPIC", payload: result.pic})
            }).catch(err=>{
                console.log(err)
            })
            
        })
        .catch(err=>console.log(err))
        }
     },[image])
     
    return(
        <div style={{maxWidth:"550px", margin:"0px auto"}}>
            <div style={{display:"flex", justifyContent:"space-around", margin:"18px 0px", borderBottom:"1px solid grey"}}>
                <div style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"15px"}}>
                    <img style={{height:"160px", width:"160px", borderRadius:"80px"}} src={state?state.pic:"Loading"} alt="profile"/>
                    <div className="file-field input-field" style={{margin:"10px"}}>
                        <div className="btn waves-effect waves-light #64b5f6 blue darken-1">
                            <span>Update Pic</span>
                            <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                        </div>
                    </div>
                </div>  
                <div>
                    <h4>{state?state.name:"Loading.."}</h4>
                    <h5>{state?state.email:"Loading.."}</h5>
                    <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
                        <h6>{myPics.length} Posts</h6>
                        <h6>{state.followers?state.followers.length:"0"} followers</h6>
                        <h6>{state.following?state.following.length:"0"} following</h6>
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    myPics.map(item=>{
                        return(
                            <img key={item._id} src={item.photo} alt={item.title} className="item" />
                        )
                    })
                }
            </div>
        </div>
        
    )
}

export default Profile