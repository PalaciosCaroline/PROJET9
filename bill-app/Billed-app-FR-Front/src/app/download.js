
// Votre librairie favorite pour les calls HTTP
const client = {}

export default {
  download(url, data, progressCallBack) {
    let request = client.get(url, {
      progress: progressCallBack
    })
    return request.then((response) => {
      var result = document.createElement('a');
      var contentDisposition = response.headers.get('Content-Disposition') || '';
      var filename = contentDisposition.match(/filename=(.+);/)[1];
      filename = filename.replace(/"/g, '')
      return response.blob()
        .then(function (data) {
          result.href = window.URL.createObjectURL(data);
          result.target = '_self';
          result.download = filename;
          return result;
        })
    })
  }
}