/*
 ** Disable selection possibility on MCQ fields
 */
(function(pAt) {
  $("section[class=MCQ]").each(function() {
    $(this)
      .attr("unselectable", "on")
      .css("user-select", "none")
      .on("selectstart", false);
  });
})();

/*
 ** $_GET(param): function that does the same as $_GET['param'] in PHP
 */
function $_GET(param) {
  var vars = {};

  window.location.href
    .replace(location.hash, "")
    .replace(/[?&]+([^=&]+)=?([^&]*)?/gi, function(m, key, value) {
      vars[key] = value !== undefined ? value : "";
    });

  if (param) {
    return vars[param] ? vars[param] : null;
  }
}

function getNbQuestions(nbQuizzes) {
  const defaultValue = 5;
  var ret = parseInt($_GET("n"));

  if (isNaN(ret) || ret <= 0) {
    ret = defaultValue;
  }

  if (ret > nbQuizzes) {
    ret = nbQuizzes;
  }

  return ret;
}

/*
 ** imgTitles: map that puts in relation the ID of the checkbox and its title
 */
const imgTitles = {
  SHA: "Solution Hydro-Alcoolique",
  soap: "Savon neutre",
  glove_vinyle: "Gants non stériles [VINYLE]",
  glove_latex_nitrile: "Gants non stériles [LATEX ou NITRILE]",
  pajamas: "Pyjama",
  standard_mask: "Masque chirurgical a très haute filtration",
  ffp1_mask: "Appareil de Protection Respiratoire FFP1",
  ffp2_mask: "Appareil de Protection Respiratoire FFP2",
  surblouse_green: "Surblouse Verte",
  surblouse_white: "Surblouse Blanche",
  protection_glasses: "Lunettes de protection",
  apron: "Tablier de protection"
};

/*
 ** WelcomeMsg: Wrapper object, HomePage of the application.
 */
function WelcomeMsg() {
  this.jQEl = $("<div>");
  this.setStyle = function() {
    this.jQEl.css({
      "background-color": "lightgrey",
      width: "100%",
      height: "100%",
      position: "absolute",
      display: "flex",
      "justify-content": "center",
      "align-items": "flex-start",
      "z-index": "2"
    });
  };

  this.msg = $("<div>")
    .css({
      "font-size": "30px",
      "margin-top": "30vh"
    })
    .append("[Hygi0Quizz] ! Prêts pour l'entraînement ?");

  this.jQEl.append(this.msg);
  this.setStyle();
  $("body").append(this.jQEl);
}

function EndMsg(pScore) {
  this.jQEl = $("<div>");
  this.setStyle = function() {
    this.jQEl.css({
      "background-color": "lightgrey",
      width: "100%",
      height: "100%",
      position: "absolute",
      display: "flex",
      "justify-content": "center",
      "align-items": "flex-start",
      "z-index": "2"
    });

    this.text = "";
    this.jQEl.hide();
  };

  this.msg = $("<div>").css({
    "font-size": "30px",
    "margin-top": "30vh"
  });

  this.display = function() {
    const finalScore = Math.trunc(pScore.totalScore / pScore.nbQuizs);
    //const finalScore = 87;

    this.msg.append("Fin de l'entraînement ! Score final: ");
    if (finalScore < 100) {
      this.msg.append(
        $("<span>")
          .attr("class", "bad_final_score")
          .append(finalScore + "%")
      );

      if (finalScore < 70) {
        this.text =
          "Il va falloir s'entraîner encore un peu.<br />Que ce soit 1% ou 99%, il y a un risque évitable pour le patient ou le thérapeute. <br /><br />C'est pas grave on s'entraîne pour tendre vers le 100% !";
      } else if ((finalScore => 70) && finalScore < 86) {
        this.text =
          "Allez c'est pas trop mal, mais c'est pas encore le 100% !<br />Que ce soit 1% ou 99%, il y a un risque évitable pour le patient ou le thérapeute. <br /><br />Encore un petit effort on n'est pas loin !";
      } else if ((finalScore => 86) && finalScore < 100) {
        this.text =
          "Allez courage ça y est presque !<br />Que ce soit 1% ou 99%, il y a un risque évitable pour le patient ou le thérapeute. <br /><br />Encore un petit effort le perfect est imminent !";
      }

      this.msg.append(
        $("<p>")
          .append(this.text)
          .css({ "font-style": "italic", "font-size": "25px" })
      );
    } else {
      this.msg.append(
        $("<span>")
          .attr("class", "good_final_score")
          .append(finalScore + "%")
      );

      this.text =
        "BRAVO !!! Ça c'est ce que j'appelle Masteriser l'hygiène !<br /><br />Félicitations vous êtes de vrais pros sur les question des précautions standards et complémentaires sur les thèmes abordés !";

      this.msg.append(
        $("<p>")
          .append(this.text)
          .css({ "font-style": "italic", "font-size": "25px" })
      );
    }

    $("body").prepend(this.jQEl);
    this.jQEl.fadeIn(200);
  };

  this.jQEl.append(this.msg);
  this.setStyle();
}

