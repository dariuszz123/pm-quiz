/**
 * Question.
 *
 * @param {string} title
 * @param {QuestionOption[]} options
 * @param {string} explain
 * @constructor
 */
var Question = function(title, options, explain) {
    this.title = title;
    this.options = options;
    this.explain = explain;
};