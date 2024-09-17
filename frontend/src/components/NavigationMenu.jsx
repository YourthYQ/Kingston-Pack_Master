// src/components/NavigationMenu.jsx

import React from "react";
import { AppstoreOutlined, MailOutlined, SettingOutlined } from "@ant-design/icons";
import { Menu } from "antd";

const NavigationMenu = () => {
  const items = [
    {
      label: "3D Bin Packing",
      key: "app1",
      icon: <MailOutlined />,
    },
    {
      label: "Navigation Two",
      key: "app2",
      icon: <AppstoreOutlined />,
    }
  ];

  return (
    <Menu theme="dark" mode="horizontal" items={items} className="custom-menu">
      
    </Menu>
  );
};

export default NavigationMenu;