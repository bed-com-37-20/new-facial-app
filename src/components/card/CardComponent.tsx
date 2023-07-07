/* eslint-disable react/prop-types */
import { Box, Card } from "@dhis2/ui";
import React from "react";
import style from "./card.module.css";
import { Divider, IconButton, Tooltip } from "@mui/material";
import { Add, Menu } from "@mui/icons-material";

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
    <Box height="265px" width="206px">
      <Card className={style.cardContainer}>
        <div className={style.cardHeader}>
          <img src={icon} />
        </div>
        <Divider />
        <div className={style.cardTitle}>{title}</div>
        <Divider />
        <div className={style.cardStatistics}>
          <div className={style.cardStatisticsHoje}>
            <span className={style.cardStatisticsHojeValue}>{value}</span>
            <span>Total</span>
          </div>
          <div className={style.cardStatisticsTotal}>
            <span className={style.cardStatisticsTotalValue}>{value}</span>
            <span>Total</span>
          </div>
        </div>
        <Divider />
        <div className={style.cardActions}>
          <Tooltip title={`Adicionar ${title}`}>
            <IconButton size="small" aria-label="delete">
              <Add />
            </IconButton>
          </Tooltip>
          &nbsp;
          <Tooltip title={`Listar ${title}`}>
            <IconButton size="small" aria-label="delete">
              <Menu />
            </IconButton>
          </Tooltip>
        </div>
      </Card>
    </Box>
  );
}
