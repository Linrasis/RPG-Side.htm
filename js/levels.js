'use strict';

function load_level(id){
    rpg_character_create({
      'color': settings_settings['color'],
      'height': 34,
      'player': true,
      'spellbar': {
        1: 'manabolt',
        2: 'create block',
        3: 'lifebolt',
        4: 'heal',
        5: 'manabolt',
        6: 'manabolt',
        7: 'manabolt',
        8: 'manabolt',
        9: 'manabolt',
        10: 'manabolt',
      },
      'spellbook': {
        'create block': {
          'cost': 10,
          'costs': 'mana',
          'current': 10,
          'cursor': 'crosshair',
          'reload': 10,
          'type': 'world-dynamic',
          'world-dynamic': {
            'color': '#151',
          },
        },
        'heal': {
          'cost': 1,
          'costs': 'mana',
          'current': 10,
          'cursor': 'pointer',
          'effect': {
            'damage': -1,
            'stat': 'health',
          },
          'reload': 10,
          'type': 'stat',
        },
        'lifebolt': {
          'cost': 1,
          'costs': 'health',
          'current': 10,
          'cursor': 'crosshair',
          'particle': {
            'color': '#0f0',
            'damage': 2,
            'lifespan': 100,
            'speed-x': 5,
            'speed-y': 5,
          },
          'reload': 10,
          'type': 'particle',
        },
        'manabolt': {
          'cost': 1,
          'costs': 'mana',
          'current': 10,
          'cursor': 'crosshair',
          'particle': {
            'color': '#00f',
            'damage': 1,
            'lifespan': 50,
            'speed-x': 5,
            'speed-y': 5,
          },
          'reload': 10,
          'type': 'particle',
        },
      },
      'stats': {
        'health': {
          'current': 10,
          'max': 10,
          'regeneration': {
            'current': 0,
            'max': 1000,
          },
        },
        'jump-velocity': 8,
        'mana': {
          'current': 10,
          'max': 10,
          'regeneration': {
            'current': 0,
            'max': 100,
          },
        },
      },
      'width': 23,
    });

    rpg_world_static.push({
      'color': '#333',
      'height': 50,
      'width': 250,
      'x': -150,
      'y': -25,
    });

    rpg_world_dynamic_create({
      'color': '#555',
      'height': 100,
      'width': 25,
      'x': -175,
      'y': -50,
    });
    rpg_world_dynamic_create({
      'color': '#555',
      'height': 25,
      'width': 225,
      'x': -150,
      'y': -50,
    });
    rpg_world_dynamic_create({
      'color': '#555',
      'height': 25,
      'width': 275,
      'x': -150,
      'y': 25,
    });
    rpg_world_dynamic_create({
      'color': '#555',
      'height': 175,
      'width': 25,
      'x': 0,
      'y': 50,
    });
    rpg_world_dynamic_create({
      'collision': false,
      'color': '#700',
      'effect': 1,
      'height': 25,
      'width': 325,
      'x': 25,
      'y': 175,
    });
    rpg_world_dynamic_create({
      'color': '#555',
      'height': 25,
      'width': 325,
      'x': 25,
      'y': 200,
    });
    rpg_world_dynamic_create({
      'color': '#555',
      'height': 200,
      'width': 25,
      'x': 75,
      'y': -225,
    });
    rpg_world_dynamic_create({
      'color': '#555',
      'height': 25,
      'width': 250,
      'x': 100,
      'y': -225,
    });
    rpg_world_dynamic_create({
      'color': '#555',
      'height': 25,
      'width': 75,
      'x': 100,
      'y': -100,
    });
    rpg_world_dynamic_create({
      'color': '#555',
      'height': 25,
      'width': 75,
      'x': 175,
      'y': 25,
    });
    rpg_world_dynamic_create({
      'collision': false,
      'color': '#66f',
      'effect': 1,
      'effect-stat': 'mana',
      'height': 25,
      'width': 25,
      'x': 225,
      'y': 0,
    });
    rpg_world_dynamic_create({
      'color': '#555',
      'height': 450,
      'width': 25,
      'x': 350,
      'y': -225,
    });

    rpg_character_create({
      'team': 0,
      'x': -125,
      'y': 15,
    });
    rpg_character_create({
      'spellbar': {
        1: 'manabolt',
      },
      'spellbook': {
        'manabolt': {
          'cost': 0,
          'costs': 'health',
          'current': 10,
          'particle': {
            'color': '#00f',
            'damage': 1,
            'lifespan': 50,
            'speed-x': 5,
            'speed-y': 5,
          },
          'reload': 10,
          'type': 'particle',
        },
      },
      'stats': {
        'health': {
          'current': 10,
          'max': 10,
          'regeneration': {
            'current': 0,
            'max': 1000,
          },
        },
      },
      'x': 125,
      'y': -110,
    });
}
