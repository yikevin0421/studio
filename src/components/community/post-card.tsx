"use client"

import { useMemo, useState } from "react";
import {
  ThumbsUp,
  MessageCircle,
  Clock3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type PostCardProps = {
  post?: any;
  [key: string]: any;
};

function getPostValue(post: any, keys: string[], fallback: any = "") {
  for (const key of keys) {
    if (post?.[key] !== undefined && post?.[key] !== null) return post[key];
  }
  return fallback;
}

export function PostCard(props: PostCardProps) {
  const post = props.post ?? props;

  const title = getPostValue(post, ["title", "subject"], "제목 없음");
  const content = String(
    getPostValue(post, ["content", "summary", "body", "text", "description"], "")
  );

  const initialLikes = Number(getPostValue(post, ["likes", "likesCount", "useful"], 0));
  const comments = Number(getPostValue(post, ["comments", "commentsCount"], 0));
  const author = getPostValue(post, ["author", "userName", "displayName", "name"], "익명");
  const time = getPostValue(post, ["time", "createdAt", "created_at"], "방금 전");

  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(initialLikes);

  const previewLimit = 90;
  const shouldClamp = content.length > previewLimit;

  const previewText = useMemo(() => {
    if (!shouldClamp) return content;
    return content.slice(0, previewLimit);
  }, [content, shouldClamp]);

  const remainingText = useMemo(() => {
    if (!shouldClamp) return "";
    return content.slice(previewLimit);
  }, [content, shouldClamp]);

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount((prev: number) => (newLikedState ? prev + 1 : prev - 1));
  };

  return (
    <article className="rounded-xl border bg-background p-4 transition-colors ">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold leading-relaxed">
          {title}
        </h3>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {shouldClamp ? (
            <>
              {previewText}
              {!isExpanded && "..."}
              {isExpanded && remainingText}
            </>
          ) : (
            content
          )}
        </p>

        {shouldClamp && (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {isExpanded ? (
              <>
                접기
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                펼쳐보기
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <button
          type="button"
          onClick={handleLike}
          className="flex items-center gap-1 hover:text-primary"
        >
          <ThumbsUp className="h-4 w-4" />
          {likesCount}
        </button>

        <span className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          {comments}
        </span>

        <span className="flex items-center gap-1">
          <Clock3 className="h-4 w-4" />
          {time}
        </span>

        <span>{author}</span>
      </div>
    </article>
  );
}

export default PostCard;
