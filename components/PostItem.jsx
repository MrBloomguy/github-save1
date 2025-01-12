import React, { useEffect, useState } from "react";
import Link from "next/link";
import { User, useOrbis, Discussion } from "@orbisclub/components";
import { getIpfsLink } from "../utils";
import { CommentsIcon } from "./Icons";
import ReactTimeAgo from "react-time-ago";
import Upvote from "./Upvote";
import UrlMetadata from "./UrlMetadata";
import { marked } from "marked";
import parse from "html-react-parser";
import DonateModal from "./DonateModal";

export default function PostItem({ post, isLastPost }) {
  const { orbis, user } = useOrbis();
  const [hasLiked, setHasLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [updatedPost, setUpdatedPost] = useState(post);
  const [categories, setCategories] = useState([]);

  // Load categories from Orbis
  useEffect(() => {
    async function loadCategories() {
      const { data } = await orbis.api
        .from("orbis_contexts")
        .select()
        .eq("context", global.orbis_context)
        .order("created_at", { ascending: false });
      if (data) {
        setCategories(data);
      }
    }
    loadCategories();
  }, []);

  // Check if user has liked this post
  useEffect(() => {
    if (user) {
      async function checkIfHasLiked() {
        const { data } = await orbis.getReaction(post.stream_id, user.did);
        if (data?.type === "like") {
          setHasLiked(true);
        }
      }
      checkIfHasLiked();
    }
  }, [user]);

  const like = async () => {
    if (user) {
      setHasLiked(true);
      setUpdatedPost((prev) => ({
        ...prev,
        count_likes: prev.count_likes + 1,
      }));
      await orbis.react(post.stream_id, "like");
    } else {
      alert("You must be connected to upvote posts.");
    }
  };

  const sharePost = async () => {
    setSharing(true);
    try {
      await navigator.share({
        title: post.content?.title,
        text: post.content?.body?.substring(0, 100) + "...",
        url: window.location.origin + "/post/" + post.stream_id,
      });
    } catch (err) {
      console.error("Share failed:", err);
      navigator.clipboard.writeText(window.location.origin + "/post/" + post.stream_id);
      alert("Link copied to clipboard!");
    }
    setSharing(false);
  };

  const handleDonate = () => {
    setIsDonateModalOpen(true);
  };

  return (
    <div className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 ${!isLastPost ? "mb-4" : ""}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <User details={post.creator_details} />
            <span className="text-gray-500 text-sm">
              <ReactTimeAgo date={post.timestamp * 1000} locale="en-US" />
            </span>
            <div>
              <button
                className="px-2 py-1 text-sm text-gray-500 bg-blue-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-400"
              >
                {post.content.context === global.orbis_context
                  ? "General"
                  : categories?.find(
                      (cat) => cat.stream_id === post.content.context
                    )?.content?.displayName || "General"}
              </button>
            </div>
          </div>
        </div>

        <Link href={`/post/${post.stream_id}`} className="block">
          {post.content?.title && (
            <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-[var(--brand-color)]">
              {post.content.title}
            </h2>
          )}

          {post.content?.body && (
            <div className="text-gray-600 line-clamp-3 mb-3">
              {parse(marked(post.content.body))}
            </div>
          )}

          {post.content?.media && post.content.media[0] && (
            <div className="relative w-full h-48 mb-3">
              <img
                src={getIpfsLink(post.content.media[0])}
                alt={post.content.title}
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
        </Link>

        {post.indexing_metadata?.urlMetadata?.title && (
          <UrlMetadata metadata={post.indexing_metadata.urlMetadata} />
        )}
      </div>

      <div className="border-t border-gray-100">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-6">
            <Upvote like={like} active={hasLiked} count={updatedPost.count_likes} />

            <div className="flex items-center group">
              <button className="group flex items-center space-x-2 text-gray-500 hover:text-yellow-500">
                <span className="text-sm font-medium">
                  {post.points || 0} Points
                </span>
              </button>
            </div>

            <div className="flex items-center group">
              <button
                onClick={() => setShowComments(!showComments)}
                className="group flex items-center space-x-2 text-gray-500 hover:text-blue-500"
              >
                <CommentsIcon className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {updatedPost.count_replies || 0}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleDonate}
              className="px-4 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-full hover:bg-green-100"
            >
              Donate
            </button>

            <button
              onClick={sharePost}
              disabled={sharing}
              className="px-4 py-1.5 text-sm text-gray-500 bg-gray-50 rounded-full hover:bg-gray-100"
            >
              Share
            </button>
          </div>
        </div>
      </div>

      {showComments && (
        <div className="border-t border-gray-100 p-4">
          <Discussion context={post.content.context} master={post.stream_id} />
        </div>
      )}

      <DonateModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
        post={post}
      />
    </div>
  );
}
