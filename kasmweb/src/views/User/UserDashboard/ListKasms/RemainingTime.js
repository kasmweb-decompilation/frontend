import React, { useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import {
  getDockedSessions,
} from "../../../../actions/actionDashboard";
import {useTranslation} from "react-i18next";

function RemainingTime(props) {
    const { t } = useTranslation('common');
    let current = props.current_time
    let expiration = moment.utc(props.expiration_date)
  
    if (expiration < current) {
      return <div className={props.className}>{t('workspaces.Expired')}</div>
    }
  
    if (expiration.diff(current, 'seconds') < 60) {
      return <div className={props.className}>{moment.utc(expiration.diff(current, 'hh mm ss')).format('ss[s]')}</div>
    }
  
    if (expiration.diff(current, 'minutes') < 60) {
      return <div className={props.className}>{moment.utc(expiration.diff(current, 'hh mm ss')).format('mm[m]')}</div>
    }
  
    const hasDays = expiration.diff(current, 'days')
    return (
      <div className={props.className}>
        {expiration
          .diff(current, 'days')
          ? expiration.diff(current, 'days') + 'd '
          : ""}
        {expiration
          .diff(current, 'hours')
          ? moment.utc(expiration.diff(moment.utc(current), 'hh:mm:ss')).format('HH[h] ')
          : ""}
        {hasDays <= 0 && moment.utc(expiration.diff(current, 'hh:mm:ss')).format("mm[m]")}
      </div>
    )
  }

  
  export default connect(
    (state) => ({
    }),
    (dispatch) => ({
      getDockedSessions: (data) => dispatch(getDockedSessions(data)),
    })
  )(RemainingTime);