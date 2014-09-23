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

```./node_modules/.bin/bower install```

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

* Course lecturer: dr. Asta Vaitkevičienė http://uosis.mif.vu.lt/~astak

* Questions data: professor Valdas Undzėnas http://uosis.mif.vu.lt/~astak/data/laboratoriniai/2014_09_INICIJAVIMAS_pratyboms_auditorijoje.pdf

##License

The MIT License (MIT)
