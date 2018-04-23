const XML = {
  STATE: {
    DONE: 4
  },
  STATUS: {
    OK: 200
  }
}

class FileManager {
  constructor(uri) {
    this.uri = uri

    this.preDefineElements()
    this.initListeners()
    this.showFolder()
  }

  template(item, id) {
    const div = document.createElement('div')
    div.className = "image"
    div.innerHTML = `<img src="${item.url}" alt=${item.filename} /><p>${item.filename}</p><span ${id ? `id=${id}` : ''} class="loader"></span>`
    
    return div
  }

  preDefineElements() {
    this.$dropzone = document.getElementById("dropzone")
    this.$images = document.getElementById("images")
    this.$total = document.getElementById("total")
  }

  initListeners() {
    this.initDrangAndDrop()
  }

  initDrangAndDrop() {
    this.$dropzone.ondragover = this.$dropzone.ondragenter = event => {
      event.stopPropagation()
      event.preventDefault()

      this.$dropzone.classList.add('over')
    }

    this.$dropzone.ondrop = this.$dropzone.ondragleave = event => {
      event.stopPropagation()
      event.preventDefault()

      this.$dropzone.classList.remove('over')

      this.processFiles(event.dataTransfer.files)
    }
  }

  appendPreviewAndProcess(file) {
    const reader = new FileReader();
    const id = uuid()

    reader.onload = e => {
      this.prependItem(this.template({
        url: e.target.result,
        filename: file.name,
      }, id))
      this.sendItem(file, id)
    }
    
    reader.readAsDataURL(file);
  }

  processFile(file) {
    var imageType = /image.*/;
    
    if (file.type.match(imageType)) {
      this.appendPreviewAndProcess(file)
    } else {
      alert('Error: wrong file format')
    }
  }

  processFiles(filesArray) {
    for (var i = 0; i < filesArray.length; i += 1) {
      this.processFile(filesArray[i])
    }
  }

  sendItem(item, previewItemId) {
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    const $previewItem = document.getElementById(previewItemId)
    xhr.open("POST", `${this.uri}/create`, true)

    xhr.upload.addEventListener("progress", e => {
      if (e.lengthComputable) {
        const percentage = Math.round((e.loaded * 100) / e.total)
        $previewItem.innerHTML = `${percentage}%`
      }
    }, false)

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XML.STATE.DONE && xhr.status === XML.STATUS.OK) {
        $previewItem.innerHTML = ''
        this.$total.innerHTML = parseInt(this.$total.innerHTML) + 1
      }

      if (xhr.readyState === XML.STATE.DONE && xhr.status !== XML.STATUS.OK) {
        alert('Upload error');
      }
    }

    fd.append('image', item);

    xhr.send(fd);
  }

  fetchItems() {
    return fetch(`${this.uri}?sort=createdAt%20desc&limit=100`)
      .then((res) => res.json())
      .catch(() => { alert('fetch error') })
  }

  renderItems(items) {
    items.forEach((item) => {
      this.renderItem(item)
    })
  }

  renderItem(item) {
    this.appendItem(this.template(item))
  }

  appendItem(newDOMItem) {
    this.$images.append(newDOMItem)
  }

  prependItem(newDOMItem) {
    this.$images.prepend(newDOMItem)
  }

  showTotal(total) {
    this.$total.innerHTML = total
  }

  showFolder() {
    this.fetchItems().then((items) => {
      this.showTotal(items.length)
      this.renderItems(items)
    })
  }
}