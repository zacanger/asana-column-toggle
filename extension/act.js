;((window, document) => {
  /*
  // minimal store type thing
  // i should use this instead of basically treating the dom as a store
  const store = (state = {}) => {
    let ls = []

    return {
      subscribe: (l) => {
        ls.push(l)
      },
      unsubscribe: (l) => {
        if (ls.includes(l)) {
          ls.splice(ls.indexOf(l), 1)
        }
      },
      setState: (n) => {
        const p = state
        state = Object.assign({}, p, typeof n === 'function' ? n(p) : n)
        ls.forEach((l) => {
          l(state, p)
        })
      },
      getState: () => state
    }
  }

  const getKeyByValue = (value, object) =>
    Object.keys(object).find((key) => object[key] === value)

  const boolToDisplay = {
    block: true,
    none: false
  }
  */

  // build the side pane thing
  const target = document.createElement('div')
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
    // remove bits from previous board from the dom in the side pane
    const kids = [ ...target.children ]
    kids.forEach((kid) => {
      target.removeChild(kid)
    })

    // get the board id
    const h = window.location.href
    const lastSlash = h.lastIndexOf('/')
    const firstSplit = h.substr(0, lastSlash)
    const id = firstSplit.substring(firstSplit.lastIndexOf('/')).substr(1)

    const columnsMap = {}
    // get settings from local storage if they exist
    const visibilityMap = JSON.parse(window.localStorage[id] || '{}')
    const saveSelection = () => {
      window.localStorage[id] = JSON.stringify(visibilityMap)
    }
    // save settings on every selection change
    target.addEventListener('change', saveSelection)

    const allColumns = [ ...document.getElementsByClassName('BoardBody-columnSortableListSortableItem') ]
    const headers = allColumns.map((column) => column.firstElementChild.firstElementChild.textContent)

    headers.forEach((key, i) => {
      columnsMap[key] = allColumns[i]
      if (visibilityMap[key] === undefined) {
        visibilityMap[key] = true
      }
      columnsMap[key].style.display = visibilityMap[key] ? 'block' : 'none'
    })

    // clean up potentially removed columns
    Object.keys(visibilityMap).forEach((k) => {
      if (!headers.includes(k)) {
        delete visibilityMap[k]
      }
    })

    const toggleVisibility = (column) => {
      columnsMap[column].style.display = visibilityMap[column] ? 'none' : 'block'
      visibilityMap[column] = !visibilityMap[column]
    }

    // build each toggle
    headers.forEach((columnName) => {
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

  // load it up the first time
  window.onload = refreshState

  // poll for url changes
  let currentPage = window.location.href
  setInterval(() => {
    if (window.location.href !== currentPage) {
      refreshState()
      currentPage = window.location.href
    }
  }, 1000)

  // toggle open/closed with ctrl+u
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && (e.code === 'KeyU' || e.keyCode === 85)) {
      if (target.style.display === 'none') {
        target.style.display = 'block'
      } else {
        target.style.display = 'none'
      }
    }
  })
})(this, this.document)
