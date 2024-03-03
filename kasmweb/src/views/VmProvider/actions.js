import { NotificationManager } from "react-notifications";
import i18n from '../../i18n';

export function handleSaveSuccess() {
    const { saveVmProviderError, savedVmProvider } = this.props;
    const { t } = i18n
    if (saveVmProviderError) {
        NotificationManager.error(saveVmProviderError, t('common:providers.save-vm-provider-config'), 3000);
        return null
    }
    else {
        NotificationManager.success(t('common:providers.vm-provider-config-saved'), t('common:providers.successfully-saved-vm-provider'));
        if (this.props.inline || this.props.wizard || this.state.wizard) {
            this.setState({ vm_provider_config: savedVmProvider })
            this.nextPage() 
        } else {
            this.props.history.push("/vm_provider");
        }
    }
}

export function handleSaveError() {
    const { saveVmProviderError } = this.props;
    const { t } = i18n
    if (saveVmProviderError) {
        NotificationManager.error(saveVmProviderError, t('common:providers.save-vm-provider-config'), 3000);
    } else
        NotificationManager.error(t('common:providers.save-vm-provider-config-failed'), t('common:providers.save-vm-provider-config'), 3000);
}
