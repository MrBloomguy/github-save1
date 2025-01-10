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

  /** Will upvote the post */
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
        {/* Header with User Info */}
        <div className="flex items-center mb-3">
          <div className="flex-shrink-0 mr-3">
            <User details={post.creator_details} height={40} />
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {post.creator_details?.profile?.username || shortAddress(post.creator_details.metadata?.address)}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <span>{post.creator_details?.profile?.title || "Project Manager"}</span>
              <span className="mx-1">·</span>
              <ReactTimeAgo date={post.timestamp * 1000} timeStyle="twitter" />
            </div>
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

        {/* Engagement Stats */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <span className="font-medium">{updatedPost.count_likes || 0}</span>
            <span className="ml-1">reactions</span>
          </div>
          <span className="mx-2">·</span>
          <div className="flex items-center">
            <span className="font-medium">{post.count_replies || 0}</span>
            <span className="ml-1">comments</span>
          </div>
          <span className="mx-2">·</span>
          <span>1 Share</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            onClick={upvote}
            className={`flex items-center px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200 ${
              hasLiked ? 'text-[var(--brand-color)]' : 'text-gray-600'
            } ${isAnimating ? 'animate-bounce' : ''}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill={hasLiked ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
            React
          </button>

          <Link
            href={"/post/" + post.stream_id}
            className="flex items-center px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200 text-gray-600"
          >
            <CommentsIcon className="h-5 w-5 mr-2" />
            Comment
          </Link>

          <button className="flex items-center px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200 text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Share
          </button>

          <Link
            href={"/post/" + post.stream_id}
            className="flex items-center px-4 py-2 rounded-md hover:bg-gray-50 transition-colors duration-200 text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
