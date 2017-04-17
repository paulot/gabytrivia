var _questions = null;
var _currentQuestion = 0;
var _trashTalks = ['That was too easy.', 'We\'re just getting started.', 'Hopefully you thought that was easy.',
                   'You might as well give up now.', 'You can\'t answer this one right.', 'You\'ll need a hint.',
                   'No way you\'ll know the answer for this one.', 'Don\'t poop your pants now...']
var _images = ['silly0.jpg', 'silly1.jpg', 'silly2.jpg', 'silly3.jpg', 'silly4.jpg', 'silly5.jpg', 'silly6.jpg',
               'silly7.jpg', 'silly8.jpg', 'silly9.png', 'silly10.png'];

function getQuestions(callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    var DONE = 4;
    if (xhr.readyState === DONE)
      callback(JSON.parse(xhr.responseText));
  }

  xhr.open('GET', '/api/v1/questions');
  xhr.send(null)
}

function populateQuestions(questions) {
  _questions = questions;
  renderQuestion(questions[_currentQuestion]);
}

function cleanNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function renderQuestion(question) {
  var title = document.getElementById('title');
  cleanNode(title);
  var titleText = document.createTextNode(question.title);
  title.appendChild(titleText);

  var answerContainer = document.getElementById('answers');
  cleanNode(answerContainer);


  for (var i = 0; i < question.choices.length; i++) {
    var li = document.createElement('li')
    var label = document.createElement('label');
    var radio = document.createElement('input');
    var text = document.createTextNode(' ' + question.choices[i]);
    var check = document.createElement('div');

    radio.type = 'radio';
    radio.name = 'answers';
    radio.value = i;
    radio.id = 'answer' + i;

    label.htmlFor = 'answer' + i;

    label.appendChild(text);

    check.className = 'check';

    li.appendChild(radio)
    li.appendChild(label);
    li.appendChild(check);
    answerContainer.appendChild(li);
  }
}

function submitQuestion() {
  var checked = document.querySelector('input[name="answers"]:checked');

  if (!checked) return;

  var questionNumber = Number(checked.value);

  if (_questions[_currentQuestion].answer == questionNumber) {
    transitionQuestion();
  } else {
    wrongAnswer();
  }
}

function openNav() {
  document.getElementById('myNav').style.width = '100%';
}

function closeNav() {
  document.getElementById('myNav').style.width = '0%';
}

function transitionQuestion() {
  _currentQuestion++;

  if (_currentQuestion == _questions.length) { youWon(); return; }

  var messageContainer = document.getElementById('message');
  cleanNode(messageContainer);

  var i = Math.floor(_trashTalks.length * Math.random());
  var titleText = document.createTextNode(_trashTalks[i]);

  messageContainer.appendChild(titleText);

  var photoContainer = document.getElementById('sillyphoto');
  photoContainer.src = 'images/' + _images[Math.floor(Math.random() * _images.length)];
  photoContainer.width = 200;
  photoContainer.height = 200;

  var rejectionContainer = document.getElementById('photocontainer');
  rejectionContainer.innerHTML = '';

  openNav();
  setTimeout(closeNav, 2000);
  changeBackground();

  updateAct();
  renderQuestion(_questions[_currentQuestion]);
}

function changeBackground() {
  var bgs = ['bg0.jpg', 'bg1.jpg', 'bg2.jpg', 'bg3.jpg', 'bg4.jpg', 'bg5.jpg', 'bg6.jpg'] 
  document.body.style.backgroundImage = 'url("images/' + bgs[Math.floor(Math.random() * bgs.length)] + '")';
}

function wrongAnswer() {
  var phrases = ['That\'s not quite right.', 'Nope.', 'Que no!', 'Ay ay ay poopy!', 'Nooooooooooolololololo.',
                 'Heeeeeeel no', 'You ain\'t right.', 'Try again poopy.', 'I think I farted.', 'Quack quack quack'];

  var messageContainer = document.getElementById('message');
  cleanNode(messageContainer);

  var i = Math.floor(phrases.length * Math.random());
  var titleText = document.createTextNode(phrases[i]);

  messageContainer.appendChild(titleText);

  var searches = ['no', 'nope']
  var offset = Math.floor(Math.random() * 50);

  searchGiphy(searches[Math.floor(Math.random() * searches.length)], 4, offset, function(data) {
    var sillyPhotoContainer = document.getElementById('sillyphoto');
    sillyPhotoContainer.src = '';
    sillyPhotoContainer.width = '0px';
    sillyPhotoContainer.height = '0px';

    var photos = handleData(data).map(imgToHtml);
    var photoContainer = document.getElementById('photocontainer');
    photoContainer.innerHTML = '';

    for (var j = 0; j < photos.length; j++) photoContainer.innerHTML += photos[j];

    openNav();
    setTimeout(closeNav, 2000);
  });
}

function youWon() {
  initiateSolitaire();
}

function updateAct() {
  var acts = ['Gaby and Paulo', 'US and general history trivia', 'Strength is never a weakness', 'Historia do Brasil',
              'Curitibans and the Freemason'];
  var currentAct = acts[Math.floor(_currentQuestion / 4)];

  document.getElementById('currentact').innerHTML = currentAct;
}
