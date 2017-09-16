;((window, document) => {
  const columnsMap = {}
  const visibilityMap = {}

  /*
  const visibilityMap = window.localStorage[document.title] || {}
  const throttle = (fn, wait, context = this) => {
    let timeout = null
    let cbArgs = null

    const later = () => {
      fn.apply(context, ...cbArgs)
      timeout = null
    }

    return (...args) => {
      if (!timeout) {
        cbArgs = args
        timeout = setTimeout(later, wait)
      }
    }
  }

  const saveSelection = throttle(() => {
    window.localStorage[document.title] = visibilityMap
  }, 1000)
  target.addEventListener('change', saveSelection)
  */

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

  window.onload = () => {
    const allColumns = [ ...document.getElementsByClassName('BoardBody-columnSortableListSortableItem') ]
    const headers = allColumns.map((column) => column.firstElementChild.firstElementChild.textContent)

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
