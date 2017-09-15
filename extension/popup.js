const target = document.getElementById('asana-toggle-target')

const allColumns = [ ...document.getElementsByClassName('BoardBody-columnSortableListSortableItem') ]
const headers = allColumns.map((column) => column.firstElementChild.firstElementChild.textContent)

const columnsMap = {}
const visibilityMap = {}

headers.forEach((key, i) => {
  columnsMap[key] = allColumns[i]
  visibilityMap[key] = true
})

const toggleVisibility = (column) => {
  columnsMap[column].style.display = visibilityMap[column] ? 'none' : 'block'
  visibilityMap[column] = !visibilityMap[column]
}

headers.forEach((columnName) => {
  const div = document.createElement('div')
  const label = document.createElement('label')
  const input = document.createElement('input')
  input.type = 'checkbox'
  input.id = columnName
  input.dataset.why = 'toggler'
  input.dataset.column = columnName
  input.checked = visibilityMap[columnName]
  label.innerText = columnName
  label.htmlFor = columnName
  div.appendChild(input)
  div.appendChild(label)
  target.appendChild(div)
})

const checkboxes = [ ...document.querySelectorAll('input[data-why=toggler]') ]

checkboxes.forEach((box) => {
  box.addEventListener('change', (e) => {
    toggleVisibility(e.target.dataset.column)
  })
})
