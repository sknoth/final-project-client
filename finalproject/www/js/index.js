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

    cors_api_url: 'https://vukn-final-project.herokuapp.com/',
    currentUser: {},

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
      app.doCORSRequest({
        method: 'GET',
        url: 'auth/facebook'
      }, function printResult(result) {
        console.log('onFacebookConnect result',result);
      });
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
              document.getElementById("createProfileBtn").addEventListener("click", app.onCreateProfile);

              app.getUserData('58c424db6dc1810011757784');
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
              console.log(x.responseText);
          }
      }

      x.send();

    },

    setUserData: function(uId) {
      console.log('setUserData');

      var x = new XMLHttpRequest();

      x.open('POST', app.cors_api_url + 'users/' + uId, true);

      x.setRequestHeader("Content-type", "application/json");

      x.onreadystatechange = function() {
          //Call a function when the state changes.
          if(x.readyState == 4 && x.status == 200) {
              // Request finished. Do processing here.
              console.log('setUserData success');
              console.log(x.responseText);
          }
      }
console.log('app.currentUser', app.currentUser);
      x.send(JSON.stringify({
        "name": "meh",
        "quote": "i wish"
      }));
    },

    onCreateProfile: function() {
      console.log('onCreateProfile');
      console.log(e);
      app.currentUser.name = document.getElementById("name").value;
      app.currentUser.quote = document.getElementById("quote").value;

      app.setUserData('58c424db6dc1810011757784');
    },

    navigateTo: function(page) {
      console.log('navigateTo: ', page);
      var htmlImport = document.getElementById(page).import.getElementById('page-' + page);

      document.body.innerHTML = '';

      document.body.appendChild(htmlImport);
    }

};

app.initialize();
