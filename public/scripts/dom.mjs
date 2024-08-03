import instance from './classes/connection';
import { resolution, canvas as canvasSettings } from './config';
import { fromCharacterToDom } from './lib/objectToDom';

const LoginButton = document.getElementById('LoginButton');
const RegisterButton = document.getElementById('RegisterButton');
const GuestButton = document.getElementById('GuestButton');

const UsernameInput = document.getElementById('UsernameInput');
const PasswordInput = document.getElementById('Passwordinput');

const LogOutButton = document.getElementById('LogOutButton');
const PlayButton = document.getElementById('PlayButton');
const HatButton = document.getElementById('HatButton');

const ChangeLogButton = document.getElementById('ChangeLogButton');
const SettingsButton = document.getElementById('SettingsButton');
const ProfilesButton = document.getElementById('ProfilesButton');

const CharacterList = document.getElementById('CharacterList');

const GameContainer = document.getElementById('GameContainer');
const canvas = document.getElementById('canvas');

const chat = document.getElementsByClassName('chat')[0];
const chatContainer = document.getElementsByClassName('chat-container')[0];
const chatInput = document.getElementById('chat-input');

function showLoggyMenu() {
  InputFormDiv.style.display = 'none';
  RegisterH1.style.display = 'none';
  RegisterButton.style.display = 'none';
  LobbyGame.style.display = 'block';
  GameContainer.style.display = 'none';
}

function showLoginMenu() {
  InputFormDiv.style.display = 'block';
  RegisterH1.style.display = 'block';
  RegisterButton.style.display = 'block';
  LobbyGame.style.display = 'none';
}

function showCharacterList() {
  LobbyGame.style.display = 'none';
  SelectHeroH1.style.display = 'block';
  CharacterList.style.display = 'block';
  TitleH1.style.display = 'none';
  BetaH1.style.display = 'none';
  instance.createConnection.bind(instance)(
    ({ heroes }) => loadCharacterList(heroes),
    (status) => (status ? showGame() : showLoggyMenu()),
    (msg) => {
      const message = document.createElement('div');
      message.className = 'chat-message';
      message.style.color = msg.color;
      message.innerHTML = `<span>${msg.author}</span>: ${msg.content}`;
      chatContainer.appendChild(message);
    }
  );
}

function showGame() {
  SelectHeroH1.style.display = 'none';
  CharacterList.style.display = 'none';
  InformationButton.style.display = 'none';
  LinksA.style.display = 'none';
  GameContainer.style.display = 'block';
}

function loadCharacterList(heroes) {
  for (const i in heroes) {
    CharacterList.appendChild(
      fromCharacterToDom(heroes[i], (cId) => {
        instance.startGame(UsernameInput.value ?? '', cId);
      })
    );
  }
}

document.getElementById('ChangeLogButton').onclick = function () {
  document.getElementById('changelogModal').style.display = 'block';
};

document.getElementById('closeModal').onclick = function () {
  document.getElementById('changelogModal').style.display = 'none';
};

window.onclick = function (event) {
  if (event.target == document.getElementById('changelogModal')) {
    document.getElementById('changelogModal').style.display = 'none';
  }
};

document.getElementById('ChangeLogButton').onclick = function () {
  document.getElementById('changelogModal').style.display = 'block';
};

document.getElementById('closeModal').onclick = function () {
  document.getElementById('changelogModal').style.display = 'none';
};

window.onclick = function (event) {
  if (event.target == document.getElementById('changelogModal')) {
    document.getElementById('changelogModal').style.display = 'none';
  }
};

document.getElementById('RegisterButton').addEventListener('click', function () {
  showLoggyMenu();
});

document.getElementById('LoginButton').addEventListener('click', function () {
  showLoggyMenu();
});

document.getElementById('GuestButton').addEventListener('click', function () {
  showLoggyMenu();
});

document.getElementById('LogOutButton').addEventListener('click', function () {
  showLoginMenu();
});

document.getElementById('PlayButton').addEventListener('click', function () {
  showCharacterList();
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    document.getElementById('settingsModal').style.display = 'block';
  }
});

