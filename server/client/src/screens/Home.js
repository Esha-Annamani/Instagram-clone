import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";
import wall1 from "../assets/wall1.jpg"
import {Link} from "react-router-dom"

const Home=()=>{
    const [data,setData]=useState([])
    const [commentText, setCommentText] = useState('');
    const {state, dispatch} = useContext(UserContext)
    useEffect(()=>{
        fetch('/allposts',{
            headers: {
                "Authorization":"Bearer "+localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            }
        }).then(res=>res.json())
        .then(result=>{
        setData(result)
    })
        .catch(err=>console.log(err))
    },[])

    const likePost = (id)=>{
        fetch('/like',{
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map((item)=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        })
        .catch(err=>console.log(err))
    }
    const unLikePost = (id)=>{
        fetch('/unlike',{
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData = data.map((item)=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        })
        .catch(err=>console.log(err))
    }

    const makeComment=(text, postId)=>{
        fetch("/comment",{
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData = data.map((item)=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setCommentText('')
            setData(newData)
        }).catch(err=>console.log(err))

    }

    const deletePost = (postid) =>{
        fetch(`/deletepost/${postid}`,{
            method: "delete",
            headers: {
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
        .catch(err=>console.log(err))
    }
    const deleteComment= (commentId, postId)=>{
        fetch(`/deletecomment/${postId}/${commentId}`,{
            method: 'delete',
            headers: {
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const updatedData = data.map(item => {
                if (item._id === postId) {
                  const updatedComments = item.comments.filter(comment => comment._id !== commentId);
                  return { ...item, comments: updatedComments };
                } else {
                  return item;
                }
              });
        
              setData(updatedData);
        })
        .catch(err=>console.log(err))
    }
    return(
        <div className="home">
            {
                data.map(item=>{
                    return(
                        <div className="card home-card" key={item._id}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent:"space-between" }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap:"3px"}}>
                                <img src={item.postedBy.pic?item.postedBy.pic:"https://res.cloudinary.com/dgxb0yzug/image/upload/v1693113970/noimage_eekmdb.png"} style={{height:"50px", width: "50px", borderRadius:"50%", padding:"5px"}}/>
                                    <h5 style={{padding:"6px"}}><Link to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile"}>{item.postedBy.name} 
                                    </Link>
                                    </h5>
                                </div>
                                {
                                item.postedBy._id == state._id &&
                                    <i className="material-icons" style={{ cursor: 'pointer'}} onClick={()=>{deletePost(item._id)}}>delete</i>
                                 }
                                 
                            </div>                            
                            <div className="card-image">
                                <img src={item.photo} />
                            </div>   
                            <div className="card-content">
                                { item.likes.includes(state._id) ? 
                                    
                                    <i className="material-icons" style={{color:"red", cursor: 'pointer'}} onClick={()=>{unLikePost(item._id)}}>favorite</i>

                                    :
                                    <div
                                        className="favorite-icon"
                                        onClick={() => { likePost(item._id) }}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="white" 
                                                stroke="red" 
                                                strokeWidth="2" 
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="heart-svg"
                                            >
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                        </div>
                                }
                                <h6>{item.likes.length} likes</h6> 
                                <h6>{item.title}</h6> 
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record=>{
                                        return(
                                            <div style={{display:"flex", alignItems:"center"}}>
                                                <img src={item.postedBy.pic?item.postedBy.pic:"https://res.cloudinary.com/dgxb0yzug/image/upload/v1693113970/noimage_eekmdb.png"} style={{height:"35px", width: "35px", borderRadius:"50%", padding:"5px"}}/>
                                                <h6 key={record._id}><span style={{fontWeight: "500"}}>{record.postedBy.name}</span> {record.text} {
                                                    item.postedBy._id == state._id &&
                                                        <i className="material-icons" style={{ cursor: 'pointer'}} onClick={()=>{deleteComment(record._id,item._id)}}>delete</i>
                                                    }</h6>
                                            </div>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(commentText,item._id)
                                }}>
                                     <input type="text" name="Add a comment" value={commentText} onChange={(e) => setCommentText(e.target.value)}/>
                                </form>
                            </div>
                        </div>
                    )
                        
                })
            }    
        </div>
    )
}

export default Home