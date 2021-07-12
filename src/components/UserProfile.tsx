import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import {getUserPosts, userExists} from "../API/users"
import LoadingIcon from './LoadingIcon'
import Post from './Post'
// receive user id and show all their posts

function UserProfile() {
  const [posts, setPosts] = useState([])
  const [doesUserExist, setDoesUserExists] = useState(false)
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [postsEmpty, setPostsEmpty] = useState(true)

  const username = useParams().username

  // ATTEMPT TO ADD COMMENTS

  // check if user exists
  useEffect(() => {
    userExists(username).then(bool => {
      if (bool) {setDoesUserExists(true)}
    })
  }, [])

  // if user exists, get their posts
  useEffect(() => {
    getUserPosts(username).then(posts => {
      if (posts.length > 0) {
        setPosts(posts)
        setLoadingPosts(false)
        setPostsEmpty(false)
      } else {
        setLoadingPosts(false)
      }
    })
  }, [doesUserExist])

  let content

  if (!doesUserExist) {
    content = "This user does not exist"
  }

  if (doesUserExist && postsEmpty) {
    content = "This user hasn't made any Posts"
  }

  return (
    <div className="w-full lg:w-3/5 mx-auto">
      <p className="my-4 mx-auto w-3/5 text-center text-2xl font-bold">This is {username}'s Profile</p>
      {loadingPosts ? <LoadingIcon /> : posts.map(post => {return <Post key={post.id} post={post} />})}
      <p className="my-4 mx-auto w-3/5 text-center text-2xl font-bold">{content}</p>
    </div>
  )
}

export default UserProfile 