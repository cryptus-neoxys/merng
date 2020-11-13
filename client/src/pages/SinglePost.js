import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import {
  Button,
  Card,
  Container,
  Dimmer,
  Form,
  Grid,
  Icon,
  Image,
  Label,
  Loader,
  Popup,
} from "semantic-ui-react";
import moment from "moment";
import { useContext, useRef, useState } from "react";

import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";

function SinglePost(props) {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);

  const [comment, setComment] = useState("");
  const commentInputRef = useRef(null);

  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: { postId },
  });

  let getPost = null;

  if (data) {
    getPost = data.getPost;
    console.log(getPost);
  }

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    onError(err) {
      return err;
    },
    variables: {
      postId,
      body: comment,
    },
  });

  function deletePostCallback() {
    props.history.push("/");
  }

  let postMarkup;

  if (!getPost) {
    postMarkup = (
      <Dimmer active inverted style={{ marginTop: 30 }}>
        <Loader inverted size='big' content='Loading Post' />
      </Dimmer>
    );
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src='https://react.semantic-ui.com/images/avatar/large/molly.png'
              size='small'
              float='right'
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <Button
                  as='div'
                  labelPosition='right'
                  onClick={() => {
                    commentInputRef.current.focus();
                    console.log("Comment on post");
                  }}>
                  <Popup
                    inverted
                    content='Like Post'
                    trigger={
                      <Button basic color='blue'>
                        <Icon name='comments' />
                      </Button>
                    }
                  />
                  <Label basic color='blue' pointing='left'>
                    {commentCount}
                  </Label>
                </Button>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            <Container>
              {user && (
                <Card fluid>
                  <Card.Content>
                    <p>Post a comment</p>
                    <Form>
                      <div className='ui action input fluid'>
                        <input
                          type='text'
                          placeholder='Comment ...'
                          name='comment'
                          value={comment}
                          onChange={(event) => setComment(event.target.value)}
                          ref={commentInputRef}
                        />
                        <button
                          type='submit'
                          className='ui button teal'
                          disabled={comment.trim() === ""}
                          onClick={submitComment}>
                          Comment
                        </button>
                      </div>
                    </Form>
                  </Card.Content>
                </Card>
              )}
              {comments.map((comment) => (
                <Card fluid key={comment.id}>
                  <Card.Content>
                    {user && user.username === comment.username && (
                      <DeleteButton
                        size='mini'
                        postId={id}
                        commentId={comment.id}
                      />
                    )}
                    <Card.Header>{comment.username}</Card.Header>
                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                    <Card.Description>{comment.body}</Card.Description>
                  </Card.Content>
                </Card>
              ))}
            </Container>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      username
      body
      createdAt
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;
