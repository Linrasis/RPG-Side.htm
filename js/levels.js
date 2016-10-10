'use strict';

function load_level(id){
    rpg_character_create({
      'color': settings_settings['color'],
      'height': 34,
      'inventory': [
        rpg_item_create({
          'cursor': 'pointer',
          'label': 'Scroll of Healthbolt',
          'spell': {
            'color': '#00f',
            'cost': 1,
            'costs': 'health',
            'damage': 1,
            'reload': 10,
          },
        }),
        rpg_item_create({
          'cursor': 'pointer',
          'label': 'Scroll of Manabolt',
          'spell': {
            'color': '#00f',
            'cost': 1,
            'damage': 1,
            'reload': 10,
          },
        }),
      ],
      'player': true,
      'stats': {
        'jump-velocity': 8,
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
      'inventory': [
        rpg_item_create({
          'label': 'Scroll of Manabolt',
          'owner': 2,
          'spell': {
            'color': '#00f',
            'damage': 1,
            'reload': 10,
          },
        }),
      ],
      'x': 125,
      'y': -110,
    });
}
