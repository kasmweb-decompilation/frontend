import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { Row, Col, Card, CardHeader, Container, UncontrolledTooltip, Collapse } from "reactstrap";
import { useTranslation, Trans } from "react-i18next";
import { isArray } from "lodash";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk } from '@fortawesome/pro-light-svg-icons/faFloppyDisk';
import { faChevronRight } from '@fortawesome/pro-light-svg-icons/faChevronRight';
import { faChevronLeft } from '@fortawesome/pro-light-svg-icons/faChevronLeft';
import { faCopy } from '@fortawesome/pro-light-svg-icons/faCopy';
import { NotificationManager } from "react-notifications";
import reactStringReplace from 'react-string-replace';
import { copyToClipboard } from "../../utils/formValidations"

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const renderChildren = (children, section) => {
  return React.Children.map(children, (child) => {
  if (child) {
    if (child.type === React.Fragment || (child.type === Collapse && child.props.isOpen === true)) {
      return renderChildren(child.props.children, section)
    }
    if (child.props.component) {
      return <FormField key={child.props.name} section={section}>
        {child}
      </FormField>
    }
      return React.cloneElement(child, {
        section: section,
      });
    }
  });
}


const notifyMessage = (section, type, override, message ) => {
  let value = 'notify-' + type + '-' + message
  if (override) {
    value = override
  }
  return section + '.' + value
}

export function notifySuccess(props) {
  const { errorMessage, type, notifyTitle, notifySuccess, onSuccess } = props
  if (errorMessage) {
    NotificationManager.error(errorMessage, <Trans i18nKey={[notifyTitle || '', 'generic.notify-' + type + '-title']} ns="common" />, 3000);    
  } else {
    NotificationManager.success(<Trans i18nKey={[notifySuccess || '', 'generic.notify-' + type + '-success']} ns="common" />, <Trans i18nKey={[notifyTitle || '', 'generic.notify-' + type + '-title']} ns="common" />, 3000);
    if (typeof onSuccess === 'function') onSuccess()
  }
}

export function notifyFailure(props) {
  const { error, type, notifyTitle, onFailure } = props
  const errorMessage = error.response && error.response.body ? error.response.body : error.message
  if (errorMessage){
    NotificationManager.error(errorMessage, <Trans i18nKey={[notifyTitle || '', 'generic.notify-' + type + '-title']} ns="common" />, 3000);
  }
  if (typeof onFailure === 'function') onFailure()
}

