import React, { useState, useEffect, useRef } from "react";
import { getSystemInfo} from "../../actions/actionSystemInfo";
import { useDispatch, useSelector } from 'react-redux'
import { createImage, updateImages, getRegistries, editWorkspace, createRegistry, deleteRegistry, updateRegistry, registryAutoUpdate } from "../../actions/actionImage";
import { getServers } from "../../actions/actionServer";
import { Row, Col, UncontrolledTooltip } from "reactstrap";
import { search, selectCategory, getUserImages } from "../../actions/actionDashboard";
import { NotificationManager } from "react-notifications";
import _ from "lodash";
import { Link } from "react-router-dom";
import verified from "../../../public/img/verified.svg";
import workspaceGif from "../../../public/img/workspaces-registry.gif";
import { bytesToSize, cyrb53 } from "../../utils/helpers"
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {Trans, useTranslation} from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faContainerStorage } from '@fortawesome/pro-light-svg-icons/faContainerStorage';
import { faShieldExclamation } from '@fortawesome/pro-light-svg-icons/faShieldExclamation';
import { faTrash } from '@fortawesome/pro-light-svg-icons/faTrash';
import PageHeader from "../../components/Header/PageHeader";
import { TabList, notifyFailure } from "../../components/Form/Form";
import { ConfirmAction } from "../../components/Table/NewTable";
import { Modal, ModalFooter } from "../../components/Form/Modal"
import { faClose } from "@fortawesome/pro-light-svg-icons/faClose";
import { faEllipsisH } from "@fortawesome/pro-light-svg-icons/faEllipsisH";
import { faInfoCircle } from "@fortawesome/pro-light-svg-icons/faInfoCircle";
import { faLifeRing } from "@fortawesome/pro-light-svg-icons/faLifeRing";
import { faSpinner } from "@fortawesome/pro-light-svg-icons/faSpinner";
import { faTimes } from "@fortawesome/pro-light-svg-icons/faTimes";

function checkWorkspace(workspace) {
  let items = []
  items = [
    ...checkRunConfig(workspace),
    ...checkExecConfig(workspace),
    ...checkVolumeMappings(workspace),
  ]
  if (items.length > 0) {
    return items
  }
  return false
}

function checkRunConfig(workspace) {
  let items = []
  if (workspace.run_config) {
    
    for (const property in workspace.run_config) {
      switch(property) {
        case 'user':
          if (workspace.run_config[property] === 1000) {
            continue
          }
          items.push({
            section: <Trans i18nKey="workspaces.docker-run-config-override-jso" ns="common" />,
            item: 'run_config.' + property,
            type: 'user_error'
          }) // Any user except 1000 should return true
        case 'entrypoint':
        case 'hostname':
        case 'environment':
          continue
        case 'privileged':
          items.push({
            section: <Trans i18nKey="workspaces.docker-run-config-override-jso" ns="common" />,
            item: 'run_config.' + property,
            type: 'privileged'
          })
          break;
        default:
          items.push({
            section: <Trans i18nKey="workspaces.docker-run-config-override-jso" ns="common" />,
            item: 'run_config.' + property,
            type: 'flag_property'
          })
      }
    }
  }
  return items
}

function checkExecConfig(workspace) {
  let items = []
  if (workspace.exec_config) {
    for (const property in workspace.exec_config) {
      switch(property) {
        case 'first_launch':
        case 'go':
        case 'assign':
          for (const subProperty in workspace.exec_config[property]) {
            if(subProperty === 'user') {
              if (workspace.exec_config[property][subProperty] === 1000) {
                continue
              }
              items.push({
                section: <Trans i18nKey="workspaces.docker-exec-config-json" ns="common" />,
                item: 'exec_config.' + property + '.' + subProperty,
                type: 'user_error'
              })
            }
            
            if(subProperty === 'privileged' && workspace.exec_config[property][subProperty] === true) {
              items.push({
                section: <Trans i18nKey="workspaces.docker-exec-config-json" ns="common" />,
                item: 'exec_config.' + property + '.' + subProperty,
                type: 'privileged_container'
              })
            }
            if (subProperty === 'cmd') {
              continue
            }
            items.push({
              section: <Trans i18nKey="workspaces.docker-exec-config-json" ns="common" />,
              item: 'exec_config.' + property + '.' + subProperty,
              type: 'flag_property'
            })
          }
          break;
        case 'environment':
          continue
        default:
          items.push({
            section: <Trans i18nKey="workspaces.docker-exec-config-json" ns="common" />,
            item: 'exec_config.' + property,
            type: 'flag_property'
          })
      }
    }
  }
  return items
}

function checkVolumeMappings(workspace) {
  let items = []
  if (workspace.volume_mappings) {
    items.push({
      section: <Trans i18nKey="workspaces.volume-mappings-json" ns="common" />,
      item: 'volume_mappings',
      type: 'flag_property'
    })
  }
  return items
}

function checkForWarnings(workspaces) {
  let allWorkspaces = []
  workspaces.forEach(workspace => {
    workspace.checkRequired = checkWorkspace(workspace)
    allWorkspaces = [
      ...allWorkspaces,
      workspace
    ]
  })
  return allWorkspaces
}

export function completeWorkspacesList(registries = [], version) {


  if (registries.length <= 0) {
    return {
      stores: [],
      allWorkspaces: []
    }
  }

  let stores = []
  let allWorkspaces = []

  registries.sort((a, b) => (a.is_verified === b.is_verified) ? 0 : a.is_verified ? -1 : 1)
  registries.forEach(store => {
    stores.push(store)
    const { base_url, img_url } = storeUrls(store, store.is_verified)
    let storeWorkspaces = store.workspaces.map(workspace => ({ ...workspace, store: store.registry_id, image_type: 'Container', enabled: true, official: store.is_verified, image_src: img_url + workspace.image_src, author: store.config.name, memory: store.memory ? (store.memory * 1000000) : (2768 * 1000000) }))
    version = (version && version.split('.', 2).join('.') + '.x') || '0.0.x'
    storeWorkspaces = storeWorkspaces.filter(x => x.compatibility && (x.compatibility.indexOf(version) !== -1 || version === '0.0.x'))
    allWorkspaces = [
      ...allWorkspaces,
      ...storeWorkspaces
    ]
  })
  allWorkspaces.sort((a, b) => a.friendly_name.localeCompare(b.friendly_name))
  return {
    stores,
    allWorkspaces
  }
}

