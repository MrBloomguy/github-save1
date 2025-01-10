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
  const [categories, setCategories] = useState([]);
  const [buidlPoints, setBuidlPoints] = useState(post.content.buidlPoints || 0);
  const [hasGivenPoints, setHasGivenPoints] = useState(false);

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

  useEffect(() => {
    if (user) {
      checkReactions();
    }

    async function checkReactions() {
      // Check upvote reaction
      let { data: likeData } = await orbis.getReaction(post.stream_id, user.did);
      if (likeData && likeData.type === "like") {
        setHasLiked(true);
      }

      // Check points reaction
      let { data: pointsData } = await orbis.getReaction(post.stream_id, user.did, "buidl_points");
      if (pointsData) {
        setHasGivenPoints(true);
      }
    }
  }, [user]);

  async function upvote() {
    if (user) {
      setHasLiked(true);
      setIsAnimating(true);
      setUpdatedPost({
        ...updatedPost,
        count_likes: post.count_likes + 1,
      });
      let res = await orbis.react(post.stream_id, "like");
      console.log("res:", res);

      setTimeout(() => setIsAnimating(false), 500);
    } else {
      alert("You must be connected to react to posts.");
    }
  }

  async function giveBuidlPoints() {
    if (user) {
      if (!hasGivenPoints) {
        setHasGivenPoints(true);
        setBuidlPoints(prev => prev + 1);
        let res = await orbis.react(post.stream_id, "buidl_points");
        console.log("Points given:", res);
      }
    } else {
      alert("You must be connected to give BuidlPoints.");
    }
  }

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

  function getCategoryName() {
    if (post.content.context === global.orbis_context) return "General";
    const category = categories.find(cat => cat.stream_id === post.content.context);
    return category?.content?.displayName || "General";
  }

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 mb-4">
      {/* Previous header and content sections remain the same */}

      {/* Action Buttons */}
      <div className="flex items-center space-x-4 pt-3 border-t border-gray-100">
        {/* Upvote Button */}
        <button
          onClick={upvote}
          className={`flex items-center space-x-2 ${
            hasLiked ? 'text-blue-500' : 'text-gray-600'
          } ${isAnimating ? 'animate-bounce' : ''} hover:text-blue-500`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill={hasLiked ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
          <span className="font-medium">{updatedPost.count_likes || 0}</span>
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
        <button
          onClick={giveBuidlPoints}
          className={`flex items-center space-x-2 ${
            hasGivenPoints ? 'text-yellow-500' : 'text-gray-500'
          } hover:text-yellow-500`}
          disabled={hasGivenPoints}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill={hasGivenPoints ? 'currentColor' : 'none'}
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
          <span className="font-medium">{buidlPoints}</span>
        </button>

        {/* Category Badge */}
        <div className="flex items-center space-x-2 text-purple-600">
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
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          <span className="font-medium">{getCategoryName()}</span>
        </div>

        {/* Proof Badge */}
        <Link
          href={`https://cerscan.com/mainnet/stream/${post.stream_id}`}
          target="_blank"
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
        </Link>
      </div>
    </div>
  );
}
