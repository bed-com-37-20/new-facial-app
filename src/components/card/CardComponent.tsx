/* eslint-disable react/prop-types */
import { Box, Card } from "@dhis2/ui";
import React from "react";
import style from "./card.module.css";
import { Divider, IconButton, Tooltip } from "@mui/material";
import { Add, InfoOutlined, Menu } from "@mui/icons-material";
import { Link } from "react-router-dom";

interface CardProps {
  icon: string
  title: string
  value: number
  program: string
  formLink: string
  listLink: string
}

export default function DashboardCard(props: CardProps): React.ReactElement {
  const { icon, title, value, program, formLink, listLink } = props;

  return (
    <Box height="245px" width="200px">
      <Card className={style.cardContainer}>
        <div className={style.cardHeader}>
          <img src={icon} />
        </div>
        <div className={style.cardTitle}>{title}</div>
        <Divider />
        <div className={style.cardStatistics}>
          <strong className={style.cardTotalLabel}>Total</strong>
          <div className={style.cardStatisticsTotal}>
            <span className={style.cardStatisticsTotalValue}>{value}</span>
            <Tooltip title={`Info`}>
              <IconButton size="small" className={style.cardInfoIcon}>
                <InfoOutlined fontSize="small"/>
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <Divider />
        <div className={style.cardActions}>
          <Tooltip title={`Add ${title}`}>
            <IconButton size="small">
              <Add />
            </IconButton>
          </Tooltip>
          &nbsp;
          <Tooltip title={`List ${title}`}>
            <Link to={listLink}>
              <IconButton size="small">
                <Menu />
              </IconButton>
            </Link>
          </Tooltip>
        </div>
      </Card>
    </Box>
  );
}
