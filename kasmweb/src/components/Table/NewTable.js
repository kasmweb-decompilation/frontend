import React, { useState, useEffect, useRef, Fragment } from "react";
import { Dialog, Transition, Menu } from '@headlessui/react'
import { useDispatch, useSelector } from 'react-redux'
import _ from "lodash";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons/faXmark';
import { faUpDown } from '@fortawesome/free-solid-svg-icons/faUpDown';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faFilter } from '@fortawesome/free-solid-svg-icons/faFilter';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faExpand } from '@fortawesome/free-solid-svg-icons/faExpand';
import { faCompress } from '@fortawesome/free-solid-svg-icons/faCompress';
import { faGripLines } from '@fortawesome/free-solid-svg-icons/faGripLines';
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons/faEyeSlash';
import { faCircleChevronRight } from '@fortawesome/free-solid-svg-icons/faCircleChevronRight';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons/faChevronDown';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { faListOl } from '@fortawesome/free-solid-svg-icons/faListOl';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight';
import { faTable } from '@fortawesome/free-solid-svg-icons/faTable';
import { faTableCellsLarge } from '@fortawesome/free-solid-svg-icons/faTableCellsLarge';
import { faGrip } from '@fortawesome/free-solid-svg-icons/faGrip';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons/faCircleCheck';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons/faCircleXmark';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch';
import { Link } from "react-router-dom";
import DraggableList from 'react-draggable-list'
import { Trans, useTranslation } from "react-i18next";
import LoadingSpinner from "../../components/LoadingSpinner/index";
import moment from "moment";

const persistedTablesState = JSON.parse(window.localStorage.getItem("new_tables_states") || "{}");

function defaultState(allColumns) {
  const sort = allColumns.find(a => a.defaultSort === true)
  return {
    columns: allColumns.filter(a => a.showByDefault === true).map(a => a.column),
    sort: { name: sort.name, column: sort.column, order: sort.defaultOrder, sortType: sort.sortType, reverseSort: sort.reverseSort },
    perPage: 20
  }
}

