import React, { useEffect, useState, useContext } from "react";
import profile from "../assets/PPE01611.jpg"
import { UserContext } from "../App";
import { useParams } from "react-router-dom";
const Profile=()=>{
    const [userProfile,setUserProfile] = useState(null)
    const {state,dispatch} = useContext(UserContext)
    const {userId} = useParams()
    const [showFollow, setShowFollow] = useState(
         state ? !state.following.includes(userId) : true
      );
    useEffect(()=>{
        fetch(`/user/${userId}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            setUserProfile(result)
        })
     },[])
     useEffect(() => {
        // Update localStorage whenever the showFollow state changes.
        localStorage.setItem('showFollow', JSON.stringify(showFollow));
      }, [showFollow]);

     const followUser = ()=>{
        fetch('/follow',{
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userId
            })
        }).then(res=>res.json())
        .then((data)=>{
            dispatch({type:"UPDATE",payload:{following:data.following, followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setUserProfile((prevState)=>{
                return{
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })
            console.log(data)
            setShowFollow(false)

        })
        .catch(err=>console.log(err))
    }

    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userId
            })
        }).then(res=>res.json())
        .then((data)=>{
            dispatch({type:"UPDATE",payload:{following:data.following, followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setUserProfile((prevState)=>{
                const unFollowUser = prevState.user.followers.filter(item=>item!=data._id)
                return{
                    ...prevState,
                    user: {
                        ...prevState.user,
                        followers:unFollowUser
                    }
                }
            })
            console.log(data)
            setShowFollow(true)

        })
        .catch(err=>console.log(err))
    }

    return(
        <>
        {
            userProfile ? 
            <div style={{maxWidth:"550px", margin:"0px auto"}}>
            <div style={{display:"flex", justifyContent:"space-around", margin:"18px 0px", borderBottom:"1px solid grey"}}>
                <div>
                    <img style={{height:"160px", width:"160px", borderRadius:"80px"}} src={userProfile.user.pic} alt="profile"/>
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <h5>{userProfile.user.email}</h5>
                    <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
                        <h6>{userProfile.posts.length} Posts</h6>
                        <h6>{userProfile.user.followers.length} followers</h6>
                        <h6>{userProfile.user.following.length} following</h6>
                        {showFollow?
                        <button style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>followUser()}>Follow</button>
                        :
                        <button style={{margin:"10px"}} className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>unfollowUser()}>UnFollow</button>
                    }
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    userProfile.posts.map(item=>{
                        return(
                            <img key={item._id} src={item.photo} alt={item.title} className="item" />
                        )
                    })
                }
            </div>
        </div>
        :
        <h2>Loading ...</h2>
        }
        </>
        
        
        
    )
}

export default Profile