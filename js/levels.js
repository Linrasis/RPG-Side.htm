'use strict';

function load_level(id){
    create_player({
      'spellbar': {
        0: 'bolt',
        1: 'bolt',
        2: 'bolt',
        3: 'bolt',
        4: 'bolt',
        5: 'bolt',
        6: 'bolt',
        7: 'bolt',
        8: 'bolt',
        9: 'bolt',
      },
      'spellbook': {
        'bolt': {
          'color': '#00f',
          'cost': 1,
          'current': 10,
          'damage': 1,
          'lifespan': 100,
          'reload': 10,
        },
      },
      'stats': {
        'health': {
          'current': 100,
          'max': 100,
          'regeneration': {
            'current': 0,
            'max': 1000,
          },
        },
        'mana': {
          'current': 10,
          'max': 10,
          'regeneration': {
            'current': 0,
            'max': 100,
          },
        },
      },
    });

    var loop_counter = 9;
    do{
        create_world_dynamic({
          'color': '#555',
          'x': -150 + 25 * loop_counter,
          'y': 25,
        });
    }while(loop_counter--);
    create_world_dynamic({
      'color': '#555',
      'x': -125,
      'y': 0,
    });
    create_world_dynamic({
      'color': '#555',
      'x': 75,
      'y': -50,
    });

    create_world_dynamic({
      'collision': false,
      'color': '#700',
      'effect': 1,
      'height': 50,
      'width': 50,
      'x': 150,
      'y': 150,
    });
    create_world_dynamic({
      'collision': false,
      'color': '#66f',
      'effect': 1,
      'effect-stat': 'mana',
      'height': 50,
      'width': 50,
      'x': 100,
      'y': 150,
    });

    world_static.push({
      'color': '#111',
      'height': 500,
      'width': 500,
      'x': -250,
      'y': -250,
    });

    create_npc({
      'friendly': true,
      'x': -200,
      'y': 100,
    });
    create_npc({
      'selected': 'bolt',
      'spellbook': {
        'bolt': {
          'color': '#f00',
          'current': 0,
          'damage': 1,
          'lifespan': 50,
          'reload': 10,
        },
      },
      'stats': {
        'health': {
          'current': 10,
          'max': 10,
        },
      },
      'x': 200,
      'y': -100,
    });
}
