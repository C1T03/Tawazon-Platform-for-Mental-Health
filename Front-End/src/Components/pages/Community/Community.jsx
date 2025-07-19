import {
  Container,
  Grid,
  CircularProgress,
  Alert,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import Post from "./Components/Post";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const role = useSelector((state) => state.user.role);
  console.log(role);
  const fetchData = async () => {
    if (isFetching) return;

    setIsFetching(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/posts`, {
        params: {
          page: page,
          limit: 10,
        },
      });

      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        // تصفية المنشورات الجديدة لمنع التكرار
        const newPosts = response.data.filter(
          (newPost) =>
            !posts.some((existingPost) => existingPost.id === newPost.id)
        );

        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && page === 1) {
    return (
      <Container
        maxWidth="xl"
        sx={{ my: 10, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ my: 10 }}>
        <Alert severity="error">خطأ في تحميل المنشورات: {error}</Alert>
      </Container>
    );
  }

  if (posts.length === 0 && !loading) {
    return (
      <Container maxWidth="xl" sx={{ my: 10 }}>
        <Typography variant="h6" align="center">
          لا توجد منشورات متاحة حالياً
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ my: 10 }}>
      <Grid container spacing={2}>
        <Grid xs={0} md={2}></Grid>
        <Grid item xs={12} md={8} gap={10}>
          <InfiniteScroll
            dataLength={posts.length}
            next={fetchData}
            hasMore={hasMore}
            loader={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "20px",
                }}
              >
                <CircularProgress />
              </div>
            }
            endMessage={
              <Typography variant="body1" align="center" sx={{ py: 3 }}>
                لقد وصلت إلى نهاية المنشورات
              </Typography>
            }
          >
            {posts.map((item) => (
              <Post
                key={item.id}
                id={item.id}
                name={item.name}
                doctor_id={item.doctor_id}
                title={item.title}
                content={item.content}
                created_at={item.created_at}
                dislike_count={item.dislike_count}
                likes_count={item.likes_count}
                post_url={item.post_url}
              />
            ))}
          </InfiniteScroll>
        </Grid>
        <Grid item xs={0} md={2}></Grid>
      </Grid>
    </Container>
  );
}
