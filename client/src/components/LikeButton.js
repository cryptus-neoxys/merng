import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { Button, Icon, Label, Popup } from "semantic-ui-react";

function LikeButton({ user, post: { id, likeCount, likes } }) {
  const [liked, setLiked] = useState(false);
  likes = likes ? likes : [];
  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else setLiked(false);
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
    onError(err) {
      return err;
    },
  });

  return (
    <Button as='div' labelPosition='right'>
      <Popup
        inverted
        content='Like Post'
        trigger={
          <Button
            color='teal'
            basic={user ? (!liked ? true : false) : true}
            as={!user ? Link : ""}
            to={!user ? "/login" : ""}
            onClick={likePost}>
            <Icon name='heart' />
          </Button>
        }
      />
      <Label basic color='teal' pointing='left'>
        {likeCount}
      </Label>
    </Button>
  );
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