const gridColumns = (allColumns, columnsCopy, firstColumn) => {
  const findFirstCol = allColumns.find(c => c.column === firstColumn)
  let output = findFirstCol && findFirstCol.colSize ? findFirstCol.colSize + ' ' : 'minmax(320px,1.5fr) '
  columnsCopy.forEach((col, i) => {
    const findCol = allColumns.find(c => c.column === col)
    if (findCol && findCol.colSize) {
      output += findCol.colSize + ' '
    } else {
      output += 'minmax(130px,1.2fr) '
    }
  })
  return output
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function NewTable({ children, multiActions, actions, allColumns, reference, data, id, name, onAction, add, additionalButtons, search, onFetch, triggerOnFetch, total, readOnly = false, additionalFilters }) {
  const dispatch = useDispatch()
  const [selected, setSelected] = useState(new Set);
  const [showFilters, setShowFilters] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [confirmationDetails, setConfirmationDetails] = useState({})
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(null)
  const [columns, setColumns] = useState([]);
  const [rowSort, setRowSort] = useState('');
  const [changeSort, setChangeSort] = useState(false);
  const [changePerPage, setChangePerPage] = useState(false);
  const [searchText, setSearchText] = useState("")

  const condensed = useSelector(state => state.tables.condensed) || false
  const getUsersLoading = useSelector(state => state.admin.getUsersLoading) || false

  const { t } = useTranslation('common');

  const searchRef = useRef(null);
  const hasFetch = !!onFetch
  const columnsCopy = _.clone(columns)
  const firstColumn = columnsCopy.shift()

  useEffect(() => {
    persistedTablesState[reference] = persistedTablesState[reference] || defaultState(allColumns);
    setColumns(persistedTablesState[reference].columns)
    setRowSort(persistedTablesState[reference].sort)
    setPerPage(persistedTablesState[reference].perPage)
  }, [])

  useEffect(() => {
    if (!hasFetch) {
      setPage(1)
    }
  }, [data])

  useEffect(() => {
    if (perPage > 0) {
      fetchData({ newPage: 1, newSearch: searchText })
    }
  }, [perPage, rowSort]);

  useEffect(() => {
    if (hasFetch && triggerOnFetch === true) {
      fetchData({ newPage: 1 })
      setSelected(new Set())
    }
  }, [triggerOnFetch]);


  useEffect(() => {
    if (searchText && searchText.length > 0) {
      if (searchRef && searchRef.current) searchRef.current.focus()
    }
  }, [data]);

  const toggleCondensed = () => {
    dispatch({
      type: "CONDENSED",
      value: !condensed
    })
  }

  const fetchData = async (newdata) => {
    if (hasFetch) {
      const silent = !data
      const { newPage, newSearch } = newdata
      let data = {
        page: (newPage - 1),
        pageSize: (perPage),
        silent,
        sortBy: rowSort.column,
        sortDirection: rowSort.order
      }
      if (newSearch) {
        const useColumns = allColumns.filter(a => columns.indexOf(a.column) !== -1)
        data.filters = []
        useColumns.filter(a => a.searchable).forEach(col => {
          data.filters.push({
            id: col.column,
            value: newSearch
          })
        })
      }
      onFetch(data)
    }
  }

  const filteredData = () => {
    const lowerSearch = String(searchText).toLowerCase() || "";
    const useColumns = allColumns.filter(a => columns.indexOf(a.column) !== -1)
    let output = data || []
    if (output) {
      const direction = rowSort.order === 'desc' ? -1 : 1
      output = applyFilters(output, direction)
      /*if (rowSort.order === 'desc') {
        output = output.reverse()
      }*/
      if (lowerSearch.length > 0) {
        output = output.filter(i => {
          return useColumns.some((c) => {
            let checkvalue = _.get(i, c.column)
            return typeof checkvalue === 'string' && String(checkvalue).toLowerCase().includes(lowerSearch)
          })
        })
      }

    }
    return output
  }

  const paginatedData = () => {
    let output = filteredData()
    if (hasFetch) {
      return output
    }

    const start = Number(perPage * (page - 1))
    const end = Number(perPage + start)

    return output.slice(start, end)

  }

  const applyFilters = (data, direction) => {
    if (data) {
      if (rowSort.reverseSort) {
        direction = (direction === 1) ? -1 : 1
      }
      return data.sort(function (a, b) {

        if (rowSort.sortType && rowSort.sortType === 'text') {
          if (a[rowSort.column] && typeof a[rowSort.column].localeCompare !== "undefined") {
            return direction*(a[rowSort.column].localeCompare(b[rowSort.column])) || direction*(b[id] - a[id])
          } else {
            return direction*(" ".localeCompare(b[rowSort.column])) || direction*(b[id] - a[id]);
          }
        }
        if (rowSort.sortType && rowSort.sortType === 'date') {
          if (a[rowSort.column]) {
            const aa = moment(a[rowSort.column])
            const bb = moment(b[rowSort.column])
            if (!aa.isValid()) return 1
            if (!bb.isValid()) return -1
            return direction*((+aa) - (+bb))
          }
        }
        return direction*(a[rowSort.column] - b[rowSort.column]) || direction*(b[id] - a[id]);
      })
    }
  }

  const allSelect = (e) => {
    let value = new Set()
    if (e.target.checked) {
      value = new Set(filteredData().map(a => a[id]));
    }
    setSelected(value)
  }

  const updateSort = (col) => {
    const findCol = allColumns.find(c => c.column === col)
    const newOrder = {
      ...rowSort,
      name: findCol.name,
      column: findCol.column,
      reverseSort: findCol.reverseSort,
      sortType: findCol.sortType || 'number'
    }
    setRowSort(newOrder)
    persistedTablesState[reference]['sort'] = newOrder
    window.localStorage.setItem("new_tables_states", JSON.stringify(persistedTablesState));
  }
  const updateOrder = (value) => {
    const newOrder = {
      ...rowSort,
      order: value,
    }
    setRowSort(newOrder)
    persistedTablesState[reference]['sort'] = newOrder
    window.localStorage.setItem("new_tables_states", JSON.stringify(persistedTablesState));
  }

  const updateSortOrder = (col, value) => {
    const findCol = allColumns.find(c => c.column === col)
    const newOrder = {
      ...rowSort,
      name: findCol.name,
      column: findCol.column,
      reverseSort: findCol.reverseSort,
      sortType: findCol.sortType || 'number',
      order: value,
    }
    setRowSort(newOrder)
    persistedTablesState[reference]['sort'] = newOrder
    window.localStorage.setItem("new_tables_states", JSON.stringify(persistedTablesState));

  }
  const updatePerPage = (value) => {
    setPerPage(value)
    setPage(1)
    persistedTablesState[reference]['perPage'] = value
    window.localStorage.setItem("new_tables_states", JSON.stringify(persistedTablesState));
    setChangePerPage(false)
  }

  const listChange = (newlist) => {
    const cols = newlist.map(c => c.column)
    const newColumns = [
      firstColumn,
      ...cols
    ]
    setColumns(newColumns)
    persistedTablesState[reference]['columns'] = newColumns
    window.localStorage.setItem("new_tables_states", JSON.stringify(persistedTablesState));
  }

  const addColumn = (col) => {
    const newColumns = [
      ...columns,
      col.column
    ]
    setColumns(newColumns)
    persistedTablesState[reference]['columns'] = newColumns
    window.localStorage.setItem("new_tables_states", JSON.stringify(persistedTablesState));
  }

  const removeColumn = (col) => {
    const newColumns = columns.filter(item => item !== col)
    setColumns(newColumns)
    persistedTablesState[reference]['columns'] = newColumns
    window.localStorage.setItem("new_tables_states", JSON.stringify(persistedTablesState));
  }

  const multiSelect = ({ id, checked }) => {
    const current = new Set(selected)
    if (checked) {
      current.add(id)
    } else {
      current.delete(id)
    }
    setSelected(current)
  };

  const debounceSearch = _.debounce((e) => {
    updateSearch(e)
  }, 400)

  const normalSearch = (e) => {
    updateSearch(e)
  }

  const updateSearch = (e) => {
    setSearchText(e.target.value)
    setPage(1)
    if (hasFetch) {
      fetchData({ newPage: 1, newSearch: e.target.value })
    }
  }

  const allSelected = filteredData() && filteredData().length === selected.size

  let usedColumns = []
  let draggableColumns = []
  let fixedColumn = {}
  columns.forEach((col, i) => {
    usedColumns.push(allColumns.find(a => a.column === col))
    if (i === 0) {
      fixedColumn = allColumns.find(a => a.column === col)
    }
    if (i > 0) {
      draggableColumns.push(allColumns.find(a => a.column === col))
    }
  })
  const unusedColumns = allColumns.filter(a => columns.indexOf(a.column) === -1)


  const noResults = (button = true) => {
    return (
      <div className="tw-flex tw-justify-center">
        <div className="tw-flex tw-flex-col tw-items-center tw-pt-8 tw-pb-24">
          <div className="tw-shadow-md tw-bg-white/40 dark:tw-bg-white/10 tw-flex tw-items-center tw-mb-8 tw-justify-center tw-rounded-full tw-w-32 tw-h-32 tw-text-5xl text-muted-more"><FontAwesomeIcon className="hover:tw-scale-105 tw-transition-all" icon={faTable} /></div>
          <div className="text-muted tw-font-semibold tw-mb-2">{t('tables.no-results')}</div>
          <div className="text-muted-more tw-mb-8">{t('tables.this-table-is-currently-empty')}</div>
          {button && add && add.action &&  <div className="pull-right add-btn tw-flex tw-gap-4"><Link to={{ pathname: add.action, search: add.search || null }}><button type="button" className="tw-rounded tw-h-10 tw-bg-blue-500 hover:tw-bg-slate-600 tw-text-sm tw-text-white tw-flex tw-items-center tw-transition"><span className="tw-h-10 tw-w-12 tw-flex tw-justify-center tw-items-center tw-bg-black/10"><FontAwesomeIcon icon={faPlus} /></span><span className="tw-px-4">{add.name}</span></button></Link></div>}
          {button && add && add.onClick && <div className="pull-right add-btn tw-flex tw-gap-4"><button onClick={add.onClick} type="button" className="tw-rounded tw-h-10 tw-bg-blue-500 hover:tw-bg-slate-600 tw-text-sm tw-text-white tw-flex tw-items-center tw-transition"><span className="tw-h-10 tw-w-12 tw-flex tw-justify-center tw-items-center tw-bg-black/10"><FontAwesomeIcon icon={faPlus} /></span><span className="tw-px-4">{add.name}</span></button></div>}
        </div>
      </div>
    )
  }

  const condensedIcon = () => {
    if (condensed) return <React.Fragment><FontAwesomeIcon className="tw-hidden lg:tw-inline-block" icon={faTableCellsLarge} /><FontAwesomeIcon className="lg:tw-hidden tw-inline-block" icon={faExpand} /></React.Fragment>
    return <React.Fragment><FontAwesomeIcon className="tw-hidden lg:tw-inline-block" icon={faGrip} /><FontAwesomeIcon className="lg:tw-hidden tw-inline-block" icon={faCompress} /></React.Fragment>
  }

  const headerColumn = (key, first) => {
    const findCol = allColumns.find(c => c.column === key)
    const colName = findCol ? findCol.name : key
    const sortUp = (rowSort.column === key && rowSort.order === 'asc') ? ' tw-bg-blue-500 tw-text-white' : ' tw-bg-white/40 dark:tw-bg-white/10'
    const sortDown = (rowSort.column === key && rowSort.order === 'desc') ? ' tw-bg-blue-500 tw-text-white' : ' tw-bg-white/40 dark:tw-bg-white/10'
    const firstCol = (first) ? ' lg:tw-pl-12 tw-items-start' : ' tw-pl-4 tw-items-center'
    return (
      <div key={key + id} className={"tw-py-1 lg:tw-p-3 tw-flex tw-leading-none lg:tw-flex-col tw-flex-1 tw-gap-1 tw-min-h-[40px]" + firstCol}>
        <div className="tw-font-bold tw-text-xs">{colName} {!first && <button onClick={() => removeColumn(key)} className={"tw-bg-transparent tw-px-2 tw-py-1 hover:tw-text-red-600 tw-font-xs"}><FontAwesomeIcon icon={faEyeSlash} /></button>}</div>
        {data && data.length > 1 && (<div className="tw-flex tw-gap-1">
          <button onClick={() => updateSortOrder(key, 'desc')} className={"tw-px-2 tw-py-1 tw-rounded tw-border tw-font-xs tw-border-solid tw-border-black/10" + sortDown}><FontAwesomeIcon icon={faChevronDown} /></button>
          <button onClick={() => updateSortOrder(key, 'asc')} className={"tw-px-2 tw-py-1 tw-rounded tw-border tw-font-xs tw-border-solid tw-border-black/10" + sortUp}><FontAwesomeIcon icon={faChevronUp} /></button>
        </div>)}
      </div>)

  }

  return (
    <React.Fragment>
      {(data && data.length > 0) || searchText.length > 0 ?
        (<React.Fragment>
          <div className="tw-flex tw-flex-col tw-py-6 tw-relative">
            
            {!readOnly &&<div className="tw-flex tw-flex-col-reverse lg:tw-flex-row tw-gap-4 tw-mb-4 tw-justify-between tw-items-center">
              <div className="tw-flex tw-w-full lg:tw-max-w-sm">
                <input type="tablesearch" name="tablesearch" ref={searchRef} onChange={hasFetch ? debounceSearch : normalSearch} defaultValue={searchText} className="tw-shadow-md tw-block tw-flex-1 tw-rounded-md tw-bg-white/70 tw-border-none dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-p-4 tw-py-2 text-muted placeholder:tw-text-gray-400 focus:tw-ring-2 focus:tw-ring-inset focus:tw-ring-blue-500 sm:tw-text-sm sm:tw-leading-6" placeholder={t('tables.search')} />
                <button className="tw-shadow-md tw-flex tw-h-10 tw-ml-2 tw-px-3 tw-gap-3 tw-items-center tw-transition tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid hover:tw-bg-slate-600 hover:tw-text-white tw-rounded" onClick={() => setShowFilters(true)}><FontAwesomeIcon icon={faFilter} /> {t('tables.filters')}</button>
                <button className={"tw-shadow-md tw-flex tw-h-10 tw-ml-2 tw-px-3 tw-gap-3 tw-items-center tw-transition dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid hover:tw-bg-slate-600 hover:tw-text-white tw-rounded" + (condensed ? ' tw-bg-blue-500 tw-text-white' : ' tw-bg-white/70 dark:tw-bg-slate-900/70')} onClick={() => toggleCondensed(!condensed)}>{condensedIcon()}</button>
              </div>
              {add && add.action && <div className="pull-right add-btn tw-w-full lg:tw-w-auto tw-flex tw-flex-wrap tw-gap-4">{additionalButtons}<Link to={{ pathname: add.action, search: add.search || null }}><button className="tw-rounded tw-w-full sm:tw-w-auto tw-h-10 tw-bg-blue-500 hover:tw-bg-slate-600 tw-text-sm tw-text-white tw-flex tw-items-center tw-transition"><span className="tw-h-10 tw-w-12 tw-flex tw-justify-center tw-items-center tw-bg-black/10"><FontAwesomeIcon icon={faPlus} /></span><span className="tw-px-4 tw-flex-1 tw-pr-10">{add.name}</span></button></Link></div>}
              {add && add.onClick && <div className="pull-right add-btn tw-w-full lg:tw-w-auto tw-flex tw-flex-wrap tw-gap-4">{additionalButtons}<button onClick={add.onClick} className="tw-rounded tw-w-full sm:tw-w-auto tw-h-10 tw-bg-blue-500 hover:tw-bg-slate-600 tw-text-sm tw-text-white tw-flex tw-items-center tw-transition"><span className="tw-h-10 tw-w-12 tw-flex tw-justify-center tw-items-center tw-bg-black/10"><FontAwesomeIcon icon={faPlus} /></span><span className="tw-px-4 tw-flex-1 tw-pr-10">{add.name}</span></button></div>}
              {!add && additionalButtons && <div className="pull-right add-btn tw-w-full lg:tw-w-auto tw-flex tw-flex-wrap tw-gap-4">{additionalButtons}</div>}
            </div>}
            {getUsersLoading ? <div><LoadingSpinner /></div> : <React.Fragment>
              {filteredData().length > 0 ? (
                <React.Fragment>
                  {!readOnly && <Paginate location="top" data={data} id={id} items={hasFetch ? total : filteredData().length} perPage={perPage} page={page} setNewPage={setPage} fetchData={fetchData} searchText={searchText} hasFetch={hasFetch} selected={selected} allSelected={allSelected} allSelect={allSelect} multiActions={multiActions} actions={actions} setConfirmationDetails={setConfirmationDetails} setConfirmationOpen={setConfirmationOpen} onAction={onAction} setSelected={setSelected} />}
                  <div className={"tw-flex tw-flex-col tw-gap-3" + (condensed ? ' lg:tw-gap-0' : '')}>
                    {condensed && (
                      <div>
                        <div className={'tw-hidden lg:tw-grid lg:tw-grid-flow-col tw-bg-white/40 tw-border tw-border-solid tw-rounded-b-none tw-border-[color:var(--border2-color)] dark:tw-bg-slate-900/70 tw-rounded' + (actions && actions.length > 0 ? ' lg:tw-grid-cols-[1fr_60px]' : ' lg:tw-grid-cols-[1fr]')}>
                          <div style={{ gridTemplateColumns: gridColumns(allColumns, columnsCopy, firstColumn) }} className={"tw-flex tw-relative tw-overflow-auto tw-flex-col tw-h-full lg:tw-pr-5 lg:tw-grid lg:tw-grid-flow-col lg:tw-items-center tw-p-2 lg:tw-p-0 tw-w-full tw-justify-between tw-border-0 tw-border-solid group-hover:tw-border-transparent tw-border-black/10 dark:tw-border-slate-700/70 tw-transition" + (actions && actions.length > 0 ? ' lg:tw-border-r' : '')}>
                            {headerColumn(firstColumn, true)}
                            {columnsCopy && columnsCopy.length > 0 && columnsCopy.map(key => headerColumn(key, false))}
                          </div>
                          {actions && actions.length > 0 && <div></div>}
                        </div>
                      </div>
                    )}
                    
                    {children({ multiSelect, selected, filteredData: paginatedData, name, columns, multiActions })}

                  </div>
                  {!readOnly && <Paginate location="bottom" data={data} id={id} items={hasFetch ? total : filteredData().length} perPage={perPage} page={page} setNewPage={setPage} fetchData={fetchData} hasFetch={hasFetch} searchText={searchText} selected={selected} allSelected={allSelected} allSelect={allSelect} multiActions={multiActions} actions={actions} setConfirmationDetails={setConfirmationDetails} setConfirmationOpen={setConfirmationOpen} onAction={onAction} setSelected={setSelected} />}
                </React.Fragment>
              ) : noResults(false)}

            </React.Fragment>}
          </div>
          {showFilters && (
            <div style={{ background: 'var(--bg)' }} className="tw-fixed tw-overflow-auto tw-z-[1050] tw-top-0 tw-right-0 tw-bottom-0  tw-w-full tw-max-w-xs tw-border-0 tw-border-l tw-border-solid tw-border-[color:var(--border-color)]">
              <div className="tw-bg-blue-500 tw-px-4 tw-py-6 sm:tw-px-6">
                <div className="tw-flex tw-items-center tw-justify-between">
                  <h2 className="tw-text-base tw-m-0 tw-font-semibold tw-leading-6 tw-break-all tw-text-white" id="slide-over-title">{t('tables.filters')}</h2>
                  <div className="tw-ml-3 tw-flex tw-h-7 tw-items-center">
                    <button onClick={() => setShowFilters(false)} type="button" className="tw-rounded-md tw-bg-blue-500 tw-text-indigo-200 hover:tw-text-white focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-white">
                      <span className="tw-sr-only">{t('tables.close-panel')}</span>
                      <FontAwesomeIcon className="tw-w-5 tw-h-5 tw-mt-1" icon={faXmark} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="tw-flex tw-flex-col tw-px-8 tw-mt-6">

                <div className="tw-w-full tw-flex tw-justify-between tw-h-8">
                  <span><FontAwesomeIcon className="tw-mr-2 tw-opacity-60" icon={faUpDown} /> {t('tables.sort-by')}</span>
                  <span onClick={() => setChangeSort(!changeSort)} className="text-muted-more tw-cursor-pointer hover:tw-font-semibold">{rowSort.name} &gt;</span>
                </div>
                {changeSort && (
                  <React.Fragment>
                    <div className="tw-relative tw-mb-3 tw-mt-2">
                      <select onChange={(e) => updateSort(e.target.value)} value={rowSort.column} className="tw-block tw-w-full tw-rounded-md tw-border-0 tw-py-1.5 tw-pl-3 tw-pr-10 tw-ring-1 tw-ring-inset tw-ring-[color:var(--border-color)] focus:tw-ring-2 focus:tw-ring-blue-500 sm:tw-text-sm sm:tw-leading-6">
                        {usedColumns && usedColumns.map(col => <option key={col.column} value={col.column}>{col.name}</option>)}
                      </select>
                      <select onChange={(e) => updateOrder(e.target.value)} value={rowSort.order} className="tw-mt-2 tw-block tw-w-full tw-rounded-md tw-border-0 tw-py-1.5 tw-pl-3 tw-pr-10 tw-ring-1 tw-ring-inset tw-ring-[color:var(--border-color)] focus:tw-ring-2 focus:tw-ring-blue-500 sm:tw-text-sm sm:tw-leading-6">
                        <option value="asc">{t('tables.ascending')}</option>
                        <option value="desc">{t('tables.descending')}</option>
                      </select>
                      <div onClick={() => setChangeSort(!changeSort)} className="tw-absolute -tw-right-6 tw-top-0 tw-h-full tw-flex tw-items-center tw-cursor-pointer">
                        <FontAwesomeIcon className="tw-w-4 tw-h-4" icon={faXmark} />
                      </div>
                    </div>
                  </React.Fragment>
                )}
                <div className="tw-w-full tw-flex tw-justify-between tw-h-8">
                  <span><FontAwesomeIcon className="tw-mr-2 tw-opacity-60" icon={faListOl} /> {t('tables.rows-per-page')}</span>
                  <span onClick={() => setChangePerPage(!changePerPage)} className="text-muted-more tw-cursor-pointer hover:tw-font-semibold">{perPage} &gt;</span>
                </div>
                {changePerPage && (
                  <React.Fragment>
                    <div className="tw-relative tw-mb-3 tw-mt-2">
                      <select onChange={(e) => updatePerPage(Number(e.target.value))} value={perPage} className="tw-block tw-w-full tw-rounded-md tw-border-0 tw-py-1.5 tw-pl-3 tw-pr-10 tw-ring-1 tw-ring-inset tw-ring-[color:var(--border-color)] focus:tw-ring-2 focus:tw-ring-blue-500 sm:tw-text-sm sm:tw-leading-6">
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                      <div onClick={() => setChangePerPage(false)} className="tw-absolute -tw-right-6 tw-top-0 tw-h-full tw-flex tw-items-center tw-cursor-pointer">
                        <FontAwesomeIcon className="tw-w-4 tw-h-4" icon={faXmark} />
                      </div>
                    </div>

                  </React.Fragment>
                )}
                {additionalFilters}
              </div>
              <div className="tw-border-0 tw-border-t tw-border-solid tw-border-[color:var(--border-color)] tw-pt-6 tw-px-8 tw-my-6 text-muted-extra tw-font-semibold tw-text-xs tw-uppercase tw-tracking-widest">{t('tables.visible-columns')}</div>
              <div className="tw-px-8">
                <div className="tw-flex tw-items-center tw-justify-between tw-mb-[10px]">
                  <div className="">{fixedColumn.name}</div>
                  <FontAwesomeIcon className="tw-opacity-60 tw-mr-[2px]" icon={faLock} />
                </div>

                <DraggableList
                  list={draggableColumns}
                  itemKey="column"
                  template={ColumnView}
                  container={() => document.body}
                  onMoveEnd={(newList) => listChange(newList)}
                  commonProps={{ removeColumn }}
                  className="tw-px-8"
                >
                </DraggableList>
              </div>
              {unusedColumns && unusedColumns.length > 0 && (
                <React.Fragment>
                  <div className="tw-border-0 tw-border-t tw-border-solid tw-border-[color:var(--border-color)] tw-pt-6 tw-px-8 tw-my-6 text-muted-extra tw-font-semibold tw-text-xs tw-uppercase tw-tracking-widest">{t('tables.hidden-columns')}</div>
                  <div className="tw-px-8">
                    {unusedColumns && unusedColumns.map(col => (
                      <div key={col.column} className="tw-flex tw-h-6 tw-items-center tw-justify-between tw-mb-2"><div>{col.name}</div><FontAwesomeIcon className="hover:tw-scale-105 tw-cursor-pointer tw-transition-all" onClick={() => addColumn(col)} icon={faEyeSlash} /></div>
                    ))}
                  </div>
                </React.Fragment>
              )}
            </div>

          )}
          {confirmationDetails && (
            <ConfirmAction
              confirmationDetails={confirmationDetails}
              open={confirmationOpen}
              setOpen={setConfirmationOpen}
              onAction={onAction}
            />

          )}
        </React.Fragment>)
        : noResults()
      }
    </React.Fragment>
  )
}

export function Paginate(props) {
  const { items, setNewPage, data, perPage, id, page, location, selected, allSelected, allSelect, actions, multiActions, setConfirmationDetails, setConfirmationOpen, onAction, setSelected, fetchData, hasFetch, searchText } = props;
  const { t } = useTranslation('common');
  const [pagePicker, setPagePicker] = useState({ before: false, after: false })
  const total = items || 0
  const pages = Math.ceil(total / perPage)

  if (pages === 1 && location === 'bottom') return

  const hasMulti = (multiActions.length > 0)

  const start = ((page - 1) * perPage) + 1
  let end = page * perPage

  if (end > total) {
    end = total
  }

  const setPage = (newPage) => {
    let page = Number(newPage)
    if (page < 1) page = 1
    if (page > pages) page = pages
    setNewPage(page)
    if (hasFetch) {
      fetchData({ newPage: page, newSearch: searchText })
    }
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
    }

    return <span key={'seperator-' + location + type} className="tw-relative tw-inline-flex tw-items-center tw-px-4 tw-py-2 tw-text-sm tw-font-semibold tw-ring-1 tw-ring-inset tw-ring-black/10 focus:outline-offset-0">
      <span onClick={() => updatePagePicker(type, true)} className="tw-opacity-70 tw-cursor-pointer">
        {pagePicker[type] ? <input type="number" onKeyUp={(event) => {
          if (event.key === 'Enter') {
            setPage(event.target.value)
            updatePagePicker(type, false)
          }
        }} /> : '...'}
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
  const itemtotal = total || 0
  return (
    <div className={"tw-shadow-md tw-flex tw-flex-wrap tw-rounded tw-items-center tw-relative tw-justify-between tw-bg-white/70 dark:tw-bg-slate-900/70 dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-px-4 tw-py-0 sm:tw-px-3" + (location && location === 'top' ? ' tw-mb-3' : ' tw-mt-3')}>

      {selected.size > 0 && (
        <div className=" tw-bg-white dark:tw-bg-slate-900 tw-flex tw-flex-wrap tw-w-full tw-z-20 tw-rounded tw-absolute tw-left-0 lg:tw-top-0 -tw-top-28 sm:tw-h-[52px]">
          {hasMulti === true && (<div className="tw-p-4 tw-py-3 tw-flex tw-items-center">
            <input checked={allSelected} onChange={allSelect} aria-description={t('tables.multi-select-checkbox')} name="userselect[]" type="checkbox" className="tw-h-4 tw-w-4 tw-rounded tw-border-gray-300 tw-border-solid tw-text-blue-500 focus:tw-ring-blue-500" />
          </div>)}
          <div className="tw-p-4 tw-py-3 tw-flex tw-items-center">
            {t('tables.selected-items', { count: (selected && selected.size) || 0 })}
          </div>
          <div className="tw-p-4 tw-py-3 tw-flex tw-items-center tw-min-h-[52px]">
            {selected.size === 1 && (
              actions.map((action, i) => {
                const kasm = data.find(i => i[id] == [...selected][0])
                let show = true
                if (action.isHidden) {
                  show = !action.isHidden(kasm)
                }
                if (show) return <button key={action.action} onClick={() => {
                  onAction(action.action, kasm)
                }} className="tw-bg-transparent tw-font-semibold tw-px-2 tw-text-blue-500 tw-opacity-70 hover:tw-opacity-100">{action.name}</button>
              })
            )}

            {selected.size > 1 && (
              multiActions.map((action, i) => {
                return <button key={action.action} onClick={() => {
                  if (action.confirm) {
                    setConfirmationDetails({
                      details: action.confirm,
                      action: action.action,
                      current: selected
                    })
                    setConfirmationOpen(true)

                  } else {
                    onAction(action.action, selected)
                  }
                }} className="tw-bg-transparent tw-font-semibold tw-px-2 tw-text-blue-500 tw-opacity-70 hover:tw-opacity-100">{action.name}</button>
              })
            )}
            <div onClick={() => setSelected(new Set())} className="tw-h-full tw-flex tw-items-center tw-ml-auto tw-px-2 tw-cursor-pointer">
              <FontAwesomeIcon className="tw-w-4 tw-h-4" icon={faXmark} />
            </div>
          </div>
        </div>
      )}

      <div className="tw-flex tw-flex-col md:tw-flex-row tw-gap-4 tw-origin-left tw-flex-1 tw-items-start lg:tw-items-center tw-justify-between tw-min-h-[52px] tw-py-4 lg:tw-py-2">
        <div className="tw-flex tw-items-center">
          {hasMulti === true && (<div className="tw-pl-1 tw-pr-4 tw-flex">
            <input checked={allSelected} onChange={allSelect} aria-description={t('tables.multi-select-checkbox')} name="userselect[]" type="checkbox" className="tw-h-4 tw-w-4 tw-rounded tw-border-gray-300 tw-border-solid tw-text-blue-500 focus:tw-ring-blue-500" />
          </div>)}
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
    </div>
  )
}

export function ConfirmAction(props) {
  const cancelButtonRef = useRef(null)
  const { open, setOpen, confirmationDetails: { action, current, details }, onAction, externalClose = false, showCloseButton = false } = props;
  const [processing, setProcessing] = useState(false);
  const { t } = useTranslation('common');
  
  useEffect(() => {
    if (open === false) setProcessing(false)
  }, [open]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="tw-relative tw-z-[999999]" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="tw-ease-out tw-duration-300"
          enterFrom="tw-opacity-0"
          enterTo="tw-opacity-100"
          leave="tw-ease-in tw-duration-200"
          leaveFrom="tw-opacity-100"
          leaveTo="tw-opacity-0"
        >
          <div className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-70 tw-transition-opacity" />
        </Transition.Child>
        <div className="tw-fixed tw-inset-0 tw-z-[999999] tw-overflow-y-auto">
          <div className="tw-flex tw-min-h-full tw-items-center tw-justify-center tw-p-4 tw-text-center sm:tw-p-0">
            <Transition.Child
              as={Fragment}
              enter="tw-ease-out tw-duration-300"
              enterFrom="tw-opacity-0 tw-translate-y-4 sm:tw-translate-y-0 sm:tw-scale-95"
              enterTo="tw-opacity-100 tw-translate-y-0 sm:tw-scale-100"
              leave="tw-ease-in tw-duration-200"
              leaveFrom="tw-opacity-100 tw-translate-y-0 sm:tw-scale-100"
              leaveTo="tw-opacity-0 tw-translate-y-4 sm:tw-translate-y-0 sm:tw-scale-95"
            >
              <Dialog.Panel className="tw-relative tw-transform tw-overflow-hidden tw-rounded-xl tw-bg-[var(--modal-bg)] tw-px-4 tw-pb-4 tw-pt-5 tw-text-left tw-shadow-[0_0_15px_rgba(0,0,0,0.4)] tw-transition-all sm:tw-my-8 sm:tw-w-full sm:tw-max-w-lg sm:tw-p-6">
                {showCloseButton && <div onClick={() => setOpen(false)} className="tw-absolute tw-top-2 tw-group tw-cursor-pointer tw-right-2 tw-flex tw-w-8 tw-h-8 tw-transition-colors tw-rounded-full tw-bg-black/5 hover:tw-bg-black/10 dark:tw-bg-black/10 dark:hover:tw-bg-black/20 tw-justify-center tw-items-center"><FontAwesomeIcon className="" icon={faTimes} /></div>}
                <div>
                  <div className={"tw-mx-auto tw-flex tw-h-12 tw-w-12 tw-items-center tw-border tw-border-solid tw-border-black/20 tw-justify-center tw-rounded-full " + (details && details.iconBg ? details.iconBg : '')}>
                    {details && details.icon}
                  </div>
                  <div className="tw-mt-3 tw-text-center sm:tw-mt-5">
                    <Dialog.Title as="h4" className="tw-font-semibold tw-leading-6 dark:tw-text-gray-100">
                      {details && details.title || ''}
                    </Dialog.Title>
                    <div className="tw-mt-2">
                      <p className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-300">
                        {details && details.text || ''}
                      </p>
                    </div>
                    <div className="tw-text-sm tw-text-gray-500 dark:tw-text-gray-300">
                    {details && details.additional}
                    </div>
                  </div>
                </div>
                <div className="tw-mt-5 sm:tw-mt-6 sm:tw-grid sm:tw-grid-flow-row-dense sm:tw-grid-cols-2 sm:tw-gap-3">
                  
                  <button
                    type="button"
                    className={"actionbutton " + (details && details.confirmBg ? details.confirmBg : 'tw-bg-blue-500')}
                    onClick={() => {
                      setProcessing(true)
                      onAction(action, current)
                      if (!externalClose) setOpen(false)
                    }}
                  >
                  {processing ? <div><FontAwesomeIcon icon={faCircleNotch} spin /></div> : details && details.confirmText }
                  </button>
                  <button
                    type="button"
                    className="cancelbutton"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    {t('buttons.Cancel')}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export function Actions(props) {
  const { current, setCurrent, quickAction, name, actions, onAction } = props;
  const { t } = useTranslation('common');

  return (
    <div style={{ background: 'var(--bg)' }} className="tw-fixed tw-z-[1050] tw-overflow-auto tw-top-0 tw-right-0 tw-bottom-0 tw-w-full lg:tw-max-w-xs tw-border-0 tw-border-l tw-border-solid tw-border-[color:var(--border-color)]">

      <div className="tw-bg-blue-500 tw-px-4 tw-py-4 sm:tw-px-6">
        <div className="tw-flex tw-items-center tw-justify-between">
          <h2 className="tw-text-base tw-m-0 tw-font-semibold tw-leading-6 tw-break-all tw-text-white" id="slide-over-title">{current[name]}</h2>
          <div className="tw-ml-3 tw-flex tw-h-7 tw-items-center">
            <button onClick={() => setCurrent(null)} type="button" className="tw-rounded-md tw-bg-blue-500 tw-text-indigo-200 hover:tw-text-white focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-white">
              <span className="tw-sr-only">{t('tables.close-panel')}</span>
              <FontAwesomeIcon className="tw-w-5 tw-h-5 tw-mt-1" icon={faXmark} />
            </button>
          </div>
        </div>
        <div className="tw-mt-1">
          <p className="tw-text-sm tw-text-blue-200">
            {t('tables.choose-one-of-the-options-belo')}
          </p>
        </div>
      </div>
      <div className="tw-flex tw-p-12 tw-px-7 tw-flex-wrap tw-gap-2">
        {actions && actions.map((action, i) => {
          return <button
            key={action.action}
            onClick={() => onAction(action.action, current)}
            className={"tw-rounded tw-w-20 tw-h-20 hover:tw-bg-slate-600 tw-overflow-hidden tw-border tw-border-solid tw-border-black/20 tw-text-sm hover:tw-text-white tw-flex tw-flex-col tw-items-center tw-justify-center tw-transition " + (action.bg ? action.bg : 'tw-bg-[color:var(--card-bg)]')}>

            <span className={"tw-text-xl tw-flex tw-h-10 tw-pt-2 tw-justify-center tw-items-end"}>{action.icon}</span>
            <span className="tw-px-1 tw-text-[11px] tw-font-semibold tw-flex tw-h-10 tw-justify-center tw-items-center tw-leading-none">{action.name}</span>
          </button>
        })
        }
      </div>
      <div className="tw-px-8 tw-pb-10">
        {quickAction}
      </div>
    </div>
  )
}

function ColumnView(props) {
  const { item, itemSelected, dragHandleProps, commonProps: { removeColumn } } = props;
  return <div className="tw-flex tw-items-center tw-justify-between">
    <div {...dragHandleProps}><FontAwesomeIcon className="tw-mr-2 tw-opacity-60" icon={faGripLines} />{item.name}</div>
    <FontAwesomeIcon className="hover:tw-scale-105 tw-cursor-pointer tw-transition-all" onClick={(e) => removeColumn(item.column)} icon={faEyeSlash} />
  </div>
}

export function StandardColumn({ main, sub, first = false, hasMulti, gap = 'tw-gap-2' }) {
  const condensed = useSelector(state => state.tables.condensed) || false
  if (first) {
    return (
      <div className={classNames("tw-p-4 tw-flex tw-flex-col tw-flex-1", gap, (hasMulti ? ' tw-w-[calc(100%_-_48px)]' : ''))}>
        {main && <span className="tw-font-semibold tw-truncate tw-w-full">{main}</span>}
        {sub && <span className={"text-muted-more tw-text-xs" + (condensed ? ' lg:tw-hidden' : '')}>{sub}</span>}
      </div>
    )
  }
  return (
    <div className={classNames("tw-pl-6 tw-py-1 lg:tw-p-4 lg:tw-flex-col tw-items-center tw-flex-1 tw-min-h-[40px]", gap, (condensed ? ' tw-flex' : ' tw-hidden lg:tw-flex'))}>
      {sub && <span className={"text-muted-more tw-text-xs lg:tw-order-2 tw-min-w-[110px] lg:tw-min-w-[60px] lg:tw-text-center" + (condensed ? ' lg:tw-hidden' : '')}>{sub}</span>}
      {main && <span className="tw-font-semibold tw-truncate tw-w-full tw-items-center lg:tw-text-center">{main}</span>}
    </div>
  )
}

export function ImageColumn({ image, main, sub, first = false }) {
  const condensed = useSelector(state => state.tables.condensed) || false
  return (
    <div className="tw-flex tw-items-center">
      <div className={"tw-flex tw-items-center" + (condensed ? ' tw-w-16 lg:tw-w-8 lg:tw-h-8' : ' tw-w-16')}>{image}</div>
      <div className="tw-p-4 tw-flex tw-flex-col tw-flex-1 tw-gap-2">
        {main && <span className="tw-font-semibold tw-w-full">{main}</span>}
        {sub && <span className={"text-muted-more tw-text-xs" + (condensed ? ' lg:tw-hidden' : '')}>{sub}</span>}
      </div>
    </div>

  )
}

export function DescriptionColumn({ main }) {
  const condensed = useSelector(state => state.tables.condensed) || false
  return (
    <div className={"tw-pl-6 tw-py-1 lg:tw-p-4 lg:tw-flex-col tw-flex-1 tw-gap-2 tw-min-h-[40px]" + (condensed ? ' tw-flex' : ' tw-hidden lg:tw-flex')}>
      {main && <span className="text-muted-more tw-text-xs lg:tw-text-center">{main}</span>}
    </div>

  )
}

const settingValue = (value) => {
  let output
  if (value === true || String(value).toLowerCase() === 'true') {
    output = <FontAwesomeIcon className="tw-text-2xl tw-text-emerald-600" icon={faCircleCheck} />;
  } else if (value === false || String(value).toLowerCase() === 'false') {
    output = <FontAwesomeIcon className="tw-text-2xl text-muted-extra" icon={faCircleXmark} />
  } else if (value === "") {
    output = "-";
  } else if (typeof value === "object") {
    output = JSON.stringify(value, null, 2);
  } else {
    output = value;
  }
  return output
}

export function SettingColumn({ main, sub }) {
  const condensed = useSelector(state => state.tables.condensed) || false
  
  const value = settingValue(main)
  return (
    <div className={"tw-pl-6 tw-py-1 lg:tw-p-4 lg:tw-flex-col tw-flex-1 tw-gap-2 tw-min-h-[40px] tw-items-center" + (condensed ? ' tw-flex' : ' tw-hidden lg:tw-flex')}>
      {sub && <span className={"text-muted-more tw-text-xs lg:tw-order-2" + (condensed ? ' lg:tw-hidden' : '')}>{sub}</span>}
      {main && <span className="text-muted-more tw-text-xs">{value}</span>}
    </div>

  )
}

export function ToggleColumn(props) {
  const { data, column, id, onChange, permission } = props
  const condensed = useSelector(state => state.tables.condensed) || false
  const checked = (String(data.value).toLowerCase() === 'true')
  const setId = column + '-' + data.original[id]

  /* const userInfo = JSON.parse(window.localStorage.getItem("user_info"));
  const hasPermission = _.get(userInfo, 'authorized_views.' + permission, false)
  if (!userInfo || !hasPermission) {
    return <SettingColumn main={data.value} sub={data.colName} />
  }*/
  return (
    <div className={"tw-pl-6 tw-py-1 lg:tw-p-4 lg:tw-flex-col tw-flex-1 tw-gap-2 tw-min-h-[40px] tw-items-center" + (condensed ? ' tw-flex' : ' tw-hidden lg:tw-flex')}>
      <span className={"text-muted-more tw-text-xs lg:tw-order-2" + (condensed ? ' lg:tw-hidden' : '')}>{data.colName}</span>
      <span className="text-muted-more tw-text-xs">
        <div className="toggle tw-flex tw-items-center">
          <input
            id={setId}
            name={column}
            type="checkbox"
            defaultChecked={checked}
            onChange={onChange}
          />
          <label className="tw-m-0" htmlFor={setId}>Toggle</label>

        </div>

      </span>
    </div>

  )
}

export function TableRow(props) {
  const { data, current, id, multiSelect, displayColumn, firstColumn, columnsCopy, selected, actions, onAction, multiActions, allColumns } = props;
  const condensed = useSelector(state => state.tables.condensed) || false
  const { t } = useTranslation('common');
  const [localcurrent, setCurrent] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showIcons, setShowIcons] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const hasMulti = (multiActions.length > 0)

  let activeRowCss = localcurrent && loaded ? ' tw-bg-blue-500 tw-ring-2 tw-ring-blue-500' : ' tw-bg-white/70 dark:tw-bg-slate-900/70'
  activeRowCss += (actions && actions.length > 0) ? ' lg:tw-grid-cols-[1fr_60px]' : ' lg:tw-grid-cols-[1fr]';
  const activeRowButtonColor = localcurrent === true ? ' !tw-text-white' : ' text-muted-more'
  const condensedRow = condensed ? ' tw-rounded-none tw-border tw-border-solid tw-border-t-0 tw-border-[color:var(--border2-color)]' : ''
  const animate = loaded ? ' tw-transition-all' : ' tw-transition-none'

  useEffect(() => {
    if (!localcurrent) {
      setCurrent(true)
      setShowActions(true)
      setTimeout(() => {
        setShowIcons(true)
      }, 50);
    } else {
      setShowIcons(false)
      setTimeout(() => {
        setShowActions(false)
        setCurrent(false)

      }, 50);

    }
  }, [showActions]);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true)
    }, 250)
  }, []);

  const showBoolValue = () => {
    const col = allColumns[0]
    if (col.showBoolValue) {
      const value = settingValue(data[col.showBoolValue])
      if (typeof value === 'object' && value.type && value.type.displayName === 'FontAwesomeIcon') {
        return <div className={'tw-p-4 tw-flex lg:tw-hidden tw-items-center'}>{value}</div>
      }
    }
  }

  const selectRow = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (showActions)
      setCurrent(data)
    setShowActions(!showActions)
  }
  const actionList = () => {
    let maxTime = Math.min(100, (300 / actions.length))
    return (
      <div className={"tw-absolute tw-right-0 lg:tw-right-[60px] lg:tw-pr-4 tw-pr-[65px] tw-h-full tw-pl-8 tw-rounded-l tw-gap-4 tw-px-4 tw-bg-blue-500 tw-origin-right" + (showActions ? ' tw-scale-x-100' : ' tw-scale-x-0') + animate + (loaded ? ' tw-flex' : ' tw-hidden')}>
        {_(actions).clone().reverse().map((action, i) => {
          let show = true
          if (action.isHidden) {
            show = !action.isHidden(data)
          }
          if (show) return (
        <div style={{ 'transitionDuration': ((i + 1) * maxTime) + 'ms' }} key={action.action} onClick={(e) => { e.stopPropagation(); onAction(action.action, data) }} className={"tw-flex tw-cursor-pointer tw-flex-col tw-justify-center tw-group/actions tw-relative tw-items-center" + (showIcons ? ' tw-opacity-100 tw-translate-y-0' : ' tw-opacity-0 tw-translate-y-4') + animate}>
          <div className="tw-text-xl tw-text-white tw-w-11 tw-h-11 tw-flex tw-justify-center tw-transition-all tw-items-center group-hover/actions:tw-translate-y-2  tw-rounded-full group-hover/actions:tw-bg-black/10 group-hover/actions:tw-shadow-inner">{action.icon}</div>
          <div className="tw-hidden tw-text-white tw-font-semibold tw-pointer-events-none lg:tw-inline-block tw-absolute tw-opacity-0 group-hover/actions:tw-opacity-100 group-hover/actions:-tw-translate-y-6 tw-transition-all tw-whitespace-nowrap tw-text-xs tw-bg-black/10 tw-rounded tw-p-0 tw-px-2 group-hover/actions:tw-shadow-inner">{action.name}</div>
        </div>)})}
      </div>)
  }
  const actionsLength = () => {
    if (actions && actions.length > 0) {
      return actions.filter((action) => {
        if (!(typeof action.isHidden === 'function')) {
          return true
        }
        return !action?.isHidden(data)
      }).length
    }

    return 0
  }

  return (
    <div>
      <div className={"tw-flex tw-relative tw-flex-col tw-shadow-md lg:tw-grid lg:tw-grid-flow-col tw-group/row lg:tw-items-center dark:tw-border dark:tw-border-slate-700/70 dark:tw-border-solid tw-rounded tw-w-full hover:tw-border-none tw-transition hover:tw-bg-blue-500 dark:hover:tw-bg-blue-500 dark:hover:tw-border-transparent hover:tw-z-10 hover:tw-ring-2 hover:tw-ring-blue-500" + activeRowCss + condensedRow}>
        <div style={{ gridTemplateColumns: gridColumns(allColumns, columnsCopy, firstColumn) }} className={"tw-flex tw-relative tw-overflow-auto tw-flex-col tw-h-full lg:tw-pr-5 lg:tw-grid lg:tw-grid-flow-col lg:tw-items-center tw-p-2 lg:tw-p-0 tw-bg-zinc-50 dark:tw-bg-slate-900/70 tw-rounded tw-w-full tw-justify-between tw-border-0 tw-border-solid group-hover:tw-border-transparent tw-border-black/10 dark:tw-border-slate-700/70 tw-transition" + (actions && actions.length > 0 ? ' lg:tw-border-r' : '')}>
          <label className={"tw-flex -tw-mx-2 lg:tw-mx-0 tw-border-0 tw-border-solid tw-border-[color:var(--border-color)] lg:tw-border-b-0 lg:tw-pb-0 lg:tw-mb-0 lg:tw-max-w-xs lg:tw-w-auto tw-m-0 tw-break-all tw-justify-start lg:tw-px-0" + (!condensed ? ' tw-mb-0' : ' tw-mb-4 tw-border-b tw-pb-2')}>
            {displayColumn(firstColumn, true, hasMulti)}
            {hasMulti ? (<div className="tw-p-4 tw-flex tw-items-center tw-order-first">
              <input checked={selected && selected.has(id)} onChange={(e) => multiSelect({ id: id, checked: e.target.checked })} aria-description={t('tables.multi-select-checkbox')} name="dataselect[]" type="checkbox" className="tw-h-4 tw-w-4 tw-rounded tw-border-[color:var(--border-color)] tw-bg-transparent tw-border-solid tw-text-blue-500 focus:tw-ring-blue-500" />
            </div>) : <div className="tw-p-2 tw-order-first"></div>}
            {showBoolValue()}
            {actions && actions.length > 0 && (
              <div className="lg:tw-hidden tw-ml-auto tw-flex tw-justify-end tw-items-center">
                <div onClick={selectRow} className={"tw-w-12 tw-pr-4 tw-h-full tw-cursor-pointer tw-flex tw-justify-end tw-items-center tw-relative tw-z-20"}>
                  <FontAwesomeIcon className={"tw-w-6 tw-h-6 tw-text-[color:var(--text-color-muted-more)] group-hover/row:!tw-text-white" + activeRowButtonColor + animate} icon={faCircleChevronRight} rotation={showActions ? 180 : 0} />
                </div>
              </div>
            )}

          </label>
          {columnsCopy && columnsCopy.length > 0 && columnsCopy.map(key => displayColumn(key, false))}
        </div>
        {actionsLength() > 0 && (
          <div className="tw-relative tw-h-full tw-hidden lg:tw-inline-block">
            <div onClick={selectRow} className="tw-min-h-[60px] tw-h-full tw-cursor-pointer tw-flex tw-justify-center tw-items-center tw-relative tw-z-20">
              <FontAwesomeIcon className={"tw-w-6 tw-h-6 group-hover/row:!tw-text-white" + activeRowButtonColor + animate} icon={faCircleChevronRight} rotation={showActions ? 180 : 0} />
            </div>
          </div>
        )}
        {actionList()}
      </div>
    </div>
  )
}