function ScoreDisplayer() {
  this.patientScoreDisplayer = $("<div>");
  this.patientScoreDisplayer.hide();
  this.patientScoreDisplayer.attr({
    class: "score_displayer",
    id: "patient_score_displayer"
  });

  this.practScoreDisplayer = $("<div>");
  this.practScoreDisplayer.hide();
  this.practScoreDisplayer.attr({
    class: "score_displayer",
    id: "practitionner_score_displayer"
  });

  $("#patient_MCQ").prepend(this.patientScoreDisplayer);
  $("#practitioner_MCQ").prepend(this.practScoreDisplayer);

  this.displayScore = function(pField, pValue) {
    if (pValue == 100) {
      $("#" + pField + "_score_displayer").css("background-color", "green");
    }

    $("#" + pField + "_score_displayer").html(pValue + "%");
    $("#" + pField + "_score_displayer")
      .delay(500)
      .show(70);
  };

  this.displayPatientScore = function(pValue) {
    this.displayScore("patient", pValue);
  };

  this.displayPractScore = function(pValue) {
    this.displayScore("practitionner", pValue);
  };

  this.reset = function() {
    $(".score_displayer").css({
      "background-color": "red"
    });
    $(".score_displayer").hide();
  };
}

/*
 ** Score: Object that save the score of the quizz and the score of all the game
 */
function Score(pNbQuizs) {
  this.patientScore = 100;
  this.practScore = 100;
  this.quizScore = 0;
  this.totalScore = 0;
  this.nbQuizs = pNbQuizs;

  this.reset = function() {
    this.patientScore = 100;
    this.practScore = 100;
    this.quizScore = 0;
  };

  this.display = function() {
    console.log(
      "Score: \n-----\nPatient: " +
        this.patientScore +
        "%\nPraticien: " +
        this.practScore +
        "%\nQuiz: " +
        this.quizScore +
        "%\nTotal: " +
        Math.trunc(this.totalScore / this.nbQuizs) +
        "%"
    );
  };
}

/*
 ** loadQuiz: function that displays the question of the quiz in the view
 **           and return the answers object.
 */
function loadQuiz(pQuiz) {
  resetQuiz();
  $("#context").html(pQuiz.context);
  return pQuiz.p_resps;
}

/*
 ** validateQuiz: function that displays the good answers according to
 **               user's answers.
 ** pQuiz: part of the quiz being corrected ('patient' | 'practitionner')
 ** pCorrectResps: expected answers object
 ** pUserResps: user's answers
 **
 */
function validateQuiz(pQuiz, pCorrectResps, pUserResps, pScore) {
  const nbCheckboxes = $("#" + pQuiz + "_MCQ_choices .checkbox").length;
  const nbQuizs = $("#" + pQuiz + "_MCQ_choices .checkbox").each(function() {
    $(this).attr("title", pCorrectResps[this.id].explanation);
    if (pUserResps[this.id] == undefined) {
      pUserResps[this.id] = false;
    }

    if (pCorrectResps[this.id].value == true) {
      $(this).hide(250, function() {
        // if user didn't check a checkbox that needed to
        if (pUserResps[this.id] != true) {
          $(this).attr(
            "src",
            "./resources/images//" + getImgName(this.id) + "_forgot.png"
          );
        }

        $(this).css("border", "green 5px solid");
        $(this).css("box-shadow", "0px 0px 40px green");
        $(this).show(250);
      });
    }
    //if user didn't check correctly the checkbox
    if (pUserResps[this.id] != pCorrectResps[this.id].value) {
      if (pQuiz == "patient") {
        pScore.patientScore -= 100 / nbCheckboxes;
      } else if (pQuiz == "practitionner") {
        pScore.practScore -= 100 / nbCheckboxes;
      }

      //if user checked a checkbox that didn't need to
      if (pCorrectResps[this.id].value == false) {
        $(this).attr(
          "src",
          "./resources/images//" + getImgName(this.id) + "_toomuch.png"
        );
      }
    }
  });

  if (pQuiz == "practitionner") {
    pScore.quizScore = (pScore.patientScore + pScore.practScore) / 2;
    pScore.totalScore += pScore.quizScore;
  }
}

/*
 ** resetQuiz: function that reset the display of the quiz form
 */
function resetQuiz() {
  $(".checkbox").css({
    border: "black 2px solid",
    opacity: "0.9",
    "box-shadow": "none"
  });

  $(".checkbox").each(function() {
    $(this)
      .attr("src", "./resources/images//" + getImgName(this.id) + ".png")
      .attr("title", imgTitles[getImgName(this.id)]);
  });
}

/*
 ** getImgName: function that takes a checkbox's id and return the name
 **             of the image displayed into it.
 ** pName: id of the checkbox
 */
