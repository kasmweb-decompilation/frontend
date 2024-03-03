import React,{ Component } from 'react';
import DataTable from "../../../../components/Table/Table";
import { Link } from 'react-router-dom'
import {withTranslation} from "react-i18next";

class DomainTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { t } = this.props;
        const columns = [
            {
                type: "text",
                accessor: "domain",
                name: t('dashboard.Domain'),
                filterable: true,
                sortable: true,
                cell: (data) => {
                    const state = {
                        level: "DEBUG",
                        site: data.value,
                        start_date: this.props.selectOpen ? this.props.start_date : null,
                        end_date: this.props.selectOpen ? this.props.end_date : null,
                        delta: this.props.delta,
                        optionsMode: "filter"
                    };

                    return (
                        <div>
                            <Link className={"tw-text-color"} to={{ pathname: "/logging", search: '?tab=filter', state }}>
                                {data.value}
                            </Link>
                        </div>
                    );
                },
            },
            {
                type: "text",
                accessor: "categories",
                name: t('dashboard.Categories'),
                filterable: true,
                sortable: true,
                cell: (data) => (
                    <div>
                        {Object.values(data.original.categories || {}).sort().join(", ")}
                    </div>
                ),
            },
            {
                type: "text",
                accessor: "allowed",
                name: t('dashboard.Requests Allowed'),
                filterable: true,
                sortable: true,
            },
            {
                type: "text",
                accessor: "denied",
                name: t('dashboard.Requests Denied'),
                filterable: true,
                sortable: true,
            },
        ];

        return (
            <div>
                <DataTable
                    id="domains"
                    data={this.props.domains.data || []}
                    columns={columns}
                />
            </div>
        );
    }
}

const DomainTableTranslated = withTranslation('common')(DomainTable)
export default DomainTableTranslated;