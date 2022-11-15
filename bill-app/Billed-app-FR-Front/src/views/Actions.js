import eyeBlueIcon from "../assets/svg/eye_blue.js"
import downloadBlueIcon from "../assets/svg/download_blue.js"
import download from "../app/download.js"



export default (billUrl, fileName) => {
  return (
    `<div class="icon-actions">
      <div id="eye" data-testid="icon-eye" data-bill-url=${billUrl}>
      ${eyeBlueIcon}&nbsp
      </div>
      <a id="link" data-testid="icon-Charged" href=${billUrl} download=${fileName} data-bill-url=${billUrl} data-bill-filename=${fileName}>
      ${downloadBlueIcon}
      </a>
    </div>`
  )
}
