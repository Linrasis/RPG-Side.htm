'use strict';

function create_npc(properties){
    properties = properties || {};

    properties['color'] = properties['color'] || '#fff';
    properties['friendly'] = properties['friendly'] || false;
    properties['height'] = properties['height'] || 20;
    properties['height-half'] = properties['height'] / 2;
    properties['width'] = properties['width'] || 20;
    properties['width-half'] = properties['width'] / 2;
    properties['x'] = properties['x'] || 0;
    properties['y'] = properties['y'] || 0;

    properties['stats'] = properties['stats'] || {};
      properties['stats']['health'] = properties['stats']['health'] || {};
        properties['stats']['health']['current'] = properties['stats']['health']['current'] || 1;
        properties['stats']['health']['max'] = properties['stats']['health']['max'] || 1;

    properties['selected'] = properties['selected'] || void 0;
    properties['spellbook'] = properties['spellbook'] || {};

    npcs.push(properties);
}

function create_particle(properties){
    properties = properties || {};

    properties['color'] = properties['color'] || '#fff';
    properties['damage'] = properties['damage'] || 1;
    properties['dx'] = properties['dx'] || 0;
    properties['dy'] = properties['dy'] || 0;
    properties['height'] = properties['height'] || 10;
    properties['height-half'] = properties['height'] / 2;
    properties['lifespan'] = properties['lifespan'] || 10;
    properties['owner'] = properties['owner'] === void 0
      ? -1
      : properties['owner'];
    properties['width'] = properties['width'] || 10;
    properties['width-half'] = properties['width'] / 2;
    properties['x'] = properties['x'] || 0;
    properties['y'] = properties['y'] || 0;

    particles.push(properties);
}

function create_player(properties){
    properties = properties || {};

    properties['equipment'] = properties['equipment'] || {
      'feet': void 0,
      'head': void 0,
      'off-hand': void 0,
      'legs': void 0,
      'main-hand': void 0,
      'neck': void 0,
      'torso': void 0,
    };
    properties['inventory'] = properties['inventory'] || [];
    properties['selected'] = properties['selected'] || 1;
    properties['spellbar'] = properties['spellbar'] || {
      0: void 0,
      1: void 0,
      2: void 0,
      3: void 0,
      4: void 0,
      5: void 0,
      6: void 0,
      7: void 0,
      8: void 0,
      9: void 0,
    };
    properties['spellbook'] = properties['spellbook'] || {};
    properties['stats'] = properties['stats'] || {};
    properties['x'] = properties['x'] || 0;
    properties['y'] = properties['y'] || 0;
    properties['y-velocity'] = properties['y-velocity'] || 0;

    player = properties;
}

function create_world_dynamic(properties){
    properties = properties || {};

    properties['collision'] = properties['collision'] == void 0;
    properties['color'] = properties['color'] || '#fff';
    properties['effect'] = properties['effect'] || {};
    properties['effect-stat'] = properties['effect-stat'] || 'health';
    properties['height'] = properties['height'] || 25;
    properties['type'] = properties['type'] || 'stone';
    properties['width'] = properties['width'] || 25;
    properties['x'] = properties['x'] || 0;
    properties['y'] = properties['y'] || 0;

    world_dynamic.push(properties);
}

function draw(){
    buffer.clearRect(
      0,
      0,
      width,
      height
    );

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
      200
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
      player['spellbook'][player['spellbar'][player['selected']]]['current']
        + '/'
        + player['spellbook'][player['spellbar'][player['selected']]]['reload'],
      100,
      225
    );

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
      parseInt(player['stats']['health']['current'] * 100 / player['stats']['health']['max'])
        + '%',
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
      parseInt(player['stats']['mana']['current'] * 100 / player['stats']['mana']['max'])
        + '%',
      150,
      125
    );
    buffer.fillText(
      player['stats']['mana']['regeneration']['current']
        + '/' + player['stats']['mana']['regeneration']['max'],
      150,
      175
    );

    buffer.textAlign = 'left';
    for(var spell in player['spellbar']){
        buffer.fillText(
          spell
            + ': '
            + player['spellbar'][spell]
            + (spell == player['selected']
              ? ', selected'
              : ''
            ),
          0,
          250 + 25 * parseInt(spell)
        );
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

    canvas.clearRect(
      0,
      0,
      width,
      height
    );
    canvas.drawImage(
      document.getElementById('buffer'),
      0,
      0
    );

    animationFrame = window.requestAnimationFrame(draw);
}

