import React from "react";
import Post from "./Post";

export default function PostList() {
  return (
    <div>
      <style jsx>{`
        @media (min-width: 1400px) {
          .container {
            max-width: 1140px;
            padding: 50px 0;
          }
        }
      `}</style>

      <div className="container">
        <div className="row">
          <Post
            title="Network Flow"
            categories={["Algorithm"]}
            url="post"
            color="#1486F8"
          />
          <Post
            title="Network Flow"
            categories={["Algorithm"]}
            url="post"
            color="#B15EFF"
          />
          <Post
            title="Network Flow"
            categories={["Algorithm"]}
            url="post"
            color="#F2994A"
          />
          <Post
            title="Network Flow"
            categories={["Algorithm"]}
            url="post"
            color="#F45890"
          />
          <Post
            title="Network Flow"
            categories={["Algorithm"]}
            url="post"
            color="#1BC7FF"
          />
          <Post
            title="Network Flow"
            categories={["Algorithm"]}
            url="post"
            color="#37D6B9"
          />
          <Post
            title="Network Flow"
            categories={["Algorithm"]}
            url="post"
            color="#1486F8"
          />
          <Post
            title="Network Flow"
            categories={["Algorithm"]}
            url="post"
            color="#1486F8"
          />
          <Post
            title="Network Flow"
            categories={["Algorithm"]}
            url="post"
            color="#1486F8"
          />
          <Post
            title="Network Flow"
            categories={["Algorithm"]}
            url="post"
            color="#1486F8"
          />
          <Post
            title="Network Flow"
            categories={["Algorithm"]}
            url="post"
            color="#1486F8"
          />
          <Post
            title="Network Flow"
            categories={["Algorithm"]}
            url="post"
            color="#1486F8"
          />
        </div>
      </div>
    </div>
  );
}
