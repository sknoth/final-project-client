/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {

    cors_api_url: 'http://localhost:8080/',
    // cors_api_url: 'https://vukn-final-project.herokuapp.com/',
    currentUser: {},
    questions: [],

    // Application Constructor
    initialize: function() {
      console.log('app initialize');
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById("signupBtn").addEventListener("click", app.onSignUp);
        document.getElementById("signinBtn").addEventListener("click", app.onSignIn);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        // do something only after device is ready
    },

    onFacebookConnect: function() {
      console.log('onFacebookConnect');

            var x = new XMLHttpRequest();
      x.open('GET', app.cors_api_url + 'auth/facebook', true);

      x.onreadystatechange = function() {
          //Call a function when the state changes.
          if(x.readyState == 4 && x.status == 200) {
              // Request finished. Do processing here.
              console.log('onFacebookConnect success');
              console.log(x.responseText);
          }
        }

      x.send();
    },

    onSignUp: function() {
      console.log('onSignUp');

      var x = new XMLHttpRequest();

      x.open('POST', app.cors_api_url + 'signup', true);
      x.setRequestHeader("Content-type", "application/json");

      x.onreadystatechange = function() {
          //Call a function when the state changes.
          if(x.readyState == 4 && x.status == 200) {
              // Request finished. Do processing here.
              console.log('success');
              console.log(x.responseText);
              // console.log(x.responseText.passport.user);
              app.navigateTo('create-profile');
              document.getElementById("saveProfileBtn").addEventListener("click", app.onSaveProfile);

              app.getUserData('58c424db6dc1810011757784');
          }
      }

      x.send(JSON.stringify({
        "email": document.getElementById("email").value,
        "password": document.getElementById("password").value
      }));

    },

    onSignIn: function() {
      console.log('onSignIn');

      var x = new XMLHttpRequest();

      x.open('POST', app.cors_api_url + 'signin', true);
      x.setRequestHeader("Content-type", "application/json");

      x.onreadystatechange = function() {
          //Call a function when the state changes.
          if(x.readyState == 4 && x.status == 200) {
              // Request finished. Do processing here.
              console.log('success');
              console.log(JSON.parse(x.responseText).passport.user);
              // console.log(x.responseText.passport.user);
              app.navigateTo('create-profile');
              document.getElementById("saveProfileBtn").addEventListener("click", app.onSaveProfile);

              app.getUserData(JSON.parse(x.responseText).passport.user);
          }
      }

      x.send(JSON.stringify({
        "email": document.getElementById("email").value,
        "password": document.getElementById("password").value
      }));

    },

    getUserData: function(uId) {
      console.log('getUserData');
      var x = new XMLHttpRequest();

      x.open('GET', app.cors_api_url + 'users/' + uId, true);

      x.onreadystatechange = function() {
          //Call a function when the state changes.
          if(x.readyState == 4 && x.status == 200) {
              // Request finished. Do processing here.
              console.log('getUserData success');
              app.currentUser = JSON.parse(x.responseText);
              console.log(app.currentUser);
          }
      }

      x.send();

    },

    setUserData: function(callback) {
      console.log('setUserData');

      var x = new XMLHttpRequest();

      x.open('POST', app.cors_api_url + 'users/' + app.currentUser._id, true);

      x.setRequestHeader("Content-type", "application/json");

      x.onreadystatechange = function() {
          //Call a function when the state changes.
          if(x.readyState == 4 && x.status == 200) {
              // Request finished. Do processing here.
              console.log('setUserData success');
              console.log(x.responseText);
              callback();
          }
      }
      x.send(JSON.stringify({"user": app.currentUser}));
    },

    onSaveProfile: function() {
      console.log('onSaveProfile');
      app.currentUser.name = document.getElementById("name").value;
      app.currentUser.studyProgram = document.getElementById("studyProgram").value;
      app.currentUser.country = document.getElementById("country").options[document.getElementById("country").selectedIndex].value;
      app.currentUser.languages = app.getSelectValues(document.getElementById("languages"));
      app.currentUser.interests = document.getElementById("interests").value;
      app.currentUser.quote = document.getElementById("quote").value;

      console.log('app.currentUser', app.currentUser);
      app.setUserData(app.initPageAnswerQuestions);
    },

    // Return an array of the selected opion values
    getSelectValues: function(select) {
      var result = [];
      var options = select && select.options;
      var opt;

      for (var i=0, iLen=options.length; i<iLen; i++) {
        opt = options[i];

        if (opt.selected) {
          result.push(opt.value || opt.text);
        }
      }
      return result;
    },

    onSkip: function() {
      console.log('onSkip');
      app.navigateTo('profile');
      document.getElementById("scanTagBtn").addEventListener("click", app.onScanTag);
    },

    onScanTag: function() {
      console.log('TODO: initialize scanning of tags....');
      app.navigateTo('scan-tag');
      document.getElementById("dummyScanSuccessBtn").addEventListener("click", app.onDummyScanSuccess);
    },

    onDummyScanSuccess: function() {
      app.navigateTo('scan-success');
    },

    initPageAnswerQuestions: function () {

        console.log('initPageAnswerQuestions');
        app.navigateTo('answer-questions');
        document.getElementById("skipBtn").addEventListener("click", app.onSkip);
        document.getElementById("nextQuestionBtn").addEventListener("click", app.onNextQuestion);

        app.initQuestions();
    },

    initQuestions: function() {
      console.log('initQuestions');

      var x = new XMLHttpRequest();

      x.open('GET', app.cors_api_url + 'questions', true);

      x.onreadystatechange = function() {
          //Call a function when the state changes.
          if(x.readyState == 4 && x.status == 200) {
              // Request finished. Do processing here.
              console.log('getUserData success');
              var questions = JSON.parse(x.responseText);

              app.questions = questions;
              app.questionId = 0;

              app.paintQuestion(app.questionId);
          }
      }

      x.send();
    },

    paintQuestion: function(qId) {

      document.getElementById('hint-select-answer').style.display = 'none';

      document.getElementById("questionKey").innerHTML = qId + 1;
      document.getElementById("questionText").innerHTML = app.questions[qId].questionText;

      var answersHTML = '';

      for (key in app.questions[qId].answers) {
        answersHTML += '<label data-answerid="' + key + '" class="radio"'
                    + 'id="answer' +  + key + '">'
                    + app.questions[qId].answers[key] + '</label>';
      }

      document.getElementById("answers").innerHTML = answersHTML;

      for (answerKey in app.questions[qId].answers) {
        document.getElementById("answer" + answerKey).addEventListener("click", app.fixRadioClick);
      }

      if (qId > 2) {
        document.getElementById("skipBtn").style.display = 'inline-block';
      }
    },

    // ugly hack to be able to contine for now....
    fixRadioClick: function(a) {

      document.getElementById('answer0').classList.contains('checked');
        document.getElementById('answer0').classList.remove('checked');

        document.getElementById('answer1').classList.contains('checked');
      document.getElementById('answer1').classList.remove('checked');

      document.getElementById('answer2').classList.contains('checked');
      document.getElementById('answer2').classList.remove('checked');

      document.getElementById('answer3').classList.contains('checked');
      document.getElementById('answer3').classList.remove('checked');

      this.classList.add('checked');
      document.getElementById('nextQuestionBtn').dataset.answerid = this.dataset.answerid;
    },

    onNextQuestion: function() {
      console.log('onNextQuestion');

      // check if user has selected an answer
      var hasSelectedAnswer = false;

      for (key in document.querySelectorAll('[data-answerid]')) {
        if (document.querySelectorAll('[data-answerid]')[key].classList &&
            document.querySelectorAll('[data-answerid]')[key].classList.contains('checked')) {
          hasSelectedAnswer = true;
        }
      }

      if(!hasSelectedAnswer) {
        document.getElementById('hint-select-answer').style.display = 'block';
        return;
      }

      // add selected question and answer to questions of user
      app.currentUser.questions.push({
        'questionId': app.questionId,
        'selectedAnswer': document.getElementById('nextQuestionBtn').dataset.answerid
      })

      // show next question
      app.questionId++;
      app.paintQuestion(app.questionId);

      // if all questions were shown already, update user and go to next screen
      if (app.questionId === 3) {

      }

    },

    navigateTo: function(page) {
      console.log('navigateTo: ', page);
      var htmlImport = document.getElementById(page).import.getElementById('page-' + page);

      document.body.innerHTML = '';
      console.log('htmlImport');
console.log(htmlImport);
      document.body.appendChild(htmlImport);
    }

};

app.initialize();
