
const buttonsCleanLocal = document.querySelectorAll('.button-clean-local')
const buttonsCleanVisit = document.querySelectorAll('.button-clean-visit')
const buttonsMissLocal = document.querySelectorAll('.button-miss-local')
const buttonsMissVisit = document.querySelectorAll('.button-miss-visit')
const buttonsGralLocal = document.querySelectorAll('.button-gral-stats-local')
const buttonsGralVisit = document.querySelectorAll('.button-gral-stats-visit')
const buttonFinCuarto = document.getElementById('button-fin-cuarto')
const buttonFinPartido = document.getElementById('button-fin-partido')
const pointsLocalHTML = document.getElementById('points-local')
const pointsVisitHTML = document.getElementById('points-visit')
const buttonDeshacer = document.getElementById('deshacer')
const buttonRehacer = document.getElementById('rehacer')
const parrafosStatsLocal = document.querySelectorAll('.p-stats-local')
const parrafosStatsVisit = document.querySelectorAll('.p-stats-visit')
const buttonsCuartos = document.querySelectorAll('.button-cuartos-modal')
const puntosCuartos = document.querySelectorAll('.puntuacion-cuartos')

let cuartoActual = 0

const historialDeshacer = []
const historialRehacer = []

function newPoint(team, cuarto, value) {
    const estadoAnterior = structuredClone(statsMatch)
    historialDeshacer.push(estadoAnterior)
    historialRehacer.length = 0

    statsMatch[team].global.points += value
    statsMatch[team].cuartos[cuarto].points += value
    pintarStatsGlobal()
    pintarPuntosCuartos()
}

function newStat(team, cuarto, stat) {
    const estadoAnterior = structuredClone(statsMatch)
    historialDeshacer.push(estadoAnterior)
    historialRehacer.length = 0

    statsMatch[team].global[stat]++

    statsMatch[team].cuartos[cuarto][stat]++
    pintarStatsGlobal()
}


function newShoot(team, cuarto, tipe, result) {
    const estadoAnterior = structuredClone(statsMatch)
    historialDeshacer.push(estadoAnterior)
    historialRehacer.length = 0

    statsMatch[team].global.tiros[tipe][result]++

    statsMatch[team].cuartos[cuarto].tiros[tipe][result]++
    pintarStatsGlobal()

}

function newRebote(team, cuarto, tipe) {
    const estadoAnterior = structuredClone(statsMatch)
    historialDeshacer.push(estadoAnterior)
    historialRehacer.length = 0

    statsMatch[team].global.rebotes[tipe]++

    statsMatch[team].cuartos[cuarto].rebotes[tipe]++
    pintarStatsGlobal()
}

function deshacer() {
    const estadoAnterior = historialDeshacer.pop()

    historialRehacer.push(structuredClone(statsMatch))

    statsMatch = estadoAnterior
    pintarStatsGlobal()
}

function rehacer() {
    const estadoAnterior = structuredClone(statsMatch)
    historialDeshacer.push(estadoAnterior)

    statsMatch = historialRehacer.pop()
}

buttonsCleanLocal.forEach(button => 
    button.addEventListener('click', ()=> {
        const textButton = button.textContent;
        if (textButton === '3pts') {
            newShoot('local', cuartoActual, 'triples', 'clean')
            newPoint('local', cuartoActual, 3)
            
        } else if (textButton === '2pts') {
            newShoot('local', cuartoActual, 'dobles', 'clean')
            newPoint('local', cuartoActual, 2)
        } else {
            newShoot('local', cuartoActual, 'libres', 'clean')
            newPoint('local', cuartoActual, 1)
        }
        pointsLocalHTML.innerText = statsMatch.local.global.points
        
    })
)

buttonsMissLocal.forEach(button => 
    button.addEventListener('click', ()=> {
        const textButton = button.textContent;
        if (textButton === '3pts') {
            newShoot('local', cuartoActual, 'triples', 'miss')
        } else if (textButton === '2pts') {
            newShoot('local', cuartoActual, 'dobles', 'miss')
        } else {
            newShoot('local', cuartoActual, 'libres', 'miss')
        }
    })
)

buttonsCleanVisit.forEach(button => 
    button.addEventListener('click', ()=> {
        const textButton = button.textContent;
        if (textButton === '3pts') {
            newShoot('visit', cuartoActual, 'triples', 'clean')
            newPoint('visit', cuartoActual, 3)
        } else if (textButton === '2pts') {
            newShoot('visit', cuartoActual, 'dobles', 'clean')
            newPoint('visit', cuartoActual, 2)
        } else {
            newShoot('visit', cuartoActual, 'libres', 'clean')
            newPoint('visit', cuartoActual, 1)
        }
        pointsVisitHTML.innerText = statsMatch.visit.global.points
        
    })
)

buttonsMissVisit.forEach(button => 
    button.addEventListener('click', ()=> {
        const textButton = button.textContent;
        if (textButton === '3pts') {
            newShoot('visit', cuartoActual, 'triples', 'miss')
        } else if (textButton === '2pts') {
            newShoot('visit', cuartoActual, 'dobles', 'miss')
        } else {
            newShoot('visit', cuartoActual, 'libres', 'miss')
        }
    })
)


