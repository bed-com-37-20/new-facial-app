// import React from 'react';
// import style from "../SideBar.module.css"
// import { Badge } from '../../../badge';
// import classNames from 'classnames';
// import { useConfig } from '@dhis2/app-runtime';
// import { MenuDataItemProps } from '../../../../types/menu/MenuTypes';
// import { useLocation } from 'react-router-dom';

// export default function SideBarSubItem({ sidebarIcon, title, showBadge, disabled, route, appName,program,leftLabel }: MenuDataItemProps) {
//     const { baseUrl } = useConfig()
//     const location = useLocation()

//     return (
//         <a href={`${baseUrl}/api/apps/${appName}/index.html#/${route}`} className={style.subItemLink}>
//             <li className={location.pathname.slice(1) === route ? style.sideBarSubItemContainerActive : classNames(style.sideBarSubItemContainer, (Boolean(disabled)) && style.sideBarDisabledSubItem)}>
//                 <img src={sidebarIcon} /> <span className={style.sideBarSubItemLabel}>{title}</span>
//                 {showBadge ? <div className={style.badgeContainer}><Badge value='10' /></div> : null}
//                 <div className={style.tooltipContainer}>
//                     {title}
//                 </div>
//             </li>
//         </a>
//     )
// }

import React from 'react';
import style from "../SideBar.module.css";
import { Badge } from '../../../badge';
import classNames from 'classnames';
import { useConfig } from '@dhis2/app-runtime';
import { useLocation } from 'react-router-dom';
export default function SideBarSubItem(_ref) {
  let {
    sidebarIcon,
    title,
    showBadge,
    disabled,
    route,
    appName
  } = _ref;
  const {
    baseUrl
  } = useConfig();
  const location = useLocation();
  return (
    /*#__PURE__*/
    // <a
    //     href={`${baseUrl}/api/apps/${appName ? `${appName}/` : ""}index.html#/${route}`}
    //     //href={`${baseUrl}/api/apps/${appName}/index.html#/${route}`} // Construct the URL
    //     //href={`#/${route}`}
    //     className={classNames(style.subItemLink, disabled && style.sideBarDisabledSubItem)} // Add disabled styling
    //     onClick={(e) => disabled && e.preventDefault()} // Prevent navigation if disabled
    // >
    React.createElement("a", {
      href: appName ? `${baseUrl}/api/apps/${appName}/index.html#/${route}` // Use appName if provided
      : `#/${route}` // Directly use the route if appName is empty
      ,
      className: classNames(style.subItemLink, disabled && style.sideBarDisabledSubItem),
      onClick: e => disabled && e.preventDefault() // Prevent navigation if disabled
    }, /*#__PURE__*/React.createElement("li", {
      className: location.pathname.slice(1) === route ? style.sideBarSubItemContainerActive : style.sideBarSubItemContainer
    }, /*#__PURE__*/React.createElement("img", {
      src: sidebarIcon,
      alt: title
    }), /*#__PURE__*/React.createElement("span", {
      className: style.sideBarSubItemLabel
    }, title), showBadge && /*#__PURE__*/React.createElement("div", {
      className: style.badgeContainer
    }, /*#__PURE__*/React.createElement(Badge, {
      value: "10"
    })), /*#__PURE__*/React.createElement("div", {
      className: style.tooltipContainer
    }, title)))
  );
}