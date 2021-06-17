import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import { getTopLevelCommentIDs, getChildComments, getComment } from "../API/comments"
import { getPost } from "../API/posts"
import { getSubredditInfo } from "../API/subreddits"
import Comment from './Comment'
import Post from './Post'

//need form at the top 
// below list all comments on props.post

function Comments(props) {
  const [post, setPost] = useState({})
  const [loadingPost, setLoadingPost] = useState(true)
  const [postID, setPostID] = useState(useParams().postid)
  const [subreddit, setSubreddit] = useState(useParams().subreddit)
  const [subInfo, setSubInfo] = useState('')
  const [loadingComments, setLoadingComments] = useState(true)
  const [commentIDs, setCommentIDs] = useState([])
  const [comments, setComments] = useState([])

  useEffect(() => {
    getPost(postID).then(post => {
      setPost(post)
      setLoadingPost(false)
    })

    getSubredditInfo(subreddit).then(info => {
      setSubInfo(info)
    })
  }, [])

  useEffect(() => {
    getTopLevelCommentIDs(postID).then(ids => {
      let incomingIDs = []
      ids.forEach(id => incomingIDs.push(id))
      setCommentIDs(incomingIDs)
    })
  }, [])

  // when we get ids populate comments state with getComment for each id
  useEffect(() => {
    let promises = []
    let arr = []

    commentIDs.forEach(id => {
      promises.push(new Promise(resolve => resolve(getComment(id))))
    })

    Promise.all(promises).then(comments => {
      setComments(comments)
      setLoadingComments(false)
    })
  }, [commentIDs])


  //Need to render Post from postid ^^

  return (
    <div className="w-3/5 mx-auto m-2 justify-space-around bg-white">
      
      <div className="flex justify-between">
        <div className="w-3/5 m-1">
          { loadingPost ? "loading post" :
            <Post post={post} comments="disabled" />}
        </div>

        <div className="border w-2/5 p-2">
          <p className="text-center p-1">
          {`r/${subreddit}`}
          </p>
          {subInfo}
        </div>
      </div>

      <div className="flex w-3/5">
        <form className="relative w-full mr-2">
          <textarea className="w-full p-3 border rounded-xl" rows="4" placeholder="Write your comment." />
          <input className="absolute bottom-0 right-0 text-center border-2 border-blue-500 w-36 rounded-lg" value="Post Comment" type="submit" /> 
        </form>
      </div>

      <div>
        {loadingComments ? "Loading Comments" : 
        comments.map(comment => {
          return <Comment comment={comment} />
        })}
      </div>

    </div>
  )
}

export default Comments
