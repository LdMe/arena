import random
import threading
import json
import time

MAX_ENERGY = 100
MAX_HEALTH = 100
ATTACK_DAMAGE = 20
ATTACK_ENERGY = 25
DEFENSE_ENERGY = 15
REST_ENERGY = 20
PLAYER_TIMEOUT = 100
TURN_TIMEOUT = 100
MAX_EXECUTION_TIME = 200

def attack(attacker, defender):
    if attacker.energy >= ATTACK_ENERGY:
        
        if defender.is_defending:
            defender.is_defending = False
            return
        attacker.energy -= ATTACK_ENERGY
        defender.health -= ATTACK_DAMAGE
        defender.health = max(defender.health, 0)
        if defender.health <= 0:
            pass

def defend(defender):
    if defender.energy >= DEFENSE_ENERGY:
        defender.energy -= DEFENSE_ENERGY
        defender.is_defending = True

def rest(player):
    if player.energy < MAX_ENERGY:
        player.energy += REST_ENERGY
        player.energy = min(player.energy, MAX_ENERGY)

def get_alive_players(players):
    return [player for player in players if player.health > 0]

def shuffle(array):
    result = array.copy()
    random.shuffle(result)
    return result

def show_players_stats(players):
    result = "##############################\nEstado de los jugadores:\n##############################\n"
    for player in players:
        result += f"{player.name}: {player.health} vida | {player.energy} energía | {'🛡' if player.is_defending else ''}\n"
    result += "##############################\n"
    print(result)

def random_play(player, enemies):
    random_number = random.random()
    if random_number < 0.33:
        enemy = random.choice([enemy for enemy in enemies if enemy.name != player.name])
        attack(player, enemy)
    elif random_number < 0.66:
        defend(player)
    else:
        rest(player)

def grupo_azul(player, enemies):
    if player.energy < DEFENSE_ENERGY:
        rest(player)
    if not player.is_defending and player.energy >= DEFENSE_ENERGY:
        defend(player)
    else:
        enemy = random.choice([enemy for enemy in enemies if enemy.name != player.name])
        attack(player, enemy)

def grupo_verde(player, enemies):
    enemy = random.choice([enemy for enemy in enemies if enemy.name != player.name])
    if player.health >= 60 and player.energy >= REST_ENERGY * 2:
        if not player.is_defending:
            attack(player, enemy)
        else:
            defend(player)
    elif 20 < player.health < 40:
        if enemy.health > 50:
            if not player.is_defending:
                attack(player, enemy)
            else:
                rest(player)
        else:
            defend(player)
    elif player.energy <= REST_ENERGY:
        rest(player)
    else:
        if not player.is_defending:
            attack(player, enemy)
        else:
            rest(player)

def grupo_rojo(player, enemies):
    estamos_protegidos = player.is_defending
    nuestra_energia = player.energy
    enemigos_desprotegidos = [enemy for enemy in enemies if enemy.name != player.name and not enemy.is_defending]
    enemigos_protegidos = [enemy for enemy in enemies if enemy.name != player.name and enemy.is_defending]
    menor_salud = MAX_HEALTH + 1
    enemigo_atacar = None

    if not estamos_protegidos:
        defend(player)
    elif nuestra_energia <= ATTACK_ENERGY * 2:
        rest(player)
    elif nuestra_energia > ATTACK_ENERGY * 2:
        if not enemigos_desprotegidos:
            enemigo_atacar = enemigos_protegidos[0]
        else:
            for enemy in enemigos_desprotegidos:
                if enemy.health < menor_salud:
                    menor_salud = enemy.health
                    enemigo_atacar = enemy
        attack(player, enemigo_atacar)

def grupo_amarillo(player, enemies):
    random_number = random.random()
    if player.energy <= ATTACK_ENERGY:
        rest(player)
    elif random_number < 0.9:
        weakest_enemy = min([enemy for enemy in enemies if enemy.name != player.name], key=lambda enemy: enemy.health)
        attack(player, weakest_enemy)
    else:
        defend(player)

def chat_gpt(player, enemies):
    scores = [(enemy, (enemy.health / MAX_HEALTH) * 0.6 + (enemy.energy / MAX_ENERGY) * 0.4 * (0.8 if enemy.is_defending else 1.0)) for enemy in enemies if enemy.name != player.name]
    scores.sort(key=lambda x: x[1])

    if player.energy >= ATTACK_ENERGY:
        attack(player, scores[-1][0])
    elif player.energy >= DEFENSE_ENERGY and player.health < MAX_HEALTH * 0.8:
        defend(player)
    else:
        rest(player)
# modifica la clase Player para que sea serializable y devuelva un equivaalente a un objeto json de javascript
class Player:
    def __init__(self, name, play_strategy):
        self.name = name
        self.health = MAX_HEALTH
        self.energy = MAX_ENERGY
        self.is_defending = False
        self.play = play_strategy

    
    def toJSON(self):
        return {
            "name": self.name,
            "health": self.health,
            "energy": self.energy,
            "is_defending": self.is_defending
        }
    

def deep_copy_players(players):
    return [Player(player.name, player.play) for player in players]

def main(players):
    start_time = time.time()
    jugadas = 0
    while len(get_alive_players(players)) > 1:
        if  time.time() - start_time > MAX_EXECUTION_TIME / 1000:  # Evita errores de tiempo negativo o excesivamente grande
            break
        alive_players = get_alive_players(players)
        jugadas += 1
        for player in alive_players:
            if player.health <= 0:
                continue
            player.play(player, alive_players)
            if len(get_alive_players(players)) == 1:
                break
        #show_players_stats(players)
    winner = get_alive_players(players)[0]
    return {"jugadores": players, "jugadas": jugadas}
def dumpUsersToJson(players):
    return [player.toJSON() for player in players]
def dumpResultsToJson(results):
    # muestra cada jugador en pantalla
    # para cada partida, guardar el estado de los jugadores
    return json.dumps([{"jugadores": dumpUsersToJson(result["jugadores"]), "jugadas": result["jugadas"]} for result in results], indent=4)
def main_n_times(players, n):
    results = []
    threads = []
    for i in range(n):
        print(f"Partida {i+1} de {n}",flush=True)
        new_players = deep_copy_players(players)
        thread = threading.Thread(target=lambda: results.append(main(shuffle(new_players))))
        thread.start()
        threads.append(thread)
        # if thread number is equal to the number of cpus, wait for all threads to finish
        # if len(threads) == 160:
        #     for thread in threads:
        #         thread.join()
        #     threads = []
    for thread in threads:
        thread.join()
    with open("resultados.json", "w") as file:
        file.write(dumpResultsToJson(results))

players = [
    Player("Callo Pie", grupo_azul),
    Player("Karis", grupo_verde),
    Player("Niebla Roja", grupo_rojo),
    Player("Amarillo", grupo_amarillo),
    Player("Randomius", random_play),
    Player("Gepeto", chat_gpt)
]

main_n_times(players, 10000)
#main(players)