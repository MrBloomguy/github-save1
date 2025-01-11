import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, useOrbis } from "@orbisclub/components";
import { shortAddress } from "../utils";
import { CommentsIcon } from "./Icons";
import ReactTimeAgo from 'react-time-ago';

export default function PostItem({ post, isLastPost }) {
  const { orbis, user } = useOrbis();
  const [hasLiked, setHasLiked] = useState(false);
  const [updatedPost, setUpdatedPost] = useState(post);
  const [isAnimating, setIsAnimating] = useState(false);
  const [buidlPoints, setBuidlPoints] = useState(0);

  /** Check if user liked this post */
  useEffect(() => {
    if (user) {
      getReaction();
    }

    async function getReaction() {
      let { data, error } = await orbis.getReaction(post.stream_id, user.did);
      if (data && data.type && data.type == "like") {
        setHasLiked(true);
      }
    }
  }, [user]);

  const [categories, setCategories] = useState([]);

useEffect(() => {
  loadCategories();
  
  async function loadCategories() {
    let { data } = await orbis.api.from("orbis_contexts")
      .select()
      .eq('context', global.orbis_context)
      .order('created_at', { ascending: false });
    if(data) {
      setCategories(data);
    }
  }
}, []);


  /** Will upvote the post and award BuidlPoints */
  async function upvote() {
    if (user) {
      setHasLiked(true);
      setIsAnimating(true);
      
      // Update post likes
      setUpdatedPost({
        ...updatedPost,
        count_likes: post.count_likes + 1,
      });

      // Award BuidlPoints
      setBuidlPoints(prev => prev + 10);

      let res = await orbis.react(post.stream_id, "like");
      console.log("res:", res);

      setTimeout(() => setIsAnimating(false), 500);
    } else {
      alert("You must be connected to react to posts.");
    }
  }

  /** Will clean description by shortening it and remove some markdown structure */
  function cleanDescription() {
    if (post.content.body) {
      let desc = post.content.body;
      const regexImage = /\!\[Image ALT tag\]\((.*?)\)/;
      const regexUrl = /\[(.*?)\]\(.*?\)/;
      desc = desc.replace(regexImage, "");
      desc = desc.replace(regexUrl, "$1");

      if (desc) {
        return desc.substring(0, 180) + "...";
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 mb-4">
      <div className="p-4">
          {/* Header with User Info - Twitter Style */}
        <div className="flex items-center mb-3">
          <div className="flex-shrink-0 mr-3">
            <User details={post.creator_details} height={40} showUsername={true} />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900 hover:underline">
              {post.creator_details?.profile?.username || shortAddress(post.creator_details.metadata?.address)}
            </span>
            <span className="text-gray-500">·</span>
            <span className="text-sm text-gray-500">
              <ReactTimeAgo date={post.timestamp * 1000} timeStyle="twitter" />
            </span>
            <span className="text-gray-500">·</span>
            <span className="text-sm text-gray-500">
            {post.content.context === global.orbis_context ? "General" : 
        categories?.find(cat => cat.stream_id === post.content.context)?.content?.displayName || "General"}
            </span>
          </div>
        </div>


        {/* Post Content */}
        <div className="mb-3">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            <Link href={"/post/" + post.stream_id} className="hover:text-[var(--brand-color)]">
              {post.content.title}
            </Link>
          </h2>
          <p className="text-gray-600">{cleanDescription()}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4 pt-3 border-t border-gray-100">
          {/* Upvote Button */}
          <button
  onClick={upvote}
  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 
    ${hasLiked ? 'bg-blue-500 text-white' : 'bg-transparent text-gray-600'}
    hover:bg-blue-100 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill={hasLiked ? 'currentColor' : 'none'}
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7-7-7 7"
    />
  </svg>
  <span className="sr-only">Upvote</span>
</button>


           {/* Comments Button */}
           <Link
            href={"/post/" + post.stream_id}
            className="flex items-center space-x-2 text-green-600 hover:text-green-700"
          >
            <CommentsIcon className="h-5 w-5" />
            <span className="font-medium">{post.count_replies || 0}</span>
          </Link>


          {/* BuidlPoints Button */}
          <div className="flex items-center space-x-2 text-indigo-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">{buidlPoints} Points</span>
          </div>

   
          {/* Proof Badge */}
          <a
            href={`https://cerscan.com/mainnet/stream/${post.stream_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-amber-600 hover:text-amber-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="font-medium">Donate</span>
          </a>
        </div>
      </div>
    </div>
  );
}