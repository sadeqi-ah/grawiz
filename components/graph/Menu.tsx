import React from "react";
import styles from "../../styles/GraphEditor.module.scss";
import I from "../../icons";

export const menuItem = {
  SELECT: "select",
  ADD_NODE: "add_node",
  ADD_EDGE: "add_edge",
  CLEAR: "clear",
};

const menuItems = [
  {
    name: menuItem.SELECT,
    icon: "Cursor",
  },
  {
    name: menuItem.ADD_NODE,
    icon: "Node",
  },
  {
    name: menuItem.ADD_EDGE,
    icon: "DirectedEdge",
  },

  {
    name: menuItem.CLEAR,
    icon: "Delete",
  },
];

type MenuProps = {
  active: string;
  onUpdate: (active: string) => void;
};

const Menu: React.FC<MenuProps> = ({ active, onUpdate }) => {
  return (
    <ul className={styles.menu}>
      {menuItems.map((item) => (
        <li
          key={item.name}
          className={active == item.name ? styles.active : ""}
          onClick={() => {
            onUpdate(item.name);
          }}
        >
          <I name={item.icon} width={32} height={32} />
        </li>
      ))}
    </ul>
  );
};

export default Menu;
