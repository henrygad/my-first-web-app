import { ReactNode, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

type Menuprops = {
  arrOfMenu: {
    name: string
    to?: string
    content?: ReactNode | null
    child?: {
      name: string
      to?: string
      content?: ReactNode | null
    }[]
  }[]
  parentClass: string
  childClass: string
  id?: string
  nestedChildParentClass?: string
};

type Listprops = {
  item: {
    name: string;
    to?: string;
    content?: ReactNode | null;
    child?: {
      name: string;
      to?: string;
      content?: ReactNode | null;
    }[];
  },
  parentClass: string
  childClass: string
  nestedChildParentClass?: string
};

type Toggledropdownnavprops = {
  displayParentNav: Record<string, string>
  setDisplayParentNav: (value: Record<string, string | string>) => void
  name: string
};

const Toggledropdownnav = ({ name, displayParentNav, setDisplayParentNav }: Toggledropdownnavprops) => {

  const handleToggleParentNav = (getParentName: string) => {
    setDisplayParentNav(
      {
        ...displayParentNav,
        [getParentName]: displayParentNav[getParentName] ? '' : getParentName
      }
    );
  };

  return <span
    className="text-xl font-bold cursor-pointer"
    onClick={() => handleToggleParentNav(name)}
  >
    {
      displayParentNav &&
        displayParentNav[name] ? <FaMinus size={10} /> : <FaPlus size={10} />
    }
  </span>

};

const List = ({ childClass, item, nestedChildParentClass }: Listprops) => {
  const [displayParentNav, setDisplayParentNav] = useState<Record<string, string>>({});
  if (!item) return;

  return <li id={item.name} className={childClass}>
    {item.to ?
      <Link to={item.to}>
        {item.name}
        {item.child &&
          item.child.length ?
          <Toggledropdownnav
            name={item.name}
            displayParentNav={displayParentNav}
            setDisplayParentNav={setDisplayParentNav}
          /> :
          null
        }
      </Link> :
      <span className="flex items-center gap-2">
        {item.content}
        {item.child &&
          item.child.length ?
          <Toggledropdownnav
            name={item.name}
            displayParentNav={displayParentNav}
            setDisplayParentNav={setDisplayParentNav}
          /> :
          null
        }
      </span>
    }

    {(item.child &&
      item.child.length) &&
      (displayParentNav &&
        displayParentNav[item.name]) ?
     
        <Menu
          arrOfMenu={item.child}
          parentClass={nestedChildParentClass || ''}
          childClass={childClass}
          id={item.name}
        />:
      null
    }

  </li>
};

const Menu = ({ arrOfMenu, parentClass, childClass, id = "menu", nestedChildParentClass }: Menuprops) => {

  return <menu id={id}>
    <ul className={parentClass}>
      {arrOfMenu &&
        arrOfMenu.length ?
        arrOfMenu.map((item) =>
          <List
            key={item.name}
            item={item}
            parentClass={parentClass}
            childClass={childClass}
            nestedChildParentClass={nestedChildParentClass}
          />
        ) :
        null
      }
    </ul>
  </menu>
};

export default Menu;
