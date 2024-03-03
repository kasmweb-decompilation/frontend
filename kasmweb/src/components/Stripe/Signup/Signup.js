import React, {Component} from "react";
import Proptypes from "prop-types";

class StripeSignup extends Component {
    componentDidMount() {
        (function () {
            var s = document.createElement("script")
            s.src = 'https://js.stripe.com/v3/pricing-table.js';
            s.async = true
            s.type = "text/javascript"
            var x = document.getElementsByTagName("script")[0]
            x.parentNode.insertBefore(s, x)
        })();

    }

    render() {
        const { email, user_id, pricingTable, publishableKey } = this.props
        return (
            <stripe-pricing-table pricing-table-id={pricingTable}
            publishable-key={publishableKey}
            customer-email={email}
            client-reference-id={user_id}>
            </stripe-pricing-table>
        );
    }
}


StripeSignup.propTypes = {
    email: Proptypes.string.isRequired,
};

export default StripeSignup