export function Paginate(props) {
  const { page, items, perPage, fetchData } = props
  const { t } = useTranslation('common');
  const [pagePicker, setPagePicker] = useState({ before: false, after: false })
  const pageBeforeRef = useRef();
  const pageAfterRef = useRef();

  const pages = Math.ceil(items / perPage)

  const start = Number((perPage * (page - 1)) + 1)
  let end = Number(perPage + start - 1)
  if (end > items) {
    end = items
  }

  const setPage = (newPage) => {
    let page = Number(newPage)
    if (page < 1) page = 1
    if (page > pages) page = pages
    fetchData({ page: page })
  }

  const increasePage = () => {
    const next = page + 1
    if (next <= pages) {
      setPage(next)
    }
  }
  const decreasePage = () => {
    const next = page - 1
    if (next >= 1) {
      setPage(next)
    }
  }

  const addButton = (i) => {
    return <button
      key={location + i}
      onClick={() => setPage(i)}
      className={"tw-relative tw-items-center tw-px-3 lg:tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-ring-1 tw-ring-inset tw-ring-black/10 hover:tw-bg-slate-600 hover:tw-text-white focus:tw-z-20 focus:outline-offset-0" + (i === page ? ' tw-bg-blue-500 hover:tw-bg-slate-600 tw-text-white' : ' tw-bg-transparent')}
    >
      {i}
    </button>
  }
  const addSeperator = (type) => {
    const updatePagePicker = (type, value) => {
      let initial = {
        ...pagePicker
      }
      initial[type] = value
      setPagePicker(initial)
      if (value) {
        if (type === 'before') {
          setTimeout(() => { pageBeforeRef.current.focus(); })
        } else {
          setTimeout(() => { pageAfterRef.current.focus(); })
        }
      }
    }

    return <span key={'seperator-' + location + type} className="tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-0 tw-text-sm tw-font-semibold tw-ring-1 tw-ring-inset tw-ring-black/10 focus:outline-offset-0">
        {pagePicker[type] && <input ref={type === 'before' ? pageBeforeRef : pageAfterRef} className="!tw-p-1 -tw-top-8 tw-left-0 tw-absolute !tw-bg-opacity-100 tw-shadow" type="number" onKeyUp={(event) => {
          if (event.key === 'Enter') {
            setPage(event.target.value)
            updatePagePicker(type, false)
          }
        }} />}

      <span onClick={() => updatePagePicker(type, !pagePicker[type])} className="tw-opacity-70 tw-cursor-pointer">
        ...
      </span>
    </span>

  }

  const buttons = () => {
    const buttons = []
    if (pages <= 6) {
      for (let i = 1; i <= pages; i++) {
        buttons.push(addButton(i))
      }
    } else {
      buttons.push(addButton(1)) // Always add first page
      if (page > 3) { // Add "..." if current page is over 3
        buttons.push(addSeperator('before'))
      }
      if (page == pages) { // Special case for last page
        buttons.push(addButton(page - 2));
      }
      if (page > 2) { // Add previous number button if page > 2
        buttons.push(addButton(page - 1));
      }
      if (page != 1 && page != pages) { // Add current page number button as long as it not the first or last page
        buttons.push(addButton(page));
      }
      if (page < pages - 1) { // Add next number button if page < pages - 1
        buttons.push(addButton(page + 1));
      }
      if (page == 1) { // Special case for first page
        buttons.push(addButton(page + 2));
      }
      if (page < pages - 2) { // Add "..." if page is < pages -2
        buttons.push(addSeperator('after'))
      }
      buttons.push(addButton(pages)); // Always add last page button
    }
    return buttons
  }

  const itemtotal = items || 0
  if (items <= perPage) return
  return (
    <div className="tw-flex tw-flex-col tw-gap-2 tw-origin-left tw-flex-1 tw-items-start lg:tw-items-center tw-justify-end tw-min-h-[52px] tw-py-4">
      <div className="tw-flex tw-items-center">
        <p className="tw-text-sm tw-m-0 text-muted tw-px-4">
          <Trans i18nKey="tables.showing-result-count">Showing <span className="tw-font-semibold text-color">{{ start }}</span> to <span className="tw-font-semibold text-color">{{ end }}</span> of <span className="tw-font-semibold text-color">{{ itemtotal }}</span> results</Trans>
        </p>
      </div>
      {pages > 1 && (
        <div className="tw-flex tw-w-full lg:tw-w-auto tw-justify-center lg:tw-justify-end">

          <nav className="isolate tw-inline-flex tw--space-x-px tw-rounded-md tw-shadow-sm" aria-label={t('tables.pagination')}>
            <button
              onClick={decreasePage}
              className="tw-relative tw-bg-transparent tw-inline-flex tw-items-center tw-rounded-l-md tw-px-2 tw-py-2 tw-text-gray-400 tw-ring-1 tw-ring-inset tw-ring-black/10 hover:tw-bg-slate-600 hover:tw-text-white focus:tw-z-20 focus:outline-offset-0"
            >
              <span className="tw-sr-only">{t('tables.previous')}</span>
              <FontAwesomeIcon className="tw-h-5 tw-w-5" aria-hidden="true" icon={faChevronLeft} />
            </button>
            {buttons()}
            <button
              onClick={increasePage}
              className="tw-relative tw-inline-flex tw-items-center tw-rounded-r-md tw-px-2 tw-py-2 tw-bg-transparent tw-text-gray-400 tw-ring-1 tw-ring-inset tw-ring-black/10 hover:tw-bg-slate-600 hover:tw-text-white focus:tw-z-20 focus:outline-offset-0"
            >
              <span className="tw-sr-only">{t('tables.next')}</span>
              <FontAwesomeIcon className="tw-h-5 tw-w-5" aria-hidden="true" icon={faChevronRight} />
            </button>
          </nav>

        </div>
      )}
    </div>

  )
}

