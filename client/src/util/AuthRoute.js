const { useContext } = require("react");
const { Route, Redirect } = require("react-router-dom");

const { AuthContext } = require("../context/auth");

function AuthRoute({ component: Component, ...rest }) {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Redirect to='/' /> : <Component {...props} />
      }
    />
  );
}

export default AuthRoute;
