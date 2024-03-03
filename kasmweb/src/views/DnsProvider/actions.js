import { NotificationManager } from "react-notifications";
import i18n from '../../i18n';

export function handleSaveSuccess() {
    const { saveDnsProviderError, savedDnsProvider } = this.props;
    const { t } = i18n
    if (saveDnsProviderError) {
        NotificationManager.error(saveDnsProviderError, t('common:providers.save-dns-provider-config'), 3000);
    }
    else {
        NotificationManager.success(t('common:providers.dns-provider-config-saved'), t('common:providers.successfully-saved-dns-provide'));
        if (this.props.inline || this.props.wizard || this.state.wizard) {
            this.setState({ dns_provider_config: savedDnsProvider })
            this.nextPage() 
        } else {
            this.props.history.push("/dns_provider");
        }
    }
}

export function handleSaveError() {
    const { saveDnsProviderError } = this.props;
    const { t } = i18n
    if (saveDnsProviderError) {
        NotificationManager.error(saveDnsProviderError, t('common:providers.save-dns-provider-config'), 3000);
    } else
        NotificationManager.error(t('common:providers.save-dns-provider-config-faile'), t('common:providers.save-dns-provider-config'), 3000);
}
