#pm-quiz

Quiz for software projects management practice class at VU.

Live: http://pm.cuf.lt

##Requirements

Modern web browser with enabled javascript.

##Dev

###Requirements

* npm ~1.4.28 https://www.npmjs.org/

###Build

```npm install```

###Run the Application

We have preconfigured the project with a simple development web server.  The simplest way to start
this server is:

```
npm start
```

Now browse to the app at `http://localhost:8000/`.

###Questions data

Questions data stored in JSON ```./data/test_1.json```

Data structure is self explaining:

```javascript
{
    "questions": [
        {
            "question": "Question text?",
            "options": [
                {"title": "Option 1", "correct": false},
                {"title": "Option 2", "correct": true}
            ],
            "explain": "Some text"
        }
    ]
}
```

##Credits

Author: Darius Krištapavičius

Course lecturer: dr. Asta Vaitkevičienė http://uosis.mif.vu.lt/~astak

Questions: professor Valdas Undzėnas

Various improvements:
* Tautvidas Sipavičius http://www.tautvidas.com
* Aurimas Sadauskas http://www.aursad.eu
* Donatas Kurapkis http://l2topai.eu

##License

The MIT License (MIT)
