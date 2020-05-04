/*
Made by Levan Mebonia
username: levo96
project : tic tac toe
*/

//player constructor
const player = (...args) => {
  let name = args[0];
  let marker = args[1];
  let dif_level = "eazy";//default
  let status = "player";//dafult

  //EAZY LEVEL
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
    let curent_cell = $(board_element).index(possible_cells[rand_number]);
    module_gameboard_arr[curent_cell] = "O";
    game.update_game_board(module_gameboard_arr)
    possible_cells[rand_number].innerHTML = "O";
  }


// MASTER LEVEL
const master_ai = (...args) => {
    let board_element = args[0];
    let ai_index = aiPlay(); //TO BE HONEST GOT HELP FOR MIN MAX ALGORITHM (CODE AT : 325)
    let board_arr = game.get_game_board_arr();
    board_arr[ai_index] = "O";
    game.update_game_board(board_arr);
    board_element[ai_index].innerHTML = "O"


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
    0,1,2,
    3,4,5,
    6,7,8
  ];
  //to get the actaul game from outside the game module
  const get_game_board_arr = () => {
    return game_board;
  }
  // to update the game module from outside the game module necessary for the check winner function
  const update_game_board = (arr) => {
    game_board = arr;
    return;
  }

  //to get current player from outside the game module neccesary for the ai_play function
  const get_current_player = () => {
    return current_player;
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
      if(element.innerHTML == ""){
       let parent = element.parentNode;
      let cell_index = $(element).index();
      element.innerHTML = current_player;
      game_board[cell_index] = current_player;
      check_winner();
      toggle_turn();
      }
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
        setTimeout(()=> {
          playerO.master_ai(actual_game_board);
          check_winner();
          toggle_turn();
          },500);
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
    game_board = [0,1,2,3,4,5,6,7,8];

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
              handleClick(e.target);
              check_winner();
              toggle_turn();
          }
          if(playerO.status == "AI") {
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
    game_board = [0,1,2,3,4,5,6,7,8];
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
    get_current_player,
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

  //MIN MAX ALGORITHM (TO BE HONEST I GOT HELP FOR THE MIN MAX ALGORITHM ONLINE)
  const aiPlay = () => {
  let board_arr = game.get_game_board_arr();
  let c_player = game.get_current_player();

  const winning = (board, player) => {
    if (
      (board[0] == player && board[1] == player && board[2] == player) ||
      (board[3] == player && board[4] == player && board[5] == player) ||
      (board[6] == player && board[7] == player && board[8] == player) ||
      (board[0] == player && board[3] == player && board[6] == player) ||
      (board[1] == player && board[4] == player && board[7] == player) ||
      (board[2] == player && board[5] == player && board[8] == player) ||
      (board[0] == player && board[4] == player && board[8] == player) ||
      (board[2] == player && board[4] == player && board[6] == player)
    ) {
      return true;
    } else {
      return false;
    }
  }

  const emptyCells = (board) => {
    return board.filter((cell) => cell !== 'O' && cell !== 'X');
  }

  const minimax = (newBoard, player) => {
    let human = 'X';
    let ai = 'O';

    let availableSpots = emptyCells(newBoard);

    if (winning(newBoard, human)) {
      return { score: -10 };
    } else if (winning(newBoard, ai)) {
      return { score: 10 };
    } else if (availableSpots.length === 0) {
      return { score: 0 };
    }
    let moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
      let move = {};
      move.index = newBoard[availableSpots[i]];
      newBoard[availableSpots[i]] = player;

      if (player === ai) {
        let result = minimax(newBoard, human);
        move.score = result.score;
      } else {
        let result = minimax(newBoard, ai);
        move.score = result.score;
      }
      newBoard[availableSpots[i]] = move.index;
      moves.push(move);
    }

    let bestMove;
    if (player === ai) {
      let bestScore = -10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
  }
  let bestPlay = minimax(board_arr, c_player).index;
  return bestPlay;
}

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
