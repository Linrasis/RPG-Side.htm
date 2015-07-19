'use strict';

function load_level(id){
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
