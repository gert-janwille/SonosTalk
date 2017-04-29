const {BrowserWindow} = require('electron').remote;

const input = document.querySelector('.txtcon');
const sound = document.querySelector('.range');
const form = document.querySelector('form');
const select = document.querySelector('.room');
const language = document.querySelector('.language');

const mbox = document.querySelector('.messages');

let msgs = [];

let counter = 0;
let minim = false;

const connected = false;

const init = data => {

  getRooms(data);

  document.querySelector('.resize').addEventListener('click', e => resize(e));
  document.querySelector('.overlay').classList.add('visible');
  document.querySelector('.delete').addEventListener('click', e => mbox.innerHTML = "");

  document.addEventListener('keydown', e => {

    if (e.keyCode === 9) {
      e.preventDefault();
      input.select()
    };
    if (e.keyCode === 13) Talk(e);
    if (e.keyCode === 38 || e.keyCode === 40) showPreMsg(e.keyCode);
  });

  form.addEventListener('submit', e => Talk(e));
}

const resize = e => {
  minim = !minim;
  let sizes = minim ? {w: 700, h: 150 } : {w: 800, h: 600 };

  if (minim) {
    BrowserWindow.getAllWindows()[0].setPosition(0, 0, true);
  }else{
    BrowserWindow.getAllWindows()[0].center();
  }

  BrowserWindow.getAllWindows()[0].setSize(sizes.w, sizes.h, true);

}

const Talk = e => {
  e.preventDefault();

  const data = {
    created: Date.now(),
    text: input.value,
    room: select.value,
    sound: sound.value,
    lang: language.value,
    role: "me"
  };

  msgs.push(data);
  counter = msgs.length;

  if (input.value !== '') SayIt(data);
  input.value = '';
}

getRooms = data => {
  data.forEach(d => {
    const item = d.members[0].roomName;

    let $option = html(`
    <option value="${item}">${item}</option>`);
    document.querySelector('.room').appendChild($option);
  })
}


const SayIt = string => {

  showmsg(string)

  fetch(`http://localhost:5005/${string.room}/say/${string.text}/${string.lang}/${string.sound}`)
    .then(d => {
      if (d.status === 200) {
        showmsg({created: Date.now(), text: `I've said in the ${string.room}.`, room: string.room, sound: string.sound, lang: string.lang, role: "sonos"})
      }else{
        showmsg({created: Date.now(), text: "Something went wrong :( try again", room: string.room, sound: string.sound, lang: string.lang, role: "sonos"})
      }

    })
}

const showmsg = data => {
    let $msg = html(`
    <p class="bericht ${data.role}">${data.text}</p>`);
    mbox.appendChild($msg);

    window.scrollTo(0, mbox.scrollHeight);
}

const showPreMsg = key => {
  if (msgs.length <= 0) return;

  if (key === 38 && counter > 0) counter--;
  if (key === 40 && counter < msgs.length) counter++;

  if (counter === msgs.length) {
    return input.value = "";
  }

  input.value = msgs[counter].text;
}

const html = (strings, ...values) => {

  let str = '';

  if(Array.isArray(strings)){
    for(let i = 0; i < strings.length; i++){
      if(strings[i]) str += strings[i];
      if(values[i]) str += values[i];
    }
  }else{
    str = strings;
  }

  let doc = new DOMParser().parseFromString(str.trim(), 'text/html');

  return doc.body.firstChild;

};

fetchData = () => {
  fetch("http://localhost:5005/zones")
    .then(r => r.json())
    .then(data =>{
      if (data.error) {
        setTimeout(fetchData, 1000)
      }else {
        init(data)
      }
    })
}

fetchData();