function effect_player(stat, effect){
    player['stats'][stat]['current'] -= effect;
    if(player['stats'][stat]['current'] <= 0){
        player['stats'][stat]['current'] = 0;

    }else if(player['stats'][stat]['current'] >= player['stats'][stat]['max']){
        player['stats'][stat]['current'] = player['stats'][stat]['max'];
        player['stats'][stat]['regeneration']['current'] = 0;
    }
}

function get_fixed_length_line(x0, y0, x1, y1, length){
    var distance = Math.sqrt(
      Math.pow(
        x1 - x0,
        2
      ) + Math.pow(
        y1 - y0,
        2
      )
    );

    x1 /= distance;
    x1 *= length;
    y1 /= distance;
    y1 *= length;

    return {
      'x': x1,
      'y': y1,
    };
}

function get_movement_speed(x0, y0, x1, y1){
    var angle = Math.atan(Math.abs(y0 - y1) / Math.abs(x0 - x1));
    return [
      Math.cos(angle),
      Math.sin(angle),
    ];
}

function logic(){
    if(!game_running){
        return;
    }

    // Regenerate player health and mana.
    if(player['stats']['health']['current'] < player['stats']['health']['max']){
        player['stats']['health']['regeneration']['current'] += 1;
        if(player['stats']['health']['regeneration']['current'] >= player['stats']['health']['regeneration']['max']){
            player['stats']['health']['current'] += 1;
            player['stats']['health']['regeneration']['current'] = 0;
        }
    }

    if(player['stats']['mana']['current'] < player['stats']['mana']['max']){
        player['stats']['mana']['regeneration']['current'] += 1;
        if(player['stats']['mana']['regeneration']['current'] >= player['stats']['mana']['regeneration']['max']){
            player['stats']['mana']['current'] += 1;
            player['stats']['mana']['regeneration']['current'] = 0;
        }
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

    // Update player spells.
    for(var spell in player['spellbook']){
        if(player['spellbook'][spell]['current'] < player['spellbook'][spell]['reload']){
            player['spellbook'][spell]['current'] += 1;
        }
    }

    // Check if player wants to fire selected spell
    //   and fire it if they do and it can be fired.
    var selected = player['spellbar'][player['selected']];

    if(mouse_lock_x > -1
      && player['spellbook'][selected]['current'] >= player['spellbook'][selected]['reload']
      && player['stats'][player['spellbook'][selected]['costs']]['current'] >= player['spellbook'][selected]['cost']){
        player['spellbook'][selected]['current'] = 0;
        player['stats'][player['spellbook'][selected]['costs']]['current'] = Math.max(
          player['stats'][player['spellbook'][selected]['costs']]['current'] - player['spellbook'][selected]['cost'],
          0
        );

        // Handle particle-creating spells.
        if(player['spellbook'][selected]['type'] === 'particle'){
            var speeds = get_movement_speed(
              player['x'],
              player['y'],
              player['x'] + mouse_x - x,
              player['y'] + mouse_y - y
            );
            var particle = {};
            for(var property in player['spellbook'][selected]['particle']){
                particle[property] = player['spellbook'][selected]['particle'][property];
            }
            particle['dx'] = (mouse_x > x ? speeds[0] : -speeds[0]);
            particle['dy'] = (mouse_y > y ? speeds[1] : -speeds[1]);
            particle['x'] = player['x'];
            particle['y'] = player['y'];

            create_particle(particle);

        }else if(player['spellbook'][selected]['type'] === 'stat'){
            effect_player(
              player['spellbook'][selected]['effect']['stat'],
              player['spellbook'][selected]['effect']['damage']
            );

        }else if(player['spellbook'][selected]['type'] === 'world-dynamic'){
            var worlddynamic = {};
            for(var property in player['spellbook'][selected]['world-dynamic']){
                worlddynamic[property] = player['spellbook'][selected]['world-dynamic'][property];
            }
            worlddynamic['x'] = player['x'] + mouse_x - x;
            worlddynamic['y'] = player['y'] + mouse_y - y;

            create_world_dynamic(worlddynamic);
        }
    }

    // Handle NPCs.
    for(var npc in npcs){
        if(npcs[npc]['selected'] == void 0){
            continue;
        }

        for(var spell in npcs[npc]['spellbook']){
            if(npcs[npc]['spellbook'][spell]['current'] < npcs[npc]['spellbook'][spell]['reload']){
                npcs[npc]['spellbook'][spell]['current'] += 1;
                continue;
            }

            if(npcs[npc]['selected'] !== spell){
                continue;
            }

            npcs[npc]['spellbook'][spell]['current'] = 0;

            // Calculate particle movement...
            var speeds = get_movement_speed(
              npcs[npc]['x'],
              npcs[npc]['y'],
              player['x'],
              player['y']
            );

            // ...and add particle with movement pattern, tied to the NPC.
            create_particle({
              'color': npcs[npc]['spellbook'][spell]['color'],
              'damage': npcs[npc]['spellbook'][spell]['damage'],
              'dx': (player['x'] > npcs[npc]['x'] ? speeds[0] : -speeds[0]),
              'dy': (player['y'] > npcs[npc]['y'] ? speeds[1] : -speeds[1]),
              'lifespan': npcs[npc]['spellbook'][spell]['lifespan'],
              'owner': npc,
              'x': npcs[npc]['x'],
              'y': npcs[npc]['y'],
            });

            break;
        }
    }

    // Handle particles.
    for(var particle in particles){
        particles[particle]['x'] += 5 * particles[particle]['dx'];
        particles[particle]['y'] += 5 * particles[particle]['dy'];

        particles[particle]['lifespan'] -= 1;
        if(particles[particle]['lifespan'] < 0){
            particles.splice(
              particle,
              1
            );
            continue;
        }

        for(var object in world_dynamic){
            if(!world_dynamic[object]['collision']
              || particles[particle]['x'] <= world_dynamic[object]['x']
              || particles[particle]['x'] >= world_dynamic[object]['x'] + world_dynamic[object]['width']
              || particles[particle]['y'] <= world_dynamic[object]['y']
              || particles[particle]['y'] >= world_dynamic[object]['y'] + world_dynamic[object]['height']){
                continue;
            }

            particles.splice(
              particle,
              1
            );
            return;
        }

        // Handle particles not owned by player.
        if(particles[particle]['owner'] > -1){
            if(particles[particle]['x'] > player['x'] - 17
              && particles[particle]['x'] < player['x'] + 17
              && particles[particle]['y'] > player['y'] - 17
              && particles[particle]['y'] < player['y'] + 17){
                effect_player(
                  'health',
                  particles[particle]['damage']
                );

                particles.splice(
                  particle,
                  1
                );
            }

            continue;
        }

        // Handle particles owned by player.
        for(var npc in npcs){
            if(npcs[npc]['friendly']
              || particles[particle]['x'] <= npcs[npc]['x'] - npcs[npc]['width'] / 2
              || particles[particle]['x'] >= npcs[npc]['x'] + npcs[npc]['width'] / 2
              || particles[particle]['y'] <= npcs[npc]['y'] - npcs[npc]['height'] / 2
              || particles[particle]['y'] >= npcs[npc]['y'] + npcs[npc]['height'] / 2){
                continue;
            }

            npcs[npc]['stats']['health']['current'] -= particles[particle]['damage'];
            if(npcs[npc]['stats']['health']['current'] <= 0){
                npcs.splice(
                  npc,
                  1
                );
            }

            particles.splice(
              particle,
              1
            );

            break;
        }
    }

    if(player['stats']['health']['current'] <= 0){
        game_running = false;
    }
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

function play_audio(id){
    if(settings['audio-volume'] <= 0){
        return;
    }

    document.getElementById(id).currentTime = 0;
    document.getElementById(id).play();
}

function reset(){
    if(!window.confirm('Reset settings?')){
        return;
    }

    document.getElementById('audio-volume').value = 1;
    document.getElementById('color').value = '#009900';
    document.getElementById('jump-key').value = 'W';
    document.getElementById('movement-keys').value = 'AD';
    document.getElementById('ms-per-frame').value = 25;

    save();
}

function resize(){
    if(mode <= 0){
        return;
    }

    height = window.innerHeight;
    document.getElementById('buffer').height = height;
    document.getElementById('canvas').height = height;
    y = height / 2;

    width = window.innerWidth;
    document.getElementById('buffer').width = width;
    document.getElementById('canvas').width = width;
    x = width / 2;
}

// Save settings into window.localStorage if they differ from default.
function save(){
    var ids = {
      'audio-volume': 1,
      'ms-per-frame': 25,
    };
    for(var id in ids){
        if(isNaN(document.getElementById(id).value)
          || document.getElementById(id).value == ids[id]){
            window.localStorage.removeItem('RPG-Side.htm-' + id);
            settings[id] = ids[id];

        }else{
            settings[id] = parseFloat(document.getElementById(id).value);
            window.localStorage.setItem(
              'RPG-Side.htm-' + id,
              settings[id]
            );
        }
    }

    ids = {
      'color': '#009900',
      'jump-key': 'W',
      'movement-keys': 'AD',
    };
    for(id in ids){
        if(document.getElementById(id).value === ids[id]){
            window.localStorage.removeItem('RPG-Side.htm-' + id);
            settings[id] = ids[id];

        }else{
            settings[id] = document.getElementById(id).value;
            window.localStorage.setItem(
              'RPG-Side.htm-' + id,
              settings[id]
            );
        }
    }
}

function select_spell(id){
    if(id < 1){
        id = 10;

    }else if(id > 10){
        id = 1;
    }

    player['selected'] = id;
    document.getElementById('canvas').style.cursor =
      player['spellbook'][player['spellbar'][id]]['cursor'] || 'auto';
}

function setmode(newmode, newgame){
    window.cancelAnimationFrame(animationFrame);
    window.clearInterval(interval);

    npcs.length = 0;
    particles.length = 0;
    world_dynamic.length = 0;
    world_static.length = 0;

    game_running = true;
    mode = newmode;

    // New game mode.
    if(mode > 0){
        // If it's a newgame from the main menu, save and setup canvas and buffers.
        if(newgame){
            save();

            document.body.innerHTML =
              '<canvas id=canvas oncontextmenu="return false"></canvas><canvas id=buffer></canvas>';

            var contextAttributes = {
              'alpha': false,
            };
            buffer = document.getElementById('buffer').getContext(
              '2d',
              contextAttributes
            );
            canvas = document.getElementById('canvas').getContext(
              '2d',
              contextAttributes
            );

            resize();
        }

        load_level(0);
        select_spell(player['selected']);

        animationFrame = window.requestAnimationFrame(draw);
        interval = window.setInterval(
          'logic()',
          settings['ms-per-frame']
        );

        return;
    }

    // Main menu mode.
    buffer = 0;
    canvas = 0;

    document.body.innerHTML = '<div><div><a onclick="setmode(1, true)">Test Level</a></div></div><div class=right><div><input disabled value=Click>Cast Spell<br><input id=jump-key maxlength=1 value='
      + settings['jump-key'] + '>Jump<br><input disabled value=ESC>Main Menu<br><input id=movement-keys maxlength=2 value='
      + settings['movement-keys'] + '>Move ←→<br><input disabled value="0 - 9">Select Spell</div><hr><div><input id=audio-volume max=1 min=0 step=0.01 type=range value='
      + settings['audio-volume'] + '>Audio<br><input id=color type=color value='
      + settings['color'] + '>Color<br><input id=ms-per-frame value='
      + settings['ms-per-frame'] + '>ms/Frame<br><a onclick=reset()>Reset Settings</a></div></div>';
}

var animationFrame = 0;
var buffer = 0;
var canvas = 0;
var game_running = false;
var height = 0;
var interval = 0;
var jump_permission = true;
var key_jump = false;
var key_left = false;
var key_right = false;
var mode = 0;
var mouse_lock_x = 0;
var mouse_lock_y = 0;
var mouse_x = 0;
var mouse_y = 0;
var npcs = [];
var particles = [];
var player = {};
var settings = {
  'audio-volume': window.localStorage.getItem('RPG-Side.htm-audio-volume') !== null
    ? parseFloat(window.localStorage.getItem('RPG-Side.htm-audio-volume'))
    : 1,
  'color': window.localStorage.getItem('RPG-Side.htm-color') || '#009900',
  'jump-key': window.localStorage.getItem('RPG-Side.htm-jump-key') || 'W',
  'movement-keys': window.localStorage.getItem('RPG-Side.htm-movement-keys') || 'AD',
  'ms-per-frame': parseInt(window.localStorage.getItem('RPG-Side.htm-ms-per-frame')) || 25,
};
var x = 0;
var width = 0;
var world_dynamic = [];
var world_static = [];
var y = 0;

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

    setmode(
      0,
      true
    );
};

window.onmousedown = function(e){
    if(mode <= 0){
        return;
    }

    e.preventDefault();
    mouse_lock_x = mouse_x;
    mouse_lock_y = mouse_y;
};

window.onmousemove = function(e){
    if(mode <= 0){
        return;
    }

    mouse_x = e.pageX;
    mouse_y = e.pageY;
};

window.onmouseup = function(e){
    mouse_lock_x = -1;
};

window.onresize = resize;
