// require("./sonos/server.js");

const init = data => {

  getRooms(data);

  const input = document.querySelector('.txtcon');
  const sound = document.querySelector('.range');
  const form = document.querySelector('form');
  const select = document.querySelector('.room');
  const language = document.querySelector('.language');

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (input.value !== '') SayIt({text: input.value, room: select.value, sound: sound.value, lang: language.value});
    input.value = '';
  });
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

  fetch(`http://localhost:5005/${string.room}/say/${string.text.replace(/ /g,"%20")}/${string.lang}/${string.sound}`)
    .then(d => {
      console.log(d);
      if (d.status === 200) {
        document.querySelector('.succes').innerHTML = "It has been said!";
      }else {
        document.querySelector('.succes').innerHTML = "something went wrong";
      }
      document.querySelector('.succes').classList.add('visible');
    })
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
    .then(data => init(data))
    .catch(err => {
      setTimeout(fetchData, 1000)
    });
}

fetchData();