function getImgName(pName) {
  /^(?:patient|pract)_MCQ_(\S+)$/.exec(pName);

  return RegExp.$1;
}

/*
 ** randomArrayGen: function that return an array of size n, of distincts random numbers
 **                 between 0 and pLength. Not very optimized but it works fine
 */
function randomArrayGen(pSize, pMaxValue) {
  var retArray = [];
  var tempNb = 0;

  while (retArray.length < pSize) {
    tempNb = Math.floor(Math.random() * pMaxValue);
    if (retArray.includes(tempNb) === false) {
      retArray.push(tempNb);
    }
  }

  return retArray;
}

/*
 ** MAIN:
 */
$(function() {
  var userResps = {};
  var expectedResps = {};
  var askMode = true;

  /*
   ** To show quizzes randomly, we will generate a random array of size
   ** distincts numbers between 0 and quizzes.length - 1
   */
  const nbQuizzes = Object.keys(quizzes).length;
  const nbQuestions = getNbQuestions(nbQuizzes);

  const quizIndexes = randomArrayGen(nbQuestions, nbQuizzes);
  var quizIndex = 0;
  var currentQuiz = quizzes[quizIndexes[quizIndex]];
  //debug
  //var currentQuiz = quizzes[29];
  var score = new Score(nbQuestions);
  var scoreDisplayer = new ScoreDisplayer();

  /*
   ** show welcome message and then show first quizz
   */
  const welcomeMsg = new WelcomeMsg();
  const endMsg = new EndMsg(score);
  expectedResps = loadQuiz(currentQuiz);

  welcomeMsg.jQEl.delay(1500).slideUp(300);
  $("#Quiz")
    .delay(1800)
    .fadeIn(1000);

  //To me to make up for lost time when working on it
  welcomeMsg.jQEl.slideUp(300);
  $("#Quiz").fadeIn(200);

  /*
   ** disable drag function on images
   */
  $("img").on("dragstart", function(e) {
    e.preventDefault();
  });

  /*
   ** Checkbox selection:
   */
  $(".checkbox").mousedown(function() {
    if (askMode) {
      //not clicked yet
      if (userResps[this.id] != true) {
        $(this).fadeTo(200, 1);
        $(this).css("border", "black 5px solid");
        $(this).css("box-shadow", "0px 0px 30px black");
        $(this).attr(
          "src",
          "./resources/images//" + getImgName(this.id) + "_checked.png"
        );
        userResps[this.id] = true;
        //clicked yet
      } else {
        $(this).fadeTo(200, 0.9);
        $(this).css("border", "black 2px solid");
        $(this).attr(
          "src",
          "./resources/images//" + getImgName(this.id) + ".png"
        );
        userResps[this.id] = false;
      }
    }
  });

  /*
   ** unfortunately .checkbox:hover property cannot be re-set after being overwritten
   ** by JS, so I have to do it like this ugly way
   */
  $(".checkbox").hover(function(e) {
    if (userResps[this.id] != true) {
      if (e.type === "mouseenter") {
        $(this).css("box-shadow", "0px 0px 20px black");
      } else {
        $(this).css("box-shadow", "none");
      }
    }
  });

  /*
   ** Patient part quiz validation:
   */
  $("#validate_patient").click(function() {
    askMode = false;
    $("#practitioner_MCQ").animate({ opacity: 0.3 }, 300);
    validateQuiz("patient", currentQuiz.responses, userResps, score);
    $("#validate_patient").fadeOut(250);
    $("#validate_practitionner")
      .delay(250)
      .fadeIn(250);
    scoreDisplayer.displayScore("patient", score.patientScore);
  });

  /*
   ** Practitionner part quiz validation:
   */
  $("#validate_practitionner").click(function() {
    $("#practitioner_MCQ").animate({ opacity: 1 }, 300);
    askMode = false;
    validateQuiz("practitionner", currentQuiz.responses, userResps, score);
    $("#validate_practitionner").fadeOut(250);
    $("#validate_next_quiz")
      .delay(250)
      .fadeIn(250);
    scoreDisplayer.displayScore("practitionner", score.practScore);
  });

  /*
   ** Go to next quiz:
   */
  $("#validate_next_quiz").click(function() {
    quizIndex++;
    userResps = {};
    expectedResps = {};
    currentQuiz = quizzes[quizIndexes[quizIndex]];

    if (quizIndex < nbQuestions) {
      $("#Quiz")
        .fadeOut(500, function() {
          $("#validate_next_quiz").fadeOut(0);
          $("#validate_patient")
            .delay(250)
            .fadeIn(0);
          expectedResps = loadQuiz(currentQuiz);
          askMode = true;
          resetQuiz();
          score.reset();
          scoreDisplayer.reset();
        })
        .slideDown(500);
    } else {
      endMsg.display();
    }
  });
});
