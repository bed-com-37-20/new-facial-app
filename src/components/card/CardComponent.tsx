/* eslint-disable react/prop-types */
import { useConfig } from "@dhis2/app-runtime";
import { Box, Card } from "@dhis2/ui";
import React from "react";
import style from "./Card.module.css";
import { Divider, IconButton, Tooltip } from "@material-ui/core";
import { Add, Menu } from "@material-ui/icons";
import classNames from "classnames";
import { CardSubItemProps } from "../../types/common/components";



export default function DashboardCard(props: CardSubItemProps): React.ReactElement {
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
