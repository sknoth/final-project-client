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
    currentFriend: {},
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
    },

    // Now safe to use device APIs
    onDeviceReady: function() {
      // do something only after device is ready
      document.getElementById("signupBtn").addEventListener("click", app.onSignUp);
      document.getElementById("signinBtn").addEventListener("click", app.onSignIn);
    },

    onFacebookConnect: function(e) {
      e.preventDefault();
      console.log('onFacebookConnect');
// window.location = 'http://localhost:8080/auth/facebook';

  console.log('meeeeeeh');
      //       var x = new XMLHttpRequest();
      // x.open('GET', app.cors_api_url + 'auth/facebook', true);
      //
      // x.onreadystatechange = function() {
      //     //Call a function when the state changes.
      //     if(x.readyState == 4 && x.status == 200) {
      //         // Request finished. Do processing here.
      //         console.log('onFacebookConnect success');
      //         console.log(x.responseText);
      //     }
      //   }
      //
      // x.send();
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
              console.log('sign up success');
              console.log(x.responseText);

              app.navigateTo('create-profile');
              document.getElementById("saveProfileBtn").addEventListener("click", app.onSaveProfile);

              app.getUserData(JSON.parse(x.responseText).passport.user, app.setCurrentUser);
          }
      }

      x.send(JSON.stringify({
        "email": document.getElementById("email").value,
        "password": document.getElementById("password").value,
        "points": 5 // points for signup
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
              // app.navigateTo('profile');
              // document.getElementById("scanTagBtn").addEventListener("click", app.onScanTag);

              app.getUserData(JSON.parse(x.responseText).passport.user, app.setCurrentUser, app.initPageProfile);
          }
      }

      x.send(JSON.stringify({
        "email": document.getElementById("email").value,
        "password": document.getElementById("password").value
      }));

    },

    getUserData: function(uId, callback, callback2) {
      console.log('getUserData');

      var x = new XMLHttpRequest();

      x.open('GET', app.cors_api_url + 'users/' + uId, true);

      x.onreadystatechange = function() {

          //Call a function when the state changes.
          if(x.readyState == 4 && x.status == 200) {
              console.log('getUserData success');

              if (typeof callback === 'function') {
                callback(JSON.parse(x.responseText));
              }

              if (typeof callback2 === 'function') {
                callback2(JSON.parse(x.responseText));
              }
          }
      }

      x.send();

    },

    setCurrentUser: function(user) {
      console.log('setCurrentUser');
      app.currentUser = user;
    },

    setCurrentFriend: function(user) {
      console.log('setCurrentFriend');
      app.currentFriend = user;
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

              if (typeof callback === 'function') {
                callback();
              }
          }
      }
      x.send(JSON.stringify({"user": app.currentUser}));
    },

    onSaveProfile: function(e) {
      console.log('onSaveProfile');

      e.preventDefault();

      app.currentUser.name = document.getElementById("name").value;
      app.currentUser.studyProgram = document.getElementById("studyProgram").value;
      app.currentUser.country = document.getElementById("country").options[document.getElementById("country").selectedIndex].value;
      app.currentUser.languages = app.getSelectValues(document.getElementById("languages"));
      app.currentUser.interests = document.getElementById("interests").value;
      app.currentUser.quote = document.getElementById("quote").value;

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

    onShowFriendProfile: function() {
      console.log('onShowFriendProfile');
      app.initPageProfile(app.currentFriend);

      document.getElementById("askQuestionBtn").style.display = 'block';
      document.getElementById("scanTagBtn").style.display = 'none';
    },

    onToProfile: function() {
      console.log('onToProfile');
      app.initPageProfile(app.currentUser);
    },

    initPageProfile: function(user) {
      console.log('initPageProfile');
      console.log(user);

      app.navigateTo('profile');
      document.getElementById("scanTagBtn").addEventListener("click", app.onScanTag);

      document.getElementById("name").innerHTML = user.name;
      document.getElementById("points").innerHTML = user.points;
      document.getElementById("study-program").innerHTML = user.studyProgram;
      document.getElementById("country").innerHTML = user.country;
      document.getElementById("languages").innerHTML = user.languages;
      document.getElementById("interests").innerHTML = user.interests;
      document.getElementById("quote").innerHTML = user.quote;

      document.getElementById("askQuestionBtn").style.display = 'none';
      document.getElementById("scanTagBtn").style.display = 'block';
    },

    onScanTag: function() {
      console.log('TODO: initialize scanning of tags....');

      app.navigateTo('scan-tag');
      document.getElementById("dummyScanSuccessBtn").addEventListener("click", app.onDummyScanSuccess);
    },

    onDummyScanSuccess: function() {
      app.navigateTo('scan-success');

      document.getElementById("showFriendProfileBtn").addEventListener("click", app.onShowFriendProfile);
      document.getElementById("askQuestionBtn").addEventListener("click", app.onAskQuestion);

      // Dummy User 1 "Ima User"
      app.getUserData('58c70a1b6acb472718fd5b23', app.setCurrentFriend);
    },

    // asking the current friend a question
    onAskQuestion: function() {
      console.log('onAskQuestion');

      app.navigateTo('answer-questions');

      document.getElementById("points-text").style.display = 'block';
      document.getElementById("hint-answer-questions").style.display = 'none';
      document.getElementById("nextQuestionBtn").style.display = 'none';
      document.getElementById("checkAnswerBtn").style.display = 'block';

      document.getElementById("toProfileBtn").addEventListener("click", app.onToProfile);
      document.getElementById("checkAnswerBtn").addEventListener("click", app.onCheckAnswer);

      app.initQuestions();
    },

    initPageAnswerQuestions: function () {
        console.log('initPageAnswerQuestions');

        app.navigateTo('answer-questions');

        document.getElementById("points-text").style.display = 'none';
        document.getElementById("hint-answer-questions").style.display = 'block';
        document.getElementById("nextQuestionBtn").style.display = 'block';
        document.getElementById("checkAnswerBtn").style.display = 'none';

        document.getElementById("toProfileBtn").addEventListener("click", app.onToProfile);
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
              console.log('initQuestions success');

              var questions = JSON.parse(x.responseText);

              app.questions = questions;

              // TODO: randomize questions order
              app.questionId = 0;

              app.paintQuestion(app.questionId);
          }
      }

      x.send();
    },

    paintQuestion: function(qId) {
      console.log('initQuestions');

      document.getElementById("correct-answer").style.display = 'none';
      document.getElementById('hint-select-answer').style.display = 'none';
      document.getElementById("hint-correct-answer").style.display = 'none';
      document.getElementById("hint-correct-answer-2nd-try").style.display = 'none';

      document.getElementById('nextQuestionBtn').dataset.answerid = null;
      document.getElementById('checkAnswerBtn').dataset.answerid = null;

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
        document.getElementById("toProfileBtn").style.display = 'inline-block';
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
      app.hasSelectedAnswer = true;
      document.getElementById('nextQuestionBtn').dataset.answerid = this.dataset.answerid;
      document.getElementById('checkAnswerBtn').dataset.answerid = this.dataset.answerid;
    },

    onNextQuestion: function() {
      console.log('onNextQuestion');

      if(!app.hasSelectedAnswer) {
        document.getElementById('hint-select-answer').style.display = 'block';
        return;
      }

      app.hasSelectedAnswer = false;

      // if all questions were shown already, update user and go to next screen
      if (app.questionId === 3) {

        app.initPageProfile(app.currentUser);

        return;
      }

      // add selected question and answer to questions of user
      app.currentUser.questions.push({
        'questionId': app.questionId,
        'selectedAnswer': document.getElementById('nextQuestionBtn').dataset.answerid
      });
      console.log(111,app.currentUser.questions);

      // updating userdata after each question because user can step out at any point
      app.setUserData();

      // potentially dangerous, we should wait for req to finish...
      app.questionId++;
      app.paintQuestion(app.questionId);

    },

    onCheckAnswer: function() {
      console.log('onCheckAnswer');

      // find selected questionid in questions of user
      var friendAnswer = app.currentFriend.questions[app.questionId].selectedAnswer;
      var userAnswer = document.getElementById('checkAnswerBtn').dataset.answerid;
console.log(friendAnswer, userAnswer);
      // check if answers match
      if (friendAnswer !== userAnswer) {
        console.log('friendAnswer !== userAnswer');
        document.getElementById('hint-wrong-answer').style.display = 'block';
        app.dontAddPoint = true;
        return;
      }
console.log(1);
      if (friendAnswer === userAnswer && app.dontAddPoint) {
        console.log('!friendAnswer === userAnswer && app.dontAddPoint');
        document.getElementById("hint-correct-answer-2nd-try").style.display = 'block';
      } else {
        document.getElementById("hint-correct-answer").style.display = 'block';
        app.currentUser.points++;
        app.setUserData(); // only updating userdata when something changed
      }
      document.getElementById("correct-answer").style.display = 'block';
      // need to add the listener here, because it does not like hidden elements...
      if (!app.successNexWuestionListener) {
        document.getElementById("onSuccessNextQuestionBtn").addEventListener("click", app.onSuccessNextQuestion);
        app.successNexWuestionListener = true;
      }
    },

    onSuccessNextQuestion: function() {

      // if all questions were shown already, update user and go to next screen
      if (app.questionId === 3) {
        app.navigateTo('come-back-tomorrow');
                document.getElementById("toProfileBtn").addEventListener("click", app.onToProfile);
        return;
      }

      document.getElementById("hint-wrong-answer").style.display = 'none';
      document.getElementById("hint-correct-answer").style.display = 'none';
      document.getElementById("hint-correct-answer-2nd-try").style.display = 'none';
      app.questionId++;
      app.paintQuestion(app.questionId);
    },

    navigateTo: function(page) {
      console.log('navigateTo: ', page);

      var htmlImport = document.getElementById(page).import.getElementById('page-' + page);

      document.body.innerHTML = '';
      document.body.appendChild(htmlImport.cloneNode(true));
    }

};

app.initialize();
