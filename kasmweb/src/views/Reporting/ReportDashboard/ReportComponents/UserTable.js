import React,{ Component } from 'react';
import DataTable from "../../../../components/Table/Table";
import { Link } from 'react-router-dom'
import {withTranslation} from "react-i18next";

class UserTable extends Component {
    constructor(props) {
        super(props);
    }

    formatSeconds(secs) {
        if (secs < 60) {
            return <div  className='text-muted-more tw-flex tw-justify-center tw-font-normal'><div className="tw-text-color tw-font-semibold">{secs}</div>sec</div>
        } else if (secs < 3600) {
            let minutes = Math.floor(secs / 60);
            let seconds = secs % 60;
            return <div className='text-muted-more tw-flex tw-justify-center tw-font-normal'><div className="tw-text-color tw-font-semibold">{minutes}</div>min <div className="tw-ml-1 tw-text-color tw-font-semibold">{seconds}</div>secs</div>
        } else {
            let hour = Math.floor(secs / 3600);
            secs = secs - hour * 3600;
            let minutes = Math.floor(secs / 60);
            let seconds = secs % 60;
            return <div className='text-muted-more tw-flex tw-justify-center tw-font-normal'><div className="tw-text-color tw-font-semibold">{hour}</div>hr <div className="tw-ml-1 tw-text-color tw-font-semibold">{minutes}</div>min <div className="tw-ml-1 tw-text-color tw-font-semibold">{seconds}</div>secs</div>
        }
    }

    render() {
      const { t } = this.props;
        const columns = [
          {
            type: "text",
            accessor: "name",
            name: "User",
            filterable: true,
            sortable: true,
            cell: (data) => {
                const state = {
                  level: "INFO",
                  username: data.value,
                  start_date: this.props.selectOpen ? this.props.start_date : null,
                  end_date: this.props.selectOpen ? this.props.end_date : null,
                  delta: this.props.delta,
                };
                
                return (
                    <div>
                        <Link className={"tw-text-color"} to={{ pathname: "/logging", state }}>
                            {data.value}
                        </Link>
                    </div>
                );
            },
          },
          {
            accessor: "kasm_length",
            name: t('dashboard.Total Session Usage'),
            filterable: false,
            sortable: true,
            cell: (data) => <div>{this.formatSeconds(Math.round(data.value))}</div>
          },
          {
            accessor: "avg_kasm_length",
            name: t('dashboard.Average Session Usage'),
            filterable: false,
            sortable: true,
            cell: (data) => <div>{this.formatSeconds(Math.round(data.value))}</div>
          },
          {
            accessor: "shortest_session",
            name: t('dashboard.Shortest Session'),
            filterable: false,
            sortable: true,
            cell: (data) => <div>{this.formatSeconds(Math.round(data.value))}</div>
          },
          {
            accessor: "longest_session",
            name: t('dashboard.Longest Session'),
            filterable: false,
            sortable: true,
            cell: (data) => <div>{this.formatSeconds(Math.round(data.value))}</div>
          },
        ];

        return (
            <div>
                <DataTable
                    id="user"
                    data={this.props.users.data || []}
                    columns={columns}
                />
            </div>
        );
    }
}
const UserTableTranslated = withTranslation('common')(UserTable)
export default UserTableTranslated;