export function Registry(props) {
  const dispatch = useDispatch()
  const [workspaceStores, setWorkspaceStores] = useState([]);
  const [allWorkspaces, setAllWorkspaces] = useState([]);
  const [availableWorkspaces, setAvailableWorkspaces] = useState([]);
  const [installedWorkspaces, setInstalledWorkspaces] = useState([]);
  const [serverStats, setServerStats] = useState({});
  const [selectedRegistry, setSelectedRegistry] = useState(false);
  const [currentTab, setCurrentTab] = useState('workspaces');
  const [addStoreInput, setAddStoreInput] = useState(false);
  const [addWorking, setAddWorking] = useState(false);
  const [updateWorking, setUpdateWorking] = useState(false);
  const [thirdPartyModal, setThirdPartyModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteStore, setDeleteStore] = useState(null);
  const [registryModal, setRegistryModal] = useState(false);
  const [storesUpdated, setStoresUpdated] = useState(false);
  const refAddStore = useRef('')

  const userImages = useSelector(state => state.dashboard.availableKasms)
  const registries = useSelector(state => state.images.registries)
  const architectures = useSelector(state => state.images.architectures)
  const addedRegistry = useSelector(state => state.images.registry)
  const registryError = useSelector(state => state.images.registryError) || null
  const systemInfo = useSelector(state => state.system_info) || {}
  const servers = useSelector(state => state.servers.servers) || []

  const searchText = useSelector(state => state.dashboard.search) || ''
  const selectedCategory = useSelector(state => state.dashboard.selectedCategory) || null

  const { t } = useTranslation('common');

  useEffect(() => {
    async function fetchData() {
      if (_.isEmpty(systemInfo)) {
        await dispatch(getSystemInfo())
      }
      dispatch(getRegistries())
      getImages()
      dispatch(search(''))
      dispatch(selectCategory(null))
      dispatch(getServers())
    }
    fetchData();
  }, []);

  useEffect(() => {
    getData()
    setAddWorking(false)
  }, [registries]);

  useEffect(() => {
    if(registries && registries.length > 0 && storesUpdated === false) {
      registries.map(store => {
        if (store.do_auto_update) {
          updateStore(store)
        }
      })
      setStoresUpdated(true)
    }
  }, [registries]);

  useEffect(() => {
    const agents = servers.filter((server) => server.server_type === 'host' && !_.isEmpty(server.disk_stats))
    if (agents.length > 0) {
      setServerStats({
        combinedFree: agents.reduce((total, server) => total + server.disk_stats.free, 0),
        combinedUsed: agents.reduce((total, server) => total + server.disk_stats.used, 0),
        combinedTotal: agents.reduce((total, server) => total + server.disk_stats.total, 0),
      })
    }
  }, [servers]);



  useEffect(() => {
    generateInstalledWorkspacesList()
    generateAvailableWorkspacesList()
  }, [userImages, workspaceStores, searchText, selectedCategory, allWorkspaces]);

  useEffect(() => {
    if (registryError !== null) {
      NotificationManager.error(
        registryError,
        t('workspaces.registry-error'),
        3000
      );
    }
  }, [registryError]);

  async function getData() {
    let version = _.get(systemInfo, 'system_info.api.build_id', null)
    if (version) {
      const { stores, allWorkspaces } = completeWorkspacesList(registries, version)
      setWorkspaceStores(stores)
      setAllWorkspaces(allWorkspaces)
    }
  }

  const cancelThirdPartyModal = () => {
    setThirdPartyModal(!thirdPartyModal)
    deleteStoreGo(addedRegistry)
  }
  const cancelDeleteModal = () => {
    setDeleteModal(!deleteModal)
  }
  
  const addThirdParty = () => {
    setThirdPartyModal(false)
    dispatch(getRegistries({ update: true }))
  }

  const cancelRegistryModal = () => {
    setRegistryModal(!registryModal)
  }

  const generateInstalledWorkspacesList = () => {
    if (userImages && allWorkspaces) {

      const workspaces = []
      userImages.forEach(image => {
        if (allWorkspaces) {
          const details = allWorkspaces.find(workspace => workspace.name === image.name)
          if (details) {
            image = {
              ...image,
              author: details.author,
              official: details.official || false,
              store: details.store,
              sha: details.sha,
              uncompressed_size_mb: details.uncompressed_size_mb
            }
          } else {
            image = {
              ...image,
              author: t('workspaces.manual'),
              sha: image.id,
            }
          }
        }
        if (image.image_type === 'Container') {
          workspaces.push(image)
        }

      })

      const enabledKasms = workspaces.filter(k => k.enabled === true).sort(function (a, b) {
        return a.friendly_name.localeCompare(b.friendly_name);
      })

      const disabledKasms = workspaces.filter(k => k.enabled === false).sort(function (a, b) {
        return a.friendly_name.localeCompare(b.friendly_name);
      })
      setInstalledWorkspaces([
        ...enabledKasms,
        ...disabledKasms
      ])
    }
  }

  const generateAvailableWorkspacesList = () => {
    if (userImages) {
      const workspaces = [
        ...allWorkspaces
      ]
      let available = []

      // This section removes items that are already installed
      userImages.forEach(image => {
        if (workspaces) {
          const index = workspaces.findIndex(workspace => workspace.name === image.name)
          if (index >= 0) {
            const details = workspaces.splice(index, 1)
            image = {
              ...image,
              author: details.author,
              official: details.official || false,
              store: details.store,
              sha: details.sha,
            }
          }
        }

      })

      available = available.concat(workspaces)
      available = checkForWarnings(available)
      available = available.sort((a, b) => a.friendly_name.localeCompare(b.friendly_name))

      const lowerSearch = searchText.toLowerCase();
      if (searchText !== "") {
        available = available.filter((i) => {
          const category = i.categories && i.categories.filter((i) =>
            i.toLowerCase().includes(lowerSearch)
          );
          return (
            i.friendly_name.toLowerCase().includes(lowerSearch) ||
            (category && category.length > 0)
          );
        });
      }

      if (selectedCategory !== null && selectedCategory.id !== 'all') {
        available = available.filter((kasm) => {
          return kasm.categories && kasm.categories.includes(selectedCategory.label);
        });
      }
  


      const has_arch = available.filter(workspace => workspace.architecture.some(value => architectures.indexOf(value) !== -1))
      const doesnt_have_arch = available.filter(workspace => !workspace.architecture.some(value => architectures.indexOf(value) !== -1))

      setAvailableWorkspaces([
        ...has_arch,
        ...doesnt_have_arch
      ])
    }
  }

  const getImages = () => {
      try {
        dispatch(getUserImages())
      } catch (e) {
        console.log(e)
      }
  }

  const deleteStoreConfirm = async () => {
    deleteStoreGo(deleteStore)
  }

  const deleteStoreGo = async (store) => {
    try {
      await dispatch(deleteRegistry(store.registry_id))
      dispatch(getRegistries({ update: true }))
      setDeleteModal(false)
      setDeleteStore(null)
    } catch (e) {
      NotificationManager.error(
        t('workspaces.store-could-not-be-deleted'),
        t('workspaces.error-deleting-store'),
        3000
      );
    }
  }

  const updateStore = async (store) => {
    try {
      setUpdateWorking(store.registry_id)
      await dispatch(updateRegistry(store.registry_id))
      setUpdateWorking(false)
      dispatch(getRegistries({ update: true }))
      NotificationManager.success(
        t('workspaces.was-successfully-updated', { store: store.config.name }),
        t('workspaces.successfully-updated-store'),
        3000
      );

    } catch (e) {
      NotificationManager.error(
        t('workspaces.could-not-be-updated', { store: store.config.name }),
        t('workspaces.error-updating-store'),
        3000
      );
    }
  }

  const addOfficial = async () => {
    setAddWorking(true)
    try {
      await dispatch(createRegistry('https://registry.kasmweb.com/'))
      dispatch(getRegistries({ update: true }))
    } catch(error) {
      notifyFailure({ error, type: 'update' })
      setAddWorking(false)
    }
  }

  const filter = (registry) => {
    let version = _.get(systemInfo, 'system_info.api.build_id', null)
    let registries = []
    registries.push(registry)
    setSelectedRegistry(registry.registry_id)
    const { allWorkspaces } = completeWorkspacesList(registries, version)
    setAllWorkspaces(allWorkspaces)
  }

  const hasFilters = () => {

    if (searchText !== '') {
      return true
    }
    if (selectedCategory !== null) {
      return true
    }
    return false
  }

  const clearFilters = () => {
    let version = _.get(systemInfo, 'system_info.api.build_id', null)
    dispatch(search(''))
    dispatch(selectCategory(null))
    const { allWorkspaces } = completeWorkspacesList(registries, version)
    setAllWorkspaces(allWorkspaces)
  }

  const clearFilterRegistries = () => {
    let version = _.get(systemInfo, 'system_info.api.build_id', null)
    setSelectedRegistry(false)
    const { allWorkspaces } = completeWorkspacesList(registries, version)
    setAllWorkspaces(allWorkspaces)
  }


  const addStore = async () => {
    setAddWorking(true)
    try {
      const create = await dispatch(createRegistry(refAddStore.current.value))
      setAddWorking(false)
      if (create.response && create.response.registry) {
        const { is_verified } = create.response.registry
        if (!is_verified) {
          setThirdPartyModal(true)
        } else {
          dispatch(getRegistries({ update: true }))
        }
        refAddStore.current.value = ''
      }
    } catch (error) {
      notifyFailure({ error, type: 'update' })
      setAddWorking(false)
    }
  }

  let tabList = []
  tabList.push({name: 'workspaces.available-workspaces', key: 'workspaces'})
  if(installedWorkspaces.length > 0) {
    tabList.push({name: 'workspaces.installed-workspaces', key: 'installed'})
  }
  tabList.push({name: 'workspaces.registries', key: 'registry'})
  
  return (
    <React.Fragment>
      <PageHeader location={props.location} routes={typeof newRoutes !== 'undefined' ? newRoutes : null} title={t('workspaces.workspace-registry')} icon={<FontAwesomeIcon icon={faContainerStorage} />} right={<DiskUsage diskStats={serverStats} installing={installedWorkspaces.filter((workspace) => workspace.enabled === true && workspace.available === false)} />} />
      <Row>
        <Col sm={{ size: 10, order: 3, offset: 1 }}>
          <TabList {...props} tabList={tabList} currentTab={currentTab} setCurrentTab={setCurrentTab} />
          <div className={"tw-flex-wrap tw-mt-12 tw-pb-12 tw-w-full tw-gap-4" + (currentTab === 'registry' ? ' tw-flex' : ' tw-hidden')}>
            {workspaceStores && workspaceStores.length > 0 ? (
              <React.Fragment>
                {workspaceStores.map(store => (
                  <Store filter={filter} updateWorking={updateWorking} setDeleteStore={setDeleteStore} setDeleteModal={setDeleteModal} updateStore={updateStore} key={store.registry_id} store={store} />
                ))}
              </React.Fragment>
            ) :
              (
                <div className="tw-h-20 tw-w-full tw-max-w-xs tw-rounded tw-p-2">
                  {addWorking ?
                    <div className="tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center"><FontAwesomeIcon icon={faSpinner} spin /></div> :
                    <span><Trans i18nKey="workspaces.no_workspace_registries_installed" ns="common">No workspace registries are currently installed. You can <span onClick={() => addOfficial()} className="tw-bg-gradient-to-r tw-bg-clip-text tw-text-transparent tw-animated-gradient tw-animate-text tw-font-bold tw-cursor-pointer">install the official registry</span> or visit the <a target="_blank" className="tw-font-bold tw-text-dark" href="https://registry.kasmweb.com">Official Registry page</a></Trans></span>}
                </div>
              )}
            <div className="tw-bg-transparent tw-h-20 tw-rounded tw-flex tw-w-full tw-max-w-xs tw-relative tw-overflow-hidden tw-justify-center tw-items-center tw-border-black/20 tw-border-dashed tw-border-2">
              <div className={((addStoreInput) ? '-tw-translate-x-0' : '-tw-translate-x-1/2') + ' tw-h-full tw-transition-all tw-block tw-absolute tw-w-72 tw-w-[200%] tw-flex tw-left-0'}>
                <div className="tw-w-1/2 tw-flex tw-flex-col tw-p-2 tw-relative tw-text-xs tw-gap-2">
                  <div className="tw-flex tw-justify-between">
                    <span className="tw-font-bold tw-underline tw-cursor-pointer" onClick={() => setRegistryModal(true)}>{t('workspaces.help-im-lost')}</span>
                    <span className="tw-font-bold tw-underline tw-cursor-pointer" onClick={() => setAddStoreInput(false)}>{t('buttons.Close')}</span>
                  </div>
                  <div className="tw-flex tw-gap-2 tw-justify-center tw-items-center tw-flex-grow">
                    <input placeholder={t('workspaces.registry-url')} className="dark:tw-bg-slate-800 dark:tw-text-white tw-flex-grow tw-bg-slate-100 tw-border-0 tw-h-full tw-px-3" type="text" name="new_store" ref={refAddStore} />
                    <button className="tw-rounded tw-justify-center tw-items-center tw-px-2 tw-h-9 tw-text-white tw-bg-gradient-to-br tw-animated-gradient tw-animate-text focus:tw-ring-4 focus:tw-ring-blue-300 dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800 tw-flex tw-flex-col tw-uppercase tw-text-xs tw-leading-none tw-font-bold" onClick={addStore}>
                      {addWorking ?
                        <div className="tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center"><FontAwesomeIcon icon={faSpinner} spin /></div> :
                        <React.Fragment><span className="tw-w-full tw-flex tw-justify-center">{t('buttons.Add')}</span><span className="tw-text-[10px]">{t('workspaces.registry')}</span></React.Fragment>}
                    </button>
                  </div>

                </div>
                <div className="tw-w-1/2 tw-flex tw-items-center tw-font-bold text-muted-more tw-transition-colors hover:!tw-text-[color:var(--text-color)] tw-justify-center tw-cursor-pointer" onClick={() => setAddStoreInput(true)}>{t('workspaces.add-new')}</div>
              </div>
            </div>

          </div>
          <div className={"tw-mt-12 tw-pb-12" + (currentTab === 'workspaces' ? ' tw-block' : ' tw-hidden')}>
            {(hasFilters() || (workspaceStores && workspaceStores.length > 1)) && (

            <div className="tw-mb-12 tw-flex tw-flex-col tw-gap-4">
            {hasFilters() && 
              <div className="tw-flex tw-gap-2">
                {t('workspaces.filter')}:
                {searchText !== '' && (
                  <span>"{searchText}"</span>
                )}
                {selectedCategory !== null && (
                    <span>{t('workspaces.' + selectedCategory.label)}</span>
                )}
                <button onClick={clearFilters} className="tw-rounded tw-h-6 tw-bg-blue-500 hover:tw-bg-slate-600 tw-text-sm tw-text-white tw-flex tw-items-center tw-transition"><span className="tw-h-6 tw-w-8 tw-flex tw-justify-center tw-items-center tw-bg-black/10"><FontAwesomeIcon icon={faTimes} /></span><span className="tw-px-2 tw-text-xs">{t('buttons.clear-filters')}</span></button>
              </div>
            }
            {workspaceStores && workspaceStores.length > 1 && (
              <div className="tw-flex tw-gap-2">
                {t('workspaces.filter-by-registry')}:
                {workspaceStores.map(store => (
                  <React.Fragment>
                  {selectedRegistry === store.registry_id ? (
                    <button key={'filter-store-' + store.registry_id} onClick={() => clearFilterRegistries()} className={"tw-rounded tw-h-6 tw-bg-blue-500 hover:tw-bg-slate-600 tw-text-sm tw-text-white tw-flex tw-items-center tw-transition"}><span className="tw-px-2 tw-text-xs">{store.config.name}</span><span className="tw-h-6 tw-w-8 tw-flex tw-justify-center tw-items-center tw-bg-black/10"><FontAwesomeIcon icon={faTimes} /></span></button>
                  ) : (
                    <button key={'filter-store-' + store.registry_id} onClick={() => filter(store)} className={"tw-rounded tw-h-6 tw-bg-zinc-100/90 dark:tw-bg-slate-700/70 hover:tw-bg-slate-600 tw-text-sm hover:tw-text-white tw-flex tw-items-center tw-transition"}><span className="tw-px-2 tw-text-xs">{store.config.name}</span></button>
                  )}
                  </React.Fragment>
                ))}

              </div>
              )}
            </div>
                        )}

            {availableWorkspaces && availableWorkspaces.length > 0 ?

              <div className="tw-grid tw-grid-cols-[repeat(auto-fill,minmax(18rem,_1fr))] tw-w-full tw-gap-4">
                {availableWorkspaces.map((workspace, index) => (
                  <Workspace userImages={userImages} key={cyrb53(workspace.author + workspace.sha)} usedkey={'available-' + index} workspace={workspace} architectures={architectures} />
                ))}
              </div> :
              <div>{t('workspaces.there-are-currently-no-availab')}</div>
            }
          </div>

          {installedWorkspaces && installedWorkspaces.length > 0 && (
            <div className={"tw-mt-12 tw-pb-12" + (currentTab === 'installed' ? ' tw-block' : ' tw-hidden')}>
              {hasFilters() && <div className="tw-mt-20 tw-text-xl tw-h-8 tw-flex tw-items-center"><button onClick={clearFilters} className="tw-rounded tw-ml-4 tw-h-6 tw-bg-blue-500 hover:tw-bg-slate-600 tw-text-sm tw-text-white tw-flex tw-items-center tw-transition"><span className="tw-h-6 tw-w-8 tw-flex tw-justify-center tw-items-center tw-bg-black/10"><FontAwesomeIcon icon={faTimes} /></span><span className="tw-px-2 tw-text-xs">{t('buttons.clear-filters')}</span></button></div>}

              <div className="tw-grid tw-grid-cols-[repeat(auto-fill,minmax(18rem,_1fr))] tw-w-full tw-gap-4">
                {installedWorkspaces.map((workspace, index) => (
                  <Workspace userImages={userImages} key={index} usedkey={'installed-' + index} workspace={workspace} architectures={architectures} />
                ))}
              </div>
            </div>
          )}

          <ConfirmAction
              confirmationDetails={{
                  action: null,
                  details: {
                      title: t('workspaces.delete-registry'),
                      text: t('workspaces.are-you-sure-you-want-to-delet-0'),
                      iconBg: 'tw-bg-pink-700 tw-text-white',
                      icon: <FontAwesomeIcon icon={faTrash} />,
                      confirmBg: 'tw-bg-pink-700',
                      confirmText: t('buttons.Delete'),

                  }
              }}
              open={deleteModal}
              externalClose={true}
              setOpen={cancelDeleteModal}
              onAction={deleteStoreConfirm}
          />

          <Modal
            icon={<FontAwesomeIcon icon={faContainerStorage} />}
            iconBg="tw-bg-blue-500 tw-text-white"
            title="workspaces.are-you-sure-you-want-to-add-a"
            contentRaw={
              <Trans i18nKey="workspaces.trust-3rd-party" ns="common">Please be sure you trust this 3rd party registry before adding workspaces from them. You are highly encouraged to <a target="_blank" href="https://kasmweb.com/docs/latest/guide/workspace_registry.html#rd-party-registry">review our documentation on 3rd party registries</a> before installing any of the workspaces provided by this registry.</Trans>
            }
            open={thirdPartyModal}
            setOpen={cancelThirdPartyModal}
            modalFooter={<ModalFooter cancel={cancelThirdPartyModal} saveName='workspaces.add-registry' save={addThirdParty} />}
          />

          <Modal
            icon={<FontAwesomeIcon icon={faContainerStorage} />}
            iconBg="tw-bg-blue-500 tw-text-white"
            title="workspaces.installing-workspace-registrie"
            contentRaw={
              <div className="tw-text-left tw-mt-8">
                <img className="tw-rounded tw-ring-4 tw-ring-slate-300" src={workspaceGif} />
                <ol className="tw-p-5 tw-px-8 tw-my-5">
                  <li className="tw-mb-2"><Trans i18nKey="workspaces.find-a-registry" ns="common">Find a Workspaces Registry and go to it. You can find any repositories that are using our template by <a target="_blank" rel="noopener nofollow" href="https://github.com/search?q=in%3Areadme+sort%3Aupdated+-user%3Akasmtech+%22KASM-REGISTRY-DISCOVERY-IDENTIFIER%22&type=repositories">searching on GitHub</a>.</Trans></li>
                  <li className="tw-mb-2">{t('workspaces.click-on-the-workspaces-regist')}</li>
                  <li className="tw-mb-2">{t('workspaces.in-kasm-workspaces-paste-the-u')}</li>
                  <li>{t('workspaces.click-the-add-registry-button')}</li>
                </ol>
                <div className="tw-flex tw-justify-between tw-items-end">
                  {workspaceStores && workspaceStores.length === 0 ? <button className="tw-rounded tw-ml-1 tw-text-white tw-bg-gradient-to-br tw-animated-gradient tw-animate-text focus:tw-ring-4 focus:tw-ring-blue-300 tw-px-3 tw-py-2 dark:tw-bg-blue-600 dark:hover:tw-bg-blue-700 focus:tw-outline-none dark:focus:tw-ring-blue-800 tw-flex tw-flex-col tw-uppercase tw-text-xs tw-leading-none tw-font-bold" onClick={() => { addOfficial(); setRegistryModal(false) }}><span className="tw-w-full tw-flex tw-justify-center">{t('buttons.install')}</span><span className="tw-text-[10px]">{t('workspaces.official-registry')}</span></button> : ''}
                  <a target="_blank" rel="noopener nofollow" href="https://kasmweb.com/docs/latest/guide/workspace_registry.html">{t('workspaces.workspace-registry-docs')}</a>
                </div>

              </div>
            }
            open={registryModal}
            setOpen={cancelRegistryModal}
            buttons={
              <React.Fragment>
                  <div>&nbsp;</div>
                  <button type="button" className="cancelbutton" onClick={cancelRegistryModal}>{t('buttons.Close')}</button>

              </React.Fragment>
            }

          />


        </Col>
      </Row>
    </React.Fragment>
  )
}

