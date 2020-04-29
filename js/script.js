/*
Made by Levan Mebonia
username: levo96
project : tic tac toe

(Not going to lie I struggled with the Min Max Algorithm )
(Min Max Algorithm tutorial :
  --  Youtube - CodingTrain : Coding Challenge 154 MinMax Algorithm )
*/


const collection_to_3arr = (collection) => {
  let tmp = [];
  let result = [];
  for(let i = 0; i < collection.length; i++) {
    tmp.push(collection[i]);
  }
  for(let i = 0; i < 3; i++) {
    result.push(tmp.splice(0,3));
  }
  return result;
}

//player constructor
const player = (...args) => {
  let name = args[0];
  let marker = args[1];
  let dif_level = "eazy";//default
  let status = "player";

  const eazy_ai = (...args) => {

    let board_element = args[0];
    let module_gameboard_arr = game.get_game_board_arr();
    let possible_cells = [];
    let pc_len = 0;
    let rand_number;

    for(let i = 0; i < board_element.length; i++) {
      if(board_element[i].innerHTML == ""){
        possible_cells.push(board_element[i]);
      }
    }

    pc_len = possible_cells.length;

    rand_number = Math.floor(Math.random() * pc_len);

    module_gameboard_arr[rand_number] = "O";
    game.update_game_board(module_gameboard_arr);
    possible_cells[rand_number].innerHTML = "O";

  }

  const master_ai = (...args) => {
    let board_element = args[0];
    let module_gameboard_arr = game.get_game_board_arr();
    let new_board = collection_to_3arr(board_element);
    let module_newgameboard_arr = [];
    //------------  min max   ----------------
    let bestScore = -Infinity;
    let move;

    for(let i = 0; i < 3; i++) {
      for(let j = 0; j < 3; j++) {
        if(new_board[i][j].innerHTML == "") {
          new_board[i][j].innerHTML = "O";
          let score = min_max(new_board, 0, true);
          new_board[i][j].innerHTML = "";
          if(score > bestScore) {
            bestScore = score;
            move = { i, j };
          }
        }
      }
    }
    new_board[move.i][move.j].innerHTML = "O";
    for(let i = 0; i < new_board.length; i++) {
      for(let j = 0; j < new_board[i].length; j++) {
        if(new_board[i][j].innerHTML == "") {
          module_newgameboard_arr.push("");
        }else{
          module_newgameboard_arr.push(new_board[i][j].innerHTML);
        }
      }
    }
    game.update_game_board(module_newgameboard_arr);

  } //<-- end of master ai

  if(name == "AI") {
    marker = "O";
    status = "AI";
    dif_level = args[1];
    if(dif_level == "master") {
      return {name, marker,status, master_ai, dif_level};
    } else {
      return {name, marker,status, eazy_ai, dif_level};
    }
  } else {
    return {name, marker}
  }

}


const min_max = (board,depth, isMaximizing) => {


  if(isMaximizing)
  {
    let bestScore = -Infinity;
    for(let i = 0; i < 3; i++) {
      for(let j = 0; j < 3; j++) {
        if(board[i][j].innerHTML == ""){
          board[i][j].innerHTML = "O";
          let score = min_max(board, depth+1,false);
          board[i][j].innerHTML = "";
          bestScore = Math.max(score, bestScore);
        }
      }
    }
    return bestScore;
  }else {
    let bestScore = Infinity;
    for(let i = 0; i < 3; i++) {
      for(let j = 0; j < 3; j++) {
        if(board[i][j].innerHTML == ""){
          board[i][j].innerHTML = "X";
          let score = min_max(board, depth+1,true);
          board[i][j].innerHTML = "";
          bestScore = Math.min(score, bestScore);
        }
      }
    }
    return bestScore;
  }
}

