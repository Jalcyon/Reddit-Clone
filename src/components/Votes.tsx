import React, { useState, useEffect } from 'react'
import { updateUser } from '../API/users'
import { incrementKarma as commentUp, decrementKarma as commentDown } from "../API/comments"
import { incrementKarma as postUp, decrementKarma as postDown } from "../API/posts"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLongArrowAltDown, faLongArrowAltUp, faReply } from '@fortawesome/free-solid-svg-icons'
import { UserInterface } from '../API/interfaces'

type VotesProps = {
  loggedIn: boolean
  content: {
    votes: number
    id: string
  }
  type: string
  replyFunc: Function
}

function Votes(props: VotesProps) {
  const [netVotes, setNetVotes] = useState<number>(props.content.votes)
  const loggedIn = props.loggedIn
  const [userInfo, setUserInfo] = useState<UserInterface>(JSON.parse(localStorage.getItem("userInfo") as string))
  const [hasUpvoted, setHasUpvoted] = useState<boolean>(false)
  const [hasDownvoted, setHasDownvoted] = useState<boolean>(false)
  const [votingDisabled, setVotingDisabled] = useState<boolean>(false)

// check vote status
  useEffect(() => {
    // if comment id is in up or down voted arrays, set vote status
    if (userInfo && userInfo.upvotedIDs.includes(props.content.id)) {
      setHasUpvoted(true)
    } else if (userInfo && userInfo.downvotedIDs.includes(props.content.id)) {
      setHasDownvoted(true)
    }
  }, [userInfo, props.content.id])


  let karmaUp: Function
  let karmaDown: Function

  if (props.type === 'post') {
    karmaUp = postUp
    karmaDown = postDown
  } else if (props.type === 'comment') {
    karmaUp = commentUp
    karmaDown = commentDown
  }

  function getUpdatedUser() {
    setUserInfo(JSON.parse(localStorage.getItem("userInfo") as string))
  }

  function setUpdatedUser(user: UserInterface) {
    localStorage.setItem("userInfo", JSON.stringify(user))
  }

  function upvote() {
    if (votingDisabled) {
      alert("Slow down there Bucko! My DB cannot handle calls this quickly.")
      return
    }

    let incrementCount = 1
    getUpdatedUser()

    // if downvoted, remove it
    if (hasDownvoted) {
      setHasDownvoted(false)
      incrementCount += 1
    }

    if (loggedIn) {
      let user = userInfo
      let username = user.username

      if (hasUpvoted) {
        let index = user.upvotedIDs.indexOf(props.content.id)
        user.upvotedIDs.splice(index, 1)
        setUserInfo(user)
        updateUser(username, user)
        setHasUpvoted(false)
        setNetVotes(prev => prev - 1)
        karmaDown(props.content.id, 1)
      } else {
        user.upvotedIDs.push(props.content.id)
        setUserInfo(user)
        updateUser(username, user)
        setHasUpvoted(true)
        setNetVotes(prev => prev + incrementCount)
        karmaUp(props.content.id, incrementCount)
      }

      setUpdatedUser(user)
    } else {
      alert("You must be logged in to vote on stuff!")
    }

    setVotingDisabled(true)
    setTimeout(()=>{setVotingDisabled(false)}, 1000)
  }

  function downvote() {
    if (votingDisabled) {
      alert("Slow down there Bucko! My DB cannot handle calls this quickly.")
      return
    }

    let decrementCount = 1
    getUpdatedUser()
    // if upvoted remove that upvote
    if(hasUpvoted) {
      setHasUpvoted(false)
      decrementCount += 1
    }

    if (loggedIn) {
      let user = userInfo
      let username = user.username
      if (hasDownvoted) {
        let index = user.downvotedIDs.indexOf(props.content.id)
        user.downvotedIDs.splice(index, 1)
        setUserInfo(user)
        updateUser(username, user)
        setHasDownvoted(false)
        setNetVotes(prev => prev + 1)
        karmaUp(props.content.id, 1)
      } else {
        user.downvotedIDs.push(props.content.id)
        setUserInfo(user)
        updateUser(username, user)
        setHasDownvoted(true)
        setNetVotes(prev => prev - decrementCount)
        karmaDown(props.content.id, decrementCount)
      }

      setUpdatedUser(user)
    } else {
      alert("You must be logged in to vote on stuff!")
    }

    setVotingDisabled(true)
    setTimeout(()=>{setVotingDisabled(false)}, 2000)
  }

  return (
    <div className="m-1">
      <span onClick={upvote} className={ (hasUpvoted ? "fill-curret text-yellow-500 " : "fill-curret text-gray-500 ") + "mx-1 cursor-pointer rounded-full px-2 hover:bg-gray-300"}><FontAwesomeIcon icon={faLongArrowAltUp} /></span>
      <span>{netVotes}</span>
      <span onClick={downvote} className={ (hasDownvoted ? "fill-curret text-indigo-500 " : "fill-curret text-gray-500 ") + "mx-1 cursor-pointer rounded-full px-2 hover:bg-gray-300"}><FontAwesomeIcon icon={faLongArrowAltDown} /></span>
      <span onClick={()=>{props.replyFunc()}} className="mx-1 cursor-pointer rounded-full px-2 hover:bg-gray-300 fill-curret text-blue-400"><FontAwesomeIcon icon={faReply} /></span>
    </div>
  )
}

export default Votes
