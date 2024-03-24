const fs = require('fs');

// creamos un objeto que devuelve un array con los nombres de los ganadores o empates y una varible que indica si es una victoria total, un empate o una victoria parcial
// si solo hay un jugador, es el ganador
// si hay varios, se calcula el máximo de vida restante. Si hay dos jugadores con la misma vida restante, es un empate para cada uno. Si hay un jugaador con más vidas que los demás sera una victoria parcial
function obtenerGanador(players) {
    const jugadoresVivos = players.filter(player => player.health > 0);
    if (jugadoresVivos.length === 1) {
        return {
            ganadores: [jugadoresVivos[0].name],
            tipo: 'victoria total'
        };
    } else if (jugadoresVivos.length > 1) {
        const jugadoresConMasVida = jugadoresVivos.filter(player => player.health === Math.max(...jugadoresVivos.map(player => player.health)));
        if (jugadoresConMasVida.length === 1) {
            return {
                ganadores: jugadoresConMasVida.map(player => player.name),
                tipo: 'victoria parcial'
            };
        } else {
            return {
                ganadores: jugadoresConMasVida.map(player => player.name),
                tipo: 'empate'
            };
        }
    } else {
        return {
            ganadores: [],
            tipo: 'empate'
        };
    }
}

// para cada jugador crea un objeto con el nombre, la cantidad de victorias totales, la cantidad de victorias parciales y la cantidad de empates
// como argumento recibe el resultado de obtenerGanador para todas las partidas
function obtenerEstadisticasPorJugador(partidas,jugadores) {
    const estadisticas = {};

    for (const player of jugadores) {
        estadisticas[player] = {
            nombre: player,
            victorias: 0,
            empates: 0,
            victoriasParciales: 0
        };
    }
    for (const partidasJugador of partidas) {
        for (const ganador of partidasJugador.ganadores) {
            if (!estadisticas[ganador]) {
                estadisticas[ganador] = {
                    nombre: ganador,
                    victorias: 0,
                    empates: 0,
                    victoriasParciales: 0
                };
            }
            if (partidasJugador.tipo === 'victoria total') {
                estadisticas[ganador].victorias++;
            } else if (partidasJugador.tipo === 'empate') {
                estadisticas[ganador].empates++;
            } else if (partidasJugador.tipo === 'victoria parcial') {
                estadisticas[ganador].victoriasParciales++;
            }
        }
    }
    return Object.values(estadisticas);
}

const players = JSON.parse(fs.readFileSync('resultados.json'));


const ganadoresPorPartida = players.map(player => obtenerGanador(player.jugadores));

//console.log("ganadoresPorPartida", ganadoresPorPartida);
const jugadores = players[0].jugadores.map(player => player.name);
const estadisticasPorJugador = obtenerEstadisticasPorJugador(ganadoresPorPartida,jugadores);  
console.log("estadisticasPorJugador", estadisticasPorJugador);
