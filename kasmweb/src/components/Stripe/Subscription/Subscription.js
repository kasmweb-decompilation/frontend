import React, { Component } from "react";
import Proptypes from "prop-types";
import { Badge } from "reactstrap";
import {withTranslation} from "react-i18next";

class StripeSubscription extends Component {
    componentDidMount() {
    }

    render() {
        const { subSummary, t } = this.props
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            // These options are needed to round to whole numbers if that's what you want.
            //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
            //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
        })
        const price = formatter.format(subSummary.plans[0].amount / 100)
        const status = (summary) => {
            if (summary.status === 'active') {
                if (summary.pending_cancel) {
                    return <Badge className="tw-text-white" color="secondary" pill>{t("stripe.Cancelled")}</Badge>
                }
                return <Badge className="tw-text-white" color="success" pill>{t("stripe.Active")}</Badge>
            }
            return <Badge className="tw-capitalize tw-text-white" color="danger" pill>{summary.status}</Badge>
        }
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(subSummary.start_date * 1000).toLocaleDateString('en-US', options);
        const cancel_date = new Date(subSummary.period_end_date).toLocaleDateString('en-US', options);
        return (
            <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-w-full">
                <div className="tw-flex tw-flex-col">
                    <div className="tw-mb-2 tw-flex tw-gap-2">
                        {status(subSummary)}
                        {subSummary.status === 'active' && subSummary.pending_cancel &&
                            <div className="text-muted tw-text-xs">{t("stripe.cancel_date", { cancel_date })}</div>
                        }
                    </div>
                    <div className="tw-font-bold">{subSummary.plans[0].name}</div>
                    <div className="tw-mb-2">{subSummary.plans[0].description}</div>
                    <div className="text-muted tw-text-xs">{t("stripe.start_date", { date })}</div>

                </div>
                <div className="tw-flex tw-flex-col tw-items-center tw-justify-center">
                    <div className="tw-flex tw-flex-col tw-font-bold">{price} / {subSummary.plans[0].recurring}</div>
                </div>
            </div>
        );
    }
}


StripeSubscription.propTypes = {
    subSummary: Proptypes.object.isRequired,
};
const StripeSubscriptionTranslated = withTranslation('common')(StripeSubscription)
export default StripeSubscriptionTranslated