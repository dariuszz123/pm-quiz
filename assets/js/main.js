$(document).ready(function () {

    var parse_str = function (str) {
        return str.replace(new RegExp('\r?\n', 'g'), '<br />');
    };

    var shuffle = function (array) {
        return array.sort(function () {
            return 0.5 - Math.random();
        });
    };

    var create_options = function (options_data) {
        var options = [];

        for (var index = 0; index < options_data.length; index++) {
            var option_data = options_data[index];
            var option = new QuestionOption(option_data.title, option_data.correct, false);
            options.push(option);
        }

        return options;
    };

    var create_questions = function (questions_data) {
        var questions = [];

        for (var index = 0; index < questions_data.length; index++) {
            var question_data = questions_data[index];
            var options = shuffle(create_options(question_data['options']));
            var question = new Question(question_data['question'], options, question_data['explain']);
            questions.push(question);
        }

        return shuffle(questions);
    };

    var create_random_questions = function (questions_data) {
        var questions = [];

        for (var index = 0; index < questions_data.length; index++) {
            var question_data = questions_data[index];
            var options = shuffle(create_options(question_data['options']));
            var question = new Question(question_data['question'], options, question_data['explain']);
            questions.push(question);
        }

        return shuffle(questions);
    };

    var update_questions_count = function (quiz) {
        $('.total-questions').text(quiz.getQuestionsCount());
    };

    var update_current_question_number = function (quiz) {
        $('.question-index').text(quiz.getCurrentQuestionNumber());
    };

    var update_question_html = function (quiz) {
        var question = quiz.getCurrentQuestion();

        $('.question-title').html(parse_str(question.title));
        $('.question-explain-text').html(parse_str(question.explain));
    };

    var disable_options = function (question) {
        var options_list = $('.options-list');
        var options = question.options;
        for (var index = 0; index < options.length; index++) {
            options_list.children().eq(index).find('.btn').addClass('disabled');
        }
    };

    var highlight_options = function (question) {
        var options_list = $('.options-list');
        var options = question.options;
        for (var index = 0; index < options.length; index++) {
            var option = options[index];
            if (option.selected && (false === option.correct)) {
                options_list.children().eq(index).find('.btn').addClass('btn-danger');
            }

            if (option.correct) {
                options_list.children().eq(index).find('.btn').addClass('btn-success');
            }
        }
    };

    var hide_show_explain = function (quiz) {
        var question = quiz.getCurrentQuestion();
        if (quiz.isAnswered(question) && (false === quiz.isCorrect(question))) {
            $('.question-explain').show();
        } else {
            $('.question-explain').hide();
        }
    };

    var show_random_questions = function () {
        return $("#randomize").is(":checked");
    };

    var get_first_not_answered_index = function (quiz) {
        var questions = quiz.getQuestions();

        for (var index = 0; index < questions.length; index++) {
            var question = questions[index];

            if (false === quiz.isAnswered(question)) {
                return index;
            }
        }

        return null;
    };

    var answered_correctly = function (quiz) {
        var questions = quiz.getQuestions();
        var correct = 0;
        for (var index = 0; index < questions.length; index++) {
            var question = questions[index];

            if (quiz.isCorrect(question)) {
                correct++;
            }
        }

        return correct;
    };

    var score_shown = false;

    var show_score = function (quiz) {
        score_shown = true;

        var correct = answered_correctly(quiz);
        var total = quiz.getQuestionsCount();
        var percent = (correct * 100 / total);
        var percent_fixed = Math.round(percent * 100) / 100;

        $('.results .percent').text(percent_fixed);
        $('.results .correct').text(correct);
        $('.results .progress-bar').css('width', percent_fixed + '%');

        $('.quiz').hide();
        $('.results').show();
    };

    var next_action = function (quiz) {
        var index = get_first_not_answered_index(quiz);

        if (quiz.getCurrentQuestionNumber() === quiz.getQuestionsCount()) {
            if (null !== index) {
                quiz.goTo(index);
            } else {
                show_score(quiz);
            }
        } else {
            if ((null === index) && (false === score_shown)) {
                show_score(quiz);
            } else {
                quiz.next();
            }
        }
    };

    var click_answer_disabled = false;

    var click_answer = function (quiz, index, question) {
        return function () {
            if (!click_answer_disabled) {
                click_answer_disabled = true;
                if (0 === $(this).find('.disabled').length) {
                    var answers = [index];

                    quiz.setAnswers(quiz.getCurrentQuestion(), answers);

                    highlight_options(question);
                    disable_options(question);

                    if (quiz.isCorrect(question)) {
                        setTimeout(function () {
                            click_answer_disabled = false;
                            next_action(quiz);
                        }, 500);
                    } else {
                        click_answer_disabled = false;
                    }
                } else {
                    click_answer_disabled = false;
                    next_action(quiz);
                }
            }
        }
    };

    var update_question_options_html = function (quiz) {
        var question = quiz.getCurrentQuestion();
        var options = question.options;

        var options_list = $('.options-list');
        var option_template = options_list.data('option');

        for (var index = 0; index < options.length; index++) {
            var option = options[index];
            var $option = $(option_template.replace('{{ title }}', option.title));

            if (quiz.isAnswered(quiz.getCurrentQuestion())) {
                $option.find('.btn').addClass('disabled');
            }

            $option.click(click_answer(quiz, index, question));

            options_list.append($option);
        }

        if (quiz.isAnswered(question)) {
            highlight_options(question);
        }
    };

    var clear_options = function () {
        $('.options-list').html('');
    };

    var load_quiz = function (data_path) {
        $.getJSON(data_path, function (data) {

            if (show_random_questions() === true) {
                var questions = create_random_questions(data['questions']);
            }
            else {
                var questions = create_questions(data['questions']);
            }

            var quiz = new Quiz();

            quiz.addPreLoadCallback(clear_options);

            quiz.addPostLoadCallback(update_questions_count);
            quiz.addPostLoadCallback(update_current_question_number);

            quiz.addPreChangeQuestionCallback(clear_options);

            quiz.addPostSetAnswersCallback(hide_show_explain);

            quiz.addPostChangeQuestionCallback(update_current_question_number);
            quiz.addPostChangeQuestionCallback(update_question_html);
            quiz.addPostChangeQuestionCallback(update_question_options_html);
            quiz.addPostChangeQuestionCallback(hide_show_explain);

            quiz.load(questions);

            $('.quiz .next').click(function () {
                next_action(quiz)
            });
            $('.quiz .previous').click(quiz.prev);
        });
    };

    $('.results').hide();
    $('.quiz').hide();

    $('.start .btn').click(function () {
        $('.start').hide();
        var data_file = $("select[name='data']:first").val();
        load_quiz("data/" + data_file);
        $(".quiz").show();
    });

    $('.results .previous').click(function () {
        $('.results').hide();
        $('.quiz').show();
    });
});