function DiskUsage({ diskStats, installing }) {
  const dispatch = useDispatch()

  const [update, setUpdate] = useState(false);
  const amountPercent = ((diskStats.combinedUsed / diskStats.combinedTotal) * 100).toFixed(0)
  const installingTotal = installing.reduce((total, workspace) => total + (workspace.uncompressed_size_mb * 1000000), 0)
  const totalPercent = (((diskStats.combinedUsed + installingTotal) / diskStats.combinedTotal) * 100).toFixed(0)
  const installingPercent = ((installingTotal / diskStats.combinedTotal) * 100).toFixed(0)

  const isRed = totalPercent > 75 ? true : false;
  const isYellow = totalPercent > 50 && totalPercent <= 75 ? true : false;
  const isGreen = totalPercent > 0 && totalPercent <= 50 ? true : false;

  const { t } = useTranslation('common');

  useEffect(() => {
    checkInstallStatus(installing)
  }, [installing]);

  const checkInstallStatus = (installing) => {
    if(installing.length > 0 && update === false) {
      setUpdate(true)
      setTimeout(() => {
        setUpdate(false)
        dispatch(getServers())
        dispatch(getUserImages())
      }, 10000)
    }
  }

  return (
    <div className="tw-bg-zinc-50 dark:tw-bg-slate-900/70 tw-p-2 tw-h-20 tw-rounded tw-w-full tw-max-w-xs tw-relative tw-shadow tw-overflow-hidden">
      {installing.length > 0 && <div className="tw-w-8 tw-h-8 tw-flex tw-justify-center tw-items-center tw-absolute tw-top-0 tw-right-0"><FontAwesomeIcon icon={faSpinner} spin /></div>}
      <div className="tw-flex tw-gap-4 tw-items-center">    
        <div className="tw-h-16 tw-w-16 usage tw-flex tw-items-center tw-justify-center">
          <div className={`tw-w-[50px] tw-h-[50px] tw-relative ${isRed
              ? "red-stroke"
              : isYellow
                ? "yellow-stroke"
                : isGreen
                  ? "green-stroke"
                  : ""
              }`}>
          {amountPercent && <CircularProgressbar
            className="text-color"
              value={amountPercent}
              text={totalPercent + "%"}
            />}
          {installingPercent > 0 && <CircularProgressbar
            className="tw-absolute tw-inset-0 tw-h-16 tw-w-16"
            value={installingPercent}
            styles={{
              path: {
                stroke: '#be4ed8',
                transform: 'rotate(0.'+amountPercent+'turn)',
                transformOrigin: 'center center',
              },
              trail: {
                stroke: 'transparent'
              },
            }}
          />}
          </div>
        </div>
        <div className="tw-flex tw-flex-col tw-text-xs tw-font-bold tw-pr-2">
          <div className="tw-whitespace-nowrap"><span className="tw-text-[color:var(--text-color-muted-more)] tw-font-normal">{t('workspaces.installing')}:</span> {t('workspaces.install-count', { count: installing.length || 0 })}</div>
          <div className="tw-whitespace-nowrap">
            <UncontrolledTooltip placement="bottom" target="estimated-size">
              {t('workspaces.the-actual-installed-size-may-')}
            </UncontrolledTooltip>
            <span className="tw-text-[color:var(--text-color-muted-more)] tw-font-normal">{t('workspaces.estimated-size')}</span> {bytesToSize(installingTotal)} <FontAwesomeIcon id="estimated-size" icon={faInfoCircle} />
          </div>
          <div className="tw-whitespace-nowrap">
            <UncontrolledTooltip placement="bottom" target="remaining-size">
              {t('workspaces.the-actual-space-remaining-may')}
            </UncontrolledTooltip>

            <span className="tw-text-[color:var(--text-color-muted-more)] tw-font-normal">{t('workspaces.remaining-space')}</span> {bytesToSize(diskStats.combinedFree - installingTotal)} <FontAwesomeIcon id="remaining-size" icon={faInfoCircle} />
          </div>
        </div>
      </div>
    </div>

  )
}