buttonsGralLocal.forEach(button => 
    button.addEventListener('click', () => {
        const textButton = button.textContent
        if (textButton === 'Reb O') {
            newRebote('local', cuartoActual, 'ofensivos')            
        } else if (textButton === 'Reb D') {
            newRebote('local', cuartoActual, 'defensivos')
        } else if (textButton === 'Per') {
            newStat('local', cuartoActual, 'perdidas')
        } else if (textButton === 'Rec') {
            newStat('local', cuartoActual, 'recuperaciones')
        } else if (textButton === 'Robo') {
            newStat('local', cuartoActual, 'robos')
        } else if (textButton === 'Tapa') {
            newStat('local', cuartoActual, 'tapas')
        }
    })
)

buttonsGralVisit.forEach(button => 
    button.addEventListener('click', () => {
        const textButton = button.textContent
        if (textButton === 'Reb O') {
            newRebote('visit', cuartoActual, 'ofensivos')            
        } else if (textButton === 'Reb D') {
            newRebote('visit', cuartoActual, 'defensivos')
        } else if (textButton === 'Per') {
            newStat('visit', cuartoActual, 'perdidas')
        } else if (textButton === 'Rec') {
            newStat('visit', cuartoActual, 'recuperaciones')
        } else if (textButton === 'Robo') {
            newStat('visit', cuartoActual, 'robos')
        } else if (textButton === 'Tapa') {
            newStat('visit', cuartoActual, 'tapas')
        }
    })
)

buttonFinCuarto.addEventListener('click', () => {
    if (cuartoActual == 3) {
        return
    }
    cuartoActual++
})

buttonDeshacer.addEventListener('click', () => {
    deshacer()
    deshacer()

    pointsLocalHTML.innerText = statsMatch.local.global.points
    pointsVisitHTML.innerText = statsMatch.visit.global.points
})

buttonRehacer.addEventListener('click', () => {
    rehacer()
    rehacer()

    pointsLocalHTML.innerText = statsMatch.local.global.points
    pointsVisitHTML.innerText = statsMatch.visit.global.points
})

function agregarStat(obj, parentKey = '') {
    let result = [];

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const newKey = parentKey ? `${parentKey}.${key}` : key;
            
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                result = result.concat(agregarStat(obj[key], newKey))
            } else if (typeof obj[key] === 'function') {
                const valorCalculado = obj[key]
                result.push([ultimasPalablas(newKey), valorCalculado])
            } else {
                result.push([ultimasPalablas(newKey), obj[key]])
            }
        }
    }
    return result
}

function ultimasPalablas(key) {
    const parts = key.split('.')
    if (parts.length > 1) {
        return `${parts[parts.length - 2]} ${parts[parts.length - 1]}`
    }

    return key
}


const conteinerStats = document.querySelectorAll('.div-stats-team')

function pintarStatsGlobal() {   
    conteinerStats[0].innerHTML = ""
    conteinerStats[1].innerHTML = ""

    const arrayStatsLocal = agregarStat(statsMatch.local.global)
    const arrayStatsVisit = agregarStat(statsMatch.visit.global)

    arrayStatsLocal.forEach(item => {
        const divStats = document.createElement('div')
        divStats.classList.add('div-stat')
        
        conteinerStats[0].appendChild(divStats)
        
        item.forEach(element => {
            const pStats = document.createElement('p')
            pStats.textContent = element
            divStats.appendChild(pStats)
        })
    })
    
    arrayStatsVisit.forEach(item => {
        const divStats = document.createElement('div')
        divStats.classList.add('div-stat')
        
        conteinerStats[1].appendChild(divStats)
        
        item.forEach(element => {
            const pStats = document.createElement('p')
            pStats.textContent = element
            divStats.appendChild(pStats)
        })
    })
}

pintarStatsGlobal()

function pintarPuntosCuartos() {
    puntosCuartos.forEach((item, index) => {
        console.log(item);
        if (index == 0) {
            item.innerText = `${statsMatch.local.global.points} / ${statsMatch.visit.global.points}`
        } else {
            item.innerText = `${statsMatch.local.cuartos[index-1].points} / ${statsMatch.visit.cuartos[index-1].points}`
        }
    })
}

pintarPuntosCuartos()

buttonsCuartos.forEach((item, index) => {
    item.addEventListener('click', () => {
        pintarStatsCuartos(index)
        console.log(index);
    })
})

function pintarStatsCuartos(cuarto) {
    conteinerStats[0].innerHTML = ""
    conteinerStats[1].innerHTML = ""

    if (cuarto == 0) {
        pintarStatsGlobal()
        return
    }
    const arrayStatsLocal = agregarStat(statsMatch.local.cuartos[cuarto-1])
    const arrayStatsVisit = agregarStat(statsMatch.visit.cuartos[cuarto-1])

    arrayStatsLocal.forEach(item => {
        const divStats = document.createElement('div')
        divStats.classList.add('div-stat')
        
        conteinerStats[0].appendChild(divStats)
        
        item.forEach(element => {
            const pStats = document.createElement('p')
            pStats.textContent = element
            divStats.appendChild(pStats)
        })
    })
    
    arrayStatsVisit.forEach(item => {
        const divStats = document.createElement('div')
        divStats.classList.add('div-stat')
        
        conteinerStats[1].appendChild(divStats)
        
        item.forEach(element => {
            const pStats = document.createElement('p')
            pStats.textContent = element
            divStats.appendChild(pStats)
        })
    })
}



