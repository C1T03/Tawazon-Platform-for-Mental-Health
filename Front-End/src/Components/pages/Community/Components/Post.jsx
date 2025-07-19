import {
  CopyAll,
  Favorite,
  Share,
  ThumbDownAlt,
  ThumbUp,
} from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  Box,
  CardMedia,
  CardActions,
  IconButton,
  Tooltip,
  Collapse,
  Grow,
  Badge,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from 'axios';

export default function Post({
  id,
  doctors_id,
  name,
  title,
  content,
  created_at,
  dislike_count,
  likes_count,
  post_url,
  avatar,
  specialty = "أخصائي نفسي"
}) {
  const [expanded, setExpanded] = useState(false);
  const [likes, setLikes] = useState(likes_count || 0);
  const [dislikes, setDislikes] = useState(dislike_count || 0);
  const [userInteraction, setUserInteraction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // تحميل تفاعلات المستخدم عند التحميل الأولي
  useEffect(() => {
    const fetchUserInteraction = async () => {
      try {
        const response = await axios.get(`/api/posts/${id}/interactions`);
        if (response.data.userInteraction) {
          setUserInteraction(response.data.userInteraction.interaction_type);
        }
      } catch (error) {
        console.error("Error fetching user interaction:", error);
      }
    };
    
    fetchUserInteraction();
  }, [id]);

  const handleInteraction = async (interactionType) => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      // إذا كان نفس النوع، إلغاء التفاعل
      if (userInteraction === interactionType) {
        await axios.delete(`/api/posts/${id}/interact`);
        setUserInteraction(null);
        if (interactionType === 'like') setLikes(l => l - 1);
        else setDislikes(d => d - 1);
      } 
      // إذا كان نوع مختلف، تغيير التفاعل
      else if (userInteraction) {
        await axios.put(`/api/posts/${id}/interact`, { interactionType });
        setUserInteraction(interactionType);
        if (interactionType === 'like') {
          setLikes(l => l + 1);
          setDislikes(d => d - 1);
        } else {
          setDislikes(d => d + 1);
          setLikes(l => l - 1);
        }
      } 
      // إذا لم يكن هناك تفاعل سابق
      else {
        await axios.post(`/api/posts/${id}/interact`, { interactionType });
        setUserInteraction(interactionType);
        if (interactionType === 'like') setLikes(l => l + 1);
        else setDislikes(d => d + 1);
      }
    } catch (error) {
      console.error("Interaction error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: content.slice(0, 100) + '...',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('تم نسخ الرابط إلى الحافظة');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Grow in={true} timeout={800}>
      <Card sx={{ 
        width: "100%", 
        maxWidth: 800,
        mx: 'auto',
        my: 2,
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 6px 24px rgba(0,0,0,0.12)'
        }
      }}>
        {/* Header */}
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          bgcolor: 'background.paper'
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar 
              alt={name} 
              src={avatar || "/default-avatar.png"} 
              sx={{ width: 56, height: 56, border: '2px solid #2e7d67' }}
            />
            <Box>
              <Typography 
                variant="h6" 
                fontFamily="Dubai-Bold" 
                color="#2e7d67"
              >
                {name}
              </Typography>
              <Typography 
                variant="subtitle2" 
                color="text.secondary" 
                fontFamily="Dubai-Regular"
              >
                {specialty}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                fontFamily="Dubai-Light"
              >
                {new Date(created_at).toLocaleDateString('ar-EG')}
              </Typography>
            </Box>
          </Box>
          
          <Box>
            <Tooltip title="نسخ الرابط">
              <IconButton onClick={() => navigator.clipboard.writeText(window.location.href)}>
                <CopyAll color="action" />
              </IconButton>
            </Tooltip>
            <Tooltip title="مشاركة">
              <IconButton onClick={handleShare}>
                <Share color="action" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Divider sx={{ bgcolor: 'divider' }} />

        {/* Content */}
        <Box sx={{ p: 3 }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            fontFamily="Dubai-Bold"
            sx={{color: 'text.primary' }}
          >
            {title}
          </Typography>
          
          <Collapse in={expanded} collapsedSize={120}>
            <Typography 
              variant="body1" 
              fontFamily="Dubai-Regular"
              sx={{ 
                lineHeight: 1.8,
                whiteSpace: 'pre-line',
                color: 'text.secondary'
              }}
            >
              {content}
            </Typography>
          </Collapse>
          
          <Typography
            variant="button"
            sx={{
              display: 'inline-block',
              mt: 1,
              color: '#2e7d67',
              cursor: 'pointer',
              fontFamily: 'Tajawal',
              fontWeight: 700,
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'عرض أقل' : 'عرض المزيد'}
          </Typography>
        </Box>

        {/* Image */}
        {post_url && !imageError && (
          <Box sx={{ 
            width: "100%", 
            maxHeight: 400, 
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            bgcolor: 'background.default'
          }}>
            <CardMedia
              component="img"
              sx={{ 
                height: 'auto',
                width: '100%',
                objectFit: 'contain'
              }}
              image={post_url}
              alt={title}
              onError={handleImageError}
            />
          </Box>
        )}

        <Divider sx={{ bgcolor: 'divider' }} />

        {/* Actions */}
        <CardActions sx={{ 
          display: 'flex', 
          justifyContent: 'space-around',
          p: 1,
          bgcolor: 'background.paper'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 0.5,
            px: 2,
            py: 1,
            borderRadius: 2,
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}>
            <Tooltip title="إعجاب">
              <IconButton 
                aria-label="Like" 
                onClick={() => handleInteraction('like')} 
                disabled={isLoading}
                color={userInteraction === 'like' ? 'primary' : 'default'}
              >
                <Badge badgeContent={likes} color="primary" max={999}>
                  <ThumbUp />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 0.5,
            px: 2,
            py: 1,
            borderRadius: 2,
            '&:hover': {
              bgcolor: 'action.hover'
            }
          }}>
            <Tooltip title="عدم إعجاب">
              <IconButton 
                aria-label="Dislike" 
                onClick={() => handleInteraction('dislike')} 
                disabled={isLoading}
                color={userInteraction === 'dislike' ? 'error' : 'default'}
              >
                <Badge badgeContent={dislikes} color="error" max={999}>
                  <ThumbDownAlt />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
        </CardActions>
      </Card>
    </Grow>
  );
}