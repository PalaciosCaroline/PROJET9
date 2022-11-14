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
    // if (iconCharged) iconCharged.forEach(icon => {
    //   icon.addEventListener('click', (icon) => {
    //     const billUrl = icon.getAttribute("data-bill-url")
    //     const downloadedImg = new Image;
    //     downloadedImg.src = billUrl;
    //     download(downloadedImg);
    //   })
    // })


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

  // chargeIcon = (icon) => {
  //   // e.preventDefault();
  //   const billUrl = icon.getAttribute("data-bill-url")
  //   console.log(billUrl)
  //   window.location.href = billUrl;
  //  }
   

  // startDownload = (icon) => {
  //   const billUrl = icon.getAttribute("data-bill-url")
  //   let imageURL = billUrl;
  
  //   const downloadedImg = new Image;
  //   downloadedImg.crossOrigin = "Anonymous";
  //   downloadedImg.addEventListener("load", imageReceived, false);
  //   downloadedImg.src = imageURL;
  // }

  // imageReceived() {
  //   let canvas = document.createElement("canvas");
  //   let context = canvas.getContext("2d");
  
  //   canvas.width = downloadedImg.width;
  //   canvas.height = downloadedImg.height;
  
  //   context.drawImage(downloadedImg, 0, 0);
  //   imageBox.appendChild(canvas);
  
  //   try {
  //     localStorage.setItem("saved-image-example", canvas.toDataURL("image/png"));
  //   }
  //   catch(err) {
  //     console.log("Error: " + err);
  //   }
  // }

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
