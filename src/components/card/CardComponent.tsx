/* eslint-disable react/prop-types */
import { Box, Card } from "@dhis2/ui";
import React from "react";
import style from "./card.module.css";
import { Divider, IconButton, Tooltip } from "@mui/material";
import { Add, InfoOutlined, Menu } from "@mui/icons-material";

interface CardProps {
  icon: string
  title: string
  value: number
  program: string
  addLink: string
  listLink: string
}

export default function DashboardCard(props: CardProps): React.ReactElement {
  const { icon, title, value, program, addLink, listLink } = props;

  return (
    <Box height="245px" width="206px">
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
            <IconButton size="small" className={style.cardInfoIcon}>
              <InfoOutlined fontSize="small"/>
            </IconButton>
          </div>
        </div>
        <Divider />
        <div className={style.cardActions}>
          <Tooltip title={`Adicionar ${title}`}>
            <IconButton size="small">
              <Add />
            </IconButton>
          </Tooltip>
          &nbsp;
          <Tooltip title={`Listar ${title}`}>
            <IconButton size="small">
              <Menu />
            </IconButton>
          </Tooltip>
        </div>
      </Card>
    </Box>
  );
}
