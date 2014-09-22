/**
 * Question option.
 *
 * @param {string} title
 * @param {bool} correct
 * @param {bool} selected
 * @constructor
 */
var QuestionOption = function(title, correct, selected) {
    this.title = title;
    this.correct = correct;
    this.selected = selected;
};