export function Form(props) {
  const { tabList, currentTab, setCurrentTab, form, tabs, userData: additionalData, dataTransform, section, title, successMessage, dispatchFunc, type, onSuccess, onFailure } = props
  const { t } = useTranslation('common');
  const dispatch = useDispatch()

  let passType = type ? type : 'create'

  const notifyTitle = notifyMessage(section, passType, title, 'title')
  const notifySuccessMessage = notifyMessage(section, passType, successMessage, 'success')

  const passSave = async(userData) => {
    let newData = {
      ...userData,
      ...additionalData
    }
    if (dataTransform) {
      newData = dataTransform(newData)
      if (newData === null) {
        return false
      }
    }
    try {
      const { response: { error_message: errorMessage } } = await dispatch(dispatchFunc(newData))
      notifySuccess({
        errorMessage,
        type: passType,
        notifyTitle,
        notifySuccess: notifySuccessMessage,
        onSuccess
      })
    } catch(error) {
      notifyFailure({
        error,
        type: passType,
        notifyTitle,
        onFailure
      })
    }

}
const setForm = React.cloneElement(form, {
  save: passSave,
  section,
  fromUpdate: (type && type === 'update') || false
})

  return (
    <Row>
      <Col sm={{ size: 10, order: 1, offset: 1 }}>
        <TabList {...props} tabList={tabList} currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <div className={currentTab === 'form' ? 'tw-block' : 'tw-hidden'}>
          {setForm}
        </div>
        {tabs}
      </Col>
    </Row>
  )
}

export function Groups(props) {
  const { section, children, onSubmit, noPadding, className, encType = null } = props
  const noPaddingClass = noPadding ? '' : ' tw-mt-12 tw-gap-8 tw-pb-32'
  
  return (
    <form onSubmit={onSubmit} encType={encType}>
      <div className={classNames("tw-flex tw-flex-col", noPaddingClass, className)}>
        {children && renderChildren(children, section)}
      </div>
    </form>
  )
}

export function Group(props) {
  const { section, title, description, tooltip, children } = props
  const { t } = useTranslation('common');
  return (
    <div className="tw-flex tw-flex-col lg:tw-flex-row tw-gap-8 lg:tw-gap-16 tw-border-0 tw-border-solid tw-pb-8 tw-border-b tw-border-black/10">
      <div className="tw-flex tw-flex-col tw-w-full tw-max-w-xs">
        {tooltip && (
          <UncontrolledTooltip placement="right" target={"group-" + title.replace(/[^a-z0-9]/gi, '')}>
            {t(section + '.' + tooltip)}
          </UncontrolledTooltip>
        )}
        <div className="tw-font-bold tw-mb-4"><span id={"group-" + title.replace(/[^a-z0-9]/gi, '')}>{t(section + '.' + title)}</span></div>
        <div className="text-muted-more tw-leading-6">{t(section + '.' + description)}</div>
      </div>
      <div className="tw-flex tw-flex-1 tw-flex-col">
        {children && renderChildren(children, section)}
      </div>
    </div>
  )
}

export function CopyToClipboard(props) {
  return (
    <button type="button" className={classNames("tw-ml-2 tw-bg-transparent tw-cursor-pointer tw-group/clip", props.className)} onClick={() => copyToClipboard(props.value)}>
      <FontAwesomeIcon className="tw-transition-all group-hover/clip:tw-scale-110" icon={faCopy} />
    </button>
  )
}

export function Button(props) {
  const {section, icon, name, color, type, onClick, buttonRef, className, full, large} = props
  const { t } = useTranslation('common');
  const displayIcon = icon === "save" ? <FontAwesomeIcon icon={faFloppyDisk} /> : icon
  const displayColor = color ? color : 'tw-bg-blue-500'
  return (
    <button ref={buttonRef} onClick={onClick} type={type ? type : 'button'} className={classNames("tw-rounded hover:tw-bg-slate-600 tw-text-sm tw-text-white tw-flex tw-items-center tw-transition", displayColor, className, (large ? 'tw-h-12' : 'tw-h-10'), full ? 'tw-w-full' : 'tw-w-auto')}>
      <span className={"tw-flex tw-justify-center tw-items-center tw-bg-black/10" + (large ? ' tw-h-12 tw-w-16 ' : ' tw-h-10 tw-w-12 ')}>{displayIcon}</span>
      <span className={"tw-px-4 tw-flex-1" + (large ? ' tw-pr-16' : ' tw-pr-10')}>{t(section + '.' + name)}</span>
    </button>
  )
}