//the game module
const game = (()=> {
  //global variables in the game module
  let playerX;
  let playerO;
  let current_player = "X";
  let winner_display = document.getElementById("gp_fi_result_text");
  let parent = document.getElementById("game_board");
  //gameboard
  let game_board = [
    "", "", "",
    "", "", "",
    "", "", ""
  ];

  const get_game_board_arr = () => {
    return game_board;
  }

  const update_game_board = (arr) => {
    game_board = arr;
    return;
  }
  //winning combination of the gameboard the numbers are indexes of the elements in the gameboard
  let winning_combos = [
    [0,1,2],[3,4,5],[6,7,8], //horizontal
    [0,3,6],[1,4,7],[2,5,8], // vertical
    [0,4,8], [2,4,6] //diogonal
  ];
  //to use the player constructor and save the object in the game module
  const init_playerX = (...args) => {
    playerX = player(args[0],args[1]);
  }
  const init_playerO = (...args) => {
    playerO = player(args[0],args[1]);
  }
//renders the squares to the gameboard and game page
  const render = () => {
    $(parent).empty();
    for(let i = 0; i < 9; i++) {
      let div = document.createElement("div");
      div.classList.add("cells");
      div.setAttribute("id", ("cell_"+i));
      parent.appendChild(div);
    }
    game_flow();
  }
  //renders saved data to the game page
  const ui_render = () => {
    $("#playerX_name").text(playerX.name);
    $("#playerX_marker").text(playerX.marker);
    $("#playerO_name").text(playerO.name);
    $("#playerO_marker").text(playerO.marker);
  }
  //switches the player turns
  const toggle_turn = () => {
    if(current_player == "X") {
      current_player = "O";
    }
    else {
      current_player = "X";
    }
  }
  //checks if the current player won and cheks for draw
  const check_winner = () => {
    let new_board = document.getElementsByClassName("cells");
    let left_over_cells = 0;
    let result = "";
    let winning_row;

    for(let i = 0; i < new_board.length; i++) {
      if(new_board[i].innerHTML == ""){
        left_over_cells += 1;
      }
    }

    for(let i = 0; i < winning_combos.length; i++) {
      let row= 0;
      for(let j = 0; j < winning_combos[i].length; j++) {
        let wc_num = winning_combos[i][j];
        if(game_board[wc_num] == current_player){
          row++;
        }
        if(row >= 3) {
          winning_row = winning_combos[i];
        }
      }
      if(winning_row) {
        result = current_player;
        break;
      }
    }

    if(result == "X" || result == "O") {
      if(result == "X") {
        winner_display.innerHTML = playerX.name + " won";
        $("#playerX_name").css("color", "limegreen");
        $("#playerX_marker").css("color", "limegreen");

      }
      if(result == "O") {
        winner_display.innerHTML = playerO.name + " won";
        $("#playerO_name").css("color", "limegreen");
        $("#playerO_marker").css("color", "limegreen");

      }
    }
    else if( (result == "") && (left_over_cells <= 0)) {
      winner_display.innerHTML = "DRAW";
    }
    else {
      winner_display.innerHTML = "";
    }

  }

//handle click singleplayer

const handleClick_sp = (element) => {
  if(winner_display.innerHTML == "")
  {
    if(current_player == "X") {
      let parent = element.parentNode;
      let cell_index = $(element).index();
      element.innerHTML = current_player;
      game_board[cell_index] = current_player;
      check_winner();
      toggle_turn();
    }
    if(current_player == "O") {
      let actual_game_board = document.getElementsByClassName("cells");
      if(playerO.dif_level == "eazy")
      {
        if(winner_display.innerHTML == ""){
        setTimeout(()=> {
          playerO.eazy_ai(actual_game_board);
          check_winner();
          toggle_turn();
        },500);
          }
        }

      if(playerO.dif_level == "master")
      {
        if(winner_display.innerHTML == ""){
          //setime out
          playerO.master_ai(actual_game_board);
          check_winner();
          toggle_turn();
        }
      }

    }
  }
}



//handles the click multiplayer
  const handleClick = (element) => {
    if(winner_display.innerHTML == "")
    {
      let parent = element.parentNode;
      let cell_index = $(element).index();
      element.innerHTML = current_player;
      game_board[cell_index] = current_player;
    } // <- executes as long es there is no winner
  }
//resets everything and removes the game boards sqares including their event Listener
  const reset_flow = () => {
    let player_names_display = document.getElementsByClassName("player_names");
    let player_markers_display = document.getElementsByClassName("player_markers");
    for(let i = 0; i < player_names_display.length; i++) {
      player_names_display[i].style.color = "black";
    }

    for(let i = 0; i < player_markers_display.length; i++) {
      player_markers_display[i].style.color = "black";
    }

    winner_display.innerHTML = "";
    game_board = ["", "", "", "", "", "", "", "", ""];

    if(current_player == "O") {
      current_player = "X";
    }
    render();
  }


//Adds event Listeners to every square/cell in the gameboard
  const game_flow = () => {
    let cells = document.getElementsByClassName("cells");
    for(let i = 0; i < cells.length; i++) {
      cells[i].addEventListener("click", (e)=> {
        if(winner_display.innerHTML == "") {
          if(playerO.status != "AI") {
            console.log("Vs Person");
              handleClick(e.target);
              check_winner();
              toggle_turn();
          }
          if(playerO.status == "AI") {
            console.log("Vs AI")
            handleClick_sp(e.target);
          }
        }
      },{once: true});
    }
  }
//deletes everything and exits the game
  const exit_game = () => {
    $(parent).empty();

    let player_names_display = document.getElementsByClassName("player_names");
    let player_markers_display = document.getElementsByClassName("player_markers");

    for(let i = 0; i < player_names_display.length; i++) {
      player_names_display[i].style.color = "black";
      player_names_display[i].innerHTML = "";
    }

    for(let i = 0; i < player_markers_display.length; i++) {
      player_markers_display[i].style.color = "black";
      player_markers_display[i].innerHTML = "";
    }

    winner_display.innerHTML = "";
    game_board = ["", "", "", "", "", "", "", "", ""];
    if(current_player == "O") {
      current_player = "X";
    }

    $(game_page).hide();
    $(start_page).fadeIn();
  }

  return {
    init_playerX,
    init_playerO,
    get_game_board_arr,
    update_game_board,
    ui_render,
    toggle_turn,
    handleClick_sp,
    handleClick,
    reset_flow,
    render,
    exit_game,
    game_flow,
  }
})();

  //Buttons
  let singleplayer_button = document.getElementById("singleplayer_button");
  let multiplayer_button = document.getElementById("multiplayer_button");
  let play_button = document.getElementById("play_button");
  let exit_button = document.getElementById("exit_button");
  let next_buttons = document.getElementsByClassName("next_buttons");
  let cancel_buttons = document.getElementsByClassName("cancel_buttons");
  let reset_button = document.getElementById("reset_button");
  //pages
  let start_page = document.getElementById("settings");
  let singleplayer_settings_page = document.getElementById("singleplayer_settings_page");
  let multiplayer_settings_page = document.getElementById("multiplayer_settings_page");
  let game_page = document.getElementById("game_page");
  //hiding the other pages
  $(singleplayer_settings_page).hide();
  $(multiplayer_settings_page).hide();
  $(game_page).hide();
  //navigation functionality
  singleplayer_button.addEventListener("click", ()=> {
    $(start_page).hide();
    $(singleplayer_settings_page).fadeIn(1000);
  });

  multiplayer_button.addEventListener("click", ()=> {
    $(start_page).hide();
    $(multiplayer_settings_page).fadeIn(1000);
  });

  exit_button.addEventListener("click", () => {
    game.exit_game();
    $(game_page).hide();
    $(start_page).fadeIn(1000);
  });

  $(".cancel_buttons").on("click", (e)=> {
    let current_page = e.target.parentNode.parentNode;
    document.getElementById("sp_playerX_input").value = "";
    document.getElementById("mp_playerX_input").value = "";
    document.getElementById("playerO_input").value = "";
    game.exit_game();
    $(current_page).hide();
    $(start_page).fadeIn(1000);
  });

  $("#dif_eazy_button").on("click", (e)=> {
    let current = e.target;
    $(current).removeClass("ssp_difficulty_buttons");
    $("#dif_master_button").removeClass("ssp_difficulty_buttons_selected");
    $("#dif_master_button").addClass("ssp_difficulty_buttons");
    $(current).addClass("ssp_difficulty_buttons_selected");
  });

