'use strict';

function draw_logic(){
    canvas_buffer.save();
    canvas_buffer.translate(
      canvas_x,
      canvas_y
    );

    canvas_buffer.save();
    canvas_buffer.translate(
      -rpg_characters[0]['x'],
      -rpg_characters[0]['y']
    );

    // Draw static world objects.
    for(var object in rpg_world_static){
        canvas_buffer.fillStyle = rpg_world_static[object]['color'];
        canvas_buffer.fillRect(
          rpg_world_static[object]['x'],
          rpg_world_static[object]['y'],
          rpg_world_static[object]['width'],
          rpg_world_static[object]['height']
        );
    }

    // Draw dynamic world objects.
    for(var object in rpg_world_dynamic){
        canvas_buffer.fillStyle = rpg_world_dynamic[object]['color'];
        canvas_buffer.fillRect(
          rpg_world_dynamic[object]['x'],
          rpg_world_dynamic[object]['y'],
          rpg_world_dynamic[object]['width'],
          rpg_world_dynamic[object]['height']
        );
    }

    // Draw characters.
    for(var character in rpg_characters){
        canvas_buffer.fillStyle = rpg_characters[character]['color'];
        canvas_buffer.fillRect(
          rpg_characters[character]['x'] - rpg_characters[character]['width-half'],
          rpg_characters[character]['y'] - rpg_characters[character]['height-half'],
          rpg_characters[character]['width'],
          rpg_characters[character]['height']
        );
    }

    // Draw particles.
    for(var particle in rpg_particles){
        canvas_buffer.fillStyle = rpg_particles[particle]['color'];
        canvas_buffer.fillRect(
          rpg_particles[particle]['x'] - rpg_particles[particle]['width-half'],
          rpg_particles[particle]['y'] - rpg_particles[particle]['height-half'],
          rpg_particles[particle]['width'],
          rpg_particles[particle]['height']
        );
    }

    canvas_buffer.restore();

    // Draw player targeting direction.
    var endpoint = math_fixed_length_line(
      0,
      0,
      mouse_x - canvas_x,
      mouse_y - canvas_y,
      25
    );
    canvas_buffer.beginPath();
    canvas_buffer.moveTo(
      0,
      0
    );
    canvas_buffer.lineTo(
      endpoint['x'],
      endpoint['y']
    );
    canvas_buffer.closePath();
    canvas_buffer.strokeStyle = '#fff';
    canvas_buffer.stroke();

    canvas_buffer.restore();

    // Draw UI.
    canvas_buffer.fillStyle = '#444';
    canvas_buffer.fillRect(
      0,
      0,
      200,
      200
    );

    canvas_buffer.fillStyle = '#0a0';
    canvas_buffer.fillRect(
      0,
      0,
      200 * (rpg_characters[0]['stats']['health']['current'] / rpg_characters[0]['stats']['health']['max']),
      100
    );
    canvas_buffer.fillStyle = '#66f';
    canvas_buffer.fillRect(
      0,
      100,
      200 * (rpg_characters[0]['stats']['mana']['current'] / rpg_characters[0]['stats']['mana']['max']),
      100
    );

    // Setup text display.
    canvas_buffer.fillStyle = '#fff';
    canvas_buffer.font = canvas_fonts['medium'];
    canvas_buffer.textAlign = 'center';
    canvas_buffer.textBaseline = 'middle';

    canvas_buffer.fillText(
      rpg_characters[0]['stats']['health']['current'],
      50,
      25
    );
    canvas_buffer.fillText(
      rpg_characters[0]['stats']['health']['max'],
      50,
      75
    );
    canvas_buffer.fillText(
      rpg_characters[0]['stats']['mana']['current'],
      50,
      125
    );
    canvas_buffer.fillText(
      rpg_characters[0]['stats']['mana']['max'],
      50,
      175
    );
    canvas_buffer.fillText(
      parseInt(
        rpg_characters[0]['stats']['health']['current'] * 100 / rpg_characters[0]['stats']['health']['max'],
        10
      ) + '%',
      150,
      25
    );
    canvas_buffer.fillText(
      rpg_characters[0]['stats']['health']['regeneration']['current']
        + '/' + rpg_characters[0]['stats']['health']['regeneration']['max'],
      150,
      75
    );
    canvas_buffer.fillText(
      parseInt(
        rpg_characters[0]['stats']['mana']['current'] * 100 / rpg_characters[0]['stats']['mana']['max'],
        10
      ) + '%',
      150,
      125
    );
    canvas_buffer.fillText(
      rpg_characters[0]['stats']['mana']['regeneration']['current']
        + '/' + rpg_characters[0]['stats']['mana']['regeneration']['max'],
      150,
      175
    );

    // Draw selected UI.
    canvas_buffer.textAlign = 'left';
    canvas_buffer.fillText(
      rpg_characters[0]['spellbar'][rpg_characters[0]['selected']],
      10,
      225
    );
    if(rpg_ui === 1){
        canvas_buffer.fillText(
          'CHARACTER',
          205,
          13
        );

    }else if(rpg_ui === 2){
        canvas_buffer.fillText(
          'Inventory is empty.',
          205,
          13
        );

    }else if(rpg_ui === 3){
        for(var spell in rpg_characters[0]['spellbar']){
            canvas_buffer.fillText(
              spell
                + ': '
                + rpg_characters[0]['spellbar'][spell]
                + (spell == rpg_characters[0]['selected']
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
    if(rpg_characters[0]['dead']){
        canvas_buffer.fillStyle = '#f00';
        canvas_buffer.font = canvas_fonts['big'];
        canvas_buffer.textAlign = 'center';
        canvas_buffer.fillText(
          'YOU ARE DEAD',
          canvas_x,
          175
        );
    }
}

function logic(){
    if(canvas_menu){
        return;
    }

    var player_dx = 0;
    var player_dy = 0;

    if(!rpg_characters[0]['dead']){
        // Add player key movments to dx and dy, if still within level boundaries.
        if(key_left){
            player_dx -= 2;
        }

        if(key_right){
            player_dx += 2;
        }
    }

    var can_jump = false;

    // Check for player collision with dynamic world objects.
    for(var object in rpg_world_dynamic){
        if(rpg_world_dynamic[object]['effect'] === 0
          && !rpg_world_dynamic[object]['collision']){
            continue;
        }

        // If player and object aren't moving, no collision checks.
        if(player_dx === 0
          && player_dy === 0
          && rpg_characters[0]['y-velocity'] === 0){
            continue;
        }

        var temp_object_right_x = rpg_world_dynamic[object]['x'] + rpg_world_dynamic[object]['width'];
        var temp_object_right_y = rpg_world_dynamic[object]['y'] + rpg_world_dynamic[object]['height'];

        // Check if player position + movement is within bounds of object.
        if(rpg_characters[0]['x'] + player_dx - rpg_characters[0]['width-half'] > temp_object_right_x
          || rpg_characters[0]['x'] + player_dx + rpg_characters[0]['width-half'] < rpg_world_dynamic[object]['x']
          || rpg_characters[0]['y'] + rpg_characters[0]['y-velocity'] - rpg_characters[0]['height-half'] > temp_object_right_y
          || rpg_characters[0]['y'] + rpg_characters[0]['y-velocity'] + rpg_characters[0]['height-half'] < rpg_world_dynamic[object]['y']){
            continue;
        }

        if(rpg_world_dynamic[object]['effect'] > 0){
            rpg_character_affect(
              0,
              rpg_world_dynamic[object]['effect-stat'],
              rpg_world_dynamic[object]['effect']
            );
        }

        if(!rpg_world_dynamic[object]['collision']){
            continue;
        }

        // Handle collisions with platforms while jumping or falling.
        if(rpg_characters[0]['y-velocity'] != 0
          && rpg_characters[0]['x'] != rpg_world_dynamic[object]['x'] - rpg_characters[0]['width-half']
          && rpg_characters[0]['x'] != temp_object_right_x + rpg_characters[0]['width-half']){
            if(rpg_characters[0]['y-velocity'] > 0){
                if(rpg_characters[0]['y'] + rpg_characters[0]['y-velocity'] <= rpg_world_dynamic[object]['y'] - 10
                  && rpg_characters[0]['y'] + rpg_characters[0]['y-velocity'] > rpg_world_dynamic[object]['y'] - rpg_characters[0]['height-half']){
                    can_jump = true;
                    rpg_characters[0]['y-velocity'] = rpg_world_dynamic[object]['y'] - rpg_characters[0]['y'] - rpg_characters[0]['height-half'];
                    player_dy = 0;
                }

            }else if(rpg_characters[0]['y'] + rpg_characters[0]['y-velocity'] < temp_object_right_y + rpg_characters[0]['height-half']
              && rpg_characters[0]['y'] + rpg_characters[0]['y-velocity'] >= temp_object_right_y + 10){
                rpg_characters[0]['y-velocity'] = temp_object_right_y - rpg_characters[0]['y'] + rpg_characters[0]['height-half'];
            }
        }

        // Handle collisions with platforms while moving left/right.
        if(key_left
          && rpg_characters[0]['y'] + rpg_characters[0]['height-half'] > rpg_world_dynamic[object]['y']
          && rpg_characters[0]['y'] - rpg_characters[0]['height-half'] < temp_object_right_y
          && rpg_characters[0]['x'] - rpg_characters[0]['width-half'] < temp_object_right_x
          && rpg_characters[0]['x'] > rpg_world_dynamic[object]['x']){
            player_dx = temp_object_right_x - rpg_characters[0]['x'] + rpg_characters[0]['width-half'];
        }

        if(key_right
          && rpg_characters[0]['y'] + rpg_characters[0]['height-half'] > rpg_world_dynamic[object]['y']
          && rpg_characters[0]['y'] - rpg_characters[0]['height-half'] < temp_object_right_y
          && rpg_characters[0]['x'] + rpg_characters[0]['width-half'] != temp_object_right_x
          && rpg_characters[0]['x'] < rpg_world_dynamic[object]['x']){
            player_dx = rpg_world_dynamic[object]['x'] - rpg_characters[0]['x'] - rpg_characters[0]['width-half'];
        }
    }

    // Update actual player position.
    rpg_characters[0]['x'] += Math.round(player_dx);
    rpg_characters[0]['y'] += Math.round(player_dy + rpg_characters[0]['y-velocity']);

    if(can_jump
      && !rpg_characters[0]['dead']){
        if(jump_permission
          && key_jump){
            rpg_characters[0]['y-velocity'] = -rpg_characters[0]['stats']['jump-velocity'];
            jump_permission = false;

        }else{
            rpg_characters[0]['y-velocity'] = 0;
        }

    }else{
        rpg_characters[0]['y-velocity'] = Math.min(
          rpg_characters[0]['y-velocity'] + 1,
          5
        );
    }

    rpg_character_handle();
    rpg_particle_handle();
}

function mouse_wheel(e){
    if(canvas_mode <= 0){
        return;
    }

    rpg_spell_select(
      0,
      rpg_characters[0]['selected']
        + (
          (e.wheelDelta || -e.detail) > 0
            ? -1
            : 1
        )
    );
}

function setmode_logic(newgame){
    rpg_characters.length = 0;
    rpg_particles.length = 0;
    rpg_world_dynamic.length = 0;
    rpg_world_static.length = 0;

    // Main menu mode.
    if(canvas_mode === 0){
        document.body.innerHTML = '<div><div><a onclick="canvas_setmode(1, true)">Test Level</a></div></div>'
          + '<div class=right><div><input disabled value=Click>Cast Spell<br>'
          + '<input id=character-key maxlength=1>Character Info<br>'
          + '<input id=inventory-key maxlength=1>Inventory<br>'
          + '<input id=jump-key maxlength=1>Jump<br>'
          + '<input disabled value=ESC>Menu<br>'
          + '<input id=movement-keys maxlength=2>Move ←→<br>'
          + '<input disabled value="0 - 9">Select Spell<br>'
          + '<input id=spellbook-key maxlength=1>Spellbook</div><hr>'
          + '<div><input id=audio-volume max=1 min=0 step=0.01 type=range>Audio<br>'
          + '<input id=color type=color>Color<br>'
          + '<input id=ms-per-frame>ms/Frame<br>'
          + '<a onclick=settings_reset()>Reset Settings</a></div></div>';
        settings_update();

    // New game mode.
    }else{
        if(newgame){
            settings_save();
        }

        rpg_ui = 0;
        //rpg_spell_select(0, rpg_characters[0]['selected']);
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
    if(canvas_mode <= 0){
        return;
    }

    var key = e.keyCode || e.which;

    // ESC: menu.
    if(key === 27){
        canvas_menu_toggle();
        return;

    }else if(key > 47
      && key < 58){
        rpg_spell_select(
          0,
          key === 48
            ? 10
            : key - 48
        );
        return;
    }

    key = String.fromCharCode(key);

    if(key === settings_settings['movement-keys'][0]){
        key_left = true;

    }else if(key === settings_settings['movement-keys'][1]){
        key_right = true;

    }else if(key === settings_settings['jump-key']){
        key_jump = true;

    }else if(key === settings_settings['character-key']){
        rpg_ui = rpg_ui === 1
          ? 0
          : 1;

    }else if(key === settings_settings['inventory-key']){
        rpg_ui = rpg_ui === 2
          ? 0
          : 2;

    }else if(key === settings_settings['spellbook-key']){
        rpg_ui = rpg_ui === 3
          ? 0
          : 3;

    }else if(key === 'Q'){
        canvas_menu_quit();
    }
};

window.onkeyup = function(e){
    var key = String.fromCharCode(e.keyCode || e.which);

    if(key === settings_settings['movement-keys'][0]){
        key_left = false;

    }else if(key === settings_settings['movement-keys'][1]){
        key_right = false;

    }else if(key === settings_settings['jump-key']){
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

    settings_init(
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
    canvas_init();
};

window.onmousedown = function(e){
    if(canvas_mode <= 0
      || (mouse_x <= 200
        && mouse_y <= 250)){
        return;
    }

    e.preventDefault();
    mouse_lock_x = mouse_x;
    mouse_lock_y = mouse_y;
};

window.onmousemove = function(e){
    if(canvas_mode <= 0){
        return;
    }

    mouse_x = e.pageX;
    mouse_y = e.pageY;
};

window.onmouseup = function(e){
    mouse_lock_x = -1;
};