function Store({ filter, updateWorking, setDeleteStore, setDeleteModal, updateStore, store, store: { is_verified, config: { name, workspacecount, icon, description, list_url, contact_url }, workspaces } }) {
  const dispatch = useDispatch()
  const { base_url, img_url } = storeUrls(store, is_verified)
  const amountToShow = 7
  const workspaceselection = workspaces.slice(0, amountToShow)
  const extra = workspacecount - amountToShow

  const { t } = useTranslation('common');

  const [showDescription, setShowDescription] = useState(false);

  const deleteButton = () => {
    return <button onClick={() => {
      setDeleteStore(store)
      setDeleteModal(true)
    }} className="tw-p-3 tw-py-1 tw-bg-red-700 tw-rounded tw-text-white">{t('buttons.Delete')}</button>
  }

  const updateButton = () => {
    return <button onClick={() => {
      updateStore(store)
    }} className="tw-p-3 tw-py-1 tw-bg-blue-500 tw-rounded tw-text-white">{t('buttons.Update')}</button>
  }

  const updateAutoUpdates = (event) => {
    try {
      dispatch(registryAutoUpdate({
        registryId: store.registry_id,
        auto_updates: event.target.checked
      }))
      NotificationManager.success(
        t('workspaces.auto-update-setting-was-succes', { name }),
        t('workspaces.successfully-updated-store'),
        3000
      );
    } catch(e) {
      NotificationManager.error(
        t('workspaces.could-not-update-the-auto-upda', { name }),
        t('workspaces.store-update-failure'),
        3000
      );

    }
  }

  const official = () => {
    if (is_verified) {
      return <div className="tw-w-5 tw-h-5 tw-flex tw-justify-center tw-items-center">
        <UncontrolledTooltip placement="right" target={"store" + store.registry_id}>
          {t('workspaces.this-is-a-verified-registry-an')}
        </UncontrolledTooltip>

        <img className="tw-w-5 tw-h-5" src={verified} id={"store" + store.registry_id} />
      </div>
    }
  }

  return (
    <div className="tw-bg-zinc-50 dark:tw-bg-slate-900/70 tw-h-20 tw-rounded tw-w-full tw-max-w-xs tw-relative tw-shadow tw-overflow-hidden">
      <div className={"tw-absolute tw-top-0 tw-left-0 tw-right-0 tw-h-40 tw-transition-all" + (showDescription ? ' -tw-translate-y-1/2' : '')}>
        <div className="tw-h-20 tw-flex tw-items-center tw-p-2 tw-gap-3">
          <a target="_blank" href={store.registry_url}>
          <img
            className="tw-object-contain tw-rounded-full tw-border-2 tw-border-white tw-border-solid tw-h-16 tw-max-w-[64px] "
            src={icon}
            onError={(e) => {
              e.target.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
              e.target.className = "tw-object-contain tw-rounded-full tw-border-2 tw-border-white tw-border-solid tw-h-16 tw-max-w-[64px]"
            }
            }
          />
          </a>

          <div className="tw-flex tw-flex-col tw-gap-1 tw-w-full">
            <div className="tw-flex tw-items-center"><span className="tw-font-bold">{name}</span><span className="tw-ml-1 tw-scale-90">{official()}</span></div>
            <div className="tw-flex tw-flex-grow tw-justify-between">
              <div onClick={() => filter(store)} id={"workspaces-" + store.registry_id} className="tw-flex tw-cursor-pointer -tw-space-x-3 tw-transition-all tw-grayscale hover:tw-grayscale-0 tw-scale-80 tw-origin-bottom-left">
              <UncontrolledTooltip placement="top" target={"workspaces-" + store.registry_id}>
                {t('workspaces.click-to-filter-by-this-regist')}
              </UncontrolledTooltip>

                {workspaceselection && workspaceselection.map(workspace => (
                  <img key={cyrb53(workspace.author + workspace.sha)} className="tw-w-8 tw-h-8 tw-rounded-full tw-border-solid tw-border-2 tw-bg-slate-100 tw-border-white dark:tw-border-gray-800" src={img_url + workspace.image_src} alt={workspace.friendly_name} />
                ))}
                {extra > 0 && (
                  <span className="tw-flex tw-justify-center tw-items-center tw-w-8 tw-h-8 tw-text-xs tw-font-medium tw-text-white tw-bg-gray-700 tw-rounded-full tw-border-solid tw-border-2 tw-border-white hover:tw-bg-gray-600 dark:tw-border-gray-800">+{extra}</span>
                )}
              </div>
              <div className="tw-flex tw-items-end tw-gap-1">
              <a href={contact_url} target="_blank" title={t('workspaces.support')} className="tw-flex tw-w-6 tw-bg-[buttonface] tw-text-text tw-h-6 tw-justify-center dark:tw-bg-slate-500 tw-rounded-full tw-items-center"><FontAwesomeIcon icon={faLifeRing} /></a>
              <button className="tw-flex tw-w-6 tw-h-6 tw-justify-center dark:tw-bg-slate-500 tw-rounded-full tw-items-center" onClick={() => setShowDescription(true)}><FontAwesomeIcon icon={faEllipsisH} /></button>
              </div>
            </div>
          </div>
        </div>
        <div className="tw-h-20 tw-text-xs tw-relative tw-flex tw-flex-col tw-justify-between tw-p-3">
          {updateWorking && updateWorking === store.registry_id ?
            <div className="tw-w-full tw-h-full tw-flex tw-justify-center tw-items-center"><FontAwesomeIcon icon={faSpinner} spin /></div> :
            <React.Fragment>
              <button className="tw-absolute tw-right-2 tw-top-2 tw-rounded-full tw-flex tw-justify-center tw-items-center tw-h-6 tw-w-6" onClick={() => setShowDescription(false)}><FontAwesomeIcon icon={faClose} /></button>
              <div className="tw-pr-6 tw-h-8 tw-overflow-auto">{description}</div>
              <div className="tw-w-full tw-flex tw-justify-between tw-items-center">
                <span className="tw-flex tw-gap-1">{t('workspaces.automatic-updates')} <input onChange={updateAutoUpdates} type="checkbox" defaultChecked={store.do_auto_update} name="automatic_updates" /></span>
                <div className="tw-flex tw-gap-1">
                  {updateButton()}
                  {deleteButton()}
                </div>
              </div>
            </React.Fragment>
          }
        </div>
      </div>
    </div>
  )
}

