"use client";
import { Comment } from "@/models/Comment";
import FoodService from "@/services/foodService";
import React, { useEffect, useState } from "react";
import { Rating } from "react-simple-star-rating";
import { showErrorToast } from "./toast";
import { cn } from "@/utils/cn";
import { Input, TextArea } from "./input";

const StarsIcon = ({ rating }: { rating: number }) => {
  const starSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="0.9rem"
      height="0.9rem"
      viewBox="0 0 32 32"
    >
      <path
        fill="#fcd53f"
        d="m18.7 4.627l2.247 4.31a2.27 2.27 0 0 0 1.686 1.189l4.746.65c2.538.35 3.522 3.479 1.645 5.219l-3.25 2.999a2.225 2.225 0 0 0-.683 2.04l.793 4.398c.441 2.45-2.108 4.36-4.345 3.24l-4.536-2.25a2.282 2.282 0 0 0-2.006 0l-4.536 2.25c-2.238 1.11-4.786-.79-4.345-3.24l.793-4.399c.14-.75-.12-1.52-.682-2.04l-3.251-2.998c-1.877-1.73-.893-4.87 1.645-5.22l4.746-.65a2.23 2.23 0 0 0 1.686-1.189l2.248-4.309c1.144-2.17 4.264-2.17 5.398 0"
      />
    </svg>
  );

  const stars = [];
  for (let i = 0; i < rating; i++) stars.push(starSVG);
  return <div className="flex">{stars}</div>;
};

const FoodComment = ({
  comment,
  isFromUser,
}: {
  comment: Comment;
  isFromUser?: boolean;
}) => {
  return (
    <div className={"mb-2 p-3 border-2 rounded-lg border-gray-200"}>
      <div className={"flex"}>
        <img
          src={comment.user.profileImage}
          alt={comment.user.name}
          className="w-10 h-10 rounded-full mr-4 mt-1"
        />
        <div className="flex flex-col justify-start h-full">
          <div className="flex items-center gap-4 mb-1">
            <h4
              className={cn(
                "text-sm font-semibold text-gray-700",
                isFromUser ? "text-purple-700" : ""
              )}
            >
              sen1or
            </h4>
            {<StarsIcon rating={comment.rating} />}
          </div>
          <p className="text-xs text-gray-600">{comment.createdAt}</p>
          <h5 className="text-md font-semibold text-gray-800 mt-1">
            {comment.title}
          </h5>
          <p className="text-gray-700 text-sm">{comment.content}</p>
        </div>
      </div>
    </div>
  );
};

const CommentSection = ({ foodId }: { foodId: number }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [hasCommented, setHasCommented] = useState(false);
  const [newComment, setNewComment] = useState({
    title: "",
    content: "",
    rating: 5,
  });

  useEffect(() => {
    let commentedPos = -1;
    FoodService.getAllComments(foodId)
      .then((data) => {
        data.data.forEach((comment, index) => {
          if (comment.user.id === 1) {
            setHasCommented(true);
            commentedPos = index;
          }
          if (commentedPos !== -1) {
            const temp = data.data[commentedPos];
            data.data[commentedPos] = data.data[0];
            data.data[0] = temp;
          }
          setComments(data.data);
        });
      })
      .catch((e) => showErrorToast("Failed while fetching comments"));
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewComment((prevComment) => ({
      ...prevComment,
      [name]: value,
    }));
  };

  const handleRatingChange = (rating: number) => {
    setNewComment((prevComment) => ({
      ...prevComment,
      rating,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newComment.title && newComment.content && newComment.rating) {
      FoodService.uploadNewComment(foodId, newComment)
        .then((data) => {
          setComments([...comments, data.data]);
          setHasCommented(true);
        })
        .catch(() => showErrorToast("Failed to add comment"));
    }
  };

  return (
    <div className="w-3/5 mx-auto h-full bg-white text-black rounded-lg overflow-y-auto px-2">
      <h2 className="text-3xl font-bold mb-2 text-gray-800">Comments</h2>
      {!hasCommented ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-2">
            <Input
              type="text"
              name="title"
              placeholder="Title"
              value={newComment.title}
              onChange={handleInputChange}
              className="mt-1 py-2 px-2 w-full rounded-lg border focus:border-blue-500 outline-0"
              required
            />
          </div>
          <div className="mb-2">
            <TextArea
              name="content"
              placeholder="Your comment"
              value={newComment.content}
              onChange={handleInputChange}
              className="mt-1 py-2 px-2 w-full rounded-lg resize-none border focus:border-blue-500 outline-0"
              required
            />
          </div>
          <div className="mb-6 flex justify-between items-center">
            <Rating
              SVGclassName={"inline-block"}
              onClick={handleRatingChange}
              initialValue={newComment.rating}
            />
            <button
              type="submit"
              className="w-52 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Submit
            </button>
          </div>
        </form>
      ) : null}
      <div>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <FoodComment
              key={index}
              comment={comment}
              isFromUser={hasCommented && index === 0}
            />
          ))
        ) : (
          <div className="w-full h-20 flex items-center justify-center">
            <p className="text-gray-700 text-center ">
              No comments yet. Be the first to comment!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
