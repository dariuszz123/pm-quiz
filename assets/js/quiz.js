var Quiz = function () {
    var self = this;
    var questions = [];
    var current_question_index = -1;

    // callbacks
    var pre_load_callbacks = [];
    var post_load_callbacks = [];
    var pre_change_question_callbacks = [];
    var post_change_question_callbacks = [];
    var pre_set_answers = [];
    var post_set_answers = [];
    var pre_reset_answers = [];
    var post_reset_answers = [];

    var call_callbacks = function (callbacks) {
        for (var index = 0; index < callbacks.length; ++index) {
            callbacks[index](self);
        }
    };

    this.addPreSetAnswersCallback = function (callback) {
        pre_set_answers.push(callback);
    };

    this.addPostSetAnswersCallback = function (callback) {
        post_set_answers.push(callback);
    };

    this.addPreLoadCallback = function (callback) {
        pre_load_callbacks.push(callback);
    };

    this.addPostLoadCallback = function (callback) {
        post_load_callbacks.push(callback);
    };

    this.addPreChangeQuestionCallback = function (callback) {
        pre_change_question_callbacks.push(callback);
    };

    this.addPostChangeQuestionCallback = function (callback) {
        post_change_question_callbacks.push(callback);
    };

    /**
     * Load questions.
     *
     * @param {Question[]} questions_list
     */
    this.load = function (questions_list) {
        call_callbacks(pre_load_callbacks);
        current_question_index = -1;
        questions = questions_list;
        self.next();
        call_callbacks(post_load_callbacks);
    };

    /**
     * Get all questions.
     *
     * @returns {Question[]}
     */
    this.getQuestions = function () {
        return questions;
    };

    /**
     * Get questions count.
     *
     * @returns {Integer}
     */
    this.getQuestionsCount = function () {
        return questions.length;
    };

    /**
     * Get current question index.
     *
     * @returns {Integer|null}
     */
    this.getCurrentQuestionNumber = function () {
        return (-1 !== current_question_index) ? (current_question_index + 1) : null;
    };

    /**
     * Get current question.
     *
     * @returns {Question|null}
     */
    this.getCurrentQuestion = function () {
        return questions[current_question_index] ? questions[current_question_index] : null;
    };

    /**
     * Move to next question.
     */
    this.next = function () {
        var next_question_index = current_question_index + 1;

        if (next_question_index < self.getQuestionsCount()) {
            call_callbacks(pre_change_question_callbacks);
            current_question_index = next_question_index;
            call_callbacks(post_change_question_callbacks);
        }
    };

    /**
     * Move to prev question.
     */
    this.prev = function () {
        var prev_question_index = current_question_index - 1;
        if (prev_question_index >= 0) {
            call_callbacks(pre_change_question_callbacks);
            current_question_index = prev_question_index;
            call_callbacks(post_change_question_callbacks);
        }
    };

    /**
     * Go to question.
     *
     * @param {int} question_index
     */
    this.goTo = function (question_index) {
        if (current_question_index !== question_index) {
            call_callbacks(pre_change_question_callbacks);
            current_question_index = question_index;
            call_callbacks(post_change_question_callbacks);
        }
    };

    /**
     * Reset answers.
     */
    this.resetAnswers = function (question) {
        call_callbacks(pre_reset_answers);

        for (var index = 0; index < question.options.length; ++index) {
            question.options[index].selected = false;
        }

        call_callbacks(post_reset_answers);
    };

    /**
     * Set answers.
     *
     * @param {Question} question
     * @param answer_indexes
     */
    this.setAnswers = function (question, answer_indexes) {
        call_callbacks(pre_set_answers);

        self.resetAnswers(self.getCurrentQuestion());

        for (var index = 0; index < question.options.length; ++index) {
            if (answer_indexes.indexOf(index) !== -1) {
                question.options[index].selected = true;
            }
        }

        call_callbacks(post_set_answers);
    };

    /**
     * Is question answered correctly.
     *
     * @param question
     * @returns {boolean}
     */
    this.isCorrect = function (question) {
        for (var index = 0; index < question.options.length; ++index) {
            var option = question.options[index];
            if (option.correct != option.selected) {
                return false;
            }
        }

        return true;
    };

    /**
     * Is question answered.
     *
     * @param {Question} question
     * @returns {boolean}
     */
    this.isAnswered = function (question) {
        for (var index = 0; index < question.options.length; ++index) {
            var option = question.options[index];

            if (option.selected) {
                return true;
            }
        }

        return false;
    };
};