'use strict';

function draw_logic(){
    buffer.save();
    buffer.translate(
      x,
      y
    );

    buffer.save();
    buffer.translate(
      -player['x'],
      -player['y']
    );

    // Draw static world objects.
    for(var object in world_static){
        buffer.fillStyle = world_static[object]['color'];
        buffer.fillRect(
          world_static[object]['x'],
          world_static[object]['y'],
          world_static[object]['width'],
          world_static[object]['height']
        );
    }

    // Draw dynamic world objects.
    for(var object in world_dynamic){
        buffer.fillStyle = world_dynamic[object]['color'];
        buffer.fillRect(
          world_dynamic[object]['x'],
          world_dynamic[object]['y'],
          world_dynamic[object]['width'],
          world_dynamic[object]['height']
        );
    }

    // Draw NPCs.
    for(var npc in npcs){
        buffer.fillStyle = npcs[npc]['color'];
        buffer.fillRect(
          npcs[npc]['x'] - npcs[npc]['width-half'],
          npcs[npc]['y'] - npcs[npc]['height-half'],
          npcs[npc]['width'],
          npcs[npc]['height']
        );
    }

    // Draw particles.
    for(var particle in particles){
        buffer.fillStyle = particles[particle]['color'];
        buffer.fillRect(
          particles[particle]['x'] - particles[particle]['width-half'],
          particles[particle]['y'] - particles[particle]['height-half'],
          particles[particle]['width'],
          particles[particle]['height']
        );
    }

    buffer.restore();

    // Draw player and targeting direction.
    buffer.fillStyle = settings['color'];
    buffer.fillRect(
      -17,
      -17,
      34,
      34
    );
    var endpoint = get_fixed_length_line(
      0,
      0,
      mouse_x - x,
      mouse_y - y,
      25
    );
    buffer.beginPath();
    buffer.moveTo(
      0,
      0
    );
    buffer.lineTo(
      endpoint['x'],
      endpoint['y']
    );
    buffer.closePath();
    buffer.strokeStyle = '#fff';
    buffer.stroke();

    buffer.restore();

    // Draw UI.
    buffer.fillStyle = '#444';
    buffer.fillRect(
      0,
      0,
      200,
      250
    );

    buffer.fillStyle = '#0a0';
    buffer.fillRect(
      0,
      0,
      200 * (player['stats']['health']['current'] / player['stats']['health']['max']),
      100
    );
    buffer.fillStyle = '#66f';
    buffer.fillRect(
      0,
      100,
      200 * (player['stats']['mana']['current'] / player['stats']['mana']['max']),
      100
    );

    // Setup text display.
    buffer.fillStyle = '#fff';
    buffer.font = '23pt sans-serif';
    buffer.textAlign = 'center';
    buffer.textBaseline = 'middle';

    buffer.fillText(
      player['stats']['health']['current'],
      50,
      25
    );
    buffer.fillText(
      player['stats']['health']['max'],
      50,
      75
    );
    buffer.fillText(
      player['stats']['mana']['current'],
      50,
      125
    );
    buffer.fillText(
      player['stats']['mana']['max'],
      50,
      175
    );

    buffer.font = '16pt sans-serif';
    buffer.fillText(
      parseInt(
        player['stats']['health']['current'] * 100 / player['stats']['health']['max'],
        10
      ) + '%',
      150,
      25
    );
    buffer.fillText(
      player['stats']['health']['regeneration']['current']
        + '/' + player['stats']['health']['regeneration']['max'],
      150,
      75
    );
    buffer.fillText(
      parseInt(
        player['stats']['mana']['current'] * 100 / player['stats']['mana']['max'],
        10
      ) + '%',
      150,
      125
    );
    buffer.fillText(
      player['stats']['mana']['regeneration']['current']
        + '/' + player['stats']['mana']['regeneration']['max'],
      150,
      175
    );

    // Draw selected UI.
    buffer.textAlign = 'left';
    if(ui === 1){
        buffer.fillText(
          'CHARACTER',
          205,
          13
        );

    }else if(ui === 2){
        buffer.fillText(
          'Inventory is empty.',
          205,
          13
        );

    }else if(ui === 3){
        for(var spell in player['spellbar']){
            buffer.fillText(
              spell
                + ': '
                + player['spellbar'][spell]
                + (spell == player['selected']
                  ? ', selected'
                  : ''
                ),
              205,
              25 * parseInt(
                spell,
                10
              ) - 12
            );
        }
    }

    // Draw game over messages.
    if(!game_running){
        buffer.font = '23pt sans-serif';
        buffer.textAlign = 'center';
        buffer.fillText(
          'ESC = Main Menu',
          x,
          220
        );

        buffer.fillStyle = '#f00';
        buffer.font = '42pt sans-serif';
        buffer.fillText(
          'YOU ARE DEAD',
          x,
          175
        );
    }
}

