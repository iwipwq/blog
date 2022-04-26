import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"
import { Context } from "../../context/Context";
import "./singlepost.scss"
import errorImg from "../../img/lorenzo-herrera-p0j-mE6mGo4-unsplash.jpg"

export default function SinglePost() {
    const location = useLocation();
    const path = location.pathname.split("/")[2];
    const [post, setPost] = useState({});
    const { user } = useContext(Context);
    console.log(user);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [isMenuOpen, SetIsMenuOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [tempImgUrl, setTempImgUrl] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [updateMode, setUpdateMode] = useState(false);
    const PF = "http://localhost:5000/images/";
    const options = {
        day: 'numeric', 
        weekday: 'long',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timezone: 'Asia/Seoul',
    }

    useEffect(() => {
      const getPost = async () => {
          const res = await axios.get(`http://localhost:5000/api/post/${path}`);
          setPost(res.data);
          setTitle(res.data.title);
          setDesc(res.data.desc);
      }
      getPost();
    }, [path]);

    const handleUploadMenu= () => {
        SetIsMenuOpen(prev => !prev);
        setTempImgUrl("");
    }

    const handleUrlInput = (e) => {
        const uploadedUrl = e.target.value;
        setFile(null);
        setTempImgUrl(uploadedUrl);
    }

    const handleFileInput = (e) => {
        const uploadedFile = e.target.files[0];
        setTempImgUrl("");
        setFile(uploadedFile);
        SetIsMenuOpen(prev => !prev);
    }

    const sendTempImgToImgUrl = () => {
        setImgUrl(tempImgUrl);
        SetIsMenuOpen(prev => !prev);
    }

    const handleInitFile = () => {
        setTempImgUrl("");
        setImgUrl("");
        setFile(null);
    }

    const handleCancelEditMode = () => {
        setUpdateMode(false);
        setTempImgUrl("");
        setFile(null);
        setImgUrl("");
        setTitle(post.title);
        setDesc(post.desc);
    }

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/post/${post._id}`,{
                data: {username: user.username}
            });
            window.location.replace("/");
        } catch(err) {
            console.log(err);
        }
    }

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:5000/api/post/${post._id}`, {
                username: user.username,
                title: title,
                desc:desc
            })
            setUpdateMode(false);
        } catch (err) {
            console.dir(err);
        }
    }

    // const imageArea = {
    //     isImg:<img src={ PF + post.photo } alt="포스트이미지" className="single-post-img" />,
    //     noImg:null,
    // }

    // if(post?.photo) {
    //     imageArea = <img src={ PF + post.photo } alt="포스트이미지" className="single-post-img" />;
    // } else {
    //     imageArea = null
    // }

    return (
        <div className="single-post">
            <div className="single-post-wrapper">
                {post?.photo && 
                <div className="single-post-img-wrapper">
                    <img src={ file ? URL.createObjectURL(file) : imgUrl ? `${imgUrl}` : PF + post.photo } onError={(e) => e.target.src = errorImg} alt="포스트이미지" className="single-post-img" />
                    {updateMode && <div className="single-post-img-edit">
                    <div className="upload-button-wrapper">
                        <button type="button" onClick={handleUploadMenu} className="image-change-button"><i class="fa-solid fa-image"></i> 이미지 교체하기</button>
                        <button type="button" onClick={handleInitFile} className="image-init-button"><i class="fa-solid fa-arrow-rotate-left"></i> 초기화</button>
                    </div>
                    <div className="menu-curtain"></div>
                    <div className={ isMenuOpen ? "upload-menu open" : "upload-menu"}>
                        <div className="single-post-file-wrapper">
                            <label htmlFor="file-input" className="single-post-file-label">직접 업로드하기</label>
                            <input type="file" id="file-input" onChange={handleFileInput} className="single-post-file-input" />
                        </div>
                        <hr/>
                        <span>혹은</span>
                        <div className="single-post-url-wrapper">
                            <label htmlFor="file-url" className="single-post-url-label">이미지링크로 업로드하기</label>
                            <input type="url" id="file-url" onChange={handleUrlInput} className="single-post-url-input" />
                            <button type="button" onClick={sendTempImgToImgUrl} className="single-post-url-button">확인</button>
                        </div>
                        <button className="upload-menu-close-button" onClick={handleUploadMenu}>취소하고 창 닫기</button>
                    </div>
                    </div>}
                </div>}
                {updateMode ? 
                    <input 
                        type="text" 
                        value={title} 
                        className="single-post-title-input"
                        onChange={(e)=>setTitle(e.target.value)}
                        autoFocus 
                    /> 
                    : <h1 className="single-post-title">{title}</h1>
                }
                <div className="single-post-info">
                    <address className="single-post-author">Author :<Link to={`/?user=${post.username}`} rel="author">{post.username}</Link></address>
                    <time 
                        dateTime={post.createdAt} 
                        title={new Date(post.createdAt).toLocaleDateString("ko-KR", options)} 
                        className="single-post-date">
                            {new Date(post.createdAt).toLocaleDateString("ko-KR", options)}
                    </time>
                </div>
                {updateMode ? 
                    <textarea 
                        className="single-post-desc-input" 
                        value={desc} 
                        onChange={(e)=>setDesc(e.target.value)} 
                    /> 
                    : <p className="single-post-desc">{desc}</p>
                }
                {post.username === user?.username &&
                    <div className="single-post-edit">
                        <div className="single-post-edit-wrapper">
                            <i className={ updateMode ? "single-post-icon fa-solid fa-upload" : "single-post-icon far fa-edit" } 
                            onClick={ updateMode ? handleUpdate : () => setUpdateMode(true)}></i>
                            <i className={ updateMode ? "single-post-icon fa-solid fa-xmark" : "single-post-icon far fa-trash-alt"} 
                            onClick={ updateMode ? handleCancelEditMode : handleDelete}></i>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
