const input = document.querySelector('.txtcon');
const sound = document.querySelector('.range');
const form = document.querySelector('form');
const select = document.querySelector('.room');
const language = document.querySelector('.language');

let msgs = [];

const init = data => {

  getRooms(data);

  document.addEventListener('keydown', e => {
    if (e.keyCode === 13) Talk(e);
  });
  form.addEventListener('submit', e => Talk(e));
}

const Talk = e => {
  e.preventDefault();
  if (input.value !== '') SayIt({created: Date.now(), text: input.value, room: select.value, sound: sound.value, lang: language.value, role: "me"});
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

  fetch(`http://localhost:5005/${string.room}/say/${string.text.replace(/ /g,"%20")}/${string.lang}/${string.sound}`)
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
    <p class="${data.role}">${data.text}</p>`);
    document.querySelector('.messages').appendChild($msg);
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
