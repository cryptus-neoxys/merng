import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";

import { AuthContext } from "../context/auth";

function Menubar() {
  const { user, logout } = useContext(AuthContext);
  const pathname = window.location.pathname;

  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  const menuBar = user ? (
    <div>
      <Menu pointing secondary size='massive' color='teal'>
        <Menu.Item name={user.username} active as={Link} to='/' />
        <Menu.Menu position='right'>
          <Menu.Item name='logout' onClick={logout} />
        </Menu.Menu>
      </Menu>
    </div>
  ) : (
    <div>
      <Menu pointing secondary size='massive' color='teal'>
        <Menu.Item
          name='home'
          active={activeItem === "home"}
          onClick={handleItemClick}
          as={Link}
          to='/'
        />
        <Menu.Menu position='right'>
          <Menu.Item
            name='login'
            active={activeItem === "login"}
            onClick={handleItemClick}
            as={Link}
            to='/login'
          />
          <Menu.Item
            name='register'
            active={activeItem === "register"}
            onClick={handleItemClick}
            as={Link}
            to='/register'
          />
        </Menu.Menu>
      </Menu>
    </div>
  );

  return menuBar;
}

export default Menubar;
