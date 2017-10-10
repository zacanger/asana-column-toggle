;((window, document) => {
  const target = document.createElement('div') // build the side pane thing
  target.style.display = 'none'
  target.id = 'asana-column-toggle'
  document.body.appendChild(target)

  target.style.height = '100%'
  target.style.width = '200px'
  target.style.border = 'none'
  target.style.paddingTop = '16px'
  target.style.paddingBottom = '16px'
  target.style.paddingLeft = '8px'
  target.style.paddingRight = '8px'
  target.style.overflow = 'auto'
  target.style.outline = 'none'
  target.style.zIndex = '5000000'
  target.style.right = '0'
  target.style.top = '0'
  target.style.position = 'fixed'
  target.style.backgroundColor = '#e5e5e5'
  target.style.color = '#666'

  const refreshState = () => {
    const kids = [ ...target.children ]
    kids.forEach((kid) => { // remove bits from previous board from the dom in the side pane
      target.removeChild(kid)
    })

    const h = window.location.href
    const lastSlash = h.lastIndexOf('/')
    const firstSplit = h.substr(0, lastSlash)
    const id = firstSplit.substring(firstSplit.lastIndexOf('/')).substr(1) // the board id

    const columnsMap = {}
    const visibilityMap = JSON.parse(window.localStorage[id] || '{}') // get settings from local storage if they exist
    const saveSelection = () => {
      window.localStorage[id] = JSON.stringify(visibilityMap)
    }
    target.addEventListener('change', saveSelection) // save settings on every selection change

    const allColumns = [ ...document.getElementsByClassName('BoardBody-columnSortableListSortableItem') ]
    const headers = allColumns.map((column) => column.firstElementChild.firstElementChild.textContent)

    headers.forEach((key, i) => {
      columnsMap[key] = allColumns[i]
      if (visibilityMap[key] === undefined) {
        visibilityMap[key] = true
      }
      columnsMap[key].style.display = visibilityMap[key] ? 'block' : 'none'
    })

    Object.keys(visibilityMap).forEach((k) => { // clean up potentially removed columns
      if (!headers.includes(k)) {
        delete visibilityMap[k]
      }
    })

    const toggleVisibility = (column) => {
      columnsMap[column].style.display = visibilityMap[column] ? 'none' : 'block'
      visibilityMap[column] = !visibilityMap[column]
    }

    headers.forEach((columnName) => { // build each toggle
      const div = document.createElement('div')
      const label = document.createElement('label')
      const input = document.createElement('input')
      input.type = 'checkbox'
      input.id = columnName
      input.style.marginRight = '8px'
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
  }

  window.onload = refreshState // load it up the first time

  let currentPage = window.location.href // poll for url changes
  setInterval(() => {
    if (window.location.href !== currentPage) {
      refreshState()
      currentPage = window.location.href
    }
  }, 1000)

  document.addEventListener('keydown', (e) => { // toggle open/closed with ctrl+u
    if (e.ctrlKey && (e.code === 'KeyU' || e.keyCode === 85)) {
      if (target.style.display === 'none') {
        target.style.display = 'block'
      } else {
        target.style.display = 'none'
      }
    }
  })
})(this, this.document)