document.getElementById('closeModal_esc').onclick = function () {
  document.getElementById('settingsModal').style.display = 'none';
};

let chatInputFocused = false;

chatInput.onblur = () => {
  chatInputFocused = false;
};

chatInput.onfocus = () => {
  chatInputFocused = true;
};

window.onclick = function (event) {
  if (event.target == document.getElementById('settingsModal')) {
    document.getElementById('settingsModal').style.display = 'none';
  }
};

let scale = 0;

const ctx = canvas.getContext('2d');

function preparateCanvas() {
  canvas.width = resolution.width;
  canvas.height = resolution.height;

  ctx.beginPath();
  ctx.fillStyle = canvasSettings.bgColor;
  ctx.fillRect(0, 0, resolution.width, resolution.height);
  ctx.closePath();

  ctx.imageSmoothingEnabled = false;

  function resize() {
    scale = window.innerWidth / canvas.width;
    if (window.innerHeight / canvas.height < window.innerWidth / canvas.width) {
      scale = window.innerHeight / canvas.height;
    }
    canvas.style.transform = 'scale(' + scale + ')';
    canvas.style.left = (1 / 2) * (window.innerWidth - canvas.width) + 'px';
    canvas.style.top = (1 / 2) * (window.innerHeight - canvas.height) + 'px';
    const canvasRect = canvas.getBoundingClientRect();
    chat.style.left = canvasRect.left + 10 + 'px';
    chat.style.top = canvasRect.top + 10 + 'px';
    chat.style.transform = `scale(${scale})`;
    chat.style.transformOrigin = '0% 0%';
  }
  resize();
  window.onresize = resize;
}

const whiteListOfKeys = {
  KeyA: 'KeyA',
  KeyD: 'KeyD',
  KeyW: 'KeyW',
  KeyS: 'KeyS',
  ArrowLeft: 'KeyA',
  ArrowRight: 'KeyD',
  ArrowUp: 'KeyW',
  ArrowDown: 'KeyS',
};

const keys = {};
let oldKeys = {};
const mouse = {
  enable: false,
  pos: [0, 0],
};
let oldMouse = { enable: false, pos: [0, 0] };

const kevent = (event) => {
  if (event.code === 'Enter' && event.type === 'keydown') {
    chatInputFocused ? chatInput.blur() : chatInput.focus();
    if (!chatInputFocused) {
      instance.sendChatMessage(chatInput.value);
      chatInput.value = '';
    }
    return;
  }

  if (chatInputFocused) return;

  if (event.code in whiteListOfKeys) {
    keys[whiteListOfKeys[event.code]] = event.type === 'keydown';
  }
  keys['isShift'] = event.shiftKey;

  for (const i in keys) {
    if (oldKeys[i] !== keys[i]) {
      instance.keyPress(i, keys[i]);
    }
  }

  oldKeys = JSON.parse(JSON.stringify(keys));
};

const mevent = (event) => {
  if (event.type === 'mousedown') mouse.enable = !mouse.enable;
  if (event.type === 'mousemove') {
    const canvasBoundingRect = canvas.getBoundingClientRect();
    const x = (event.pageX - canvasBoundingRect.left) / scale - canvas.width / 2;
    const y = (event.pageY - canvasBoundingRect.top) / scale - canvas.height / 2;
    mouse.pos = [Math.round(x), Math.round(y)];
  }

  for (const i in mouse) {
    if (i === 'pos' && !mouse.enable) continue;
    if (mouse[i] != oldMouse[i]) {
      instance.mouse({
        [i]: mouse[i],
      });
    }
  }

  oldMouse = JSON.parse(JSON.stringify(mouse));
};

document.addEventListener('keydown', kevent);
document.addEventListener('keyup', kevent);
canvas.addEventListener('mousedown', mevent);
canvas.addEventListener('mouseup', mevent);
canvas.addEventListener('mousemove', mevent);

const buttPlug = () => {
  void console.log('UwU');
  preparateCanvas();
};

export { buttPlug };
