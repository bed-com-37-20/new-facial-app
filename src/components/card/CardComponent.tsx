/* eslint-disable react/prop-types */
import { useConfig } from "@dhis2/app-runtime";
import { Box, Card } from "@dhis2/ui";
import React from "react";
import style from "./card.module.css";
import { Divider, IconButton, Tooltip } from "@material-ui/core";
import { Add, InfoOutlined, Menu } from "@material-ui/icons";
import { NavLink } from "react-router-dom";
import classNames from "classnames";

interface CardProps {
  icon: string
  title: string
  leftLabel: string
  value: string
  program: string
  formLink: string
  listLink: string
  disabled?: boolean
  appName: string
}

export default function DashboardCard(props: CardProps): React.ReactElement {
  const { baseUrl } = useConfig();
  const { icon, title, listLink, formLink, disabled, appName } = props;

  return (
    <Box width="180px">
      <Card
        className={classNames(
          style.cardContainer,
          disabled === true && style.disabledCard
        )}
      >
        <div className={style.cardHeader}>
          <img src={icon} />
        </div>
        <Divider />
        <div className={style.cardStatistics}>
          <strong className={style.cardTitle}>{title}</strong>
        </div>
        <Divider />
        <div className={style.cardActions}>
          <a
            href={`${baseUrl}/api/apps/${appName}/index.html#/${formLink}`}
            className={disabled === true && style.disabledLink}
          >
            <Tooltip title={`Add ${title}`}>
              <IconButton size="small" disabled={disabled}>
                <Add />
              </IconButton>
            </Tooltip>
          </a>
          &nbsp;
          <a
            href={`${baseUrl}/api/apps/${appName}/index.html#/${listLink}`}
            className={disabled === true && style.disabledLink}
          >
            <Tooltip title={`List ${title}`}>
              <IconButton size="small" disabled={disabled}>
                <Menu />
              </IconButton>
            </Tooltip>
          </a>
        </div>
      </Card>
    </Box>
  );
}
