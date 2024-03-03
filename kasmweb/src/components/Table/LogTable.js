import React, { useState } from "react";
import { NewTable, StandardColumn, TableRow } from './NewTable';
import _ from "lodash";
import {useTranslation} from "react-i18next";
import { cyrb53 } from "../../utils/helpers";

// Main table
export default function Table(props) {
  const { data, history, id: reference, onAction: onBaseAction, actions, multiActions = [], columns, mainId: id, add, additionalButtons, search, onFetch, total, readOnly = false } = props
  const searchvalue = search || columns[0].accessor
  const { t } = useTranslation('common');
  
  const allColumns = () => {
    let cols = []
    columns.forEach((col, i) => {
      let newcol = {
        name: col.name,
        showByDefault: col.showByDefault !== undefined ? col.showByDefault : true,
        column: col.accessor,
        sortType: col.type,
        cell: col.cell || null,
        overwrite: col.overwrite || false,
        colSize: col.colSize || null,
        showBoolValue: col.showBoolValue || null
      }
      if (i === 0) {
        newcol.defaultSort = true
        newcol.defaultOrder = 'desc'
      }
      cols.push(newcol)
    })
    return cols
  }

  
  return (
    <NewTable id={id} search={searchvalue} add={add} readOnly={readOnly} additionalButtons={additionalButtons} multiActions={[]} actions={[]} onAction={onBaseAction} onFetch={onFetch} allColumns={allColumns()} data={data} total={total} reference={reference}>
      {({ multiSelect, selected, setCurrent, filteredData, columns }) => (
        <React.Fragment>
          {filteredData() && filteredData().length > 0 && filteredData().map((row, index) => {
            const useId = id ? row[id] : cyrb53(JSON.stringify(row) + index)
            return <div onClick={() => onBaseAction('view', row)} key={useId} className="tw-cursor-pointer"><Row row={row} id={useId} actions={[]} multiSelect={[]} multiActions={[]} selected={selected} setCurrent={setCurrent} onAction={onBaseAction} columns={columns} allColumns={allColumns()}></Row></div>
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

  const displayColumn = (columnType, first = false) => {
    const findCol = allColumns.find(c => c.column === columnType)
    const colName = findCol ? findCol.name : columnType
    const key = columnType + useId
    let main = String(_.get(row, columnType, '-'))
    if (findCol && findCol.cell) {
      main = findCol.cell({value: main, original: row, colName})
      if (findCol.overwrite) {
       return main
      }
    }
    switch (columnType) {
      default:
        return <StandardColumn key={key} main={main} sub={colName} first={first}></StandardColumn>
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
