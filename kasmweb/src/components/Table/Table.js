import React, { useState } from "react";
import { NewTable, Actions, StandardColumn, TableRow, SettingColumn } from './NewTable';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons/faEye';
import { faPencil } from '@fortawesome/free-solid-svg-icons/faPencil';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import _ from "lodash";
import {useTranslation} from "react-i18next";
import { cyrb53 } from "../../utils/helpers";

// Main table
export default function Table(props) {
  const { data, history, id: reference, onAction: onBaseAction, actions, multiActions = [], columns, mainId: id, add, additionalButtons, additionalFilters, search, onFetch, triggerOnFetch, total, readOnly = false } = props
  const searchvalue = search || columns[0].accessor
  const { t } = useTranslation('common');

  // Handle all the actions
  const onAction = (action, item, value = null) => {
    const promises = []
    switch (action) {
      // Handle single row actins by passing them back up the chain
      default:
        onBaseAction(action, item)

    }
  }

  // A lot of the code in this file deals with converting what was used in the old table code
  // into something usable with the new.
  const convertedActions = actions ? actions.map(action => {
    // If the icon is an object then a FontAwesomeIcon should be being passed through,
    // return early in that case
    if (typeof action.icon === 'object') {
      return {
        name: action.description,
        action: action.id,
        icon: action.icon,
        isHidden: action.isHidden
      }
    }

    let newIcon
    // Convert the most ubiquitous icons from the old style into the new icons
    switch (action.icon) {
      case 'fa-eye':
        newIcon = <FontAwesomeIcon icon={faEye} />
        break;
      case 'fa-pencil':
        newIcon = <FontAwesomeIcon icon={faPencil} />
        break;
      case 'fa-trash':
        newIcon = <FontAwesomeIcon icon={faTrash} />
        break;
      // Fallback to using the old style icons. At some point we will want to remove the
      // old fontawesome file so all the icons will need to be updated before then.
      default:
        newIcon = <i className={`fa ${action.icon}`} aria-hidden="true" />
    }
    return ({
      name: action.description,
      action: action.id,
      icon: newIcon,
      isHidden: action.isHidden
    })
  }
  ) : []

  const convertedMultiActions = actions ? actions.reduce(function(result, action) {
    if(action.id === 'delete' || action.id === 'delete-server') {
      result.push({
        name: action.description,
        action: 'deleteMulti',
        confirm: { // If this is set, then a confirmation modal is triggered before the action is done
          title: t('tables.delete-items'),
          text: t('tables.are-you-sure-you-want-to-delet'),
          iconBg: 'tw-bg-pink-700 tw-text-white',
          icon: <FontAwesomeIcon icon={faTrash} />,
          confirmBg: 'tw-bg-pink-700',
          confirmText: t('tables.delete')
        }
      })
    }
    return result
  }, []
  ) : []

  const allMultiActions = [
    ...convertedMultiActions,
    ...multiActions
  ]
  
  const allColumns = () => {
    let cols = []
    columns.forEach((col, i) => {
      let newcol = {
        name: col.name,
        showByDefault: col.showByDefault !== undefined ? col.showByDefault : true,
        column: col.accessor,
        sortType: col.type,
        reverseSort: col.reverseSort || false,
        searchable: col.searchable || false,
        cell: col.cell || null,
        overwrite: col.overwrite || false,
        colSize: col.colSize || null,
        showBoolValue: col.showBoolValue || null
      }
      if (i === 0) {
        if (col.defaultSort === undefined || col.defaultSort === true) {
          newcol.defaultSort = true
          newcol.defaultOrder = col.defaultOrder || 'asc'
        }
      } else {
        if (col.defaultSort) {
          newcol.defaultSort = col.defaultSort
        }
        if (col.defaultOrder) {
          newcol.defaultOrder = col.defaultOrder
        }
      }
      cols.push(newcol)
    })
    return cols
  }

  return (
    <NewTable id={id} search={searchvalue} add={add} readOnly={readOnly} additionalFilters={additionalFilters} additionalButtons={additionalButtons} multiActions={allMultiActions} actions={convertedActions} onAction={onAction} onFetch={onFetch} triggerOnFetch={triggerOnFetch} allColumns={allColumns()} data={data} total={total} reference={reference}>
      {({ multiSelect, selected, setCurrent, filteredData, columns }) => (
        <React.Fragment>
          {filteredData() && filteredData().length > 0 && filteredData().map((row, index) => {
            const useId = id ? row[id] : cyrb53(JSON.stringify(row))
            return <Row key={useId} row={row} id={useId} actions={convertedActions} multiSelect={multiSelect} multiActions={allMultiActions} selected={selected} setCurrent={setCurrent} onAction={onAction} columns={columns} allColumns={allColumns()}></Row>
          })}
        </React.Fragment>
      )}
    </NewTable>
  )
}


// This function allows you to define how a single row should look for this table, the simplest option
// is to just use a <StandardColumn> for everything, this just has 2 options, main and sub, but you can
// Use any styling you like for a column
export function Row(props) {
  const [current, setCurrent] = useState(null);
  const { row, setSelect, multiSelect, selected, onAction, columns, id, allColumns, actions, multiActions } = props;

  const useId = id ? id : cyrb53(JSON.stringify(row))

  const columnsCopy = _.clone(columns)
  const firstColumn = columnsCopy.shift() // The first column is attached to the multiselect so is handled seperately

  const displayColumn = (columnType, first = false, hasMulti = true) => {
    const findCol = allColumns.find(c => c.column === columnType)
    const colName = findCol ? findCol.name : columnType

    const key = columnType + useId
    let main = _.get(row, columnType)
    if (typeof main === 'boolean') {
      columnType = 'boolean'
      main = String(main)
    } else if (typeof main === 'object') {
      main = JSON.stringify(main)
    } else {
      main = String(main || '-')
    }
    if (findCol && findCol.cell) {
      main = findCol.cell({value: main, original: row, colName, hasMulti})
      if (findCol.overwrite) {
       return main
      }
    }
    switch (columnType) {
      case 'boolean':
        return <SettingColumn key={key} main={main} sub={colName} first={first} hasMulti={hasMulti} />

      default:
        return <StandardColumn key={key} main={main || '-'} sub={colName} first={first} hasMulti={hasMulti}></StandardColumn>
    }
  }

  return (
    <React.Fragment>
      <TableRow
        data={row}
        current={current}
        setCurrent={setCurrent}
        id={useId}
        multiSelect={multiSelect}
        displayColumn={displayColumn}
        firstColumn={firstColumn}
        columnsCopy={columnsCopy}
        selected={selected}
        actions={actions}
        onAction={onAction}
        multiActions={multiActions}
        allColumns={allColumns}
      />
    </React.Fragment>
  )
}
