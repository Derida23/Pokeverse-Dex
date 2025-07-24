
import { types } from "~/constants/types";
import type { DamageRelations, Types } from '~/types/responses/Types';

interface typeUrl {
  name: string
  url: string
}

interface typeID {
  name: string
  id: string
}

export default defineEventHandler(async (event) => {
  try {
    const type = event.context.params?.type;
    const typeId = types.find((item) => item.name === type) as { name: string, id: number }

    const { apiUrl } = useRuntimeConfig()
    const response = await $fetch<Types>(`${apiUrl}/type/${typeId.id}`, {
      method: 'GET'
    })

    delete response['moves']
    delete response['sprites']
    delete response['past_damage_relations']
    delete response['game_indices']
    delete response['generation']
    delete response['move_damage_class']
    delete response['names']

    response.pokemon = response.pokemon?.filter(item => item.slot !== 2)

    const getTypes = (data: typeUrl[] | [])=>
      data.map((item) => ({
      name: item.name,
      id: item.url.split('/')[6],
    }));

    const excludeById = (excludeIds: string[]): typeID[] => {
      const data = types
        .filter((type) => !excludeIds.includes(String(type.id)))
        .map((item) => ({
          ...item,
          id: String(item.id),
        }));

      return data;
    };

    const { damage_relations } = response;

    const allDamageTo = Object.entries(damage_relations as DamageRelations)
      .filter(([key]) => key.endsWith('_damage_to'))
      .flatMap(([, value]) => value);


    const allDamageFrom = Object.entries(damage_relations as DamageRelations)
      .filter(([key]) => key.endsWith('_damage_from'))
      .flatMap(([, value]) => value);

    const includedTypesTo = getTypes(allDamageTo as typeUrl[]);
    const includeIdsTo = includedTypesTo.map((t) => t.id);

    const includedTypesFrom = getTypes(allDamageFrom as typeUrl[]);
    const includeIdsFrom = includedTypesFrom.map((t) => t.id);

    if (damage_relations) {
      response.offense = {
        double_damage: getTypes(damage_relations.double_damage_to),
        single_damage: excludeById(includeIdsTo),
        half_damage: getTypes(damage_relations.half_damage_to),
        no_damage: getTypes(damage_relations.no_damage_to),
      };
  
      response.defense = {
        no_damage: getTypes(damage_relations.no_damage_from),
        quarter_damage: [],
        half_damage: getTypes(damage_relations.half_damage_from),
        single_damage: excludeById(includeIdsFrom),
        double_damage: getTypes(damage_relations.double_damage_from),
        fourth_damage: []
      };
    }

    delete response['damage_relations']

    return {
      success: true,
      message: 'Fetched successfully',
      data: response
    }
  } catch (error) {
    const err = error as { statusCode?: number; statusMessage?: string }
    return sendError(event, createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Internal Server Error',
    }))
  }
})
