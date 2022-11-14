import { ROUTES_PATH } from '../constants/routes.js'
import { formatDate, formatStatus } from "../app/format.js"
import Logout from "./Logout.js"

export default class {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
    if (buttonNewBill) buttonNewBill.addEventListener('click', this.handleClickNewBill)
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
    const iconCharged = document.querySelectorAll(`a[data-testid="icon-Charged"]`)
    if (iconEye) iconEye.forEach(icon => {
      icon.addEventListener('click', () => this.handleClickIconEye(icon))
    })
    if (iconCharged) iconCharged.forEach(icon => {
      icon.addEventListener('click', () => this.downloading(icon))
    })

    new Logout({ document, localStorage, onNavigate })
  }

  handleClickNewBill = () => {
    this.onNavigate(ROUTES_PATH['NewBill'])
  }

  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url")
    console.log(billUrl)
    const imgWidth = Math.floor($('#modaleFile').width() * 0.5)
    $('#modaleFile').find(".modal-body").html(`<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" data-testid="imageModal"/></div>`)
    $('#modaleFile').modal('show')
  }

  downloadImage = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url");
    const downloadedImg = new Image;
    downloadedImg.src = billUrl;
    download(downloadedImg);
  }

  downloading = (icon) => browser.downloads.download({
    url : icon.getAttribute("data-bill-url"),
    filename : icon.getAttribute("data-bill-filename"),
    conflictAction : 'uniquify'
  });
  

  downloadFile = (icon) => {
    fetch(url, { method: 'get', mode: 'no-cors', referrerPolicy: 'no-referrer' })
      .then(res => res.blob())
      .then(res => {
        const fileName = icon.getAttribute("data-bill-url");
        const aElement = document.createElement('a');
        aElement.setAttribute('download', fileName);
        const href = URL.createObjectURL(res);
        href = fileName;
        aElement.href = href;
        // aElement.setAttribute('href', href);
        aElement.setAttribute('target', '_blank');
        aElement.click();
        URL.revokeObjectURL(href);
      });
  };

  

  startDownload = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url")
    let imageURL = billUrl;
  
    const downloadedImg = new Image;
    downloadedImg.crossOrigin = "Anonymous";
    downloadedImg.addEventListener("load", imageReceived, false);
    downloadedImg.src = imageURL;
  }


  getBills = () => {
    if (this.store) {
      return this.store
      .bills()
      .list()
      .then(snapshot => {
        const bills = snapshot
        .map(doc => {
          try {
            return {
              ...doc,
              formatedDate: doc.date ? formatDate(doc.date) : doc.date,
              status: formatStatus(doc.status)
              }
            } catch(e) {
              // if for some reason, corrupted data was introduced, we manage here failing formatDate function
              // log the error and return unformatted date in that case
              console.log(e,'for',doc)
              return {
                ...doc,
                date: doc.date,
                status: formatStatus(doc.status)
              }
            }
          })
          console.log('length', bills.length)
        return bills
      }) 
      // rajouter à la fonction (gestion des erreurs de fetch)
      .catch(error => {
        throw error;
      })
    } 
  }
}