function logic(){
    if(!game_running){
        return;
    }

    var player_dx = 0;
    var player_dy = 0;

    // Add player key movments to dx and dy, if still within level boundaries.
    if(key_left){
        player_dx -= 2;
    }

    if(key_right){
        player_dx += 2;
    }

    var can_jump = false;

    // Check for player collision with dynamic world objects.
    for(var object in world_dynamic){
        if(world_dynamic[object]['effect'] === 0
          && !world_dynamic[object]['collision']){
            continue;
        }

        // If player and object aren't moving, no collision checks.
        if(player_dx === 0
          && player_dy === 0
          && player['y-velocity'] === 0){
            continue;
        }

        var temp_object_right_x = world_dynamic[object]['x'] + world_dynamic[object]['width'];
        var temp_object_right_y = world_dynamic[object]['y'] + world_dynamic[object]['height'];

        // Check if player position + movement is within bounds of object.
        if(player['x'] + player_dx - 17 > temp_object_right_x
          || player['x'] + player_dx + 17 < world_dynamic[object]['x']
          || player['y'] + player['y-velocity'] - 17 > temp_object_right_y
          || player['y'] + player['y-velocity'] + 17 < world_dynamic[object]['y']){
            continue;
        }

        if(world_dynamic[object]['effect'] > 0){
            effect_player(
              world_dynamic[object]['effect-stat'],
              world_dynamic[object]['effect']
            );
        }

        // Handle collisions with platforms while jumping or falling.
        if(player['y-velocity'] != 0
          && player['x'] != world_dynamic[object]['x'] - 17
          && player['x'] != temp_object_right_x + 17){
            if(player['y-velocity'] > 0){
                if(player['y'] + player['y-velocity'] <= world_dynamic[object]['y'] - 10
                  && player['y'] + player['y-velocity'] > world_dynamic[object]['y'] - 17){
                    can_jump = true;
                    player['y-velocity'] = world_dynamic[object]['y'] - player['y'] - 17;
                    player_dy = 0;
                }

            }else if(player['y'] + player['y-velocity'] < temp_object_right_y + 17
              && player['y'] + player['y-velocity'] >= temp_object_right_y + 10){
                player['y-velocity'] = temp_object_right_y - player['y'] + 17;
            }
        }

        // Handle collisions with platforms while moving left/right.
        if(key_left
          && player['y'] + 17 > world_dynamic[object]['y']
          && player['y'] - 17 < temp_object_right_y
          && player['x'] != world_dynamic[object]['x'] - 17
          && player['x'] > world_dynamic[object]['x']){
            player_dx = temp_object_right_x - player['x'] + 17;
        }

        if(key_right
          && player['y'] + 17 > world_dynamic[object]['y']
          && player['y'] - 17 < temp_object_right_y
          && player['x'] != temp_object_right_x + 17
          && player['x'] < world_dynamic[object]['x']){
            player_dx = world_dynamic[object]['x'] - player['x'] - 17;
        }
    }

    // Update actual player position.
    player['x'] += Math.round(player_dx);
    player['y'] += Math.round(player_dy + player['y-velocity']);

    if(can_jump){
        if(jump_permission
          && key_jump){
            player['y-velocity'] = -7;
            jump_permission = false;

        }else{
            player['y-velocity'] = 0;
        }

    }else{
        player['y-velocity'] = Math.min(
          player['y-velocity'] + 1,
          5
        );
    }

    handle_player();
    handle_npcs();
    handle_particles();
}