export function ButtonGroup(props) {
  const {section, icon, name, color, type, onChange, buttonRef, className, full, large, children} = props
  const { t } = useTranslation('common');
  const displayIcon = icon === "save" ? <FontAwesomeIcon icon={faFloppyDisk} /> : icon
  const displayColor = color ? color : 'tw-bg-blue-500'
  return (
    <button ref={buttonRef} type={type ? type : 'button'} className={classNames("tw-rounded tw-text-sm tw-text-white tw-flex tw-items-center tw-transition", displayColor, className, (large ? 'tw-h-12' : 'tw-h-10'), full ? 'tw-w-full' : 'tw-w-auto')}>
      <span className={"tw-flex tw-justify-center tw-items-center tw-bg-black/10" + (large ? ' tw-h-12 tw-w-16 ' : ' tw-h-10 tw-w-12 ')}>{displayIcon}</span>
      <select
        className="!tw-bg-transparent tw-text-inherit tw-accent-white tw-ring-0 tw-outline-none tw-py-0"
        onChange={onChange} 
      >{children}
      </select>
    </button>
  )
}

export function FormField(props) {
  const { section, tooltip, rawTooltip, label, rawLabel, children, className, resetSection, additional = '' } = props
  const prefix = (!resetSection) ? section + '.' : ''
  const tooltipRef = React.useRef(null);
  const [ready, setReady] = React.useState(false);
  const { t } = useTranslation('common');

  React.useEffect(() => {
    if (tooltipRef.current) {
      setReady(true);
    }
  }, [tooltipRef]);

  let required = false
  if (children.props && children.props.required) {
    required = true
  }
  let displayLabel = ''
  let kebabLabel = ''
  if (children.props && children.props.name) {
    displayLabel = prefix + children.props.name
    kebabLabel = prefix + children.props.name.replace(/_/g, '-')
  }
  if (label) {
    displayLabel = prefix + label
    kebabLabel = prefix + label.replace(/_/g, '-')
  }
  const tooltipId = (children.props.id) ? 'tooltip-' + children.props.id : null
  const hasTooptip = _.some([rawTooltip, tooltip]) 
  return (
    <div className={classNames("kasm-form-field tw-w-full tw-max-w-lg tw-mb-6", className)}>
      {children.props && hasTooptip && ready && (
        <UncontrolledTooltip key="tooltipId"  placement="right" target={tooltipId}>
          {rawTooltip ? rawTooltip : t(prefix + tooltip)}
        </UncontrolledTooltip>
      )}
      <div className="tw-flex tw-flex-col">
        <label htmlFor={children.props && children.props.id} className={"tw-font-bold" + (required ? ' requiredasterisk' : '')}>
          <span ref={tooltipRef} id={tooltipId}>
            {rawLabel ? rawLabel :
            reactStringReplace(t([displayLabel, kebabLabel]), /\((.*?)\)/, (match, i) => (
            <span className="text-muted-more tw-text-xs">({match})</span>
            ))}
         
            </span>
        </label>
        {additional && (
          <div className="tw-mb-2 -tw-mt-3">
            {additional}
          </div>

        )}
      </div>
      {children}
    </div>
  )
}

export function FormFooter(props) {
  const { section, children, cancel, cancelButton = false, saveButton = false, className, inline = false } = props
  const [loaded, setLoaded] = useState(false);
  const { t } = useTranslation('common');

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true)
    }, 250)
  }, []);

  const move = loaded ? 'tw-transition-all tw-translate-y-0' : 'tw-translate-y-32'
  const inlineClass = inline ? '' : 'form-footer tw-fixed tw-py-6 tw-px-16 tw-bottom-0 tw-right-0 lg:tw-right-6 tw-left-0 lg:tw-left-6 tw-bg-[image:var(--bg-trans)] tw-backdrop-blur-sm'

  return (
    <div className={classNames("tw-flex  tw-rounded-t-lg tw-justify-center tw-gap-6", className, move, inlineClass)}>
      {!cancelButton ? <button className="cancel-button tw-bg-transparent" type="button" onClick={() => cancel()}> {t('buttons.Cancel')}</button> : cancelButton}
      {!saveButton ? <Button id="save-form" icon="save" type="submit" section="buttons" name="Save" /> : saveButton}
    </div>
  )
}

export function submitFailure(errors) {
    const firstError = Object.keys(errors)[0];
    const el = document.querySelector(`[id="${firstError}"]`);
    const position = el.getBoundingClientRect().top + document.documentElement.scrollTop;
  
    const offset = 100;
  
    window.scrollTo({ top: position - offset, behavior: 'smooth' });
}

