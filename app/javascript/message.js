const moment = require("moment");

// HTMLエスケープ処理
function htmlEscape(str) {
  if (!str) return;
  return str.replace(/[&<>"'`]/g, function(match) {
    const escape = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#39;',
      '`': '&#x60;'
    };
    return escape[match];
  });
}

// 改行処理
function replaceBr(str) {
  return str.replace(/\r\n/g, "<br />").replace(/(\n|\r)/g, "<br />");
}

function sendMessage() {
  const submit = document.getElementById('submit');
  submit.addEventListener('click', (e) => {
    const formData = new FormData(document.getElementById('send-form'));
    const XHR = new XMLHttpRequest();
    const rootPath = location.pathname;
    XHR.open("POST", rootPath, true);
    XHR.responseType = "json";
    XHR.send(formData);
    XHR.onload = () => {
      if (formData.get("content") == "") {
        alert("Please type a message")
      } else if (XHR.status != 200) {
        alert(`Error ${XHR.status}: ${XHR.statusText}`);
        return null;
      } else if (XHR.readyState === XHR.DONE && XHR.status === 200) {
        const message = XHR.response.post;
        const escapeMessage = htmlEscape(message.content);
        const replaceHtml = replaceBr(escapeMessage);
        const user = XHR.response.user;
        const list = document.getElementById("list");
        const formText = document.getElementById("send-input");
        const createMoment = moment(message.created_at, 'YYYY-MM-DDTHH:mm:ssZ')
        const createTime = createMoment.format('MM/DD HH:mm');
        const HTML =`
          <div class="message-current-user">
            <div class="message-info">
              <p class="info-current-user"><a href="/users/${user.public_uid}" class="info-username">${user.username}</a></p>
            </div>
          </div>
          <div class="current-user-message-contents">
          <div class="message-date">
            <p class="current-user-info-date">${createTime}</p>
          </div>
            <div class="current-user-message-content">
              ${replaceHtml}
            </div>
          </div>`;
        list.insertAdjacentHTML("afterend", HTML);
        formText.value = "";
      };
    };
    e.preventDefault();
  });
}


window.addEventListener('load', sendMessage)