$("#dif_master_button").on("click", (e) => {
    let current = e.target;
    $(current).removeClass("ssp_difficulty_buttons");
    $("#dif_eazy_button").removeClass("ssp_difficulty_buttons_selected");
    $("#dif_eazy_button").addClass("ssp_difficulty_buttons");
    $(current).addClass("ssp_difficulty_buttons_selected");
  });

  $(".next_buttons").on("click", (e) => {
    let current_page = e.target.parentNode.parentNode;
    let current_page_id = current_page.getAttribute("id");

    if(current_page_id == "singleplayer_settings_page") {
      let pXinput = document.getElementById("sp_playerX_input");
      let dif_level = document.getElementsByClassName("ssp_difficulty_buttons_selected")[0].innerHTML;
      if(pXinput.value != "") {
        game.init_playerX(pXinput.value, "X");
        game.init_playerO("AI",dif_level);
        $(current_page).hide();
        game.ui_render();
        $(game_page).fadeIn(1000);
        game.render();
        pXinput.value = "";
      }
    }

    if(current_page_id == "multiplayer_settings_page") {
      let pXinput = document.getElementById("mp_playerX_input");
      let pOinput = document.getElementById("playerO_input");
      if((pXinput.value != "") && (pOinput.value != "")) {
        game.init_playerX(pXinput.value, "X");
        game.init_playerO(pOinput.value, "O");
        $(current_page).hide();
        game.ui_render();
        $(game_page).fadeIn(1000);
        game.render();
        pXinput.value = "";
        pOinput.value = "";
        pXinput.style.borderColor = "black";
        pOinput.style.borderColor = "black";
      }
      else {

      }
    }

    reset_button.addEventListener("click", ()=> {
      game.reset_flow();
    });


  });
  //---------------------------------------------------------------------------