export function ViewField(props) {
  const { component } = props
  const details = { input: {...props}, disabled: true, copy: true, meta: { touched: false, error: false, warning: false } }
  if (component === 'blank') {
    return <div className="input"><div className="textarea">{props.value}</div></div>
  }
  return component(details)
}

export function TabList(props) {
  const { tabList, currentTab, setCurrentTab } = props;
  const [tabWidth, setTabWidth] = useState(0);
  const [initial, setInitial] = useState(true);
  const [availableWidth, setAvailableWidth] = useState(0);
  const { t } = useTranslation('common');
  const tabsRef = useRef(null)
  const addArrows = tabWidth > availableWidth

  useEffect(() => {
    setTimeout(() => {
      setTabWidth(tabsRef.current && tabsRef.current.scrollWidth)
      setAvailableWidth(tabsRef.current && tabsRef.current.offsetWidth)
    }, 500)
  }, [])

  useEffect(() => {
    setTabWidth(tabsRef.current && tabsRef.current.scrollWidth)
    setAvailableWidth(tabsRef.current && tabsRef.current.offsetWidth)
  }, [addArrows])

  const updateTab = (location) => {
      const { search } = location
      const tab = new URLSearchParams(search).get('tab') || tabList[0].key
      if (tab !== currentTab) {
        setCurrentTab(tab)
      }
  }

  useEffect(() => {
    if (props.location) {
      // if browser back/forward buttons are used
      props.history.listen((loc, action) => {
        if (action === "POP") {
          updateTab(loc)
        }
      });
      // Initial browser load
      updateTab(props.location)
    }
  }, []);

  // Update history when tab is clicked
  useEffect(() => {
    if (props.history && !initial) {
      const params = new URLSearchParams(props.location.search)
      if (currentTab === tabList[0].key) {
        params.delete('tab') // on first tab, don't want it to set a search param, but do want it to update the history
      } else {
        params.set('tab', currentTab)
      }
      props.history.push({ pathname: props.location.pathname, search: params.toString() });
    }
    if (initial) {
      setInitial(false)
    }
  }, [currentTab]);


  const scrollForward = () => {
    const amount = tabsRef.current.scrollLeft + (availableWidth - 80)
    tabsRef.current.scrollTo({
      top: 0,
      left: amount,
      behavior: 'smooth'
    })
  }
  const scrollBackward = () => {
    const amount = tabsRef.current.scrollLeft - (availableWidth - 80)
    tabsRef.current.scrollTo({
      top: 0,
      left: amount,
      behavior: 'smooth'
    })
  }

  return (
    <React.Fragment>
      <div className="tw-flex tw-w-full tw-mb-6">
      {addArrows && (
            <div onClick={() => scrollBackward()} className="tw-w-8 tw-rounded tw-flex tw-items-center tw-justify-center -tw-ml-6 tw-text-xl"><FontAwesomeIcon icon={faChevronLeft} /></div>
          )}

          <nav ref={tabsRef} className={"tw-border-b tw-border-0 tw-border-solid tw-border-[color:var(--border-color)] tab-nav tw-block lg:tw-w-full tw-flex-1 tw-space-x-8 tw-whitespace-nowrap tw-overflow-x-auto"} aria-label={t('tables.tabs')}>
            {tabList && tabList.map((tab) => {
              if (!tab.isHidden) return (
              <button
                key={tab.key}
                onClick={() => setCurrentTab(tab.key)}
                className={classNames(
                  tab.key === currentTab
                    ? 'tw-border-blue-500 tw-font-bold'
                    : 'tw-border-transparent text-muted-extra hover:tw-border-blue-500/60 hover:tw-text-gray-700',
                  'tw-group tw-inline-flex tw-items-center tw-border-b-2 tw-border-0 tw-border-solid tw-py-4 tw-px-1 tw-font-semibold tw-bg-transparent'
                )}
                aria-current={tab.current ? 'page' : undefined}
              >
                <span>{t(tab.name)}</span>
              </button>
            )})}
          </nav>
        {addArrows && (
            <div onClick={() => scrollForward()} className="tw-w-8 tw-rounded tw-flex tw-items-center tw-justify-center -tw-mr-6 tw-text-xl"><FontAwesomeIcon icon={faChevronRight} /></div>
          )}

      </div>
    </React.Fragment>
  )
}
