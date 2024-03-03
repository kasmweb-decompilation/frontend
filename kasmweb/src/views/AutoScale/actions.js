import { NotificationManager } from "react-notifications";
import {withTranslation} from "react-i18next";
import i18n from '../../i18n';
import { hasAuth } from "../../utils/axios";

export async function handleSaveSuccess() {
    const { saveAutoScaleError, savedAutoScale } = this.props;
    const { t } = i18n
    if (saveAutoScaleError) {
        NotificationManager.error(saveAutoScaleError, t("common:autoscale.Save AutoScale Config"), 3000);
    }
    else {
        NotificationManager.success(t("common:autoscale.Successfully Saved AutoScale Config"), t("common:autoscale.Save AutoScale Config"));
        if (this.state.page === 0) {
            this.nextPage()
        }
    }
}

export function handleSaveError() {
    const { saveAutoScaleError } = this.props;
    const { t } = i18n
    if (saveAutoScaleError) {
        NotificationManager.error(saveAutoScaleError, t("common:autoscale.Save AutoScale Config"), 3000);
    } else
        NotificationManager.error(t("common:autoscale.Save AutoScale Config Failed"), t("common:autoscale.Save AutoScale Config"), 3000);
}


export async function submitApi(type) {
    if (type === 'autoscale') {
        await this.addAutoscale()
    }

    if (type === 'dns') {
        const addDns = await this.addDns()
        if (addDns !== null) {
            let details = this.props.savedAutoScale
            this.updateAutoScale({
                ...details,
                dns_provider_config_id: addDns
            })
        }
        
    }
    if (type === 'vm') {
        const addVm = await this.addVm()
        if (addVm !== null) {
            let details = this.props.savedAutoScale
            this.updateAutoScale({
                ...details,
                vm_provider_config_id: addVm
            })
        }

    }

}

export async function updateAutoScale(details) {
    try {
        const config = await this.props.updateAutoScaleConfig(details)
        this.handleSaveSuccess()
        return config.response.autoscale_config
    } catch (e) {
        this.handleSaveError()
    }
}

export function nextPage() {
    const steps = this.steps(this.state.registerDns)
    const next = this.state.page + 1
    if (next >= steps.length) {
        return this.finalDestination()
    }

    this.setState({ page: this.state.page + 1 })

}

export function finalDestination() {
    if (this.state.pool) {
        this.props.history.push("/update_server_pool/" + this.state.pool+'?tab=autoscale');
    } else {
        this.props.history.push("/autoscale");
    }
}

export function previousPage() {
    this.setState({ page: this.state.page - 1 })
}


export async function addDns(update = false) {
    const { t } = i18n;
    if (!this.props.dnsForm) {
        NotificationManager.error(t("common:autoscale.Please select a provider or create a new one"), t("common:autoscale.DNS Provider Details"), 3000);
        return null
    }

    let dnsprovider = {
        dns_provider_config_id: null
    }
    if ('dns_provider_config_id' in this.props.dnsForm && this.props.dnsDirty === false && this.props.dnsForm.dns_provider_config_id) {
        this.setState({ dns_provider_config: this.props.dnsForm })
        this.nextPage()
        return this.props.dnsForm.dns_provider_config_id
    }
    if ('dns_provider_config_id' in this.props.dnsForm && this.props.dnsDirty === true && this.props.dnsForm.dns_provider_config_id) {
        update = true
    }
    try {
        let details = {
            ...this.props.dnsValues,
            dns_provider_name: this.props.dnsForm.dns_provider_name
        }

        if (update === false) {
            await this.props.createDnsProviderConfig(details)
            this.setState({ dns_provider_config: dnsprovider })
        } else {
            details.dns_provider_config_id = this.props.dnsForm.dns_provider_config_id
            await this.props.updateDnsProviderConfig(details)
            this.setState({ dns_provider_config: dnsprovider })
        }
        dnsprovider = this.props.savedDnsProvider

        const savesuccess = this.dnsSaveSuccess()
        if (savesuccess === null) return null

    } catch (e) {
        this.dnsSaveError()
        return null
    }
    return dnsprovider.dns_provider_config_id
}

export async function addVm(update = false) {
    const { t } = i18n;
    if (!this.props.providerForm) {
        NotificationManager.error(t("common:autoscale.Please select a provider or create a new one"), t("common:autoscale.VM Provider Details"), 3000);
        return null
    }
    let vmprovider = {
        vm_provider_config_id: null
    }
    if ('vm_provider_config_id' in this.props.providerForm && this.props.providerDirty === false && this.props.providerForm.vm_provider_config_id) {
        this.setState({ vm_provider_config: this.props.providerForm })
        this.nextPage()
        return this.props.providerForm.vm_provider_config_id
    }
    if ('vm_provider_config_id' in this.props.providerForm && this.props.providerDirty === true && this.props.providerForm.vm_provider_config_id) {
        update = true
    }
    try {
        let details = {
            ...this.props.providerValues,
            vm_provider_name: this.props.providerForm.vm_provider_name
        }
        if (update === false) {
            await this.props.createVmProviderConfig(details)
            this.setState({ vm_provider_config: vmprovider })
        } else {
            details.vm_provider_config_id = this.props.providerForm.vm_provider_config_id
            await this.props.updateVmProviderConfig(details)
            this.setState({ vm_provider_config: vmprovider })
        }
        vmprovider = this.props.savedVmProvider

        const savesuccess = this.vmSaveSuccess()
        if (savesuccess === null) return null
    } catch (e) {
        this.vmSaveError()
        return null
    }
    return vmprovider.vm_provider_config_id
}

export function steps(dns) {
    let steps = [
        {
            index: 1,
            description: 'AutoScale Details'
        },
    ]
    if (hasAuth('vm_providers')) {
        steps.push({
            index: 2,
            description: 'VM Provider Details'
        })
    }

    if (dns && hasAuth('dns_providers')) {
        steps.push({
            index: 3,
            description: 'DNS Provider Details'
        })
    }
    return steps
}

export async function addAutoscale() {
    let details = this.props.autoscaleValues
    let config_details = null;
    if (this.props.match.params.id) {
        config_details = this.props.autoscale_configs.find(autoscale => autoscale.autoscale_config_id === this.props.match.params.id)
    }
    if(config_details === null && this.props.savedAutoScale) {
        config_details = this.props.savedAutoScale
    }
    if (config_details !== null) {
        let newdetails = {
            ...config_details,
            ...details
        }
        const updateautoscale = await this.updateAutoScale(newdetails)
        this.setState({ autoscale_config: updateautoscale })
        return
    }
    try {
        await this.props.createAutoScaleConfig(details)
        this.handleSaveSuccess()
    } catch (e) {
        this.handleSaveError()
    }
}