function storeUrls(store, official = false) {
  const base_url = store.config.list_url.replace('list.json', '')
  const img_url = official ? '/img/thumbnails/' : base_url + store.schema_version + '/icons/'
  return {
    base_url,
    img_url
  }
}

function Workspace({ workspace, userImages, architectures, usedkey }) {

  const dispatch = useDispatch()
  const workspaceExists = userImages && userImages.find(image => image.name === workspace.name)
  const [showDescription, setShowDescription] = useState(false);

  const { t } = useTranslation('common');

  const handleSuccess = () => {
    NotificationManager.success(
      t('workspaces.workspace-has-been-added-and-i'),
      t('workspaces.workspace-added'),
      3000
    );
  }
  const handleFailure = () => {
    NotificationManager.error(
      t('workspaces.workspace-could-not-be-added'),
      t('workspaces.error-adding-workspace'),
      3000
    );
  }

  const imageCreate = async (workspacedetails) => {
    const workspace = {
      ...workspacedetails
    }
    delete workspace.sha
    delete workspace.official
    delete workspace.author
    delete workspace.available
    delete workspace.memory_friendly
    delete workspace.persistent_profile_settings
    delete workspace.zones
    delete workspace.networks
    delete workspace.default_category
    delete workspace.architecture
    delete workspace.store
    delete workspace.compatibility
    delete workspace.checkRequired
    const workspaceDetails = {
      ...workspace,
      volume_mworkspaceings: JSON.stringify(workspace.volume_mworkspaceings),
      run_config: JSON.stringify(workspace.run_config),
      exec_config: JSON.stringify(workspace.exec_config),
      launch_config: JSON.stringify(workspace.launch_config),
      memory: workspace.memory || (2768 * 1000000),
      cores: workspace.cores || 2,
      gpu_count: workspace.gpu_count || 0,
      require_gpu: workspace.require_gpu || null,
      enabled: true, // always set to true
      docker_token: workspace.docker_token || null,
      docker_user: workspace.docker_user || null,
      hash: workspace.hash || null,
      persistent_profile_path: workspace.persistent_profile_path || null,
      categories: workspace.categories ? workspace.categories.join('\n') : '',
      restrict_to_network: workspace.restrict_to_network || false,
      restrict_network_names: workspace.restrict_network_names || [],
      allow_network_selection: workspace.allow_network_selection || false,
      restrict_to_server: workspace.restrict_to_server || false,
      server_id: workspace.server_id || "",
      server_pool_id: workspace.server_pool_id || null,
      restrict_to_zone: workspace.restrict_to_zone || false,
      zone_id: workspace.zone_id || "",
      filter_policy_id: workspace.filter_policy_id || null,
      session_time_limit: workspace.session_time_limit || null,
      hidden: workspace.hidden || false,
      notes: workspace.notes || null,
      image_type: workspace.image_type || 'Container',
      link_url: workspace.link_url || null,
    }
    try {
      let create
      if (workspacedetails.image_id) {
        create = await dispatch(updateImages(workspaceDetails))
      } else {
        create = await dispatch(createImage(workspaceDetails))
      }
      if (_.has(create.response, 'error_message')) {
        handleFailure()
      } else {
        dispatch(getUserImages())
        handleSuccess()
      }
    } catch (e) {
      handleFailure()
    }
  }

  const installButton = () => {
    if (workspaceExists && workspaceExists.enabled === true) {
      if (workspaceExists.available === false) {
        return <button className="tw-text-xs tw-w-full tw-p-4 tw-py-1 tw-rounded-lg tw-flex tw-justify-center tw-items-center"><FontAwesomeIcon className="tw-mr-3" icon={faSpinner} spin /> {t('workspaces.installing')}</button>
      }
      return
    }
    return <button onClick={() => imageCreate(workspace)} className={"tw-text-xs tw-w-full tw-p-4 tw-py-1 tw-rounded-lg tw-flex tw-justify-center tw-items-center tw-bg-blue-500 tw-font-bold tw-text-white"}>{!workspaceExists ? t('buttons.install') : t('buttons.enable')}</button>
  }
  const official = () => {
    if (workspace.official) {
      return <div className="tw-w-5 tw-h-5 tw-flex tw-justify-center tw-items-center">
        <UncontrolledTooltip placement="right" target={"official" + workspace.sha}>
          {t('workspaces.this-workspace-is-from-a-verif', { author: workspace.author })}
        </UncontrolledTooltip>
        <img className="tw-w-4 tw-h-4" src={verified} id={"official" + workspace.sha} />
      </div>
    }
  }

  const editButton = () => {
    if (workspaceExists) {
      return <Link to={'/updateworkspace/' + workspace.image_id} className="tw-text-xs tw-text-color tw-w-full tw-p-4 tw-py-1 tw-rounded-lg tw-bg-black/5 tw-flex tw-justify-center tw-items-center">{t('buttons.Edit')}</Link>
    }
    return <Link onClick={() => {
      dispatch(editWorkspace(workspace))
    }} to={'/createworkspace'} className="tw-text-xs tw-text-color tw-w-full tw-p-2 tw-py-1 tw-rounded-lg tw-bg-black/5 tw-flex tw-justify-center tw-items-center">{t('buttons.Edit')}</Link>
  }

  const noarch = () => {
    if (workspace.architecture && !workspace.architecture.some(value => architectures.indexOf(value) !== -1)) {
      return <UncontrolledTooltip placement="top" target={usedkey}>
        {t('workspaces.this-workspace-does-not-work-o')}
      </UncontrolledTooltip>
    }
  }

  const workspacedisabled = () => {
    if (showDescription === false && workspace.enabled === false) {
      return <UncontrolledTooltip placement="top" target={usedkey}>
        {t('workspaces.this-workspace-is-installed-bu')}
      </UncontrolledTooltip>
    }
  }

  const hasWarning = () => {
    if (workspace.checkRequired) {
      return <div className="tw-absolute tw-right-3 tw-top-8">
        <UncontrolledTooltip placement="top" autohide={false} target={"warning" + workspace.sha}>
          {t('workspaces.this-workspace-has-defined-con')}
          <ul className="tw-list-disc tw-my-3">
          {workspace.checkRequired && workspace.checkRequired.map(item => (
          <li>{item.section} - {item.item} - <a onClick={(e) => e.stopPropagation()} target="_blank" href="https://kasmweb.com/docs/develop/guide/workspace_registry.html#configuration-warnings">{item.type}</a></li>
          ))}
          </ul>
        </UncontrolledTooltip>
        <FontAwesomeIcon className="tw-text-orange-300 dark:tw-text-orange-300/70 tw-text-lg" icon={faShieldExclamation} id={"warning" + workspace.sha} />
      </div>
    }
  }


  const warningBorder = workspace.checkRequired ? "tw-border-orange-300 dark:tw-border-orange-300/40 " : "tw-border-transparent "

  return (
    <div className={(((showDescription === false && workspace.enabled === false) || (workspace.architecture && !workspace.architecture.some(value => architectures.indexOf(value) !== -1))) ? "tw-opacity-40 dark:tw-opacity-20 " : "") + warningBorder +  "tw-rounded tw-group tw-w-full tw-shadow tw-relative tw-overflow-hidden tw-h-[100px] tw-border tw-border-solid dark:tw-border-slate-700/70 tw-flex tw-flex-col tw-justify-between tw-bg-zinc-50 dark:tw-bg-slate-900/70"}>
      {noarch()}
      {workspacedisabled()}
      <div id={usedkey} className={"tw-absolute tw-top-0 tw-left-0 tw-right-0 tw-h-[200px] tw-transition-all" + (showDescription ? ' -tw-translate-y-1/2' : '')}>
        {workspace.uncompressed_size_mb && <div className="tw-absolute tw-top-0 tw-text-[color:var(--text-color-muted-more)] tw-right-0 tw-text-[10px] tw-font-semibold tw-p-1 tw-px-2 tw-rounded-bl text-muted-more tw-bg-zinc-100/90 dark:tw-bg-slate-800/70">{bytesToSize(workspace.uncompressed_size_mb*1000000)}</div>}
        <div onClick={() => setShowDescription(true)} className={"tw-h-[100px] tw-p-4 tw-relative tw-overflow-hidden tw-cursor-pointer"}>
          <img className="tw-h-[90px] tw-w-[90px] tw-object-contain group-hover:tw-scale-150 tw-transition-all tw-absolute tw-left-2 tw-top-1" src={workspace.image_src || 'img/favicon.png'} onError={(e) => e.target.src = "img/favicon.png"} alt={workspace.friendly_name} />
          <div className="tw-flex-col tw-pl-28 tw-pr-5 tw-relative">
            <div className="tw-font-bold tw-whitespace-nowrap tw-overflow-hidden tw-overflow-ellipsis">{workspace.friendly_name}</div>
            <div className="tw-text-xs tw-flex tw-items-center tw-gap-1 tw-h-5">{workspace.author || t('workspaces.manual')} <span>{official()}</span></div>
            <div className=" tw-h-8"></div>
          </div>
          {hasWarning()}
          <div className="tw-absolute tw-bottom-0 tw-left-0 tw-right-0 tw-bg-zinc-100/90 dark:tw-bg-slate-800/70 tw-h-8 tw-text-[10px] tw-flex tw-items-center tw-justify-center">
            {/*workspace.architecture && workspace.architecture.map((arch, index) => (
              <span key={'arch' + index} className="tw-p-2 tw-py-0 tw-m-[1px] tw-inline-block tw-rounded tw-bg-slate-400/70 dark:tw-text-slate-100">{arch}</span>
            ))*/ }
            {workspace.categories && workspace.categories.map((cat, index) => (
              <span key={'cat' + index} className="tw-p-2 tw-py-0 tw-m-[1px] tw-inline-block tw-rounded text-muted-more">{t(["workspaces." + cat, cat])}</span>
            ))}
          </div>
          {workspaceExists && workspaceExists.enabled === true && workspaceExists.available === false && (
            <div className="tw-absolute tw-inset-0 tw-flex tw-justify-center tw-items-center tw-bg-slate-600/70 tw-text-white"><FontAwesomeIcon icon={faSpinner} spin /> {t('workspaces.installing')}</div>
          )}
        </div>
        <div className="tw-h-[100px] tw-text-xs tw-relative tw-p-2 tw-pl-4 tw-flex">
          <button className="tw-absolute tw-right-2 tw-top-2 tw-rounded-full tw-flex tw-justify-center tw-items-center tw-h-6 tw-w-6" onClick={() => setShowDescription(false)}><FontAwesomeIcon icon={faClose} /></button>
          <div className="tw-flex tw-flex-col tw-flex-grow">
            <div className="tw-font-bold">{workspace.friendly_name}</div>
            <div className="tw-line-clamp-4">{workspace.description}</div>
          </div>
          <div className="tw-flex tw-flex-col tw-justify-end tw-gap-1">
            {editButton()}
            {installButton()}
          </div>
        </div>
      </div>
    </div>
  )
}
