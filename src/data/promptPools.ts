import type { PromptPoolItem } from "../types/game";

export const promptPools: Record<string, PromptPoolItem[]> = {
  charades_people: [
    { text: "Batman", audience: "all" },
    { text: "a dog", audience: "all" },
    { text: "a news anchor", audience: "all" },
  ],

  charades_actions: [
    { text: "doing dishes", audience: "all" },
    { text: "buying groceries", audience: "all" },
    { text: "opening a restaurant", audience: "all" },
  ],

  would_you_rather_romance: [
    { text: "Henry Cavill", audience: "all" },
    { text: "Keanu Reeves", audience: "all" },
    { text: "Leopold the Third", audience: "all" },
  ],

  drink_penalties: [
    { text: "take 2 sips", audience: "drinkers_only" },
    { text: "do 10 jumping jacks", audience: "non_drinkers_only" },
    { text: "lose 1 point", audience: "all" },
  ],

  lawyer:[
    {text: "porque los hombres deberian usar minifalda", audience:"all"},
    {text: "porque manejar curado es de hecho mas seguro", audience:"all"},
    {text: "porque NO fui yo quien se comio tu hamster", audience:"all"},
    {text: "porque no es discriminatorio decirle arigato a la mesera del restaurant indio", audience:"all"},
    {text: "porque no importa que haya chocado contra el orfanato", audience:"all"},
    {text: "porque seria muy divertido que pusiera metal en el microondas", audience:"all"},
  ],
  jobs: [
    {text: "actor porno", audience:"all"},
    {text: "moderador de Twitch", audience:"all"},
    {text: "Abogado", audience:"all"},
    {text: "doctor", audience:"all"},
    {text: "el vagabundo que duerme frente la entrada principal", audience:"all"},
    {text: "tu nuevo/a ex", audience:"all"},
    {text: "tu nuevo papa/mama", audience:"all"},
  ]
};
