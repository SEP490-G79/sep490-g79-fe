import React, { useContext, useEffect, useState } from 'react'
import BlogCard from './BlogCard'
import {type Blog } from '@/types/Blog';
import type useAuthAxios from '@/utils/authAxios';
import AppContext from '@/context/AppContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';


const Blogs = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const {blogAPI} = useContext(AppContext);
    const {shelterId} = useParams();

    useEffect(() => {
        axios.get(`${blogAPI}/${shelterId}/get-by-shelter`)
        .then(result => {
          console.log(result?.data?.data)
          setBlogs(result?.data?.data)
        })
        .catch(error => console.log(error?.response.data.message))
    }, [])

  return (
    <div className="grid grid-cols-3 gap-2">
      {blogs?.map(blog => <BlogCard blog={blog} />)}
    </div>
  );
}

export default Blogs