function mouse_wheel(e){
    if(mode <= 0){
        return;
    }

    select_spell(
      player['selected']
        + (
          (e.wheelDelta || -e.detail) > 0
            ? -1
            : 1
        )
    );
}

function setmode_logic(newgame){
    game_running = true;
    npcs.length = 0;
    particles.length = 0;
    world_dynamic.length = 0;
    world_static.length = 0;

    // Main menu mode.
    if(mode === 0){
        document.body.innerHTML = '<div><div><a onclick="setmode(1, true)">Test Level</a></div></div><div class=right><div><input disabled value=Click>Cast Spell<br><input id=character-key maxlength=1 value='
          + settings['character-key'] + '>Character Info<br><input id=inventory-key maxlength=1 value='
          + settings['inventory-key'] + '>Inventory<br><input id=jump-key maxlength=1 value='
          + settings['jump-key'] + '>Jump<br><input disabled value=ESC>Main Menu<br><input id=movement-keys maxlength=2 value='
          + settings['movement-keys'] + '>Move ←→<br><input disabled value="0 - 9">Select Spell<br><input id=spellbook-key maxlength=1 value='
          + settings['spellbook-key'] + '>Spellbook</div><hr><div><input id=audio-volume max=1 min=0 step=0.01 type=range value='
          + settings['audio-volume'] + '>Audio<br><input id=color type=color value='
          + settings['color'] + '>Color<br><input id=ms-per-frame value='
          + settings['ms-per-frame'] + '>ms/Frame<br><a onclick=reset()>Reset Settings</a></div></div>';

    // New game mode.
    }else{
        if(newgame){
            save();
        }

        ui = 0;
        //select_spell(player['selected']);
    }
}

var jump_permission = true;
var key_jump = false;
var key_left = false;
var key_right = false;
var mouse_lock_x = 0;
var mouse_lock_y = 0;
var mouse_x = 0;
var mouse_y = 0;

window.onkeydown = function(e){
    if(mode <= 0){
        return;
    }

    var key = e.keyCode || e.which;

    // ESC: return to main menu.
    if(key === 27){
        setmode(
          0,
          true
        );
        return;

    }else if(key > 47
      && key < 58){
        select_spell(
          key === 48
            ? 10
            : key - 48
        );
        return;
    }

    key = String.fromCharCode(key);

    if(key === settings['movement-keys'][0]){
        key_left = true;

    }else if(key === settings['movement-keys'][1]){
        key_right = true;

    }else if(key === settings['jump-key']){
        key_jump = true;

    }else if(key === settings['character-key']){
        ui = ui === 1
          ? 0
          : 1;

    }else if(key === settings['inventory-key']){
        ui = ui === 2
          ? 0
          : 2;

    }else if(key === settings['spellbook-key']){
        ui = ui === 3
          ? 0
          : 3;
    }
};

window.onkeyup = function(e){
    var key = String.fromCharCode(e.keyCode || e.which);

    if(key === settings['movement-keys'][0]){
        key_left = false;

    }else if(key === settings['movement-keys'][1]){
        key_right = false;

    }else if(key === settings['jump-key']){
        key_jump = false;
        jump_permission = true;
    }
};

window.onload = function(e){
    if('onmousewheel' in window){
        window.onmousewheel = mouse_wheel;

    }else{
        document.addEventListener(
          'DOMMouseScroll',
          mouse_wheel,
          false
        );
    }

    init_settings(
      'RPG-Side.htm-',
      {
        'audio-volume': 1,
        'character-key': 'C',
        'color': '#009900',
        'inventory-key': 'B',
        'jump-key': 'W',
        'movement-keys': 'AD',
        'ms-per-frame': 25,
        'spellbook-key': 'V',
      }
    );
    init_canvas();
};

window.onmousedown = function(e){
    if(mode <= 0
      || (mouse_x <= 200
        && mouse_y <= 250)){
        return;
    }

    e.preventDefault();
    mouse_lock_x = mouse_x;
    mouse_lock_y = mouse_y;
};

window.onmousemove = function(e){
    if(mode <= 0
      || !game_running){
        return;
    }

    mouse_x = e.pageX;
    mouse_y = e.pageY;
};

window.onmouseup = function(e){
    mouse_lock_x = -1;
};
